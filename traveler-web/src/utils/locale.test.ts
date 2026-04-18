import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import i18n from '../i18n'
import { getLocaleText } from './locale'

describe('getLocaleText', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en')
  })

  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('returns empty string for undefined / null / empty input', () => {
    expect(getLocaleText(undefined)).toBe('')
    expect(getLocaleText(null)).toBe('')
    expect(getLocaleText('')).toBe('')
  })

  it('returns the raw string when a plain string is passed', () => {
    expect(getLocaleText('hello')).toBe('hello')
  })

  it('returns the English text when i18n.language is en', async () => {
    await i18n.changeLanguage('en')
    expect(getLocaleText({ en: 'Hello', zh: '你好' })).toBe('Hello')
  })

  it('returns the Chinese text when i18n.language is zh', async () => {
    await i18n.changeLanguage('zh')
    expect(getLocaleText({ en: 'Hello', zh: '你好' })).toBe('你好')
  })

  it('falls back to English when the requested language is missing', async () => {
    await i18n.changeLanguage('zh')
    expect(getLocaleText({ en: 'Hello', zh: '' } as { en: string; zh: string })).toBe('Hello')
  })
})
