interface Component {
  id: string
  type: string
  name: string
  props: Record<string, any>
  styles: Record<string, string>
  visible: boolean
  locked: boolean
  children?: Component[]
}

interface SavedProject {
  id: string
  name: string
  components: Component[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'webmotion-projects'

export function saveProject(name: string, components: Component[]): SavedProject {
  const projects = getAllProjects()
  const existing = projects.find((p) => p.name === name)

  const project: SavedProject = {
    id: existing?.id || `proj-${Date.now()}`,
    name,
    components,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updated = projects.filter((p) => p.id !== project.id)
  updated.push(project)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

  return project
}

export function loadProject(id: string): SavedProject | null {
  const projects = getAllProjects()
  return projects.find((p) => p.id === id) || null
}

export function getAllProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function deleteProject(id: string): void {
  const projects = getAllProjects().filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function exportProjectAsJSON(components: Component[]): string {
  return JSON.stringify({ components, exportedAt: new Date().toISOString() }, null, 2)
}

export function importProjectFromJSON(json: string): Component[] | null {
  try {
    const data = JSON.parse(json)
    if (data.components && Array.isArray(data.components)) {
      return data.components
    }
    return null
  } catch {
    return null
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
