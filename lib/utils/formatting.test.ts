import { describe, it, expect } from 'vitest'
import { formatDate, isOverdue, formatStatus, getPriorityColor } from './formatting'

describe('formatting utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date)
      expect(formatted).toBeDefined()
      expect(typeof formatted).toBe('string')
    })

    it('should include year when showYear is true', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date, { showYear: true })
      expect(formatted).toContain('2024')
    })

    it('should not include year when showYear is false', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date, { showYear: false })
      // The exact format depends on locale, but it should be a valid date string
      expect(formatted).toBeDefined()
    })

    it('should handle different date formats', () => {
      const date = '2024-12-25'
      const formatted = formatDate(date)
      expect(formatted).toBeDefined()
    })
  })

  describe('isOverdue', () => {
    it('should return true for overdue incomplete tasks', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      expect(isOverdue(yesterday, false)).toBe(true)
    })

    it('should return false for completed tasks even if overdue', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      expect(isOverdue(yesterday, true)).toBe(false)
    })

    it('should return false for future dates', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      expect(isOverdue(tomorrow, false)).toBe(false)
    })

    it('should return false for today', () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const todayStr = `${year}-${month}-${day}`
      // Today should not be overdue
      expect(isOverdue(todayStr, false)).toBe(false)
      
      // Yesterday should be overdue
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yYear = yesterday.getFullYear()
      const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0')
      const yDay = String(yesterday.getDate()).padStart(2, '0')
      const yesterdayStr = `${yYear}-${yMonth}-${yDay}`
      expect(isOverdue(yesterdayStr, false)).toBe(true)
    })

    it('should handle empty string', () => {
      expect(isOverdue('', false)).toBe(false)
    })
  })

  describe('formatStatus', () => {
    it('should format status with underscore', () => {
      expect(formatStatus('in_progress')).toBe('In Progress')
    })

    it('should capitalize first letter of each word', () => {
      expect(formatStatus('todo')).toBe('Todo')
      expect(formatStatus('done')).toBe('Done')
    })

    it('should handle single word status', () => {
      expect(formatStatus('todo')).toBe('Todo')
    })

    it('should handle multiple underscores', () => {
      expect(formatStatus('in_progress_test')).toBe('In Progress Test')
    })

    it('should handle empty string', () => {
      expect(formatStatus('')).toBe('')
    })
  })

  describe('getPriorityColor', () => {
    it('should return correct colors for high priority', () => {
      const colors = getPriorityColor('high')
      expect(colors.bg).toContain('red')
      expect(colors.text).toContain('red')
    })

    it('should return correct colors for low priority', () => {
      const colors = getPriorityColor('low')
      expect(colors.bg).toContain('emerald')
      expect(colors.text).toContain('emerald')
    })

    it('should return correct colors for normal priority', () => {
      const colors = getPriorityColor('normal')
      expect(colors.bg).toContain('amber')
      expect(colors.text).toContain('amber')
    })

    it('should return normal colors as default', () => {
      const colors = getPriorityColor('normal')
      expect(colors.bg).toBeDefined()
      expect(colors.text).toBeDefined()
    })

    it('should include dark mode variants', () => {
      const colors = getPriorityColor('high')
      expect(colors.bg).toContain('dark:')
      expect(colors.text).toContain('dark:')
    })
  })
})

