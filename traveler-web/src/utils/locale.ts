import type { LocaleText } from '../data/types'
import i18n from '../i18n'

export function getLocaleText(value: LocaleText | string | undefined | null): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[i18n.language as 'en' | 'zh'] || value.en || ''
}
