<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <router-link to="/" class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="4" fill="currentColor" opacity="0.1"/>
            <path d="M12 10h8M12 16h8M12 22h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>JSON Visualizer</span>
        </router-link>
      </div>

      <nav class="nav">
        <router-link to="/visualizer" class="nav-link">Visualizer</router-link>
        <router-link to="/converter" class="nav-link">Convert</router-link>
        <router-link to="/validator" class="nav-link">Validate</router-link>
        <router-link to="/codegen" class="nav-link">Code Gen</router-link>
        <router-link to="/schema" class="nav-link">Schema</router-link>
        <router-link to="/tools" class="nav-link">Tools</router-link>
      </nav>

      <div class="header-right">
        <button @click="$emit('toggle-theme')" class="btn btn-secondary theme-toggle">
          <svg v-if="!isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
            <path d="m12 1-1 1m0 0-1-1m1 1 1-1M3 12l1 1m0 0-1 1m1-1-1-1m18 0-1 1m0 0 1 1m-1-1 1-1M12 21l1 1m0 0 1-1m-1 1-1-1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const isDarkMode = computed(() => appStore.isDarkMode)

defineEmits<{
  'toggle-theme': []
}>()
</script>

<style lang="scss" scoped>
.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.125rem;

  svg {
    color: var(--primary);
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: $spacing-lg;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.875rem;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-md;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }

  &.router-link-active {
    color: var(--primary);
    background-color: rgba(59, 130, 246, 0.1);
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.theme-toggle {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
