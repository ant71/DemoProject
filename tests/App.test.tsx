import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('DemoProject')).toBeInTheDocument()
  })

  it('increments counter on button click', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    fireEvent.click(button)
    expect(screen.getByText(/count is 1/i)).toBeInTheDocument()
  })
})
