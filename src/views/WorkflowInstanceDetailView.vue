<template>
  <div>
    <a-button type="primary" @click="goBack">返回</a-button>

    <div class="tool-bar mt-4">
      <a-button type="text" :icon="h(ZoomInOutlined)" />
      <a-button type="text" :icon="h(ZoomOutOutlined)" />
    </div>

    <div class="app-content relative">
      <div id="container"></div>
      <TeleportContainer />
      <div
        class="absolute top-1 right-1 h-[98%] w-[500px] bg-white shadow-lg border-l z-50 p-4 overflow-y-auto"
        v-show="showEditPane"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WorkflowNodeInstance from '@/components/WorkflowNodeInstance.vue'
import { onMounted, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Graph, Model, Shape } from '@antv/x6'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Selection } from '@antv/x6-plugin-selection'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { History } from '@antv/x6-plugin-history'
import { Transform } from '@antv/x6-plugin-transform'
import { Snapline } from '@antv/x6-plugin-snapline'
import { ZoomInOutlined, ZoomOutOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { DagreLayout, type OutModel } from '@antv/layout'
import { getWorkflowInstance } from '@/service/api/workflowInstanceApi'

const route = useRoute()
const router = useRouter()
const workflowInstanceId = route.query.workflowInstanceId || null

const currentWorkflowInstance = ref<API.WorkflowInstanceDetailResponseDTO>({})
const showEditPaneRef = ref()
const showEditPane = ref(false)
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
  shape: 'workflow-node-instance',
  width: 180,
  height: 42,
  component: WorkflowNodeInstance,
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

const openEditPane = (node: any) => {
  showEditPane.value = true
  showEditPaneRef.value.open(node)
}

const closeEditPane = () => {
  showEditPane.value = false
}

const goBack = () => {
  router.back()
}

// 在组件挂载后初始化画布
onMounted(async () => {
  const graph = new Graph({
    container: document.getElementById('container')!,
    grid: false,
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
        modifiers: 'shift'
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

  graph.on('node:click', ({ node }) => {
    console.log('点击节点:', node.data)
    // openEditPane(node.data)
  })
  graph.on('blank:click', () => {
    closeEditPane()
  })

  if (workflowInstanceId) {
    const workflowInstance = (await getWorkflowInstance({
      workflowInstanceId: Number(workflowInstanceId)
    })) as API.WorkflowInstanceDetailResponseDTO
    currentWorkflowInstance.value = workflowInstance
    console.log('当前工作流实例:', currentWorkflowInstance.value)
    graph.fromJSON(JSON.parse(workflowInstance.graphData!!))
  }
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
  font-size: 16px;
}
</style>
