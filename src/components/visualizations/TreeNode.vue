<template>
  <div 
    class="tree-node" 
    :class="{ 
      selected: node.selected, 
      expanded: node.expanded,
      [`level-${level}`]: true,
      'dark-mode': isDarkMode
    }"
  >
    <div 
      class="node-content" 
      @click="handleClick"
      @contextmenu.prevent="(event) => handleRightClickSimple(event, node)"
    >
      <div class="node-indent" :style="{ width: `${level * 20}px` }"></div>
      
      <div class="node-toggle" v-if="hasChildren" @click.stop="$emit('toggle', node.id)">
        <span class="toggle-icon">{{ node.expanded ? '▼' : '▶' }}</span>
      </div>
      <div class="node-toggle-placeholder" v-else></div>
      
      <div class="node-info">
        <span class="node-key">{{ node.key }}</span>
        <span class="node-type" :class="node.type">{{ node.type }}</span>
        <span class="node-value" v-if="!hasChildren">{{ formatValue(node.value) }}</span>
        <span class="node-count" v-else-if="node.type === 'array'">{{ node.children.length }} items</span>
        <span class="node-count" v-else-if="node.type === 'object'">{{ node.children.length }} properties</span>
      </div>
    </div>
    
    <div class="node-children" v-if="node.expanded && hasChildren">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :isDarkMode="isDarkMode"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatJsonPath } from '../../utils/jsonPath'

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
  node: TreeNodeData
  level: number
  isDarkMode?: boolean
}>()

const emit = defineEmits<{
  toggle: [nodeId: string]
  select: [nodeId: string]
}>()

const hasChildren = computed(() => props.node.children.length > 0)



const handleClick = () => {
  emit('select', props.node.id)
}

const handleRightClickSimple = async (_event: MouseEvent, node: TreeNodeData) => {
  console.log('RIGHT CLICK DETECTED ON TREE NODE!', node.path, node.key)
  
  try {
    const jsonPath = formatJsonPath(node.path)
    console.log('Generated JSON path:', jsonPath)
    
    // Copy to clipboard directly
    await navigator.clipboard.writeText(jsonPath)
    
    // Show alert as immediate feedback
    alert(`Copied JSON path: ${jsonPath}`)
    
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    alert(`JSON path: ${formatJsonPath(node.path)}\n\nCopy this manually.`)
  }
}

const formatValue = (value: any): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  return JSON.stringify(value)
}
</script>

<style scoped lang="scss">
.tree-node {
  user-select: text;
  cursor: text;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 4px 0;
  cursor: text;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  user-select: text;
  
  &:hover {
    background: #f8f9fa;
  }
  
  // Text selection styling
  ::selection {
    background: #0969da;
    color: #ffffff;
  }
  
  ::-moz-selection {
    background: #0969da;
    color: #ffffff;
  }
}

.selected .node-content {
  background: #e3f2fd;
  
  &:hover {
    background: #e3f2fd;
  }
}

.node-toggle {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 2px;
  user-select: none;
  
  &:hover {
    background: #e1e5e9;
  }
}

.node-toggle-placeholder {
  width: 20px;
  height: 20px;
}

.toggle-icon {
  font-size: 10px;
  color: #656d76;
  user-select: none;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  user-select: text;
  cursor: text;
}

.node-key {
  font-weight: 600;
  color: #0d1117;
  font-size: 13px;
  user-select: text;
  cursor: text;
}

.node-type {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
  text-transform: uppercase;
  user-select: none;
  
  &.object {
    background: #e3f2fd;
    color: #1565c0;
  }
  
  &.array {
    background: #f3e5f5;
    color: #6a1b9a;
  }
  
  &.string {
    background: #e8f5e8;
    color: #2e7d32;
  }
  
  &.number {
    background: #fff3e0;
    color: #ef6c00;
  }
  
  &.boolean {
    background: #fce4ec;
    color: #ad1457;
  }
  
  &.null {
    background: #f5f5f5;
    color: #616161;
  }
}

.node-value {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
  color: #0d1117;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: text;
  cursor: text;
}

.node-count {
  font-size: 12px;
  color: #4a4a4a;
  font-style: italic;
  font-weight: 500;
  user-select: text;
  cursor: text;
}

.node-children {
  margin-left: 0;
  user-select: text;
  cursor: text;
}

// Dark mode support
// Dark mode support
.tree-node.dark-mode {
  .node-content {
    &:hover {
      background: #30363d;
    }
    
    ::selection {
      background: #58a6ff;
      color: #0d1117;
    }
    
    ::-moz-selection {
      background: #58a6ff;
      color: #0d1117;
    }
  }
  
  &.selected .node-content {
    background: #1a3d5c;
    
    &:hover {
      background: #1a3d5c;
    }
  }
  
  .node-toggle:hover {
    background: #30363d;
  }
  
  .toggle-icon {
    color: #8b949e;
  }
  
  .node-key {
    color: #f0f6fc;
    font-weight: 600;
  }
  
  .node-value {
    color: #e6edf3;
    font-weight: 500;
  }
  
  .node-count {
    color: #8b949e;
    font-weight: 500;
  }
  
  .node-type {
    &.object {
      background: rgba(88, 166, 255, 0.15);
      color: #79c0ff;
    }
    
    &.array {
      background: rgba(188, 140, 255, 0.15);
      color: #d2a8ff;
    }
    
    &.string {
      background: rgba(86, 211, 100, 0.15);
      color: #7ee787;
    }
    
    &.number {
      background: rgba(255, 166, 87, 0.15);
      color: #ffa657;
    }
    
    &.boolean {
      background: rgba(255, 123, 114, 0.15);
      color: #ff7b72;
    }
    
    &.null {
      background: rgba(139, 148, 158, 0.15);
      color: #8b949e;
    }
  }
}
</style>
