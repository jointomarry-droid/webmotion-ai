'use client'

import { Type, AlignLeft, MousePointer, Image, Layout, CreditCard, Grid, Minus, Plus } from 'lucide-react'
import { CanvasElement } from './EditorCanvas'

const components = [
  {
    type: 'heading' as const,
    label: 'Heading',
    icon: Type,
    defaultProps: {
      content: 'Your Heading Here',
      styles: { fontSize: '2rem', fontWeight: 'bold' },
    },
  },
  {
    type: 'paragraph' as const,
    label: 'Paragraph',
    icon: AlignLeft,
    defaultProps: {
      content: 'Your text content goes here. Edit this to add your own description.',
      styles: { color: '#6b7280' },
    },
  },
  {
    type: 'button' as const,
    label: 'Button',
    icon: MousePointer,
    defaultProps: {
      content: 'Click Me',
      styles: {},
    },
  },
  {
    type: 'card' as const,
    label: 'Card',
    icon: CreditCard,
    defaultProps: {
      content: 'Card Title',
      styles: {},
    },
  },
  {
    type: 'container' as const,
    label: 'Container',
    icon: Layout,
    defaultProps: {
      content: '',
      styles: {},
      children: [],
    },
  },
]

interface ComponentPaletteProps {
  onAddElement: (element: CanvasElement) => void
}

export function ComponentPalette({ onAddElement }: ComponentPaletteProps) {
  const handleAddComponent = (component: typeof components[0]) => {
    const newElement: CanvasElement = {
      id: `el-${Date.now()}`,
      type: component.type,
      content: component.defaultProps.content,
      styles: component.defaultProps.styles as Record<string, string>,
      children: component.defaultProps.children,
    }
    onAddElement(newElement)
  }

  return (
    <div className="w-64 border-r border-border bg-background p-4 overflow-y-auto">
      <h3 className="font-semibold text-sm mb-4 text-muted-foreground">Components</h3>
      
      <div className="space-y-2">
        {components.map((component) => (
          <button
            key={component.type}
            onClick={() => handleAddComponent(component)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <component.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="font-medium text-sm">{component.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-semibold text-sm mb-4 text-muted-foreground">Layouts</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const elements: CanvasElement[] = [
                { id: `el-${Date.now()}-1`, type: 'heading', content: 'Hero Section', styles: { fontSize: '3rem', fontWeight: 'bold', textAlign: 'center' } },
                { id: `el-${Date.now()}-2`, type: 'paragraph', content: 'Your description here', styles: { textAlign: 'center', color: '#6b7280' } },
                { id: `el-${Date.now()}-3`, type: 'button', content: 'Get Started', styles: {} },
              ]
              elements.forEach(el => onAddElement(el))
            }}
            className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="text-xs font-medium">Hero</div>
          </button>
          <button
            onClick={() => {
              const elements: CanvasElement[] = [
                { id: `el-${Date.now()}-1`, type: 'heading', content: 'Features', styles: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' } },
                { id: `el-${Date.now()}-2`, type: 'card', content: 'Feature 1', styles: {} },
                { id: `el-${Date.now()}-3`, type: 'card', content: 'Feature 2', styles: {} },
                { id: `el-${Date.now()}-4`, type: 'card', content: 'Feature 3', styles: {} },
              ]
              elements.forEach(el => onAddElement(el))
            }}
            className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="text-xs font-medium">Features</div>
          </button>
          <button
            onClick={() => {
              const elements: CanvasElement[] = [
                { id: `el-${Date.now()}-1`, type: 'heading', content: 'Pricing', styles: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' } },
                { id: `el-${Date.now()}-2`, type: 'card', content: 'Starter', styles: {} },
                { id: `el-${Date.now()}-3`, type: 'card', content: 'Pro', styles: {} },
                { id: `el-${Date.now()}-4`, type: 'card', content: 'Enterprise', styles: {} },
              ]
              elements.forEach(el => onAddElement(el))
            }}
            className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="text-xs font-medium">Pricing</div>
          </button>
          <button
            onClick={() => {
              const elements: CanvasElement[] = [
                { id: `el-${Date.now()}-1`, type: 'heading', content: 'CTA Section', styles: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' } },
                { id: `el-${Date.now()}-2`, type: 'paragraph', content: 'Ready to get started?', styles: { textAlign: 'center', color: '#6b7280' } },
                { id: `el-${Date.now()}-3`, type: 'button', content: 'Sign Up Now', styles: {} },
              ]
              elements.forEach(el => onAddElement(el))
            }}
            className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="text-xs font-medium">CTA</div>
          </button>
        </div>
      </div>
    </div>
  )
}
