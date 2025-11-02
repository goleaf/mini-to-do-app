import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils/test-utils'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('should render title', () => {
    render(<EmptyState title="No tasks found" />)
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(<EmptyState title="No tasks" description="Create your first task to get started" />)
    expect(screen.getByText('Create your first task to get started')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    const icon = <span data-testid="test-icon">📋</span>
    render(<EmptyState title="No tasks" icon={icon} />)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('should not render description when not provided', () => {
    render(<EmptyState title="No tasks" />)
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument()
  })
})

