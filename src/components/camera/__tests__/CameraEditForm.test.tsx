import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { CameraEditForm } from '../CameraEditForm'
import { useCameraDetail } from '@/hooks/useCameraDetails'
import { CameraTag } from '@/types/camera.interface'
import { useRouter } from 'next/navigation'
import { useUpdateCamera } from '@/hooks/useUpdateCamera'

// Mock the hooks and next/navigation
jest.mock('../../../hooks/useCameraDetails')
jest.mock('../../../hooks/useUpdateCamera')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockUseCameraDetail = useCameraDetail as jest.Mock
const mockUseUpdateCamera = useUpdateCamera as jest.Mock
const mockUseRouter = useRouter as jest.Mock

describe('CameraEditForm', () => {
  const mockCameraData = {
    id: '1',
    name: 'Test Camera',
    rtsp_url: 'rtsp://example.com',
    stream_frame_width: 1920,
    stream_frame_height: 1080,
    stream_fps: 30,
    stream_quality: 80,
    stream_max_length: 60,
    stream_skip_frames: 5,
    tags: [{ id: 'tag1' }, { id: 'tag2' }] as CameraTag[],
  }

  const mockPush = jest.fn()
  const mockMutateAsync = jest.fn().mockResolvedValue({})

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
    })
    mockUseUpdateCamera.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading skeleton when data is loading', () => {
    mockUseCameraDetail.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    render(<CameraEditForm id="1" />)
    expect(screen.getByTestId('form-skeleton')).toBeInTheDocument()
  })

  it('shows error message when there is an error', () => {
    mockUseCameraDetail.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    })

    render(<CameraEditForm id="1" />)
    expect(screen.getByText('Failed to load camera.')).toBeInTheDocument()
  })

  it('renders form with camera data when loaded', async () => {
    mockUseCameraDetail.mockReturnValue({
      data: mockCameraData,
      isLoading: false,
      error: null,
    })

    render(<CameraEditForm id="1" />)

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Test Camera')
      expect(screen.getByLabelText('RTSP URL')).toHaveValue('rtsp://example.com')
      expect(screen.getByLabelText('Stream Width')).toHaveValue(1920)
      expect(screen.getByLabelText('Stream Height')).toHaveValue(1080)
    })
  })

  it('submits form with updated values', async () => {
    mockUseCameraDetail.mockReturnValue({
      data: mockCameraData,
      isLoading: false,
      error: null,
    })

    render(<CameraEditForm id="1" />)

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Test Camera')
    })

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated Camera' } })
    fireEvent.change(screen.getByLabelText('Stream FPS'), { target: { value: '25' } })

    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'Updated Camera',
        rtsp_url: 'rtsp://example.com',
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_fps: 25, // updated value
        stream_quality: 80,
        stream_max_length: 60,
        stream_skip_frames: 5,
        tags: ['tag1', 'tag2'],
      })
      expect(mockPush).toHaveBeenCalledWith('/cameras/1')
    })
  })

  it('shows validation errors for invalid inputs', async () => {
    mockUseCameraDetail.mockReturnValue({
      data: mockCameraData,
      isLoading: false,
      error: null,
    })

    render(<CameraEditForm id="1" />)

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Test Camera')
    })

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('RTSP URL'), { target: { value: 'invalid-url' } })
    fireEvent.change(screen.getByLabelText('Stream FPS'), { target: { value: '-1' } })

    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Invalid RTSP URL')).toBeInTheDocument()
      expect(screen.getByText('Stream FPS must be a positive number')).toBeInTheDocument()
    })
  })

  it('disables submit button when mutation is pending', async () => {
    mockUseCameraDetail.mockReturnValue({
      data: mockCameraData,
      isLoading: false,
      error: null,
    })
    mockUseUpdateCamera.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    })

    render(<CameraEditForm id="1" />)

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeDisabled()
    })
  })
})