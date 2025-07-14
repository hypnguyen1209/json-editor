<template>
  <div class="card-visualization" :class="{ 'dark-mode': isDarkMode }">
    <div class="cards-container">
      <div v-for="(item, index) in flattenData(props.data)" :key="index" 
           class="data-card"
           @contextmenu.prevent="(event) => showContextMenuForItem(event, item)">
        <div class="card-header">
          <span class="card-key">{{ item.key }}</span>
          <span class="card-type">{{ getDataType(item.value) }}</span>
        </div>
        <div class="card-content">
          <div v-if="item.type === 'object'" class="object-content">
            <div class="object-properties">
              {{ Object.keys(item.value).length }} properties
            </div>
          </div>
          <div v-else-if="item.type === 'array'" class="array-content">
            <div class="array-length">
              {{ item.value.length }} items
            </div>
          </div>
          <div v-else class="primitive-content">
            <span class="value" :class="item.type">{{ formatValue(item.value) }}</span>
          </div>
        </div>
        <div v-if="item.children && item.children.length > 0" class="card-children">
          <div class="children-indicator">
            {{ item.children.length }} nested items
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatJsonPath } from '../../utils/jsonPath'

interface CardItem {
  key: string
  value: any
  type: string
  children?: CardItem[]
  path: string[]
}

const props = defineProps<{
  data: any
  isDarkMode?: boolean
}>()

const flattenData = (obj: any, path: string[] = [], parentKey = 'root'): CardItem[] => {
  const items: CardItem[] = []
  
  if (obj === null || obj === undefined) {
    return [{
      key: parentKey,
      value: obj,
      type: 'null',
      path
    }]
  }
  
  if (Array.isArray(obj)) {
    const arrayItem: CardItem = {
      key: parentKey,
      value: obj,
      type: 'array',
      path,
      children: []
    }
    
    obj.forEach((item, index) => {
      const childItems = flattenData(item, [...path, index.toString()], `[${index}]`)
      arrayItem.children!.push(...childItems)
    })
    
    items.push(arrayItem)
    return items
  }
  
  if (typeof obj === 'object') {
    const objectItem: CardItem = {
      key: parentKey,
      value: obj,
      type: 'object',
      path,
      children: []
    }
    
    Object.entries(obj).forEach(([key, value]) => {
      const childItems = flattenData(value, [...path, key], key)
      objectItem.children!.push(...childItems)
    })
    
    items.push(objectItem)
    return items
  }
  
  // Primitive value
  items.push({
    key: parentKey,
    value: obj,
    type: typeof obj,
    path
  })
  
  return items
}

const getDataType = (value: any): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value
}

const formatValue = (value: any): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  return JSON.stringify(value)
}

// Context menu handlers
const showContextMenuForItem = async (_event: MouseEvent, item: CardItem) => {
  console.log('RIGHT CLICK DETECTED ON CARD!', item.path, item.key)
  
  try {
    const jsonPath = formatJsonPath(item.path)
    console.log('Generated JSON path:', jsonPath)
    
    // Copy to clipboard directly
    await navigator.clipboard.writeText(jsonPath)
    
    // Show alert as immediate feedback
    alert(`Copied JSON path: ${jsonPath}`)
    
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    alert(`JSON path: ${formatJsonPath(item.path)}\n\nCopy this manually.`)
  }
}
</script>

<style scoped lang="scss">
.card-visualization {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  cursor: text;
  user-select: text;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  max-width: 100%;
}

.data-card {
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: text;
  user-select: text;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f3f4;
}

.card-key {
  font-weight: 600;
  font-size: 14px;
  color: #0d1117;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: text;
  cursor: text;
}

.card-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  
  &:contains('object') {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  &:contains('array') {
    background: #f3e5f5;
    color: #7b1fa2;
  }
  
  &:contains('string') {
    background: #e8f5e8;
    color: #388e3c;
  }
  
  &:contains('number') {
    background: #fff3e0;
    color: #f57c00;
  }
  
  &:contains('boolean') {
    background: #fce4ec;
    color: #c2185b;
  }
  
  &:contains('null') {
    background: #f5f5f5;
    color: #757575;
  }
}

.card-content {
  margin-bottom: 12px;
}

.object-content,
.array-content {
  .object-properties,
  .array-length {
    font-size: 13px;
    color: #666;
    font-style: italic;
  }
}

.primitive-content {
  .value {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 4px;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: text;
    cursor: text;
    
    &.string {
      background: #e8f5e8;
      color: #0d4421;
    }
    
    &.number {
      background: #fff3e0;
      color: #8b3d00;
    }
    
    &.boolean {
      background: #fce4ec;
      color: #7a0e3b;
    }
    
    &.null {
      background: #f5f5f5;
      color: #4a4a4a;
    }
  }
}

.card-children {
  .children-indicator {
    font-size: 12px;
    color: #666;
    padding: 4px 8px;
    background: #f8f9fa;
    border-radius: 4px;
    text-align: center;
  }
}

// Dark mode support
.card-visualization.dark-mode .data-card {
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
  
  .card-key {
    color: #f0f6fc;
  }
  
  .card-header {
    border-color: #30363d;
  }
  
  .primitive-content .value {
    font-weight: 500;
    
    &.string {
      background: rgba(126, 231, 135, 0.15);
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
  
  .children-indicator {
    background: #30363d;
    color: #8b949e;
  }
}
</style>
