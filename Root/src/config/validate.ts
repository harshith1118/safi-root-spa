
/**
 * Ajv-based JSON Schema validation for Root SPA Initial Context.
 *
 * Uses JSON Schema Draft 2020-12 via ajv/dist/2020.
 * Validates the Initial Context configuration against the schema
 * and exports a typed, validated configuration.
 *
 * Validation improvements:
 * - Uses strict mode for better error detection
 * - Includes field path, error keyword and readable messages
 * - Validates duplicate section IDs
 * - Section-specific validation for hero, features, text and CTA
 * - CTA URL scheme safety (approved protocols only)
 * - Reserved PathName blocking (SAFI pending list)
 */

import Ajv from 'ajv/dist/2020'
import type { ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'
import type { InitialContext, Section } from './types'
import schema from '../schemas/root-spa.schema.json'
import exampleConfig from './initial-context.json'
import { RESERVED_PATH_NAMES } from './reserved-pathnames'

// Approved URL protocols for CTA button URLs.
// HTTPS is preferred; HTTP is allowed only when required.
const ALLOWED_URL_PROTOCOLS = ['https:', 'http:']

const ajv = new Ajv({
  strict: true,
  allErrors: true,
  strictSchema: true,
})

addFormats(ajv)

/**
 * Build a human-readable validation error message.
 */
function buildErrorMessage(errors: ErrorObject[]): string {
  return errors
    .map((err) => {
      const path = err.instancePath ? err.instancePath.slice(1) : 'root'
      const keyword = err.keyword
      const message = err.message || 'validation error'

      return `at "${path}" — ${keyword}: ${message}`
    })
    .join('; ')
}

/**
 * Validate CTA button URL.
 * Only HTTP and HTTPS protocols are permitted.
 */
function validateCtaUrl(sectionId: string, url: string): void {
  let parsed: URL

  try {
    parsed = new URL(url)
  } catch {
    throw new Error(
      `Section "${sectionId}" (type: cta) buttonUrl is malformed and must be a valid URL. Got: ${url}`
    )
  }

  const protocol = parsed.protocol.toLowerCase()

  if (!ALLOWED_URL_PROTOCOLS.includes(protocol)) {
    throw new Error(
      `Section "${sectionId}" (type: cta) buttonUrl must use an approved protocol (${ALLOWED_URL_PROTOCOLS.join(
        ', '
      )}). Got: ${url}`
    )
  }
}

/**
 * Section-specific validation.
 */
function validateSection(section: Section): void {
  switch (section.type) {
    case 'hero': {
      if (!section.heading) {
        throw new Error(
          `Section "${section.id}" (type: hero) must have a heading`
        )
      }

      if (!section.description) {
        throw new Error(
          `Section "${section.id}" (type: hero) must have a description`
        )
      }

      break
    }

    case 'features': {
      if (!section.items || !Array.isArray(section.items)) {
        throw new Error(
          `Section "${section.id}" (type: features) must have an items array`
        )
      }

      if (section.items.length === 0) {
        throw new Error(
          `Section "${section.id}" (type: features) must have at least one item`
        )
      }

      for (let i = 0; i < section.items.length; i++) {
        const item = section.items[i]

        if (!item.title) {
          throw new Error(
            `Section "${section.id}" (type: features) item ${i + 1} must have a title`
          )
        }

        if (!item.description) {
          throw new Error(
            `Section "${section.id}" (type: features) item "${item.title}" must have a description`
          )
        }
      }

      break
    }

    case 'text': {
      if (!section.heading) {
        throw new Error(
          `Section "${section.id}" (type: text) must have a heading`
        )
      }

      if (!section.description) {
        throw new Error(
          `Section "${section.id}" (type: text) must have a description`
        )
      }

      break
    }

    case 'cta': {
      if (!section.buttonText) {
        throw new Error(
          `Section "${section.id}" (type: cta) must have buttonText`
        )
      }

      if (section.buttonUrl) {
        validateCtaUrl(section.id, section.buttonUrl)
      }

      break
    }
  }
}

/**
 * Validate the given configuration against the JSON Schema
 * and application-level rules.
 */
function validateConfig(config: unknown): InitialContext {
  const validate = ajv.compile(schema as object)
  const valid = validate(config)

  if (!valid) {
    const errorMessages = buildErrorMessage(validate.errors || [])

    throw new Error(
      `Initial Context validation failed: ${errorMessages}`
    )
  }

  const typed = config as InitialContext

  // Validate unique section IDs.
  const seen = new Set<string>()
  const duplicates: string[] = []

  for (const section of typed.sections) {
    if (seen.has(section.id)) {
      duplicates.push(section.id)
    }

    seen.add(section.id)
  }

  if (duplicates.length > 0) {
    throw new Error(
      `Initial Context validation failed: duplicate section IDs: ${duplicates.join(
        ', '
      )}`
    )
  }

  // Validate reserved PathNames.
  if (RESERVED_PATH_NAMES.includes(typed.pathName.toLowerCase())) {
    throw new Error(
      `Initial Context validation failed: "${typed.pathName}" is a reserved PathName and cannot be used in configuration.`
    )
  }

  // Validate each section.
  for (const section of typed.sections) {
    validateSection(section)
  }

  return typed
}

/**
 * Validate the example Initial Context at module load time.
 */
export const validatedConfig: InitialContext =
  validateConfig(exampleConfig)


/**
 * Validate any supplied Initial Context configuration.
 */
export function validateAndType(config: unknown): InitialContext {
  return validateConfig(config)
}

export default validateConfig
