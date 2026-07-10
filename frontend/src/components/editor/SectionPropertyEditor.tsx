'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'

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

interface SectionPropertyEditorProps {
  component: Component
  onUpdate: (props: Record<string, any>) => void
  onStyleUpdate: (styles: Record<string, string>) => void
}

export function SectionPropertyEditor({ component, onUpdate, onStyleUpdate }: SectionPropertyEditorProps) {
  switch (component.type) {
    case 'hero':
      return <HeroEditor component={component} onUpdate={onUpdate} onStyleUpdate={onStyleUpdate} />
    case 'features':
      return <FeaturesEditor component={component} onUpdate={onUpdate} />
    case 'pricing':
      return <PricingEditor component={component} onUpdate={onUpdate} />
    case 'testimonials':
      return <TestimonialsEditor component={component} onUpdate={onUpdate} />
    case 'faq':
      return <FAQEditor component={component} onUpdate={onUpdate} />
    case 'footer':
      return <FooterEditor component={component} onUpdate={onUpdate} />
    case 'cta':
      return <CTAEditor component={component} onUpdate={onUpdate} onStyleUpdate={onStyleUpdate} />
    case 'stats':
      return <StatsEditor component={component} onUpdate={onUpdate} />
    case 'newsletter':
      return <NewsletterEditor component={component} onUpdate={onUpdate} onStyleUpdate={onStyleUpdate} />
    case 'navbar':
      return <NavbarEditor component={component} onUpdate={onUpdate} />
    default:
      return <div className="text-sm text-muted-foreground p-2">Select a section to edit its properties</div>
  }
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldRow label={label}>
      <div className="flex gap-2">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="flex-1 px-2 py-1.5 rounded border border-input bg-background text-xs" />
      </div>
    </FieldRow>
  )
}

function ArrayEditor({ items, onAdd, onRemove, onUpdate, fields, title }: {
  items: any[]
  onAdd: () => void
  onRemove: (i: number) => void
  onUpdate: (i: number, key: string, val: any) => void
  fields: { key: string; label: string; type?: 'text' | 'textarea' | 'boolean' }[]
  title: string
}) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{title}</label>
        <button onClick={onAdd} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left">
            <GripVertical className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium flex-1 truncate">{item.title || item.name || item.question || `${title} ${i + 1}`}</span>
            <button onClick={(e) => { e.stopPropagation(); onRemove(i) }} className="p-0.5 hover:bg-destructive/10 rounded"><Trash2 className="h-3 w-3 text-destructive" /></button>
            {open === i ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {open === i && (
            <div className="px-3 pb-3 space-y-2 border-t">
              {fields.map((f) => (
                <div key={f.key} className="pt-2">
                  <label className="text-[10px] text-muted-foreground mb-0.5 block">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs resize-none" rows={2} />
                  ) : f.type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={!!item[f.key]} onChange={(e) => onUpdate(i, f.key, e.target.checked)} /> {f.label}</label>
                  ) : (
                    <input type="text" value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function StyleFields({ styles, onUpdate }: { styles: Record<string, string>; onUpdate: (s: Record<string, string>) => void }) {
  const set = (k: string, v: string) => onUpdate({ ...styles, [k]: v })
  return (
    <div className="space-y-3 pt-3 border-t">
      <label className="text-xs font-semibold text-muted-foreground">Section Styles</label>
      <ColorField label="Background" value={styles.backgroundColor || '#ffffff'} onChange={(v) => set('backgroundColor', v)} />
      <FieldRow label="Padding">
        <input type="text" value={styles.padding || ''} onChange={(e) => set('padding', e.target.value)} placeholder="80px 20px" className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" />
      </FieldRow>
      <ColorField label="Text Color" value={styles.color || '#000000'} onChange={(v) => set('color', v)} />
    </div>
  )
}

function HeroEditor({ component, onUpdate, onStyleUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void; onStyleUpdate: (s: Record<string, string>) => void }) {
  const p = component.props
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Title"><input type="text" value={p.title || ''} onChange={(e) => set('title', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Subtitle"><textarea value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs resize-none" rows={2} /></FieldRow>
      <FieldRow label="Button Text"><input type="text" value={p.ctaText || ''} onChange={(e) => set('ctaText', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Button Link"><input type="text" value={p.ctaLink || ''} onChange={(e) => set('ctaLink', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <StyleFields styles={component.styles} onUpdate={onStyleUpdate} />
    </div>
  )
}

function FeaturesEditor({ component, onUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void }) {
  const p = component.props
  const items = p.items || []
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Title"><input type="text" value={p.title || ''} onChange={(e) => set('title', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Subtitle"><input type="text" value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <ArrayEditor
        title="Features"
        items={items}
        onAdd={() => set('items', [...items, { title: 'New Feature', description: 'Description here' }])}
        onRemove={(i) => set('items', items.filter((_: any, j: number) => j !== i))}
        onUpdate={(i, k, v) => { const next = [...items]; next[i] = { ...next[i], [k]: v }; set('items', next) }}
        fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }]}
      />
    </div>
  )
}

function PricingEditor({ component, onUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void }) {
  const p = component.props
  const plans = p.plans || []
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Title"><input type="text" value={p.title || ''} onChange={(e) => set('title', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Subtitle"><input type="text" value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <ArrayEditor
        title="Plans"
        items={plans}
        onAdd={() => set('plans', [...plans, { name: 'New Plan', price: '$0', period: '/month', description: 'Plan description', features: [], cta: 'Choose Plan', popular: false }])}
        onRemove={(i) => set('plans', plans.filter((_: any, j: number) => j !== i))}
        onUpdate={(i, k, v) => { const next = [...plans]; next[i] = { ...next[i], [k]: v }; set('plans', next) }}
        fields={[
          { key: 'name', label: 'Plan Name' },
          { key: 'price', label: 'Price' },
          { key: 'period', label: 'Period (e.g. /month)' },
          { key: 'description', label: 'Description' },
          { key: 'cta', label: 'Button Text' },
          { key: 'popular', label: 'Popular', type: 'boolean' },
        ]}
      />
    </div>
  )
}

function TestimonialsEditor({ component, onUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void }) {
  const p = component.props
  const items = p.items || []
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Title"><input type="text" value={p.title || ''} onChange={(e) => set('title', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Subtitle"><input type="text" value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <ArrayEditor
        title="Testimonials"
        items={items}
        onAdd={() => set('items', [...items, { quote: 'Amazing product!', author: 'Name', role: 'Role', company: 'Company' }])}
        onRemove={(i) => set('items', items.filter((_: any, j: number) => j !== i))}
        onUpdate={(i, k, v) => { const next = [...items]; next[i] = { ...next[i], [k]: v }; set('items', next) }}
        fields={[
          { key: 'quote', label: 'Quote', type: 'textarea' },
          { key: 'author', label: 'Author Name' },
          { key: 'role', label: 'Role' },
          { key: 'company', label: 'Company' },
        ]}
      />
    </div>
  )
}

function FAQEditor({ component, onUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void }) {
  const p = component.props
  const items = p.items || []
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Title"><input type="text" value={p.title || ''} onChange={(e) => set('title', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Subtitle"><input type="text" value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <ArrayEditor
        title="FAQ Items"
        items={items}
        onAdd={() => set('items', [...items, { question: 'New question?', answer: 'Answer here.' }])}
        onRemove={(i) => set('items', items.filter((_: any, j: number) => j !== i))}
        onUpdate={(i, k, v) => { const next = [...items]; next[i] = { ...next[i], [k]: v }; set('items', next) }}
        fields={[
          { key: 'question', label: 'Question' },
          { key: 'answer', label: 'Answer', type: 'textarea' },
        ]}
      />
    </div>
  )
}

function FooterEditor({ component, onUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void }) {
  const p = component.props
  const cols = p.columns || []
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Brand Name"><input type="text" value={p.brand || ''} onChange={(e) => set('brand', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Tagline"><input type="text" value={p.tagline || ''} onChange={(e) => set('tagline', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Copyright"><input type="text" value={p.copyright || ''} onChange={(e) => set('copyright', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <ArrayEditor
        title="Footer Columns"
        items={cols}
        onAdd={() => set('columns', [...cols, { title: 'Column', links: ['Link 1', 'Link 2'] }])}
        onRemove={(i) => set('columns', cols.filter((_: any, j: number) => j !== i))}
        onUpdate={(i, k, v) => { const next = [...cols]; next[i] = { ...next[i], [k]: v }; set('columns', next) }}
        fields={[{ key: 'title', label: 'Column Title' }]}
      />
    </div>
  )
}

function CTAEditor({ component, onUpdate, onStyleUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void; onStyleUpdate: (s: Record<string, string>) => void }) {
  const p = component.props
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Title"><input type="text" value={p.title || ''} onChange={(e) => set('title', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Subtitle"><input type="text" value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Button Text"><input type="text" value={p.ctaText || ''} onChange={(e) => set('ctaText', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <StyleFields styles={component.styles} onUpdate={onStyleUpdate} />
    </div>
  )
}

function StatsEditor({ component, onUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void }) {
  const p = component.props
  const items = p.items || []
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <ArrayEditor
      title="Stats"
      items={items}
      onAdd={() => set('items', [...items, { value: '0', label: 'Metric' }])}
      onRemove={(i) => set('items', items.filter((_: any, j: number) => j !== i))}
      onUpdate={(i, k, v) => { const next = [...items]; next[i] = { ...next[i], [k]: v }; set('items', next) }}
      fields={[{ key: 'value', label: 'Value' }, { key: 'label', label: 'Label' }]}
    />
  )
}

function NewsletterEditor({ component, onUpdate, onStyleUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void; onStyleUpdate: (s: Record<string, string>) => void }) {
  const p = component.props
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Title"><input type="text" value={p.title || ''} onChange={(e) => set('title', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Subtitle"><input type="text" value={p.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Placeholder"><input type="text" value={p.placeholder || ''} onChange={(e) => set('placeholder', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Button Text"><input type="text" value={p.ctaText || ''} onChange={(e) => set('ctaText', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <StyleFields styles={component.styles} onUpdate={onStyleUpdate} />
    </div>
  )
}

function NavbarEditor({ component, onUpdate }: { component: Component; onUpdate: (p: Record<string, any>) => void }) {
  const p = component.props
  const links = p.links || []
  const set = (k: string, v: any) => onUpdate({ ...p, [k]: v })
  return (
    <div className="space-y-3">
      <FieldRow label="Brand"><input type="text" value={p.brand || ''} onChange={(e) => set('brand', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <FieldRow label="Button Text"><input type="text" value={p.ctaText || ''} onChange={(e) => set('ctaText', e.target.value)} className="w-full px-2 py-1.5 rounded border border-input bg-background text-xs" /></FieldRow>
      <ArrayEditor
        title="Nav Links"
        items={links}
        onAdd={() => set('links', [...links, { label: 'Link', href: '#' }])}
        onRemove={(i) => set('links', links.filter((_: any, j: number) => j !== i))}
        onUpdate={(i, k, v) => { const next = [...links]; next[i] = { ...next[i], [k]: v }; set('links', next) }}
        fields={[{ key: 'label', label: 'Label' }, { key: 'href', label: 'URL' }]}
      />
    </div>
  )
}
