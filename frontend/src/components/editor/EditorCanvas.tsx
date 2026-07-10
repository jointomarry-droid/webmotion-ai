'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Trash2, Copy, Settings } from 'lucide-react'

export interface CanvasElement {
  id: string
  type: 'heading' | 'paragraph' | 'button' | 'image' | 'container' | 'card'
  content: string
  styles: Record<string, string>
  children?: CanvasElement[]
}

interface EditorCanvasProps {
  elements: CanvasElement[]
  onElementsChange: (elements: CanvasElement[]) => void
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
}

export function EditorCanvas({
  elements,
  onElementsChange,
  selectedElement,
  onSelectElement,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.dataTransfer.setData('elementId', elementId)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const elementId = e.dataTransfer.getData('elementId')
    if (elementId) {
      // Reorder logic here
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectElement(null)
    }
  }

  const deleteElement = (id: string) => {
    onElementsChange(elements.filter(el => el.id !== id))
    if (selectedElement === id) {
      onSelectElement(null)
    }
  }

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id)
    if (element) {
      const newElement = {
        ...element,
        id: `el-${Date.now()}`,
      }
      const index = elements.findIndex(el => el.id === id)
      const newElements = [...elements]
      newElements.splice(index + 1, 0, newElement)
      onElementsChange(newElements)
    }
  }

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement === element.id

    const wrapperStyle = {
      position: 'relative' as const,
      outline: isSelected ? '2px solid #8b5cf6' : 'none',
      outlineOffset: '2px',
      borderRadius: '4px',
      cursor: 'pointer',
    }

    const handleProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, element.id),
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelectElement(element.id)
      },
    }

    switch (element.type) {
      case 'heading':
        return (
          <div key={element.id} style={wrapperStyle} {...handleProps}>
            <h2 style={element.styles} className="text-3xl font-bold p-4">
              {element.content}
            </h2>
            {isSelected && (
              <div className="absolute -top-8 right-0 flex gap-1 bg-white shadow-lg rounded-lg p-1">
                <button onClick={() => duplicateElement(element.id)} className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="h-3 w-3" />
                </button>
                <button onClick={() => deleteElement(element.id)} className="p-1 hover:bg-red-100 rounded">
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
            )}
          </div>
        )

      case 'paragraph':
        return (
          <div key={element.id} style={wrapperStyle} {...handleProps}>
            <p style={element.styles} className="text-gray-600 p-4">
              {element.content}
            </p>
            {isSelected && (
              <div className="absolute -top-8 right-0 flex gap-1 bg-white shadow-lg rounded-lg p-1">
                <button onClick={() => duplicateElement(element.id)} className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="h-3 w-3" />
                </button>
                <button onClick={() => deleteElement(element.id)} className="p-1 hover:bg-red-100 rounded">
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
            )}
          </div>
        )

      case 'button':
        return (
          <div key={element.id} style={wrapperStyle} {...handleProps}>
            <button
              style={element.styles}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold mx-4 my-2"
            >
              {element.content}
            </button>
            {isSelected && (
              <div className="absolute -top-8 right-0 flex gap-1 bg-white shadow-lg rounded-lg p-1">
                <button onClick={() => duplicateElement(element.id)} className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="h-3 w-3" />
                </button>
                <button onClick={() => deleteElement(element.id)} className="p-1 hover:bg-red-100 rounded">
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
            )}
          </div>
        )

      case 'card':
        return (
          <div key={element.id} style={wrapperStyle} {...handleProps}>
            <div className="p-6 m-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{element.content}</h3>
              <p className="text-gray-500 text-sm">Card description goes here.</p>
            </div>
            {isSelected && (
              <div className="absolute -top-8 right-0 flex gap-1 bg-white shadow-lg rounded-lg p-1">
                <button onClick={() => duplicateElement(element.id)} className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="h-3 w-3" />
                </button>
                <button onClick={() => deleteElement(element.id)} className="p-1 hover:bg-red-100 rounded">
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
            )}
          </div>
        )

      case 'container':
        return (
          <div key={element.id} style={wrapperStyle} {...handleProps}>
            <div className="p-4 m-4 border-2 border-dashed border-gray-300 rounded-xl min-h-[100px]">
              {element.children?.length === 0 && (
                <p className="text-gray-400 text-sm text-center">Drop elements here</p>
              )}
            </div>
            {isSelected && (
              <div className="absolute -top-8 right-0 flex gap-1 bg-white shadow-lg rounded-lg p-1">
                <button onClick={() => duplicateElement(element.id)} className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="h-3 w-3" />
                </button>
                <button onClick={() => deleteElement(element.id)} className="p-1 hover:bg-red-100 rounded">
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-gray-100 dark:bg-gray-900 p-8 overflow-auto"
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg min-h-[600px]">
        {elements.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <GripVertical className="h-8 w-8" />
              </div>
              <p>Drag elements from the palette</p>
              <p className="text-sm mt-2">or use AI to generate a layout</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {elements.map(element => renderElement(element))}
          </div>
        )}
      </div>
    </div>
  )
}
