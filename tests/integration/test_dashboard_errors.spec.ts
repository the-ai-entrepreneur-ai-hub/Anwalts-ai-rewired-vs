import { describe, it, expect } from 'vitest'

import { useApiError } from '~/composables/useApiError'

describe('dashboard API error handling', () => {
  it('extracts backend error messages when present', () => {
    const { capture, lastError } = useApiError()

    capture({
      response: {
        data: {
          error: {
            message: 'Session expired',
          },
        },
      },
    })

    expect(lastError.value).toBe('Session expired')
  })
})
