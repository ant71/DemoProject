import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Weather from '../src/components/Weather'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
}
global.navigator.geolocation = mockGeolocation as any

describe('Weather Component', () => {
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
    mockGeolocation.getCurrentPosition.mockClear()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves
    render(<Weather />)
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument()
  })

  it('fetches and displays weather data for default location (Sydney)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sydney, Australia/i })).toBeInTheDocument()
    })

    expect(screen.getByText('23°C')).toBeInTheDocument()
    expect(screen.getByText('Clear sky')).toBeInTheDocument()
  })

  it('displays 3-day compact forecast', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sydney, Australia/i })).toBeInTheDocument()
    })

    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()

    // Check for temperature displays in compact format "max° / min°"
    expect(screen.getByText('25° / 18°')).toBeInTheDocument()
    expect(screen.getByText('26° / 19°')).toBeInTheDocument()
  })

  it('displays error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByText('Unable to load weather data')).toBeInTheDocument()
    })
  })

  it('displays error when API returns non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByText('Unable to load weather data')).toBeInTheDocument()
    })
  })

  it('changes location when dropdown selection changes', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockWeatherData,
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sydney, Australia/i })).toBeInTheDocument()
    })

    const dropdown = screen.getByRole('combobox')
    fireEvent.change(dropdown, { target: { value: 'Tokyo, Japan' } })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Tokyo, Japan/i })).toBeInTheDocument()
    })

    // Verify fetch was called with Tokyo coordinates
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('latitude=35.6762&longitude=139.6503')
    )
  })

  it('uses current location when geolocation button is clicked', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockWeatherData,
    })

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -37.8136,
          longitude: 144.9631,
        },
      })
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sydney, Australia/i })).toBeInTheDocument()
    })

    const geoButton = screen.getByTitle('Use my current location')
    fireEvent.click(geoButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Current Location/i })).toBeInTheDocument()
    })

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
  })

  it('handles geolocation permission denied', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockWeatherData,
    })

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        message: 'User denied geolocation',
      })
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sydney, Australia/i })).toBeInTheDocument()
    })

    const geoButton = screen.getByTitle('Use my current location')

    // Verify geolocation was called when button clicked
    fireEvent.click(geoButton)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()

    // The button should return to enabled state after error
    await waitFor(() => {
      expect(geoButton).not.toHaveTextContent('...')
    })
  })

  it('disables controls while getting location', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockWeatherData,
    })

    mockGeolocation.getCurrentPosition.mockImplementation(() => {
      // Don't call callback to simulate pending state
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sydney, Australia/i })).toBeInTheDocument()
    })

    const geoButton = screen.getByTitle('Use my current location')
    fireEvent.click(geoButton)

    // Check that button shows loading state
    expect(geoButton).toHaveTextContent('...')
    expect(geoButton).toBeDisabled()

    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toBeDisabled()
  })

  describe('Weather code conversions', () => {
    it('displays correct emoji for clear sky (code 0)', async () => {
      const clearSkyData = { ...mockWeatherData, current: { ...mockWeatherData.current, weather_code: 0 } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => clearSkyData,
      })

      render(<Weather />)

      await waitFor(() => {
        expect(screen.getByText('Clear sky')).toBeInTheDocument()
      })
    })

    it('displays correct emoji for rainy weather (code 61)', async () => {
      const rainyData = { ...mockWeatherData, current: { ...mockWeatherData.current, weather_code: 61 } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => rainyData,
      })

      render(<Weather />)

      await waitFor(() => {
        expect(screen.getByText('Rainy')).toBeInTheDocument()
      })
    })

    it('displays correct emoji for thunderstorm (code 95)', async () => {
      const stormData = { ...mockWeatherData, current: { ...mockWeatherData.current, weather_code: 95 } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => stormData,
      })

      render(<Weather />)

      await waitFor(() => {
        expect(screen.getByText('Thunderstorm')).toBeInTheDocument()
      })
    })
  })

  it('has all major cities in dropdown', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sydney, Australia/i })).toBeInTheDocument()
    })

    const dropdown = screen.getByRole('combobox') as HTMLSelectElement

    // Check for cities from different regions
    expect(dropdown).toContainHTML('Sydney, Australia')
    expect(dropdown).toContainHTML('New York, USA')
    expect(dropdown).toContainHTML('London, UK')
    expect(dropdown).toContainHTML('Tokyo, Japan')
    expect(dropdown).toContainHTML('São Paulo, Brazil')
    expect(dropdown).toContainHTML('Cairo, Egypt')
  })

  it('rounds temperature values correctly', async () => {
    const dataWithDecimals = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        temperature_2m: 22.7,
      },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dataWithDecimals,
    })

    render(<Weather />)

    await waitFor(() => {
      expect(screen.getByText('23°C')).toBeInTheDocument()
    })
  })
})
