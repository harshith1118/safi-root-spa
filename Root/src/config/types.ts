/**
 * TypeScript types for the Root SPA Initial Context configuration.
 * These mirror the structure enforced by src/schemas/root-spa.schema.json.
 */

export type Theme = 'clean' | 'modern' | 'classic' | 'minimal'

export type SectionType =
  | 'hero'
  | 'features'
  | 'text'
  | 'cta'
  | 'testimonials'
  | 'gallery'
  | 'faq'

export interface SectionItem {
  title: string
  description: string
  details?: string[]
}

export interface Section {
  id: string
  type: SectionType
  heading: string
  description: string
  items?: SectionItem[]
  buttonText?: string
  buttonUrl?: string
}

export interface InitialContext {
  templateVersion: string
  pathName: string
  displayName: string
  title: string
  subtitle: string
  theme: Theme
  sections: Section[]
}
