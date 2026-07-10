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

export function generateTailwindCode(components: Component[]): string {
  const root = components[0]
  if (!root) return ''

  const sections = (root.children || []).filter((c) => c.visible)

  const imports = new Set<string>()
  imports.add("import React from 'react'")

  const sectionCode = sections.map((s) => renderSection(s, 2)).join('\n\n')

  return `${Array.from(imports).join('\n')}

export default function Page() {
  return (
    <div className="min-h-screen">
${sectionCode}
    </div>
  )
}
`
}

function renderSection(s: Component, indent: number): string {
  const pad = '  '.repeat(indent)

  switch (s.type) {
    case 'hero':
      return `${pad}<section className="relative min-h-[500px] flex items-center justify-center text-center px-4" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#0f172a')}, color: ${tc(s.styles.color, '#ffffff')} }}>
${pad}  <div className="max-w-4xl mx-auto">
${pad}    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
${pad}      ${esc(s.props.title || 'Hero Title')}
${pad}    </h1>
${pad}    <p className="text-lg md:text-xl opacity-85 mb-10 max-w-2xl mx-auto">
${pad}      ${esc(s.props.subtitle || 'Subtitle')}
${pad}    </p>
${pad}    <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-lg transition-colors">
${pad}      ${esc(s.props.ctaText || 'Get Started')}
${pad}    </button>
${pad}  </div>
${pad}</section>`

    case 'features':
      return `${pad}<section className="py-20 px-4" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#ffffff')} }}>
${pad}  <div className="max-w-6xl mx-auto">
${pad}    ${s.props.title ? `<h2 className="text-3xl md:text-4xl font-bold text-center mb-4">${esc(s.props.title)}</h2>` : ''}
${pad}    ${s.props.subtitle ? `<p className="text-gray-600 text-center text-lg mb-12 max-w-2xl mx-auto">${esc(s.props.subtitle)}</p>` : ''}
${pad}    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
${(s.props.items || []).map((item: any, i: number) => `${pad}      <div key={${i}} className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
${pad}        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4" />
${pad}        <h3 className="text-xl font-semibold mb-2">${esc(item.title)}</h3>
${pad}        <p className="text-gray-600">${esc(item.description)}</p>
${pad}      </div>`).join('\n')}
${pad}    </div>
${pad}  </div>
${pad}</section>`

    case 'pricing':
      return `${pad}<section className="py-20 px-4" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#f8fafc')} }}>
${pad}  <div className="max-w-6xl mx-auto">
${pad}    ${s.props.title ? `<h2 className="text-3xl md:text-4xl font-bold text-center mb-4">${esc(s.props.title)}</h2>` : ''}
${pad}    ${s.props.subtitle ? `<p className="text-gray-600 text-center text-lg mb-12">${esc(s.props.subtitle)}</p>` : ''}
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${(s.props.plans || []).map((plan: any, i: number) => `${pad}      <div key={${i}} className={\`p-8 rounded-2xl border-2 \${${plan.popular} ? 'border-purple-500 shadow-xl scale-105' : 'border-gray-200'} bg-white\`}>
${pad}        ${plan.popular ? '<div className="text-center mb-4"><span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Most Popular</span></div>' : ''}
${pad}        <h3 className="text-xl font-bold mb-2">${esc(plan.name)}</h3>
${pad}        <div className="mb-4"><span className="text-4xl font-extrabold">${esc(plan.price)}</span>{plan.period && <span className="text-gray-500">${esc(plan.period)}</span>}</div>
${pad}        <p className="text-gray-500 text-sm mb-6">${esc(plan.description)}</p>
${pad}        <ul className="space-y-3 mb-8">
${(plan.features || []).map((f: string) => `${pad}          <li key={${JSON.stringify(f)}} className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> ${esc(f)}</li>`).join('\n')}
${pad}        </ul>
${pad}        <button className={\`w-full py-3 rounded-xl font-semibold transition-colors \${${plan.popular} ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}\`}>
${pad}          ${esc(plan.cta || 'Choose Plan')}
${pad}        </button>
${pad}      </div>`).join('\n')}
${pad}    </div>
${pad}  </div>
${pad}</section>`

    case 'testimonials':
      return `${pad}<section className="py-20 px-4" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#ffffff')} }}>
${pad}  <div className="max-w-6xl mx-auto">
${pad}    ${s.props.title ? `<h2 className="text-3xl md:text-4xl font-bold text-center mb-4">${esc(s.props.title)}</h2>` : ''}
${pad}    ${s.props.subtitle ? `<p className="text-gray-600 text-center text-lg mb-12">${esc(s.props.subtitle)}</p>` : ''}
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${(s.props.items || []).map((item: any, i: number) => `${pad}      <div key={${i}} className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
${pad}        <div className="text-amber-400 mb-3">★★★★★</div>
${pad}        <p className="italic text-gray-700 mb-4">"${esc(item.quote)}"</p>
${pad}        <div className="flex items-center gap-3">
${pad}          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
${pad}            ${(item.author || 'U').charAt(0)}
${pad}          </div>
${pad}          <div>
${pad}            <div className="font-semibold text-sm">${esc(item.author)}</div>
${pad}            <div className="text-gray-500 text-xs">${esc(item.role || '')}${item.company ? ` at ${esc(item.company)}` : ''}</div>
${pad}          </div>
${pad}        </div>
${pad}      </div>`).join('\n')}
${pad}    </div>
${pad}  </div>
${pad}</section>`

    case 'cta':
      return `${pad}<section className="py-20 px-4 text-center" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#7c3aed')}, color: ${tc(s.styles.color, '#ffffff')} }}>
${pad}  <div className="max-w-3xl mx-auto">
${pad}    <h2 className="text-3xl md:text-4xl font-bold mb-4">${esc(s.props.title || 'Ready to Get Started?')}</h2>
${pad}    <p className="text-lg opacity-90 mb-8">${esc(s.props.subtitle || 'Join us today.')}</p>
${pad}    <button className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
${pad}      ${esc(s.props.ctaText || 'Get Started')}
${pad}    </button>
${pad}  </div>
${pad}</section>`

    case 'faq':
      return `${pad}<section className="py-20 px-4" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#ffffff')} }}>
${pad}  <div className="max-w-3xl mx-auto">
${pad}    ${s.props.title ? `<h2 className="text-3xl md:text-4xl font-bold text-center mb-4">${esc(s.props.title)}</h2>` : ''}
${pad}    ${s.props.subtitle ? `<p className="text-gray-600 text-center text-lg mb-12">${esc(s.props.subtitle)}</p>` : ''}
${pad}    <div className="space-y-4">
${(s.props.items || []).map((item: any, i: number) => `${pad}      <details key={${i}} className="group border border-gray-200 rounded-xl overflow-hidden">
${pad}        <summary className="px-6 py-4 cursor-pointer font-medium hover:bg-gray-50 flex items-center justify-between">
${pad}          ${esc(item.question)}
${pad}          <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
${pad}        </summary>
${pad}        <div className="px-6 pb-4 text-gray-600">${esc(item.answer)}</div>
${pad}      </details>`).join('\n')}
${pad}    </div>
${pad}  </div>
${pad}</section>`

    case 'stats':
      return `${pad}<section className="py-16 px-4" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#f1f5f9')} }}>
${pad}  <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
${(s.props.items || []).map((item: any, i: number) => `${pad}    <div key={${i}}>
${pad}      <div className="text-4xl md:text-5xl font-extrabold text-purple-600 mb-2">${esc(item.value)}</div>
${pad}      <div className="text-gray-600">${esc(item.label)}</div>
${pad}    </div>`).join('\n')}
${pad}  </div>
${pad}</section>`

    case 'newsletter':
      return `${pad}<section className="py-16 px-4 text-center" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#1e293b')}, color: ${tc(s.styles.color, '#ffffff')} }}>
${pad}  <div className="max-w-xl mx-auto">
${pad}    <h2 className="text-2xl md:text-3xl font-bold mb-2">${esc(s.props.title || 'Stay Updated')}</h2>
${pad}    <p className="opacity-80 mb-6">${esc(s.props.subtitle || 'Get the latest news.')}</p>
${pad}    <div className="flex gap-2">
${pad}      <input type="email" placeholder="${esc(s.props.placeholder || 'Enter your email')}" className="flex-1 px-4 py-3 rounded-lg text-gray-900" />
${pad}      <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">${esc(s.props.ctaText || 'Subscribe')}</button>
${pad}    </div>
${pad}  </div>
${pad}</section>`

    case 'contact':
      return `${pad}<section className="py-20 px-4" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#f8fafc')} }}>
${pad}  <div className="max-w-xl mx-auto">
${pad}    ${s.props.title ? `<h2 className="text-3xl font-bold text-center mb-2">${esc(s.props.title)}</h2>` : ''}
${pad}    ${s.props.subtitle ? `<p className="text-gray-600 text-center mb-8">${esc(s.props.subtitle)}</p>` : ''}
${pad}    <form className="space-y-4">
${(s.props.fields || []).map((f: any) => f.type === 'textarea'
? `${pad}      <textarea placeholder="${esc(f.placeholder || '')}" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />`
: `${pad}      <input type="${f.type || 'text'}" placeholder="${esc(f.placeholder || '')}" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />`
).join('\n')}
${pad}      <button type="button" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">${esc(s.props.submitText || 'Send Message')}</button>
${pad}    </form>
${pad}  </div>
${pad}</section>`

    case 'navbar':
      return `${pad}<nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white" style={{ padding: ${tc(s.styles.padding, '16px 24px')} }}>
${pad}  <div className="font-bold text-xl">${esc(s.props.brand || 'Brand')}</div>
${pad}  <div className="flex items-center gap-6">
${(s.props.links || []).map((link: any) => `${pad}    <a href="${esc(link.href || '#')}" className="text-gray-600 hover:text-gray-900 text-sm font-medium">${esc(link.label)}</a>`).join('\n')}
${pad}    <button className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">${esc(s.props.ctaText || 'Get Started')}</button>
${pad}  </div>
${pad}</nav>`

    case 'footer':
      const cols = s.props.columns || []
      return `${pad}<footer className="py-12 px-6" style={{ backgroundColor: ${tc(s.styles.backgroundColor, '#0f172a')}, color: ${tc(s.styles.color, '#ffffff')} }}>
${pad}  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-${Math.min(cols.length + 1, 5)} gap-8 mb-8">
${pad}    <div>
${pad}      <div className="font-bold text-lg mb-2">${esc(s.props.brand || 'Brand')}</div>
${pad}      <p className="text-gray-400 text-sm">${esc(s.props.tagline || '')}</p>
${pad}    </div>
${cols.map((col: any) => `${pad}    <div>
${pad}      <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">${esc(col.title)}</h4>
${pad}      <ul className="space-y-2">
${(col.links || []).map((link: string) => `${pad}        <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">${esc(link)}</a></li>`).join('\n')}
${pad}      </ul>
${pad}    </div>`).join('\n')}
${pad}  </div>
${pad}  <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
${pad}    ${esc(s.props.copyright || `© ${new Date().getFullYear()} All rights reserved.`)}
${pad}  </div>
${pad}</footer>`

    default:
      return `${pad}<section className="py-12 px-4">${pad}  {/* ${esc(s.name)} */}${pad}</section>`
  }
}

function tc(color: string | undefined, fallback: string): string {
  if (!color) return `'${fallback}'`
  return `'${color}'`
}

function esc(str: string): string {
  if (!str) return ''
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/"/g, '&quot;')
}
