import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../src/App'

// Mock fetch for Weather component
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
}
global.navigator.geolocation = mockGeolocation as any

describe('App', () => {
  const mockWeatherData = {
    current: {
      temperature_2m: 22.5,
      weather_code: 0,
      wind_speed_10m: 15.3,
      relative_humidity_2m: 65,
    },
    daily: {
      time: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'],
      temperature_2m_max: [25, 26, 24, 23, 27, 28, 25],
      temperature_2m_min: [18, 19, 17, 16, 20, 21, 18],
      weather_code: [0, 1, 2, 3, 45, 61, 95],
    },
    timezone: 'Australia/Sydney',
  }

  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockWeatherData,
    })
  })

  it('renders the main title', () => {
    render(<App />)
    expect(screen.getByText('This is a demo project')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<App />)
    expect(screen.getByText('Built with React, TypeScript & Vite')).toBeInTheDocument()
  })

  it('renders all three feature cards', () => {
    render(<App />)
    expect(screen.getByText('Fast')).toBeInTheDocument()
    expect(screen.getByText('Modern')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
  })

  it('renders feature card descriptions', () => {
    render(<App />)
    expect(screen.getByText('Lightning-fast development with Vite')).toBeInTheDocument()
    expect(screen.getByText('Beautiful and responsive design')).toBeInTheDocument()
    expect(screen.getByText('Production-ready setup')).toBeInTheDocument()
  })

  it('renders the Weather component', async () => {
    render(<App />)

    // Weather component should load
    await waitFor(() => {
      expect(screen.getByText(/Weather/i)).toBeInTheDocument()
    })
  })

  it('renders background shapes for visual design', () => {
    const { container } = render(<App />)
    const shapes = container.querySelectorAll('.shape')
    expect(shapes).toHaveLength(3)
  })

  it('has proper structure with content container', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.App')).toBeInTheDocument()
    expect(container.querySelector('.content')).toBeInTheDocument()
    expect(container.querySelector('.hero-section')).toBeInTheDocument()
  })

  it('displays weather data when loaded', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Sydney, Australia Weather')).toBeInTheDocument()
      expect(screen.getByText('23°C')).toBeInTheDocument()
    })
  })
})
