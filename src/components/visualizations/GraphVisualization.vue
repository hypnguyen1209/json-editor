<template>
  <div class="graph-visualization" :class="{ 'dark-mode': isDarkMode }">
    <div class="graph-container" ref="containerRef">
      <svg ref="svgRef" class="graph-svg"></svg>
    </div>
    
    <div class="graph-controls">
      <button @click="resetView" class="control-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 12A9 9 0 0 1 12 3A9 9 0 0 1 21 12A9 9 0 0 1 12 21" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        Reset
      </button>
      <button @click="centerGraph" class="control-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
        </svg>
        Center
      </button>
      <button @click="togglePhysics" class="control-btn" :class="{ active: physicsEnabled }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        Physics
      </button>
    </div>
    
    <div class="graph-info" v-if="selectedNode">
      <div class="info-header">
        <h4>{{ selectedNode.label }}</h4>
        <span class="info-type" :class="selectedNode.type">{{ selectedNode.type }}</span>
      </div>
      <div class="info-content">
        <div class="info-row">
          <span class="info-label">Path:</span>
          <span class="info-value">{{ selectedNode.path.join(' → ') || 'root' }}</span>
        </div>
        <div class="info-row" v-if="selectedNode.value !== undefined && selectedNode.type !== 'object' && selectedNode.type !== 'array'">
          <span class="info-label">Value:</span>
          <span class="info-value">{{ formatValue(selectedNode.value) }}</span>
        </div>
        <div class="info-row" v-if="selectedNode.children && selectedNode.children.length > 0">
          <span class="info-label">Children:</span>
          <span class="info-value">{{ selectedNode.children.length }}</span>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import * as d3 from 'd3'
import { formatJsonPath } from '../../utils/jsonPath'

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  label: string
  value: any
  type: string
  level: number
  children: string[]
  parent?: string
  path: string[]
  radius: number
  targetX?: number
  targetY?: number
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: GraphNode
  target: GraphNode
}

const props = defineProps<{
  data: any
  isDarkMode?: boolean
}>()

const svgRef = ref<SVGElement>()
const containerRef = ref<HTMLElement>()
const selectedNode = ref<GraphNode | null>(null)
const physicsEnabled = ref(true)

let svg: d3.Selection<SVGElement, unknown, null, undefined>
let g: d3.Selection<SVGGElement, unknown, null, undefined>
let simulation: d3.Simulation<GraphNode, GraphLink>
let zoom: d3.ZoomBehavior<SVGElement, unknown>

const nodes = computed((): GraphNode[] => {
  return buildGraphNodes(props.data)
})

const links = computed((): GraphLink[] => {
  const linkList: GraphLink[] = []
  
  nodes.value.forEach(node => {
    if (node.parent) {
      const parentNode = nodes.value.find(n => n.id === node.parent)
      if (parentNode) {
        linkList.push({
          source: parentNode,
          target: node
        })
      }
    }
  })
  
  return linkList
})

const buildGraphNodes = (data: any, parentId = '', path: string[] = [], level = 0): GraphNode[] => {
  const nodesList: GraphNode[] = []
  const nodeId = path.length === 0 ? 'root' : path.join('.')
  
  const node: GraphNode = {
    id: nodeId,
    label: path.length === 0 ? 'root' : path[path.length - 1],
    value: data,
    type: getDataType(data),
    level,
    children: [],
    parent: parentId || undefined,
    path: [...path],
    radius: getNodeRadius(data, level)
  }
  
  nodesList.push(node)
  
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const childNodes = buildGraphNodes(item, nodeId, [...path, index.toString()], level + 1)
      node.children.push(...childNodes.map(n => n.id))
      nodesList.push(...childNodes)
    })
  } else if (data && typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const childNodes = buildGraphNodes(value, nodeId, [...path, key], level + 1)
      node.children.push(...childNodes.map(n => n.id))
      nodesList.push(...childNodes)
    })
  }
  
  return nodesList
}

const getDataType = (value: any): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value
}

const getNodeRadius = (data: any, level: number): number => {
  const baseRadius = Math.max(15, 25 - level * 2)
  
  if (Array.isArray(data)) {
    return Math.min(baseRadius + data.length * 1.5, 35)
  } else if (data && typeof data === 'object') {
    return Math.min(baseRadius + Object.keys(data).length * 1.5, 35)
  }
  
  return baseRadius
}

const getNodeColor = (type: string): string => {
  const colors = {
    object: '#2196f3',
    array: '#9c27b0',
    string: '#4caf50',
    number: '#ff9800',
    boolean: '#e91e63',
    null: '#9e9e9e'
  }
  return colors[type as keyof typeof colors] || '#69b3a2'
}

const getNodeSize = (data: any, type: string): { width: number, height: number } => {
  let width = 120
  let height = 60
  
  if (type === 'object') {
    const keys = Object.keys(data || {})
    width = Math.max(120, Math.min(200, 80 + keys.length * 8))
    height = Math.max(60, 40 + keys.length * 4)
  } else if (type === 'array') {
    const length = Array.isArray(data) ? data.length : 0
    width = Math.max(120, Math.min(200, 80 + length * 6))
    height = Math.max(60, 40 + Math.ceil(length / 3) * 8)
  } else {
    // For primitive types, adjust based on content length
    const valueStr = formatValue(data)
    width = Math.max(100, Math.min(180, 60 + valueStr.length * 6))
    height = 50
  }
  
  return { width, height }
}

const formatValue = (value: any): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value.length > 20 ? `"${value.substring(0, 20)}..."` : `"${value}"`
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  return JSON.stringify(value).substring(0, 25)
}

const calculateRectangularLayout = (containerWidth: number, containerHeight: number) => {
  // Group nodes by level for hierarchical layout
  const levelGroups: { [key: number]: GraphNode[] } = {}
  const maxLevel = Math.max(...nodes.value.map(n => n.level))
  
  nodes.value.forEach(node => {
    if (!levelGroups[node.level]) {
      levelGroups[node.level] = []
    }
    levelGroups[node.level].push(node)
  })
  
  // Calculate positions for each level
  const margins = { top: 80, bottom: 80, left: 100, right: 100 }
  const usableWidth = containerWidth - margins.left - margins.right
  const usableHeight = containerHeight - margins.top - margins.bottom
  
  for (let level = 0; level <= maxLevel; level++) {
    const levelNodes = levelGroups[level] || []
    if (levelNodes.length === 0) continue
    
    const y = margins.top + (level * (usableHeight / maxLevel))
    const nodeWidth = Math.min(180, usableWidth / Math.max(levelNodes.length, 1))
    const totalWidth = nodeWidth * levelNodes.length
    const startX = margins.left + (usableWidth - totalWidth) / 2
    
    levelNodes.forEach((node, index) => {
      node.targetX = startX + (index * nodeWidth) + nodeWidth / 2
      node.targetY = y
      
      // Initialize x, y if not set
      if (node.x === undefined) node.x = node.targetX
      if (node.y === undefined) node.y = node.targetY
    })
  }
}

const initializeD3 = () => {
  if (!svgRef.value || !containerRef.value) return

  const container = containerRef.value
  const rect = container.getBoundingClientRect()
  const width = rect.width
  const height = rect.height

  // Clear previous content
  d3.select(svgRef.value).selectAll("*").remove()

  svg = d3.select(svgRef.value)
    .attr('width', width)
    .attr('height', height)

  // Add zoom behavior
  zoom = d3.zoom<SVGElement, unknown>()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

  svg.call(zoom)
    .on('click', () => {
      selectedNode.value = null
    })

  // Create main group
  g = svg.append('g')

  // Initialize rectangular layout positions
  calculateRectangularLayout(width, height)

  // Initialize simulation with minimal forces for smooth interactions
  simulation = d3.forceSimulation<GraphNode, GraphLink>()
    .force('link', d3.forceLink<GraphNode, GraphLink>().id(d => d.id).distance(120).strength(0.3))
    .force('collision', d3.forceCollide().radius(d => Math.max(getNodeSize((d as GraphNode).value, (d as GraphNode).type).width / 2 + 20, 50)))
    .force('x', d3.forceX(d => (d as GraphNode).targetX || width / 2).strength(0.8))
    .force('y', d3.forceY(d => (d as GraphNode).targetY || height / 2).strength(0.8))
    .alphaDecay(0.05)

  updateGraph()
}

const updateGraph = () => {
  if (!g || !simulation) return

  // Update links
  const link = g.selectAll<SVGLineElement, GraphLink>('.link')
    .data(links.value, d => `${(d.source as GraphNode).id}-${(d.target as GraphNode).id}`)

  link.exit().remove()

  const linkEnter = link.enter()
    .append('line')
    .attr('class', 'link')
    .style('stroke', '#999')
    .style('stroke-opacity', 0.6)
    .style('stroke-width', 2)

  const linkUpdate = linkEnter.merge(link)

  // Update nodes
  const node = g.selectAll<SVGGElement, GraphNode>('.node')
    .data(nodes.value, d => d.id)

  node.exit().remove()

  const nodeEnter = node.enter()
    .append('g')
    .attr('class', 'node')
    .style('cursor', 'pointer')
    .call(d3.drag<SVGGElement, GraphNode>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('click', (event, d) => {
      event.stopPropagation()
      selectedNode.value = d
    })
    .on('contextmenu', async (event, d) => {
      event.preventDefault()
      event.stopPropagation()
      
      console.log('RIGHT CLICK DETECTED ON GRAPH NODE!', d.path, d.label)
      
      try {
        const jsonPath = formatJsonPath(d.path)
        console.log('Generated JSON path:', jsonPath)
        
        // Copy to clipboard directly
        await navigator.clipboard.writeText(jsonPath)
        
        // Show alert as immediate feedback
        alert(`Copied JSON path: ${jsonPath}`)
        
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
        alert(`JSON path: ${formatJsonPath(d.path)}\n\nCopy this manually.`)
      }
      
      selectedNode.value = d
    })

  // Add rectangular background
  nodeEnter.append('rect')
    .attr('class', 'node-rect')
    .attr('width', d => getNodeSize(d.value, d.type).width)
    .attr('height', d => getNodeSize(d.value, d.type).height)
    .attr('x', d => -getNodeSize(d.value, d.type).width / 2)
    .attr('y', d => -getNodeSize(d.value, d.type).height / 2)
    .attr('rx', 8)
    .attr('ry', 8)
    .style('fill', d => getNodeColor(d.type))
    .style('stroke', '#fff')
    .style('stroke-width', 2)
    .style('transition', 'all 0.3s ease')

  // Add type label (top section)
  nodeEnter.append('text')
    .attr('class', 'node-type')
    .attr('text-anchor', 'middle')
    .attr('dy', d => -getNodeSize(d.value, d.type).height / 2 + 16)
    .style('font-family', 'SF Mono, Monaco, monospace')
    .style('font-size', '10px')
    .style('font-weight', '700')
    .style('fill', '#fff')
    .style('text-transform', 'uppercase')
    .style('opacity', '0.8')
    .style('pointer-events', 'none')
    .text(d => d.type)

  // Add main label (center)
  nodeEnter.append('text')
    .attr('class', 'node-label')
    .attr('text-anchor', 'middle')
    .attr('dy', '0')
    .style('font-family', 'SF Mono, Monaco, monospace')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .style('fill', '#fff')
    .style('pointer-events', 'none')
    .text(d => {
      if (d.label.length > 15) {
        return d.label.substring(0, 15) + '...'
      }
      return d.label
    })

  // Add value label (bottom section) for primitive types
  nodeEnter.filter(d => d.type !== 'object' && d.type !== 'array')
    .append('text')
    .attr('class', 'node-value')
    .attr('text-anchor', 'middle')
    .attr('dy', d => getNodeSize(d.value, d.type).height / 2 - 8)
    .style('font-family', 'SF Mono, Monaco, monospace')
    .style('font-size', '9px')
    .style('font-weight', '400')
    .style('fill', '#fff')
    .style('opacity', '0.9')
    .style('pointer-events', 'none')
    .text(d => {
      const formatted = formatValue(d.value)
      return formatted.length > 20 ? formatted.substring(0, 20) + '...' : formatted
    })

  // Add count label for objects and arrays
  nodeEnter.filter(d => d.type === 'object' || d.type === 'array')
    .append('text')
    .attr('class', 'node-count')
    .attr('text-anchor', 'middle')
    .attr('dy', d => getNodeSize(d.value, d.type).height / 2 - 8)
    .style('font-family', 'SF Mono, Monaco, monospace')
    .style('font-size', '9px')
    .style('font-weight', '400')
    .style('fill', '#fff')
    .style('opacity', '0.9')
    .style('pointer-events', 'none')
    .text(d => {
      if (d.type === 'array') {
        const length = Array.isArray(d.value) ? d.value.length : 0
        return `${length} items`
      } else if (d.type === 'object') {
        const keys = Object.keys(d.value || {})
        return `${keys.length} keys`
      }
      return ''
    })

  const nodeUpdate = nodeEnter.merge(node)

  // Update rectangle colors based on selection
  nodeUpdate.select('.node-rect')
    .style('fill', d => selectedNode.value?.id === d.id ? '#ff6b6b' : getNodeColor(d.type))
    .style('stroke-width', d => selectedNode.value?.id === d.id ? 3 : 2)
    .style('filter', d => selectedNode.value?.id === d.id ? 'brightness(1.1)' : 'none')

  // Set up simulation
  simulation
    .nodes(nodes.value)
    .on('tick', () => {
      linkUpdate
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!)

      nodeUpdate
        .attr('transform', d => `translate(${d.x!},${d.y!})`)
    })

  simulation.force<d3.ForceLink<GraphNode, GraphLink>>('link')!
    .links(links.value)

  simulation.alpha(1).restart()
}

const dragstarted = (event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
  if (!event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

const dragged = (event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
  d.fx = event.x
  d.fy = event.y
}

const dragended = (event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
  if (!event.active) simulation.alphaTarget(0)
  if (!physicsEnabled.value) {
    d.fx = event.x
    d.fy = event.y
  } else {
    d.fx = null
    d.fy = null
  }
}

const resetView = () => {
  if (!svg || !zoom || !containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  calculateRectangularLayout(rect.width, rect.height)
  
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity)
    
  // Reset all fixed positions
  nodes.value.forEach(node => {
    node.fx = null
    node.fy = null
  })
  
  simulation.alpha(1).restart()
  selectedNode.value = null
}

const centerGraph = () => {
  if (!svg || !zoom || !containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(1))
}

const togglePhysics = () => {
  physicsEnabled.value = !physicsEnabled.value
  
  if (physicsEnabled.value) {
    // Enable physics - remove fixed positions
    nodes.value.forEach(node => {
      node.fx = null
      node.fy = null
    })
    simulation.alpha(1).restart()
  } else {
    // Disable physics - fix current positions
    nodes.value.forEach(node => {
      node.fx = node.x
      node.fy = node.y
    })
    simulation.stop()
  }
}



// Watch for data changes
watch(() => props.data, () => {
  nextTick(() => {
    updateGraph()
  })
}, { deep: true })

onMounted(async () => {
  await nextTick()
  initializeD3()
  
  // Handle window resize
  const resizeObserver = new ResizeObserver(() => {
    nextTick(() => {
      initializeD3()
    })
  })
  
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})
</script>

<style scoped lang="scss">
.graph-visualization {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #fafbfc;
}

.graph-container {
  flex: 1;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  margin: 20px;
  position: relative;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.graph-svg {
  width: 100%;
  height: 100%;
  display: block;
  
  :deep(.link) {
    stroke: #999;
    stroke-width: 2;
    stroke-opacity: 0.6;
  }
  
  :deep(.node) {
    cursor: pointer;
    
    .node-rect {
      transition: all 0.3s ease;
      
      &:hover {
        stroke-width: 4 !important;
        filter: brightness(1.1);
      }
    }
    
    .node-type {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 10px;
      font-weight: 700;
      fill: #fff;
      text-transform: uppercase;
      opacity: 0.8;
      pointer-events: none;
      user-select: none;
    }
    
    .node-label {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 12px;
      font-weight: 600;
      fill: #fff;
      pointer-events: none;
      user-select: none;
    }
    
    .node-value, .node-count {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 9px;
      font-weight: 400;
      fill: #fff;
      opacity: 0.9;
      pointer-events: none;
      user-select: none;
    }
  }
}

.graph-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #ffffff;
  color: #24292f;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f3f4f6;
    border-color: #afb8c1;
  }
  
  &.active {
    background: #0969da;
    color: #ffffff;
    border-color: #0969da;
    
    &:hover {
      background: #0860ca;
    }
  }
  
  svg {
    flex-shrink: 0;
  }
}

.graph-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  z-index: 10;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f3f4;
  
  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #24292f;
    font-family: 'SF Mono', Monaco, monospace;
  }
}

.info-type {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  
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

.info-content {
  .info-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .info-label {
    font-size: 12px;
    font-weight: 600;
    color: #656d76;
    min-width: 60px;
    flex-shrink: 0;
  }
  
  .info-value {
    font-size: 12px;
    font-family: 'SF Mono', Monaco, monospace;
    color: #24292f;
    word-break: break-word;
    flex: 1;
  }
}

// Dark mode support
.graph-visualization.dark-mode {
  background: #0d1117;
  
  .graph-container {
    background: #21262d;
    border-color: #30363d;
  }
  
  .graph-svg {
    :deep(.link) {
      stroke: #7d8590;
    }
    
    :deep(.node) {
      .node-value, .node-count {
        fill: #fff;
        opacity: 0.9;
      }
      
      .node-type {
        fill: #fff;
        opacity: 0.8;
      }
      
      .node-label {
        fill: #fff;
      }
    }
  }
  
  .control-btn {
    background: #21262d;
    border-color: #30363d;
    color: #f0f6fc;
    
    &:hover {
      background: #30363d;
      border-color: #484f58;
    }
    
    &.active {
      background: #58a6ff;
      color: #0d1117;
      border-color: #58a6ff;
      
      &:hover {
        background: #539bf5;
      }
    }
  }
  
  .graph-info {
    background: #21262d;
    border-color: #30363d;
    
    .info-header {
      border-color: #30363d;
      
      h4 {
        color: #f0f6fc;
      }
    }
    
    .info-type {
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
    
    .info-label {
      color: #8b949e;
    }
    
    .info-value {
      color: #e6edf3;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .graph-controls {
    top: 10px;
    right: 10px;
    flex-direction: column;
  }
  
  .graph-info {
    bottom: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  .control-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>
