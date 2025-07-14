<template>
  <div 
    v-if="isVisible" 
    class="toast-notification"
    :class="type"
  >
    <div class="toast-content">
      <svg v-if="type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" class="toast-icon">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
      <svg v-else-if="type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none" class="toast-icon">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span class="toast-message">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  isVisible: boolean
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 3000
})

const emit = defineEmits<{
  hide: []
}>()

// Auto-hide after duration
watch(() => props.isVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      emit('hide')
    }, props.duration)
  }
})
</script>

<style scoped lang="scss">
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 200px;
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: slideIn 0.3s ease-out;
  
  &.success {
    border-color: #28a745;
    
    .toast-icon {
      color: #28a745;
    }
  }
  
  &.error {
    border-color: #dc3545;
    
    .toast-icon {
      color: #dc3545;
    }
  }
  
  &.info {
    border-color: #17a2b8;
    
    .toast-icon {
      color: #17a2b8;
    }
  }
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}

.toast-icon {
  flex-shrink: 0;
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
  color: #24292f;
  flex: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// Dark mode support
:global(.dark-mode) {
  .toast-notification {
    background: #2d333b;
    border-color: #444c56;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    
    &.success {
      border-color: #3fb950;
      
      .toast-icon {
        color: #3fb950;
      }
    }
    
    &.error {
      border-color: #f85149;
      
      .toast-icon {
        color: #f85149;
      }
    }
    
    &.info {
      border-color: #58a6ff;
      
      .toast-icon {
        color: #58a6ff;
      }
    }
  }
  
  .toast-message {
    color: #e6edf3;
  }
}
</style>
