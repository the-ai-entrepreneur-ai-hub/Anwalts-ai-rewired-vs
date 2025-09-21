import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('dashboard implementation removes hardcoded values', () => {
  it('does not contain template demo text or numbers', () => {
    const file = resolve(__dirname, '../../pages/dashboard.vue')
    const content = readFileSync(file, 'utf-8')

    expect(content).not.toContain('Dr. Max Müller')
    expect(content).not.toContain('Senior Partner')
    expect(content).not.toMatch(/>\s*42\s*</)
    expect(content).not.toMatch(/>\s*389\s*</)
  })
})
