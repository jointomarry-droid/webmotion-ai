---
name: webmotion-visual-editor
description: Use when building or working with the visual drag-and-drop editor, component palette, property panel, or live preview features. Trigger on keywords like visual editor, drag drop, builder, canvas, property panel, component palette, live preview, WYSIWYG.
---

# WebMotion Visual Editor Skill

This skill provides guidance for building and using the visual drag-and-drop editor for website creation and customization.

## Editor Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Visual Editor                      │
├─────────────┬─────────────────┬─────────────────────┤
│  Component  │     Canvas      │    Property Panel   │
│   Palette   │  (Live Preview) │    (Controls)       │
├─────────────┴─────────────────┴─────────────────────┤
│                  State Manager                      │
│            (Undo/Redo, History)                     │
└─────────────────────────────────────────────────────┘
```

## Core Components

### 1. Component Palette
```typescript
interface PaletteItem {
  id: string
  name: string
  icon: ReactNode
  category: 'layout' | 'content' | 'media' | 'interactive'
  component: React.ComponentType
  defaultProps: Record<string, any>
}

// Categories
const categories = {
  layout: ['Container', 'Grid', 'Flex', 'Stack', 'Section'],
  content: ['Heading', 'Paragraph', 'List', 'Quote', 'Code'],
  media: ['Image', 'Video', 'Icon', 'Avatar', 'Gallery'],
  interactive: ['Button', 'Input', 'Select', 'Card', 'Modal']
}
```

### 2. Canvas (Live Preview)
```typescript
interface CanvasState {
  selectedId: string | null
  hoveredId: string | null
  components: CanvasComponent[]
  zoom: number
  device: 'desktop' | 'tablet' | 'mobile'
}

interface CanvasComponent {
  id: string
  type: string
  props: Record<string, any>
  children: CanvasComponent[]
  styles: Record<string, any>
  position: { x: number; y: number }
}
```

### 3. Property Panel
```typescript
interface PropertyField {
  name: string
  type: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'slider'
  label: string
  defaultValue: any
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  step?: number
}

// Example property definitions
const buttonProperties: PropertyField[] = [
  { name: 'text', type: 'text', label: 'Button Text', defaultValue: 'Click me' },
  { name: 'variant', type: 'select', label: 'Variant', defaultValue: 'primary',
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Outline', value: 'outline' }
    ]
  },
  { name: 'size', type: 'select', label: 'Size', defaultValue: 'md',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' }
    ]
  },
  { name: 'disabled', type: 'boolean', label: 'Disabled', defaultValue: false }
]
```

## Drag-and-Drop Implementation

### Using @dnd-kit
```typescript
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export function EditorCanvas() {
  const [components, setComponents] = useState<CanvasComponent[]>([])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over) {
      // Move component
      setComponents(items => arrayMove(items, activeIndex, overIndex))
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={components} strategy={verticalListSortingStrategy}>
        {components.map(comp => (
          <SortableItem key={comp.id} component={comp} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

## State Management

### Editor State
```typescript
interface EditorState {
  // Components on canvas
  components: CanvasComponent[]
  
  // Selection state
  selectedId: string | null
  hoveredId: string | null
  
  // History for undo/redo
  history: HistoryEntry[]
  historyIndex: number
  
  // Canvas settings
  zoom: number
  device: 'desktop' | 'tablet' | 'mobile'
  
  // Actions
  addComponent: (type: string, position: Position) => void
  updateComponent: (id: string, props: Record<string, any>) => void
  deleteComponent: (id: string) => void
  moveComponent: (id: string, newPosition: Position) => void
  
  // History actions
  undo: () => void
  redo: () => void
}
```

### History Management
```typescript
interface HistoryEntry {
  timestamp: number
  action: 'add' | 'update' | 'delete' | 'move'
  componentId: string
  previousState: CanvasComponent | null
  newState: CanvasComponent | null
}

// Undo/Redo implementation
const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [index, setIndex] = useState(-1)

  const undo = () => {
    if (index > 0) {
      const entry = history[index - 1]
      applyState(entry.previousState)
      setIndex(index - 1)
    }
  }

  const redo = () => {
    if (index < history.length - 1) {
      const entry = history[index + 1]
      applyState(entry.newState)
      setIndex(index + 1)
    }
  }

  return { undo, redo, canUndo: index > 0, canRedo: index < history.length - 1 }
}
```

## Property Panel Controls

### Control Components
```typescript
// Text Input
function TextInput({ value, onChange, label }: PropertyControlProps) {
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  )
}

// Color Picker
function ColorPicker({ value, onChange, label }: PropertyControlProps) {
  return (
    <div>
      <label>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
      </div>
    </div>
  )
}

// Select Dropdown
function SelectControl({ value, onChange, label, options }: PropertyControlProps) {
  return (
    <div>
      <label>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
```

## Canvas Features

### 1. Responsive Preview
```typescript
const devices = {
  desktop: { width: '100%', label: 'Desktop' },
  tablet: { width: 768, label: 'Tablet' },
  mobile: { width: 375, label: 'Mobile' }
}

function DeviceSelector({ current, onChange }: DeviceSelectorProps) {
  return (
    <div className="flex gap-2">
      {Object.entries(devices).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            'px-3 py-1 rounded',
            current === key ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

### 2. Zoom Controls
```typescript
function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onZoomChange(zoom - 0.1)}>-</button>
      <span>{Math.round(zoom * 100)}%</span>
      <button onClick={() => onZoomChange(zoom + 0.1)}>+</button>
      <button onClick={() => onZoomChange(1)}>Fit</button>
    </div>
  )
}
```

### 3. Grid & Alignment
```typescript
// Snap to grid
const snapToGrid = (position: Position, gridSize: number = 10): Position => ({
  x: Math.round(position.x / gridSize) * gridSize,
  y: Math.round(position.y / gridSize) * gridSize
})

// Alignment guides
const getAlignmentGuides = (components: CanvasComponent[], selected: CanvasComponent) => {
  const guides: Guide[] = []
  
  components.forEach(comp => {
    if (comp.id === selected.id) return
    
    // Horizontal center alignment
    if (Math.abs(comp.position.y - selected.position.y) < 5) {
      guides.push({ type: 'horizontal', position: comp.position.y })
    }
    
    // Vertical center alignment
    if (Math.abs(comp.position.x - selected.position.x) < 5) {
      guides.push({ type: 'vertical', position: comp.position.x })
    }
  })
  
  return guides
}
```

## Code Export

### Generate Code from Canvas
```typescript
function generateCode(components: CanvasComponent[]): string {
  let code = `'use client'\n\nimport { motion } from 'framer-motion'\n\n`
  
  code += `export function GeneratedPage() {\n  return (\n    <div className="min-h-screen">\n`
  
  components.forEach(comp => {
    code += generateComponentCode(comp)
  })
  
  code += `    </div>\n  )\n}\n`
  
  return code
}

function generateComponentCode(comp: CanvasComponent): string {
  const indent = '      '
  
  switch (comp.type) {
    case 'heading':
      return `${indent}<${comp.props.tag} className="${comp.styles.className}">\n${indent}  ${comp.props.text}\n${indent}</${comp.props.tag}>\n`
    
    case 'button':
      return `${indent}<button className="${comp.styles.className}">\n${indent}  ${comp.props.text}\n${indent}</button>\n`
    
    default:
      return `${indent}<div className="${comp.styles.className}">\n${indent}</div>\n`
  }
}
```

## Best Practices

1. **Performance**
   - Virtualize long component lists
   - Debounce property changes
   - Use React.memo for canvas items
   - Lazy load heavy components

2. **User Experience**
   - Show visual feedback on drag
   - Highlight drop zones
   - Provide undo/redo shortcuts
   - Auto-save state

3. **Accessibility**
   - Keyboard navigation
   - Screen reader announcements
   - Focus management
   - High contrast mode

4. **Extensibility**
   - Plugin system for custom components
   - Theme customization
   - Export to multiple formats
   - Import from Figma/Sketch

## Output

When building visual editor features, provide:
- React components with full TypeScript
- State management implementation
- Drag-and-drop functionality
- Property panel controls
- Canvas rendering logic
- Code export utilities
