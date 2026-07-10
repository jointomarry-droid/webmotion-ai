'use client'

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

export function SectionRenderer({ component }: { component: Component }) {
  switch (component.type) {
    case 'hero':
      return <HeroSection component={component} />
    case 'features':
      return <FeaturesSection component={component} />
    case 'pricing':
      return <PricingSection component={component} />
    case 'testimonials':
      return <TestimonialsSection component={component} />
    case 'cta':
      return <CTASection component={component} />
    case 'footer':
      return <FooterSection component={component} />
    case 'contact':
      return <ContactSection component={component} />
    case 'faq':
      return <FAQSection component={component} />
    case 'stats':
      return <StatsSection component={component} />
    case 'newsletter':
      return <NewsletterSection component={component} />
    case 'navbar':
      return <NavbarSection component={component} />
    case 'container':
    case 'section':
      return (
        <div style={component.styles}>
          {component.children?.map((child) => (
            <SectionRenderer key={child.id} component={child} />
          ))}
        </div>
      )
    case 'heading':
      const Tag = (component.props.level || 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
      return <Tag style={component.styles}>{component.props.text || 'Heading'}</Tag>
    case 'paragraph':
      return <p style={component.styles}>{component.props.text || 'Text'}</p>
    case 'button':
      return (
        <button
          style={{
            ...component.styles,
            padding: '12px 28px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          {component.props.text || 'Button'}
        </button>
      )
    case 'image':
      return (
        <img
          src={component.props.src || '/placeholder.svg'}
          alt={component.props.alt || ''}
          style={{ ...component.styles, maxWidth: '100%' }}
        />
      )
    default:
      return (
        <div style={{ ...component.styles, padding: '20px', border: '1px dashed #ccc' }}>
          {component.name}
        </div>
      )
  }
}

function HeroSection({ component }: { component: Component }) {
  return (
    <div
      style={{
        ...component.styles,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '500px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          lineHeight: '1.1',
          maxWidth: '800px',
        }}
      >
        {component.props.title || 'Hero Title'}
      </h1>
      <p
        style={{
          fontSize: '1.25rem',
          opacity: 0.85,
          marginBottom: '2.5rem',
          maxWidth: '600px',
          lineHeight: '1.6',
        }}
      >
        {component.props.subtitle || 'Hero subtitle text'}
      </p>
      <button
        style={{
          padding: '14px 36px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '1.1rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
      >
        {component.props.ctaText || 'Get Started'}
      </button>
    </div>
  )
}

function FeaturesSection({ component }: { component: Component }) {
  const items = component.props.items || []
  return (
    <div style={component.styles}>
      {component.props.title && (
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem' }}>
          {component.props.title}
        </h2>
      )}
      {component.props.subtitle && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.1rem' }}>
          {component.props.subtitle}
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {items.map((item: any, i: number) => (
          <div
            key={i}
            style={{
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
              }}
            >
              ✦
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              {item.title}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingSection({ component }: { component: Component }) {
  const plans = component.props.plans || []
  return (
    <div style={component.styles}>
      {component.props.title && (
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem' }}>
          {component.props.title}
        </h2>
      )}
      {component.props.subtitle && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.1rem' }}>
          {component.props.subtitle}
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, 1fr)`,
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {plans.map((plan: any, i: number) => (
          <div
            key={i}
            style={{
              padding: '2.5rem',
              borderRadius: '16px',
              border: plan.popular ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              background: plan.popular ? 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)' : '#ffffff',
              position: 'relative',
              boxShadow: plan.popular ? '0 8px 30px rgba(124, 58, 237, 0.15)' : 'none',
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 16px',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}
              >
                Most Popular
              </div>
            )}
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              {plan.name}
            </h3>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>{plan.price}</span>
              {plan.period && <span style={{ color: '#6b7280' }}>{plan.period}</span>}
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {plan.description}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              {plan.features?.map((f: string, j: number) => (
                <li key={j} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <span style={{ color: '#10b981' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: plan.popular ? 'none' : '1px solid #e5e7eb',
                backgroundColor: plan.popular ? '#7c3aed' : 'transparent',
                color: plan.popular ? 'white' : '#374151',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {plan.cta || 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialsSection({ component }: { component: Component }) {
  const items = component.props.items || []
  return (
    <div style={component.styles}>
      {component.props.title && (
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem' }}>
          {component.props.title}
        </h2>
      )}
      {component.props.subtitle && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.1rem' }}>
          {component.props.subtitle}
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {items.map((item: any, i: number) => (
          <div
            key={i}
            style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
              {'★★★★★'}
            </div>
            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6', color: '#374151' }}>
              &ldquo;{item.quote}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                }}
              >
                {item.author?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.author}</div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                  {item.role}{item.company ? ` at ${item.company}` : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CTASection({ component }: { component: Component }) {
  return (
    <div
      style={{
        ...component.styles,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', maxWidth: '700px' }}>
        {component.props.title || 'Ready to Get Started?'}
      </h2>
      <p style={{ fontSize: '1.15rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '500px' }}>
        {component.props.subtitle || 'Join us today.'}
      </p>
      <button
        style={{
          padding: '14px 36px',
          backgroundColor: 'white',
          color: '#7c3aed',
          borderRadius: '10px',
          fontWeight: '700',
          fontSize: '1.1rem',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {component.props.ctaText || 'Get Started'}
      </button>
    </div>
  )
}

function FooterSection({ component }: { component: Component }) {
  const columns = component.props.columns || []
  return (
    <div style={component.styles}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(columns.length + 1, 5)}, 1fr)`,
          gap: '3rem',
          maxWidth: '1100px',
          margin: '0 auto',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            {component.props.brand || 'Brand'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6' }}>
            {component.props.tagline || 'Tagline goes here.'}
          </p>
        </div>
        {columns.map((col: any, i: number) => (
          <div key={i}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {col.links?.map((link: string, j: number) => (
                <li key={j} style={{ marginBottom: '0.5rem' }}>
                  <a style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', paddingTop: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
        {component.props.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
      </div>
    </div>
  )
}

function ContactSection({ component }: { component: Component }) {
  const fields = component.props.fields || []
  return (
    <div style={component.styles}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {component.props.title && (
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>
            {component.props.title}
          </h2>
        )}
        {component.props.subtitle && (
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
            {component.props.subtitle}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {fields.map((field: any, i: number) => (
            <div key={i}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.375rem', color: '#374151' }}>
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                  }}
                />
              )}
            </div>
          ))}
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '0.5rem',
            }}
          >
            {component.props.submitText || 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FAQSection({ component }: { component: Component }) {
  const items = component.props.items || []
  return (
    <div style={component.styles}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {component.props.title && (
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem' }}>
            {component.props.title}
          </h2>
        )}
        {component.props.subtitle && (
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            {component.props.subtitle}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item: any, i: number) => (
            <div
              key={i}
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                {item.question}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatsSection({ component }: { component: Component }) {
  const items = component.props.items || []
  return (
    <div style={component.styles}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {items.map((item: any, i: number) => (
          <div key={i}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#7c3aed', marginBottom: '0.25rem' }}>
              {item.value}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsletterSection({ component }: { component: Component }) {
  return (
    <div
      style={{
        ...component.styles,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {component.props.title && (
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {component.props.title}
        </h2>
      )}
      {component.props.subtitle && (
        <p style={{ opacity: 0.85, marginBottom: '1.5rem', maxWidth: '400px' }}>
          {component.props.subtitle}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '450px', width: '100%' }}>
        <input
          type="email"
          placeholder={component.props.placeholder || 'Enter your email'}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.95rem',
          }}
        />
        <button
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {component.props.ctaText || 'Subscribe'}
        </button>
      </div>
    </div>
  )
}

function NavbarSection({ component }: { component: Component }) {
  const links = component.props.links || []
  return (
    <div
      style={{
        ...component.styles,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
        {component.props.brand || 'Brand'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {links.map((link: any, i: number) => (
          <a
            key={i}
            href={link.href}
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          style={{
            padding: '8px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '6px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          {component.props.ctaText || 'Get Started'}
        </button>
      </div>
    </div>
  )
}
