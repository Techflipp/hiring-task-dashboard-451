import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { CameraCard } from '@/components/camera/CameraCard'
import '@testing-library/jest-dom'
import { Camera } from '@/types/camera.interface'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockPush = jest.fn()

beforeEach(() => {
  ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
})

const mockCamera = {
  id: 'camera-1',
  name: 'Main Entrance',
  snapshot: 'https://example.com/snapshot.jpg',
  is_active: true,
  status_message: 'All systems operational',
  tags: [
    { id: '1', name: 'Entrance', color: '#FFDD57' },
    { id: '2', name: 'Daytime', color: '#57D9FF' },
  ],
}

describe('CameraCard', () => {
  it('renders camera details correctly', () => {
    render(<CameraCard camera={mockCamera as Camera} />)

    // Title
    expect(screen.getByText('Main Entrance')).toBeInTheDocument()

    // Image
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('snapshot.jpg'))

    // Status message
    expect(screen.getByText('All systems operational')).toBeInTheDocument()

    // Tags
    expect(screen.getByText('Entrance')).toBeInTheDocument()
    expect(screen.getByText('Daytime')).toBeInTheDocument()

    // Badge
    expect(screen.getByText('Active')).toBeInTheDocument()

    // View Details link
    expect(screen.getByText('View Details →')).toHaveAttribute(
      'href',
      '/cameras/camera-1'
    )
  })

  it('navigates to camera detail on card click', () => {
    render(<CameraCard camera={mockCamera  as Camera} />)

    const card = screen.getByRole('img').closest('div') // click near image area
    fireEvent.click(card!)

    expect(mockPush).toHaveBeenCalledWith('/cameras/camera-1')
  })

  it('shows inactive badge when camera is not active', () => {
    const inactiveCamera = { ...mockCamera, is_active: false }
    render(<CameraCard camera={inactiveCamera  as Camera} />)

    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })
})
