<template>
  <div>
    <div class="tool-bar">
      <a-button type="text" :icon="h(PlusOutlined)" @click="openEditPane(null)" />
      <a-button type="text" :icon="h(ZoomInOutlined)" />
      <a-button type="text" :icon="h(ZoomOutOutlined)" />
    </div>

    <div class="app-content relative">
      <div id="container"></div>
      <TeleportContainer />
      <div
        class="absolute top-1 right-1 h-[98%] w-[500px] bg-white shadow-lg border-l z-50 p-4 overflow-y-auto"
        v-show="showEditPane"
      >
        <WorkflowNodeEditPanel ref="showEditPaneRef" @onSubmitSuccess="handleSaveNode" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WorkflowNode from '@/components/WorkflowNode.vue'
import { onMounted, h, ref, watch } from 'vue'
import { Graph, Model, Shape } from '@antv/x6'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Selection } from '@antv/x6-plugin-selection'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { History } from '@antv/x6-plugin-history'
import { Transform } from '@antv/x6-plugin-transform'
import { Snapline } from '@antv/x6-plugin-snapline'
import { ZoomInOutlined, ZoomOutOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { DagreLayout, type OutModel } from '@antv/layout'
import WorkflowNodeEditPanel from './WorkflowNodeEditPanel.vue'

const showEditPaneRef = ref()
const showEditPane = ref(false)
const props = defineProps({
  graphData: {
    type: Object,
    required: false
  }
})

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
  shape: 'workflow-node',
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

const handleSaveNode = (workflowNode: any) => {
  if (workflowNode.workflowNodeCode) {
    console.log('编辑节点:', workflowNode)
    const node = graphHolder.value!!.getCellById(workflowNode.workflowNodeCode)
    node.setData(workflowNode)
  } else {
    console.log('新增节点:', workflowNode)
    addNode(graphHolder.value, 100, 100, workflowNode)
  }
  closeEditPane()
}

const addNode: any = (graph: Graph, x: number, y: number, data: any) => {
  const node = graph.addNode({
    shape: 'workflow-node',
    x: x,
    y: y,
    data: {
      ...data
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
  node.setData({ ...node.data, uuid: node.id })
}

const openEditPane = (node: any) => {
  showEditPane.value = true
  showEditPaneRef.value.open(node)
}

const closeEditPane = () => {
  showEditPane.value = false
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
      closeEditPane()
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

  graph.on('node:click', ({ node }) => {
    console.log('点击节点:', node.data)
    openEditPane(node.data)
  })
  graph.on('blank:click', () => {
    closeEditPane()
  })
})

watch(
  () => props.graphData,
  (newGraphData) => {
    if (newGraphData) {
      console.log('正在导入工作流', newGraphData)
      graphHolder.value!!.fromJSON(newGraphData as Model.FromJSONData)
    }
  }
)

const exportGraph = () => {
  const graphCellData = graphHolder.value!!.toJSON().cells
  const nodeId2ChildrenIds = getNodeChildrenMap()
  graphCellData
    .filter((it) => it.shape === 'workflow-node')
    .forEach((it) => {
      it.data!!.workflowNodeCode = it.id
      it.data!!.workflowNodeChildCodes = nodeId2ChildrenIds.get(it.id!!) || []
    })
  return graphCellData
}

const getNodeChildrenMap = () => {
  const edges = graphHolder.value!!.getEdges()
  const map = new Map<string, string[]>()
  edges.forEach((edge) => {
    const sourceId = edge.getSourceCellId()
    const targetId = edge.getTargetCellId()
    if (map.has(sourceId)) {
      map.get(sourceId)!.push(targetId)
    } else {
      map.set(sourceId, [targetId])
    }
  })
  return map
}

defineExpose({ exportGraph })
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
  font-size: 16px;
}
</style>
