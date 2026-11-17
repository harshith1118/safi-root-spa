import { useState } from 'react'
import { validatedConfig } from './config/validate'
import type { Section } from './config/types'
import './App.css'

/* ── Hero ────────────────────────────────────────────────────────────── */

function HeroSection({ section }: { section: Section }) {
  return (
    <section className="hero-section" id={section.id}>
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-eyebrow">
              Welcome to {validatedConfig.displayName}
            </span>
            <h1 className="hero-heading">{section.heading}</h1>
            <p className="hero-description">{section.description}</p>
            <div className="hero-actions">
              <a
                className="btn-primary"
                href={section.buttonUrl ?? '#contact'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
              <a className="btn-secondary" href="#services">
                Learn More
              </a>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Beautiful residential interior with modern home services in progress"
              width={800}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Features / Services ─────────────────────────────────────────────── */

function FeaturesSection({ section }: { section: Section }) {
  return (
    <section className="content-section" id={section.id}>
      <div className="section-inner">
        <div className="section-header">
          <span className="section-eyebrow">What we offer</span>
          <h2 className="section-title">{section.heading}</h2>
          <p className="section-description">{section.description}</p>
        </div>

        <div className="services-grid">
          {section.items?.map((item, index) => (
            <article
              key={`${section.id}-${index}`}
              className="service-card"
            >
              <div className="service-image">
                <img
                  src={`https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                  alt={`Home services: ${item.title}`}
                  width={600}
                  height={400}
                />
              </div>

              <div className="service-content">
                <h3 className="service-title">{item.title}</h3>
                <p className="service-description">{item.description}</p>
              </div>

              <a href="#contact" className="service-link">
                Learn more
                <span aria-hidden="true"> →</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── About ───────────────────────────────────────────────────────────── */

function AboutSection({ section }: { section: Section }) {
  return (
    <section className="about-section">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-content">
            <p className="about-text">{section.description}</p>
          </div>

          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Professional home services team working in a residential setting"
              width={800}
              height={480}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CTA ─────────────────────────────────────────────────────────────── */

function CtaSection({ section }: { section: Section }) {
  return (
    <section className="cta-section" id={section.id}>
      <div className="cta-inner">
        <div className="cta-background"></div>

        <div>
          <span className="cta-eyebrow">Get in touch</span>
          <h2 className="cta-title">{section.heading}</h2>
          <p className="cta-description">{section.description}</p>
        </div>

        <a
          className="cta-button"
          href={section.buttonUrl ?? 'https://example.com/contact'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {section.buttonText}
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </section>
  )
}

/* ── Generic Fallback ───────────────────────────────────────────────── */

function GenericSection({ section }: { section: Section }) {
  return (
    <section className="generic-section" id={section.id}>
      <div className="generic-section-inner">
        <div className="generic-section-header">
          <h2 className="generic-section-title">{section.heading}</h2>
          <p className="generic-section-description">{section.description}</p>
        </div>

        {section.items && section.items.length > 0 && (
          <div className="generic-items">
            {section.items.map((item, index) => (
              <article key={`${section.id}-${index}`} className="generic-item">
                <h3 className="generic-item-title">{item.title}</h3>
                <p className="generic-item-description">{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Render Section ─────────────────────────────────────────────────── */

function RenderSection({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} section={section} />

    case 'features':
      return <FeaturesSection key={section.id} section={section} />

    case 'text':
      return <AboutSection key={section.id} section={section} />

    case 'cta':
      return <CtaSection key={section.id} section={section} />

    default:
      return <GenericSection key={section.id} section={section} />
  }
}

/* ── App ─────────────────────────────────────────────────────────────── */

function App() {
  const config = validatedConfig
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <main className={`root-spa theme-${config.theme}`}>
      {/* ── Skip Link ────────────────────────────────────────────────── */}
      <a className="skip-link" href="#top">
        Skip to main content
      </a>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5A3 3 0 0 0 9 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm6 11.59-2.83 1.08a3 3 0 0 1-2.15-.85 6.5 6.5 0 0 1-1.68-2.06 3 3 0 0 1-.53-2.61 6 6 0 0 1 3.43-.59 6 6 0 0 1 5.38 2.28 2.5 2.5 0 0 1-1.06 1.85 2.5 2.5 0 0 1-2.28-.65 3 3 0 0 1-2.83-1.08zM3.5 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm7.5 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </span>
            {validatedConfig.displayName}
          </a>

          <nav className="site-nav" aria-label="Main navigation">
            {config.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={
                  section.id === 'hero' ? 'nav-link active' : 'nav-link'
                }
              >
                {section.type === 'hero' ? 'Home' : section.heading}
              </a>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-toggle"
            aria-label="Open navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav
        className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        {config.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="mobile-nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {section.type === 'hero' ? 'Home' : section.heading}
          </a>
        ))}
      </nav>

      {/* ── Top anchor ───────────────────────────────────────────────── */}
      <div id="top" />

      {/* ── Sections ──────────────────────────────────────────────────── */}
      {config.sections.map((section) => (
        <RenderSection key={section.id} section={section} />
      ))}

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">{validatedConfig.displayName}</p>
          <span className="footer-attribution">Powered by Root SPA</span>
        </div>
      </footer>
    </main>
  )
}

export default App