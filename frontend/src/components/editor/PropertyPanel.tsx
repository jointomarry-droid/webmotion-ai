'use client'

import { CanvasElement } from './EditorCanvas'

interface PropertyPanelProps {
  element: CanvasElement | null
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
}

export function PropertyPanel({ element, onUpdateElement }: PropertyPanelProps) {
  if (!element) {
    return (
      <div className="w-72 border-l border-border bg-background p-4">
        <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">Select an element to edit its properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 border-l border-border bg-background p-4 overflow-y-auto">
      <h3 className="font-semibold text-sm mb-4 text-muted-foreground">Properties</h3>

      <div className="space-y-4">
        {/* Content */}
        <div>
          <label className="block text-xs font-medium mb-1">Content</label>
          <textarea
            value={element.content}
            onChange={(e) => onUpdateElement(element.id, { content: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none"
            rows={3}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <div className="px-3 py-2 rounded-lg border border-input bg-muted text-sm capitalize">
            {element.type}
          </div>
        </div>

        {/* Styles */}
        <div className="space-y-3">
          <label className="block text-xs font-medium mb-1">Styles</label>

          {/* Font Size */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Font Size</label>
            <input
              type="text"
              value={element.styles.fontSize || ''}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  styles: { ...element.styles, fontSize: e.target.value },
                })
              }
              placeholder="e.g., 2rem, 24px"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Font Weight</label>
            <select
              value={element.styles.fontWeight || ''}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  styles: { ...element.styles, fontWeight: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            >
              <option value="">Default</option>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="300">Light</option>
              <option value="600">Semi Bold</option>
            </select>
          </div>

          {/* Text Align */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Text Align</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() =>
                    onUpdateElement(element.id, {
                      styles: { ...element.styles, textAlign: align },
                    })
                  }
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium capitalize ${
                    element.styles.textAlign === align
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={element.styles.color || '#000000'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    styles: { ...element.styles, color: e.target.value },
                  })
                }
                className="w-10 h-10 rounded-lg border border-input cursor-pointer"
              />
              <input
                type="text"
                value={element.styles.color || ''}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    styles: { ...element.styles, color: e.target.value },
                  })
                }
                placeholder="#000000"
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={element.styles.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    styles: { ...element.styles, backgroundColor: e.target.value },
                  })
                }
                className="w-10 h-10 rounded-lg border border-input cursor-pointer"
              />
              <input
                type="text"
                value={element.styles.backgroundColor || ''}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    styles: { ...element.styles, backgroundColor: e.target.value },
                  })
                }
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
          </div>

          {/* Padding */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Padding</label>
            <input
              type="text"
              value={element.styles.padding || ''}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  styles: { ...element.styles, padding: e.target.value },
                })
              }
              placeholder="e.g., 1rem, 16px"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Border Radius</label>
            <input
              type="text"
              value={element.styles.borderRadius || ''}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  styles: { ...element.styles, borderRadius: e.target.value },
                })
              }
              placeholder="e.g., 8px, 0.5rem"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
