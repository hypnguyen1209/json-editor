<template>
  <div 
    v-if="isVisible" 
    class="context-menu" 
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    @click.stop
  >
    <div class="menu-item" @click="copyJsonPath">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
      Copy JSON Path
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Position {
  x: number
  y: number
}

const props = defineProps<{
  isVisible: boolean
  position: Position
  jsonPath: string
}>()

const emit = defineEmits<{
  close: []
  copied: [path: string]
}>()

const copyJsonPath = async () => {
  try {
    await navigator.clipboard.writeText(props.jsonPath)
    emit('copied', props.jsonPath)
  } catch (err) {
    console.error('Failed to copy JSON path:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = props.jsonPath
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      emit('copied', props.jsonPath)
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr)
    }
    document.body.removeChild(textArea)
  }
  emit('close')
}

const handleClickOutside = () => {
  emit('close')
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 160px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 13px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #24292f;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
  
  svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
}

// Dark mode support
:global(.dark-mode) {
  .context-menu {
    background: #2d333b;
    border-color: #444c56;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  
  .menu-item {
    color: #e6edf3;
    
    &:hover {
      background: #373e47;
    }
  }
}
</style>
