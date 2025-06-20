/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { CameraEditForm } from '@/components/camera/CameraEditForm'
import '@testing-library/jest-dom'

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('../../../hooks/useCameraDetails', () => ({
  useCameraDetail: jest.fn(),
}))

jest.mock('../../../hooks/useUpdateCamera', () => ({
  useUpdateCamera: jest.fn(),
}))

const mockCamera = {
  id: 'camera-xyz',
  name: 'Lobby Cam',
  rtsp_url: 'rtsp://test',
  stream_frame_width: 1280,
  stream_frame_height: 720,
  stream_fps: 30,
  stream_quality: 90,
  stream_max_length: 60,
  stream_skip_frames: 5,
  tags: [{ id: '1', name: 'Security', color: '#ff0' }],
}

describe('CameraEditForm', () => {
  const mockMutateAsync = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // mock useUpdateCamera hook
    const { useUpdateCamera } = require('../../../hooks/useUpdateCamera')
    useUpdateCamera.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
  })

  it('shows skeleton while loading', () => {
    const { useCameraDetail } = require('../../../hooks/useCameraDetails')
    useCameraDetail.mockReturnValue({ isLoading: true })

    render(<CameraEditForm id="camera-xyz" />)
    expect(screen.getByTestId('form-skeleton')).toBeInTheDocument()
  })

  it('shows error alert on failure', () => {
    const { useCameraDetail } = require('../../../hooks/useCameraDetails')
    useCameraDetail.mockReturnValue({ isLoading: false, error: true, data: {} })

    render(<CameraEditForm id="camera-xyz" />)
    expect(screen.getByText('Failed to load camera.')).toBeInTheDocument()
  })

  it('renders form fields with existing camera data', async () => {
    const { useCameraDetail } = require('../../../hooks/useCameraDetails')
    useCameraDetail.mockReturnValue({ isLoading: false, data: mockCamera })

    render(<CameraEditForm id="camera-xyz" />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Lobby Cam')).toBeInTheDocument()
      expect(screen.getByDisplayValue('rtsp://test')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1280')).toBeInTheDocument()
      expect(screen.getByDisplayValue('720')).toBeInTheDocument()
    })
  })

  it('submits updated data correctly', async () => {
    const { useCameraDetail } = require('../../../hooks/useCameraDetails')
    useCameraDetail.mockReturnValue({ isLoading: false, data: mockCamera })

    render(<CameraEditForm id="camera-xyz" />)

    const nameInput = screen.getByLabelText('Name')
    const rtspInput = screen.getByLabelText('RTSP URL')
    const submitBtn = screen.getByRole('button', { name: /save changes/i })

    await waitFor(() => {
      expect(nameInput).toHaveValue('Lobby Cam')
    })

    fireEvent.change(nameInput, { target: { value: 'Main Lobby Cam' } })
    fireEvent.change(rtspInput, { target: { value: 'rtsp://updated' } })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Main Lobby Cam',
          rtsp_url: 'rtsp://updated',
        })
      )
    })
  })

  it('shows validation errors on invalid submit', async () => {
    const { useCameraDetail } = require('../../../hooks/useCameraDetails')
    useCameraDetail.mockReturnValue({ isLoading: false, data: mockCamera })

    render(<CameraEditForm id="camera-xyz" />)

    const nameInput = screen.getByLabelText('Name')
    const submitBtn = screen.getByRole('button', { name: /save changes/i })

    fireEvent.change(nameInput, { target: { value: '' } }) // invalid name
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/name/i)).toHaveClass('text-red-600')
    })
  })
})
