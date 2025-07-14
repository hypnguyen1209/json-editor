<template>
  <div class="tree-visualization" :class="{ 'dark-mode': isDarkMode }">
    <div class="tree-container">
      <TreeNode 
        :node="rootNode" 
        :level="0"
        :isDarkMode="isDarkMode"
        @toggle="toggleNode"
        @select="selectNode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TreeNode from './TreeNode.vue'

interface TreeNodeData {
  id: string
  key: string
  value: any
  type: string
  children: TreeNodeData[]
  expanded: boolean
  selected: boolean
  path: string[]
}

const props = defineProps<{
  data: any
  isDarkMode?: boolean
}>()

const selectedNodeId = ref<string | null>(null)
const expandedNodes = ref<Set<string>>(new Set(['root']))

const rootNode = computed((): TreeNodeData => {
  return buildTreeNode(props.data, 'root', [])
})

const buildTreeNode = (data: any, key: string, path: string[]): TreeNodeData => {
  const nodeId = path.length === 0 ? 'root' : path.join('.')
  const node: TreeNodeData = {
    id: nodeId,
    key,
    value: data,
    type: getDataType(data),
    children: [],
    expanded: expandedNodes.value.has(nodeId),
    selected: selectedNodeId.value === nodeId,
    path
  }

  if (Array.isArray(data)) {
    node.children = data.map((item, index) => 
      buildTreeNode(item, `[${index}]`, [...path, index.toString()])
    )
  } else if (data && typeof data === 'object' && data !== null) {
    node.children = Object.entries(data).map(([key, value]) => 
      buildTreeNode(value, key, [...path, key])
    )
  }

  return node
}

const getDataType = (value: any): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value
}

const toggleNode = (nodeId: string) => {
  if (expandedNodes.value.has(nodeId)) {
    expandedNodes.value.delete(nodeId)
  } else {
    expandedNodes.value.add(nodeId)
  }
}

const selectNode = (nodeId: string) => {
  selectedNodeId.value = nodeId
}


</script>

<style scoped lang="scss">
.tree-visualization {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  cursor: text;
  user-select: text;
}

.tree-container {
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  padding: 12px;
  cursor: text;
  // Darker text colors for better visibility
  color: #1a1a1a;
  
  // Make text selectable and darker
  * {
    user-select: text;
    cursor: text;
  }
  
  // Enhanced text selection
  ::selection {
    background: #0969da;
    color: #ffffff;
  }
  
  ::-moz-selection {
    background: #0969da;
    color: #ffffff;
  }
}

// Dark mode support - using component class instead of global
.tree-visualization.dark-mode .tree-container {
  background: #21262d;
  border-color: #30363d;
  color: #f0f6fc;
  
  ::selection {
    background: #58a6ff;
    color: #0d1117;
  }
  
  ::-moz-selection {
    background: #58a6ff;
    color: #0d1117;
  }
}
</style>
