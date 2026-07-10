'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Move,
  Eye,
  EyeOff,
  Undo2,
  Redo2,
  Save,
  Download,
  Settings,
  Layers,
  Palette,
  Type,
  Image,
  Layout,
  Grid,
  Box,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Code,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { copyToClipboard } from '@/lib/utils'
import { AILayoutGenerator, type GeneratedSection } from '@/components/editor/AILayoutGenerator'
import { SectionRenderer } from '@/components/editor/SectionRenderer'
import { AISuggestions } from '@/components/editor/AISuggestions'
import { SectionPropertyEditor } from '@/components/editor/SectionPropertyEditor'
import { generateTailwindCode } from '@/lib/editor/codeExport'
import { saveProject, getAllProjects, deleteProject, exportProjectAsJSON, downloadFile } from '@/lib/editor/projectStorage'
import toast from 'react-hot-toast'

interface Component {
  id: string
  type: string
  name: string
  props: Record<string, any>
  children?: Component[]
  styles: Record<string, string>
  visible: boolean
  locked: boolean
}

interface HistoryState {
  components: Component[]
  timestamp: number
}

const COMPONENT_CATEGORIES = [
  {
    name: 'Layout',
    icon: Layout,
    components: [
      { type: 'container', name: 'Container', icon: Box },
      { type: 'section', name: 'Section', icon: Layout },
      { type: 'grid', name: 'Grid', icon: Grid },
      { type: 'flex', name: 'Flex Row', icon: Layout },
    ],
  },
  {
    name: 'Content',
    icon: Type,
    components: [
      { type: 'heading', name: 'Heading', icon: Type },
      { type: 'paragraph', name: 'Paragraph', icon: Type },
      { type: 'list', name: 'List', icon: Type },
      { type: 'quote', name: 'Quote', icon: Type },
    ],
  },
  {
    name: 'Media',
    icon: Image,
    components: [
      { type: 'image', name: 'Image', icon: Image },
      { type: 'video', name: 'Video', icon: Image },
      { type: 'icon', name: 'Icon', icon: Image },
    ],
  },
  {
    name: 'Interactive',
    icon: Sparkles,
    components: [
      { type: 'button', name: 'Button', icon: Box },
      { type: 'input', name: 'Input', icon: Box },
      { type: 'card', name: 'Card', icon: Box },
      { type: 'modal', name: 'Modal', icon: Box },
    ],
  },
  {
    name: 'Navigation',
    icon: Layout,
    components: [
      { type: 'navbar', name: 'Navbar', icon: Layout },
      { type: 'sidebar', name: 'Sidebar', icon: Layout },
      { type: 'tabs', name: 'Tabs', icon: Layout },
      { type: 'breadcrumb', name: 'Breadcrumb', icon: Layout },
    ],
  },
  {
    name: 'Sections',
    icon: Layout,
    components: [
      { type: 'hero', name: 'Hero Section', icon: Layout },
      { type: 'features', name: 'Features', icon: Layout },
      { type: 'pricing', name: 'Pricing', icon: Layout },
      { type: 'testimonial', name: 'Testimonial', icon: Layout },
      { type: 'footer', name: 'Footer', icon: Layout },
    ],
  },
]

const DEFAULT_COMPONENTS: Component[] = [
  {
    id: 'root',
    type: 'container',
    name: 'Page',
    props: {},
    children: [
      {
        id: 'hero-1',
        type: 'hero',
        name: 'Hero Section',
        props: {
          title: 'Welcome to WebMotion.ai',
          subtitle: 'Build beautiful websites with AI-powered animations',
          ctaText: 'Get Started',
          ctaLink: '/signup',
        },
        styles: {
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '80px 20px',
          textAlign: 'center',
        },
        visible: true,
        locked: false,
      },
      {
        id: 'features-1',
        type: 'features',
        name: 'Features Section',
        props: {
          title: 'Powerful Features',
          items: [
            { title: 'AI Animations', description: 'Generate animations with AI' },
            { title: 'Visual Editor', description: 'Drag-and-drop builder' },
            { title: 'One-Click Deploy', description: 'Deploy instantly' },
          ],
        },
        styles: {
          padding: '60px 20px',
          backgroundColor: '#ffffff',
        },
        visible: true,
        locked: false,
      },
    ],
    styles: {},
    visible: true,
    locked: false,
  },
]

export default function VisualEditorPage() {
  const [components, setComponents] = useState<Component[]>(DEFAULT_COMPONENTS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryState[]>([{ components: DEFAULT_COMPONENTS, timestamp: Date.now() }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<'ai' | 'components' | 'styles' | 'settings'>('ai')
  const [draggedType, setDraggedType] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const selectedComponent = findComponentById(components, selectedId)

  function findComponentById(comps: Component[], id: string | null): Component | null {
    if (!id) return null
    for (const comp of comps) {
      if (comp.id === id) return comp
      if (comp.children) {
        const found = findComponentById(comp.children, id)
        if (found) return found
      }
    }
    return null
  }

  const addToHistory = useCallback((newComponents: Component[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ components: newComponents, timestamp: Date.now() })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setComponents(history[historyIndex - 1].components)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setComponents(history[historyIndex + 1].components)
    }
  }

  const addComponent = (type: string, parentId: string = 'root') => {
    const id = `${type}-${Date.now()}`
    const defaultProps: Record<string, any> = {}
    const defaultStyles: Record<string, string> = {}

    switch (type) {
      case 'heading':
        defaultProps.text = 'New Heading'
        defaultProps.level = 'h2'
        break
      case 'paragraph':
        defaultProps.text = 'New paragraph text goes here.'
        break
      case 'button':
        defaultProps.text = 'Click Me'
        defaultProps.variant = 'primary'
        break
      case 'image':
        defaultProps.src = '/placeholder.svg'
        defaultProps.alt = 'Image'
        break
      case 'hero':
        defaultProps.title = 'Hero Title'
        defaultProps.subtitle = 'Hero subtitle text'
        defaultProps.ctaText = 'Get Started'
        defaultStyles.backgroundColor = '#0f172a'
        defaultStyles.color = '#ffffff'
        defaultStyles.padding = '80px 20px'
        defaultStyles.textAlign = 'center'
        break
    }

    const newComponent: Component = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      props: defaultProps,
      styles: defaultStyles,
      visible: true,
      locked: false,
    }

    const addToParent = (comps: Component[]): Component[] => {
      return comps.map((comp) => {
        if (comp.id === parentId) {
          return { ...comp, children: [...(comp.children || []), newComponent] }
        }
        if (comp.children) {
          return { ...comp, children: addToParent(comp.children) }
        }
        return comp
      })
    }

    const newComponents = addToParent(components)
    setComponents(newComponents)
    addToHistory(newComponents)
    setSelectedId(id)
    toast.success(`Added ${newComponent.name}`)
  }

  const removeComponent = (id: string) => {
    if (id === 'root') return

    const removeFromTree = (comps: Component[]): Component[] => {
      return comps
        .filter((comp) => comp.id !== id)
        .map((comp) => ({
          ...comp,
          children: comp.children ? removeFromTree(comp.children) : undefined,
        }))
    }

    const newComponents = removeFromTree(components)
    setComponents(newComponents)
    addToHistory(newComponents)
    if (selectedId === id) setSelectedId(null)
    toast.success('Component removed')
  }

  const duplicateComponent = (id: string) => {
    if (id === 'root') return

    const duplicateInTree = (comps: Component[]): Component[] => {
      return comps.flatMap((comp) => {
        if (comp.id === id) {
          const duplicate = {
            ...comp,
            id: `${comp.type}-${Date.now()}`,
            name: `${comp.name} (Copy)`,
          }
          return [comp, duplicate]
        }
        if (comp.children) {
          return [{ ...comp, children: duplicateInTree(comp.children) }]
        }
        return [comp]
      })
    }

    const newComponents = duplicateInTree(components)
    setComponents(newComponents)
    addToHistory(newComponents)
    toast.success('Component duplicated')
  }

  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const root = components[0]
    if (!root?.children) return

    const index = root.children.findIndex((c) => c.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === root.children.length - 1) return

    const newChildren = [...root.children]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const [moved] = newChildren.splice(index, 1)
    newChildren.splice(targetIndex, 0, moved)

    const newComponents = components.map((c) =>
      c.id === 'root' ? { ...c, children: newChildren } : c
    )
    setComponents(newComponents)
    addToHistory(newComponents)
  }

  const updateComponentProps = (id: string, props: Record<string, any>) => {
    const updateInTree = (comps: Component[]): Component[] => {
      return comps.map((comp) => {
        if (comp.id === id) {
          return { ...comp, props: { ...comp.props, ...props } }
        }
        if (comp.children) {
          return { ...comp, children: updateInTree(comp.children) }
        }
        return comp
      })
    }

    const newComponents = updateInTree(components)
    setComponents(newComponents)
  }

  const updateComponentStyles = (id: string, styles: Record<string, string>) => {
    const updateInTree = (comps: Component[]): Component[] => {
      return comps.map((comp) => {
        if (comp.id === id) {
          return { ...comp, styles: { ...comp.styles, ...styles } }
        }
        if (comp.children) {
          return { ...comp, children: updateInTree(comp.children) }
        }
        return comp
      })
    }

    const newComponents = updateInTree(components)
    setComponents(newComponents)
  }

  const toggleVisibility = (id: string) => {
    const toggleInTree = (comps: Component[]): Component[] => {
      return comps.map((comp) => {
        if (comp.id === id) {
          return { ...comp, visible: !comp.visible }
        }
        if (comp.children) {
          return { ...comp, children: toggleInTree(comp.children) }
        }
        return comp
      })
    }

    setComponents(toggleInTree(components))
  }

  const handleDragStart = (type: string) => {
    setDraggedType(type)
  }

  const handleDrop = (parentId: string) => {
    if (draggedType) {
      addComponent(draggedType, parentId)
      setDraggedType(null)
    }
  }

  const generateCode = (): string => {
    return generateTailwindCode(components)
  }

  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-semibold">Visual Editor</h1>
          <Badge variant="secondary">Draft</Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="flex items-center border rounded-lg p-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded ${device === 'desktop' ? 'bg-muted' : ''}`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded ${device === 'tablet' ? 'bg-muted' : ''}`}
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded ${device === 'mobile' ? 'bg-muted' : ''}`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-border" />

          <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex === 0}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo2 className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border" />

          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>

          <Button variant="outline" size="sm" onClick={() => {
            const name = prompt('Project name:', 'My Website')
            if (name) {
              saveProject(name, components)
              toast.success(`Saved "${name}"`)
            }
          }}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>

          <Button size="sm" onClick={() => {
            const code = generateCode()
            downloadFile(code, 'page.tsx', 'text/typescript')
            toast.success('Code downloaded!')
          }}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>

          <Button variant="ghost" size="sm" onClick={() => {
            const code = generateCode()
            copyToClipboard(code)
            toast.success('Code copied!')
          }}>
            <Code className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Components */}
        {!showPreview && (
          <aside className="w-64 border-r flex flex-col shrink-0">
            <div className="p-3 border-b">
              <div className="flex gap-1">
                {(['ai', 'components', 'styles', 'settings'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSidebarTab(tab)}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded capitalize ${
                      sidebarTab === tab ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    {tab === 'ai' ? '✨ AI' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3">
              {sidebarTab === 'ai' && (
                <AILayoutGenerator
                  onGenerate={(sections) => {
                    const rootChildren = sections.map((s) => ({
                      ...s,
                      id: `${s.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    }))
                    const newComponents = components.map((c) =>
                      c.id === 'root'
                        ? { ...c, children: [...(c.children || []), ...rootChildren] }
                        : c
                    )
                    setComponents(newComponents)
                    addToHistory(newComponents)
                    toast.success(`Generated ${sections.length} sections`)
                  }}
                  onAppend={(sections) => {
                    const rootChildren = sections.map((s) => ({
                      ...s,
                      id: `${s.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    }))
                    const newComponents = components.map((c) =>
                      c.id === 'root'
                        ? { ...c, children: [...(c.children || []), ...rootChildren] }
                        : c
                    )
                    setComponents(newComponents)
                    addToHistory(newComponents)
                    toast.success(`Added ${sections.length} sections`)
                  }}
                  currentSectionCount={components[0]?.children?.length || 0}
                />
              )}

              {sidebarTab === 'components' && (
                <div className="space-y-4">
                  {COMPONENT_CATEGORIES.map((category) => (
                    <div key={category.name}>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        {category.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {category.components.map((comp) => (
                          <button
                            key={comp.type}
                            draggable
                            onDragStart={() => handleDragStart(comp.type)}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-center"
                          >
                            <comp.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">{comp.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sidebarTab === 'styles' && selectedComponent && (
                <SectionPropertyEditor
                  component={selectedComponent}
                  onUpdate={(props) => updateComponentProps(selectedComponent.id, props)}
                  onStyleUpdate={(styles) => updateComponentStyles(selectedComponent.id, styles)}
                />
              )}

              {sidebarTab === 'settings' && selectedComponent && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Name</label>
                    <Input
                      value={selectedComponent.name}
                      onChange={(e) => {
                        const updateName = (comps: Component[]): Component[] =>
                          comps.map((c) =>
                            c.id === selectedComponent.id
                              ? { ...c, name: e.target.value }
                              : { ...c, children: c.children ? updateName(c.children) : undefined }
                          )
                        setComponents(updateName(components))
                      }}
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(selectedComponent.id)}
                    >
                      {selectedComponent.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateComponent(selectedComponent.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveComponent(selectedComponent.id, 'up')}
                    >
                      <ChevronDown className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveComponent(selectedComponent.id, 'down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeComponent(selectedComponent.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {sidebarTab === 'components' && !selectedComponent && (
                <p className="text-xs text-muted-foreground text-center mt-8">
                  Select a component to edit its properties
                </p>
              )}
            </div>
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1 overflow-auto bg-muted/30 p-8 flex justify-center">
          <div
            ref={canvasRef}
            className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: deviceWidths[device],
              maxWidth: '100%',
              minHeight: '600px',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('root')}
          >
            <AnimatePresence>
              {components[0]?.children?.filter((c) => c.visible).map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`relative group ${
                    selectedId === component.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-primary/30 hover:ring-offset-1'
                  }`}
                  style={component.styles}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedId(component.id)
                  }}
                >
                  {/* Component Controls */}
                  <div className="absolute -top-3 left-0 right-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="flex items-center gap-1 bg-background border rounded-lg px-2 py-1 shadow-lg">
                      <GripVertical className="h-3 w-3 text-muted-foreground cursor-move" />
                      <span className="text-xs font-medium px-1">{component.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveComponent(component.id, 'up')
                        }}
                        className="p-0.5 hover:bg-muted rounded"
                        title="Move up"
                      >
                        <ChevronDown className="h-3 w-3 rotate-180" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveComponent(component.id, 'down')
                        }}
                        className="p-0.5 hover:bg-muted rounded"
                        title="Move down"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateComponent(component.id)
                        }}
                        className="p-0.5 hover:bg-muted rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeComponent(component.id)
                        }}
                        className="p-0.5 hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {/* Component Content */}
                  <SectionRenderer component={component} />
                </motion.div>
              ))}
            </AnimatePresence>

            {components[0]?.children?.length === 0 && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Drop components here</p>
                  <p className="text-sm">Drag from the left panel or click + to add</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Layer Tree + Suggestions */}
        {!showPreview && (
          <aside className="w-64 border-l flex flex-col shrink-0">
            <div className="p-3 border-b">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Layers
              </h3>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <LayerTree
                components={components}
                selectedId={selectedId}
                onSelect={setSelectedId}
                depth={0}
              />
            </div>
            {components[0]?.children && components[0].children.length > 0 && (
              <div className="border-t p-3">
                <AISuggestions
                  currentSections={components[0].children}
                  onAddSection={(type) => addComponent(type, 'root')}
                />
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}

function LayerTree({
  components,
  selectedId,
  onSelect,
  depth,
}: {
  components: Component[]
  selectedId: string | null
  onSelect: (id: string) => void
  depth: number
}) {
  return (
    <div style={{ paddingLeft: depth * 16 }}>
      {components.map((comp) => (
        <div key={comp.id}>
          <button
            onClick={() => onSelect(comp.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-left ${
              selectedId === comp.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            } ${!comp.visible ? 'opacity-50' : ''}`}
          >
            {comp.children && comp.children.length > 0 && (
              <ChevronRight className="h-3 w-3 shrink-0" />
            )}
            <span className="truncate">{comp.name}</span>
          </button>
          {comp.children && comp.children.length > 0 && (
            <LayerTree
              components={comp.children}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}
