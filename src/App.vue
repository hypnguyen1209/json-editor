<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <!-- Top Navigation Bar -->
    <div class="top-nav">
      <div class="nav-left">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="logo-icon">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M12 7L7 10V14L12 17L17 14V10L12 7Z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <h1>JSON Editor</h1>
        </div>
        <div class="file-actions">
          <div class="file-info">
            <select v-model="selectedFormat" class="format-dropdown">
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
              <option value="toml">TOML</option>
            </select>
            <span class="filename">{{ currentFileName }}</span>
            <span class="file-status" :class="validationStatus.type">{{ validationStatus.message }}</span>
          </div>
        </div>
      </div>
      <div class="nav-right">
        <div class="action-group">
          <button @click="triggerFileUpload" class="nav-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15M17 8L12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Upload
          </button>
          <button @click="loadSampleData" class="nav-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Sample
          </button>
          <button @click="formatData" class="nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" stroke-width="2"/>
            </svg>
            Format
          </button>
          <button @click="validateData" class="nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Validate
          </button>
          <button @click="exportImage" class="nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15M7 10L12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Export
          </button>
        </div>
        <div class="separator"></div>
        <a href="https://github.com/hypnguyen1209/json-editor" target="_blank" rel="noopener noreferrer" class="github-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
        <button @click="toggleTheme" class="theme-btn">
          <svg v-if="!isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Left Panel - Editor -->
      <div class="editor-panel">
        <div class="panel-header">
          <h3>Input</h3>
          <div class="editor-actions">
            <button @click="clearData" class="action-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H5H21M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6H19Z" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              Clear
            </button>
          </div>
        </div>
        <div class="editor-wrapper">
          <div 
            class="drop-zone"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            :class="{ 'drag-over': isDragOver }"
          >
            <VueMonacoEditor
              v-model:value="inputData"
              :language="getMonacoLanguage()"
              :theme="isDarkMode ? 'vs-dark' : 'vs'"
              :options="monacoOptions"
              class="monaco-editor"
              @change="handleDataChange"
            />
            <div v-if="isDragOver" class="drop-overlay">
              <div class="drop-message">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="drop-icon">
                  <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15M17 8L12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <h4>Drop your file here</h4>
                <p>Supports JSON, YAML, CSV, XML, and TOML files</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Vertical Divider -->
      <div class="panel-divider"></div>
      
      <!-- Right Panel - Visualization -->
      <div class="visualization-panel">
        <div class="panel-header">
          <h3>Visualization</h3>
          <div class="viz-controls">
            <select v-model="visualizationType" class="view-selector">
              <option value="cards">Cards</option>
              <option value="tree">Tree</option>
              <option value="graph">Graph</option>
            </select>
            <div class="zoom-controls">
              <button class="zoom-btn" @click="zoomOut">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M21 21L16.65 16.65M8 11H14" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <span class="zoom-level">{{ zoomLevel }}%</span>
              <button class="zoom-btn" @click="zoomIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M21 21L16.65 16.65M11 8V14M8 11H14" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="visualization-canvas" :style="{ transform: `scale(${zoomLevel / 100})` }">
          <CardVisualization 
            v-if="visualizationType === 'cards' && parsedData" 
            :data="parsedData"
            :isDarkMode="isDarkMode"
          />
          <TreeVisualization 
            v-else-if="visualizationType === 'tree' && parsedData" 
            :data="parsedData"
            :isDarkMode="isDarkMode"
          />
          <GraphVisualization 
            v-else-if="visualizationType === 'graph' && parsedData" 
            :data="parsedData"
            :isDarkMode="isDarkMode"
          />
          <div v-else class="empty-canvas">
            <div class="empty-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="empty-icon">
                <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              <h4>No Data to Visualize</h4>
              <p>Enter valid {{ selectedFormat.toUpperCase() }} data in the editor to see the visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Hidden file input for upload -->
    <input 
      ref="fileInput"
      type="file" 
      accept=".json,.yaml,.yml,.csv,.xml,.toml"
      @change="handleFileUpload"
      style="display: none"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { parseData, validateData as validateDataUtil, formatParsedData, type DataFormat } from '@/utils/dataParser'
import { exportAsImage } from '@/utils/export'
import TreeVisualization from '@/components/visualizations/TreeVisualization.vue'
import GraphVisualization from '@/components/visualizations/GraphVisualization.vue'
import CardVisualization from '@/components/visualizations/CardVisualization.vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

// File input reference
const fileInput = ref<HTMLInputElement>()

// Monaco Editor options
const monacoOptions = ref({
  automaticLayout: true,
  fontSize: 14,
  lineNumbers: 'on' as const,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  tabSize: 2,
  insertSpaces: true,
  folding: true,
  foldingStrategy: 'indentation' as const,
  showFoldingControls: 'always' as const,
  bracketPairColorization: { enabled: true },
  guides: {
    bracketPairs: true,
    indentation: true
  },
  suggest: {
    showKeywords: true,
    showSnippets: true
  },
  formatOnPaste: true,
  formatOnType: true
})

// Get the appropriate language for Monaco Editor
const getMonacoLanguage = () => {
  switch (selectedFormat.value) {
    case 'json':
      return 'json'
    case 'yaml':
      return 'yaml'
    case 'xml':
      return 'xml'
    case 'toml':
      return 'ini' // Monaco doesn't have TOML, use INI as fallback
    case 'csv':
      return 'plaintext'
    default:
      return 'plaintext'
  }
}

const appStore = useAppStore()
const isDarkMode = ref(appStore.isDarkMode)

const inputData = ref('')
const selectedFormat = ref<DataFormat>('json')
const visualizationType = ref('tree')
const parsedData = ref(null)
const validationStatus = ref({ type: 'info', message: 'Ready' })
const currentFileName = ref('Untitled')
const zoomLevel = ref(100)
const isDragOver = ref(false)

const sampleData = {
    "glossary": {
        "title": "example glossary",
		"GlossDiv": {
            "title": "S",
			"GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
					"SortAs": "SGML",
					"GlossTerm": "Standard Generalized Markup Language",
					"Acronym": "SGML",
					"Abbrev": "ISO 8879:1986",
					"GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
						"GlossSeeAlso": ["GML", "XML"]
                    },
					"GlossSee": "markup"
                }
            }
        }
    }
}

const handleDataChange = () => {
  try {
    const result = parseData(inputData.value, selectedFormat.value)
    parsedData.value = result
    validationStatus.value = { type: 'success', message: 'Valid' }
  } catch (error) {
    parsedData.value = null
    validationStatus.value = { type: 'error', message: 'Invalid' }
  }
}

const toggleTheme = () => {
  appStore.toggleTheme()
  isDarkMode.value = appStore.isDarkMode
}

const formatData = () => {
  try {
    if (parsedData.value) {
      inputData.value = formatParsedData(parsedData.value, selectedFormat.value)
      validationStatus.value = { type: 'success', message: 'Formatted' }
    }
  } catch (error) {
    validationStatus.value = { type: 'error', message: 'Format error' }
  }
}

const validateData = () => {
  try {
    const isValid = validateDataUtil(inputData.value, selectedFormat.value)
    validationStatus.value = { 
      type: isValid ? 'success' : 'error', 
      message: isValid ? 'Valid' : 'Invalid' 
    }
  } catch (error) {
    validationStatus.value = { type: 'error', message: 'Validation error' }
  }
}

const exportImage = async () => {
  try {
    const element = document.querySelector('.visualization-canvas')
    if (element) {
      await exportAsImage(element as HTMLElement, 'json-visualization')
      validationStatus.value = { type: 'success', message: 'Exported' }
    }
  } catch (error) {
    validationStatus.value = { type: 'error', message: 'Export error' }
  }
}

const loadSampleData = () => {
  inputData.value = JSON.stringify(sampleData, null, 2)
  selectedFormat.value = 'json'
  handleDataChange()
}

const clearData = () => {
  inputData.value = ''
  parsedData.value = null
  validationStatus.value = { type: 'info', message: 'Ready' }
}

const zoomIn = () => {
  if (zoomLevel.value < 200) {
    zoomLevel.value += 25
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 25) {
    zoomLevel.value -= 25
  }
}

// File upload functions
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Process the uploaded file
  processFile(file)
  
  // Reset file input
  target.value = ''
}

// Drag and drop functions
const handleDragOver = (event: DragEvent) => {
  event.dataTransfer!.dropEffect = 'copy'
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  // Only hide overlay if leaving the drop zone entirely
  if (!event.currentTarget || !event.relatedTarget || 
      !(event.currentTarget as Element).contains(event.relatedTarget as Node)) {
    isDragOver.value = false
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return
  
  const file = files[0]
  
  // Check if file type is supported
  const extension = file.name.split('.').pop()?.toLowerCase()
  const supportedExtensions = ['json', 'yaml', 'yml', 'csv', 'xml', 'toml']
  
  if (!extension || !supportedExtensions.includes(extension)) {
    validationStatus.value = { 
      type: 'error', 
      message: 'Unsupported file type' 
    }
    return
  }
  
  // Process the dropped file (reuse the upload logic)
  processFile(file)
}

// Helper function to process file (shared between upload and drop)
const processFile = (file: File) => {
  // Update filename
  currentFileName.value = file.name
  
  // Detect format from file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'json':
      selectedFormat.value = 'json'
      break
    case 'yaml':
    case 'yml':
      selectedFormat.value = 'yaml'
      break
    case 'csv':
      selectedFormat.value = 'csv'
      break
    case 'xml':
      selectedFormat.value = 'xml'
      break
    case 'toml':
      selectedFormat.value = 'toml'
      break
    default:
      selectedFormat.value = 'json'
  }
  
  // Read file content
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    inputData.value = content
    handleDataChange()
    validationStatus.value = { type: 'success', message: 'File loaded' }
  }
  
  reader.onerror = () => {
    validationStatus.value = { type: 'error', message: 'File read error' }
  }
  
  reader.readAsText(file)
}

// Watch for format changes to re-parse data
watch(selectedFormat, () => {
  if (inputData.value) {
    handleDataChange()
  }
})

// Watch for dark mode changes to ensure visualization re-renders
watch(isDarkMode, () => {
  // Force re-render of visualizations by triggering a reactive update
  if (parsedData.value) {
    const temp = parsedData.value
    parsedData.value = null
    nextTick(() => {
      parsedData.value = temp
    })
  }
})

// Load sample data on mount
loadSampleData()
</script>

<style lang="scss">
// Reset and base styles
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  background: #fafbfc;
  color: #24292f;
  overflow: hidden;
}

// Top Navigation
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e1e5e9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon {
    color: #0969da;
  }
  
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #24292f;
    margin: 0;
  }
}

.file-actions {
  display: flex;
  align-items: center;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.format-dropdown {
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #0969da;
  }
  
  &:focus {
    border-color: #0969da;
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.12);
  }
}

.filename {
  font-size: 15px;
  font-weight: 600;
  color: #24292f;
}

.file-status {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  
  &.success {
    background: #dafbe1;
    color: #1a7f37;
  }
  
  &.error {
    background: #ffebe9;
    color: #cf222e;
  }
  
  &.info {
    background: #ddf4ff;
    color: #0969da;
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background: #ffffff;
  color: #24292f;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    border-color: #afb8c1;
  }
  
  &:active {
    background: #e1e5e9;
  }
  
  &.secondary {
    background: #f6f8fa;
    border-color: #d0d7de;
  }
  
  svg {
    flex-shrink: 0;
  }
}

.separator {
  width: 1px;
  height: 24px;
  background: #d0d7de;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background: #ffffff;
  color: #656d76;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #24292f;
  }
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background: #ffffff;
  color: #656d76;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #24292f;
    text-decoration: none;
  }
  
  svg {
    flex-shrink: 0;
  }
  
  span {
    white-space: nowrap;
  }
}

// Main Content Layout
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-panel,
.visualization-panel {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.editor-panel {
  width: 50%;
  border-right: 1px solid #e1e5e9;
}

.visualization-panel {
  width: 50%;
  background: #fafbfc;
}

.panel-divider {
  width: 4px;
  background: #e1e5e9;
  cursor: col-resize;
  
  &:hover {
    background: #0969da;
  }
}

// Panel Headers
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e5e9;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #24292f;
    margin: 0;
  }
}

.editor-actions,
.viz-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #ffffff;
  color: #24292f;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
}

.view-selector {
  padding: 6px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  
  &:focus {
    border-color: #0969da;
    box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.12);
  }
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #ffffff;
  color: #24292f;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
}

.zoom-level {
  font-size: 13px;
  font-weight: 500;
  color: #656d76;
  min-width: 45px;
  text-align: center;
}

// Editor
.editor-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.drop-zone {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: text;
  
  &:hover {
    cursor: text;
  }
  
  &.drag-over {
    .monaco-editor {
      opacity: 0.3;
    }
  }
}

.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 105, 218, 0.1);
  border: 2px dashed #0969da;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
}

.drop-message {
  text-align: center;
  color: #0969da;
  
  .drop-icon {
    margin-bottom: 16px;
    color: #0969da;
  }
  
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    opacity: 0.8;
  }
}

.monaco-editor {
  width: 100%;
  height: 100%;
  border: none !important;
  outline: none !important;
  cursor: text !important;
  
  &:hover {
    cursor: text !important;
  }
  
  .prism-editor__textarea,
  .prism-editor__editor {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Liberation Mono', 'Menlo', monospace !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
    padding: 20px !important;
    cursor: text !important;
  }

  .prism-editor__textarea {
    outline: none !important;
    background: transparent !important;
    color: #0d1117 !important;
    font-weight: 500 !important;
    resize: none !important;
    cursor: text !important;
    caret-color: #0969da !important;
    
    &:focus {
      cursor: text !important;
      caret-color: #0969da !important;
      outline: none !important;
    }
    
    &:hover {
      cursor: text !important;
    }
    
    &::selection {
      background: #0969da !important;
      color: #ffffff !important;
    }
    
    &::-moz-selection {
      background: #0969da !important;
      color: #ffffff !important;
    }
    
    &::placeholder {
      color: #656d76 !important;
      font-weight: 400 !important;
    }
  }

  .prism-editor__editor {
    background: #ffffff !important;
    cursor: text !important;
    
    // Enhanced syntax highlighting with darker colors
    .token.string {
      color: #0a3069 !important;
      font-weight: 500 !important;
    }
    
    .token.number {
      color: #8250df !important;
      font-weight: 600 !important;
    }
    
    .token.boolean {
      color: #cf222e !important;
      font-weight: 600 !important;
    }
    
    .token.null {
      color: #656d76 !important;
      font-weight: 600 !important;
    }
    
    .token.property {
      color: #0969da !important;
      font-weight: 600 !important;
    }
    
    .token.punctuation {
      color: #24292f !important;
      font-weight: 500 !important;
    }
  }

  .prism-editor__line-numbers {
    background: #f6f8fa !important;
    color: #656d76 !important;
    border-right: 1px solid #e1e5e9 !important;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
    padding: 20px 16px !important;
    min-width: 60px !important;
    text-align: right !important;
    font-weight: 500 !important;
    user-select: none !important;
  }
}

// Visualization Canvas
.visualization-canvas {
  flex: 1;
  overflow: auto;
  background: #fafbfc;
  position: relative;
  transform-origin: top left;
  transition: transform 0.2s ease;
}

.empty-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #fafbfc;
}

.empty-message {
  text-align: center;
  color: #656d76;
  max-width: 320px;
  padding: 40px;
  
  .empty-icon {
    color: #d0d7de;
    margin-bottom: 16px;
  }
  
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #24292f;
  }
  
  p {
    font-size: 14px;
    line-height: 1.5;
  }
}

// Dark mode
.dark-mode {
  background: #0d1117;
  color: #f0f6fc;
  
  .top-nav {
    background: #161b22;
    border-color: #30363d;
  }
  
  .logo h1 {
    color: #f0f6fc;
  }
  
  .format-dropdown,
  .nav-btn,
  .theme-btn,
  .github-btn,
  .action-btn,
  .view-selector,
  .zoom-btn {
    background: #21262d;
    border-color: #30363d;
    color: #f0f6fc;
    
    &:hover {
      background: #30363d;
      border-color: #484f58;
    }
  }
  
  .nav-btn.secondary {
    background: #161b22;
  }
  
  .filename {
    color: #f0f6fc;
  }
  
  .file-status {
    &.success {
      background: rgba(46, 160, 67, 0.15);
      color: #3fb950;
    }
    
    &.error {
      background: rgba(248, 81, 73, 0.15);
      color: #f85149;
    }
    
    &.info {
      background: rgba(88, 166, 255, 0.15);
      color: #58a6ff;
    }
  }
  
  .separator {
    background: #30363d;
  }
  
  .editor-panel,
  .visualization-panel {
    background: #0d1117;
  }
  
  .visualization-panel {
    background: #0d1117;
  }
  
  .panel-divider {
    background: #30363d;
    
    &:hover {
      background: #58a6ff;
    }
  }
  
  .panel-header {
    background: #161b22;
    border-color: #30363d;
    
    h3 {
      color: #f0f6fc;
    }
  }
  
  .code-editor {
    .prism-editor__textarea {
      color: #e6edf3 !important;
      font-weight: 500 !important;
      caret-color: #58a6ff !important;
      
      &:focus {
        cursor: text !important;
        caret-color: #58a6ff !important;
        outline: none !important;
      }
      
      &:hover {
        cursor: text !important;
      }
      
      &::selection {
        background: #58a6ff !important;
        color: #0d1117 !important;
      }
      
      &::-moz-selection {
        background: #58a6ff !important;
        color: #0d1117 !important;
      }
      
      &::placeholder {
        color: #7d8590 !important;
        font-weight: 400 !important;
      }
    }
    
    .prism-editor__editor {
      background: #0d1117 !important;
      cursor: text !important;
      
      // Enhanced dark mode syntax highlighting
      .token.string {
        color: #7ee787 !important;
        font-weight: 500 !important;
      }
      
      .token.number {
        color: #79c0ff !important;
        font-weight: 600 !important;
      }
      
      .token.boolean {
        color: #ff7b72 !important;
        font-weight: 600 !important;
      }
      
      .token.null {
        color: #8b949e !important;
        font-weight: 600 !important;
      }
      
      .token.property {
        color: #79c0ff !important;
        font-weight: 600 !important;
      }
      
      .token.punctuation {
        color: #e6edf3 !important;
        font-weight: 500 !important;
      }
    }
    
    .prism-editor__line-numbers {
      background: #161b22 !important;
      color: #8b949e !important;
      border-color: #30363d !important;
      font-weight: 500 !important;
    }
  }
  
  .visualization-canvas,
  .empty-canvas {
    background: #0d1117;
  }
  
  .empty-message {
    color: #7d8590;
    
    .empty-icon {
      color: #484f58;
    }
    
    h4 {
      color: #f0f6fc;
    }
  }
  
  .drop-overlay {
    background: rgba(88, 166, 255, 0.1);
    border-color: #58a6ff;
  }
  
  .drop-message {
    color: #58a6ff;
    
    .drop-icon {
      color: #58a6ff;
    }
  }
}

// Responsive design
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .editor-panel,
  .visualization-panel {
    width: 100%;
    height: 50%;
  }
  
  .editor-panel {
    border-right: none;
    border-bottom: 1px solid #e1e5e9;
  }
  
  .panel-divider {
    display: none;
  }
}

@media (max-width: 768px) {
  .top-nav {
    padding: 0 16px;
    flex-wrap: wrap;
    min-height: 64px;
  }
  
  .nav-left {
    gap: 16px;
  }
  
  .nav-right {
    gap: 8px;
  }
  
  .action-group {
    gap: 4px;
  }
  
  .nav-btn {
    padding: 6px 12px;
    font-size: 13px;
    
    span {
      display: none;
    }
  }
  
  .github-btn {
    padding: 8px;
    
    span {
      display: none;
    }
  }
  
  .panel-header {
    padding: 12px 16px;
  }
}
</style>
