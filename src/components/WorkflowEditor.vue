<template>
  <div>
    <div class="tool-bar">
      <a-button type="text" :icon="h(PlusOutlined)" />
      <a-button type="text" :icon="h(ZoomInOutlined)" />
      <a-button type="text" :icon="h(ZoomOutOutlined)" />
    </div>

    <div class="app-content">
      <div id="container"></div>
      <TeleportContainer />
    </div>
  </div>
</template>

<script lang="ts" setup>
import WorkflowNode from '@/components/WorkflowNode.vue'
import { onMounted, h, ref } from 'vue'
import { Graph, Shape } from '@antv/x6'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Selection } from '@antv/x6-plugin-selection'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { History } from '@antv/x6-plugin-history'
import { Transform } from '@antv/x6-plugin-transform'
import { Snapline } from '@antv/x6-plugin-snapline'
import { ZoomInOutlined, ZoomOutOutlined, PlusOutlined } from '@ant-design/icons-vue'

const graphHolder = ref<Graph>()

const portAttr = {
  circle: {
    r: 4,
    magnet: true,
    stroke: '#1890ff',
    strokeWidth: 1,
    fill: '#fff',
    style: { visibility: 'hidden' }
  }
}

// 注册自定义 Vue 节点
register({
  shape: 'custom-vue-node',
  width: 180,
  height: 42,
  component: WorkflowNode,
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: portAttr
      },
      right: {
        position: 'right',
        attrs: portAttr
      },
      bottom: {
        position: 'bottom',
        attrs: portAttr
      },
      left: {
        position: 'left',
        attrs: portAttr
      }
    }
  }
})

// 获取 Teleport 容器组件（解决 Teleport 渲染问题）
const TeleportContainer = getTeleport()

import { DagreLayout, type OutModel } from '@antv/layout'

const prettyLayout = async (graph: Graph) => {
  // 1. 获取 Graph 实例中的数据
  const nodes = graph.getNodes().map((node) => ({
    id: node.id,
    data: {
      x: node.position().x,
      y: node.position().y,
      size: [node.size().width, node.size().height]
    }
  }))
  const edges = graph.getEdges().map((edge) => ({
    source: edge.getSourceCellId(),
    target: edge.getTargetCellId()
  }))

  const dagreLayout = new DagreLayout({
    type: 'dagre',
    rankdir: 'TB', // TB: top-bottom, LR: left-right
    align: 'UL', // 节点对齐方式
    nodesep: 80, // 节点间距
    ranksep: 40 // 层间距
  })

  // 3. 执行布局计算
  const model = dagreLayout.layout({
    nodes: nodes,
    edges: edges
  }) as OutModel
  console.log('布局计算结果:', model)
  // 4. 更新 graph 中节点位置
  model.nodes?.forEach((item) => {
    const node = graph.getCellById(item.id as string)
    if (node && node.isNode()) {
      node.setPosition(item.x, item.y)
    }
  })

  console.log(graph.toJSON())
  // 5. 居中画布
  graph.centerContent()
}

const addNode: any = (graph: Graph, x: number, y: number) => {
  graph.addNode({
    shape: 'custom-vue-node',
    x: x,
    y: y,
    data: {
      label: '我是文案11111',
      status: 'running',
      customValue: 123
    },
    ports: {
      items: [
        { group: 'top', id: 'port-top' },
        { group: 'right', id: 'port-right' },
        { group: 'bottom', id: 'port-bottom' },
        { group: 'left', id: 'port-left' }
      ]
    }
  })
}

// 在组件挂载后初始化画布
onMounted(() => {
  const graph = new Graph({
    container: document.getElementById('container')!,
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      allowLoop: false,
      allowNode: false,
      allowEdge: false,
      allowPort: true,
      allowMulti: false,
      snap: {
        radius: 20
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          },
          zIndex: 0
        })
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF'
          }
        }
      }
    },
    background: {
      color: '#F2F7FA'
    },
    autoResize: true
  })
    .use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        showNodeSelectionBox: true,
        modifiers: 'shift' // 按住 shift 多选
      })
    )
    .use(
      new Keyboard({
        enabled: true
      })
    )
    .use(
      new History({
        enabled: true
      })
    )
    .use(
      new Transform({
        resizing: false,
        rotating: false
      })
    )
    .use(new Snapline())

  graphHolder.value = graph

  // 添加一个自定义 Vue 节点
  addNode(graph, 100, 100)
  addNode(graph, 100, 200)
  addNode(graph, 100, 300)
  addNode(graph, 100, 400)

  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.canUndo()) {
      graph.undo()
    }
    return false
  })

  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.canRedo()) {
      graph.redo()
    }
    return false
  })
  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
    prettyLayout(graph)
  })

  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })

  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  graph.on('node:mouseenter', () => {
    const container = document.getElementById('container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  graph.on('node:mouseleave', () => {
    const container = document.getElementById('container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, false)
  })
})
</script>

<style scoped>
#container {
  width: 100%;
  height: 700px;
}

.ant-btn .anticon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px; /* 根据需要设置 */
}
</style>
