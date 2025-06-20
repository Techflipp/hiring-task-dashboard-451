/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent } from '@testing-library/react'
import { CameraDetail } from '@/components/camera/CameraDetail'
import { useRouter } from 'next/navigation'
import '@testing-library/jest-dom'
import { Camera } from '@/types/camera.interface'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock camera hook
jest.mock('../../../hooks/useCameraDetails.ts', () => ({
  useCameraDetail: jest.fn(),
}))

const mockPush = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
})

const mockCamera: Partial<Camera> = {
  id: 'camera-123',
  name: 'West Gate Camera',
  rtsp_url: 'rtsp://stream.example.com',
  snapshot: 'https://example.com/snapshot.jpg',
  is_active: true,
  status_message: 'Streaming live',
  created_at: '2024-06-20T08:00:00Z',
  updated_at: '2024-06-21T09:00:00Z',
  tags: [
    { id: '1', name: 'Entry', color: '#009688' },
    { id: '2', name: 'Morning', color: '#4CAF50' },
  ],
}

describe('CameraDetail', () => {

  it('renders error state', () => {
    const { useCameraDetail } = require("../../../hooks/useCameraDetails")
    useCameraDetail.mockReturnValue({ isLoading: false, error: true })

    render(<CameraDetail id="camera-123" />)
    expect(screen.getByText('Failed to load camera details.')).toBeInTheDocument()
  })

  it('renders camera details correctly', () => {
    const { useCameraDetail } = require("../../../hooks/useCameraDetails")
    useCameraDetail.mockReturnValue({ isLoading: false, error: null, data: mockCamera })

    render(<CameraDetail id="camera-123" />)

    expect(screen.getByText('West Gate Camera')).toBeInTheDocument()
    expect(screen.getByText(/rtsp:\/\/stream\.example\.com/)).toBeInTheDocument()
    expect(screen.getByText('Entry')).toBeInTheDocument()
    expect(screen.getByText('Morning')).toBeInTheDocument()
    expect(screen.getByText('Streaming live')).toBeInTheDocument()
    expect(screen.getByText(/Created:/)).toBeInTheDocument()
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument()
  })

  it('navigates to edit/configure/analytics pages on button click', () => {
    const { useCameraDetail } = require("../../../hooks/useCameraDetails")
    useCameraDetail.mockReturnValue({ isLoading: false, error: null, data: mockCamera })

    render(<CameraDetail id="camera-123" />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(mockPush).toHaveBeenCalledWith('/cameras/camera-123/edit')

    fireEvent.click(screen.getByRole('button', { name: /configure/i }))
    expect(mockPush).toHaveBeenCalledWith('/cameras/camera-123/configure')

    fireEvent.click(screen.getByRole('button', { name: /analytics/i }))
    expect(mockPush).toHaveBeenCalledWith('/cameras/camera-123/analytics')
  })
})
