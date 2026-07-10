import { create } from 'zustand'
import { User, Template, Project, AIMessage, SubscriptionTier } from '@/types'

// Auth Store
interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, isLoading: false }),
}))

// Template Store
interface TemplateState {
  templates: Template[]
  selectedTemplate: Template | null
  isLoading: boolean
  filters: {
    category?: string
    search?: string
    sort_by?: string
    page: number
    limit: number
  }
  setTemplates: (templates: Template[]) => void
  addTemplate: (template: Template) => void
  updateTemplate: (id: string, updates: Partial<Template>) => void
  removeTemplate: (id: string) => void
  setSelectedTemplate: (template: Template | null) => void
  setFilters: (filters: Partial<TemplateState['filters']>) => void
  setLoading: (loading: boolean) => void
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  selectedTemplate: null,
  isLoading: false,
  filters: {
    page: 1,
    limit: 12,
  },
  setTemplates: (templates) => set({ templates }),
  addTemplate: (template) => set((state) => ({ 
    templates: [template, ...state.templates] 
  })),
  updateTemplate: (id, updates) => set((state) => ({
    templates: state.templates.map((t) => 
      t.id === id ? { ...t, ...updates } : t
    ),
  })),
  removeTemplate: (id) => set((state) => ({
    templates: state.templates.filter((t) => t.id !== id),
  })),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  setLoading: (isLoading) => set({ isLoading }),
}))

// Project Store
interface ProjectState {
  projects: Project[]
  selectedProject: Project | null
  isLoading: boolean
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  setSelectedProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects] 
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id ? { ...p, ...updates } : p
    ),
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
  })),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setLoading: (isLoading) => set({ isLoading }),
}))

// AI Chat Store
interface AIState {
  messages: AIMessage[]
  isGenerating: boolean
  selectedModel: string
  addMessage: (message: AIMessage) => void
  updateMessage: (id: string, updates: Partial<AIMessage>) => void
  clearMessages: () => void
  setGenerating: (generating: boolean) => void
  setSelectedModel: (model: string) => void
}

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  isGenerating: false,
  selectedModel: 'gpt-4',
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map((m) => 
      m.id === id ? { ...m, ...updates } : m
    ),
  })),
  clearMessages: () => set({ messages: [] }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
}))

// UI Store
interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  sidebarOpen: true,
  commandPaletteOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleCommandPalette: () => set((state) => ({ 
    commandPaletteOpen: !state.commandPaletteOpen 
  })),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
}))
