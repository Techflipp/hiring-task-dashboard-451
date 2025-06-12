import { http, HttpResponse } from 'msw'

// Import your actual types (assuming they're in a separate file)
import { 
  Camera, 
  DemographicsConfig, 
  PaginatedResponse, 
  DemographicsResponse, 
  CreateDemographicsConfigPayload, 
  UpdateDemographicsConfigPayload, 
  Tag 
} from '../../lib/types'

function createMockCamera(overrides: Partial<Camera> = {}): Camera {
  return {
    id: 'default-camera-id',
    name: 'Default Camera',
    rtsp_url: 'rtsp://example.com/stream',
    is_active: true,
    status_message: 'Connected',
    snapshot: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    stream_frame_width: 1280,
    stream_frame_height: 720,
    stream_max_length: 3600,
    stream_quality: 80,
    stream_fps: 30,
    stream_skip_frames: 0,
    tags: [
      { id: 'tag-1', name: 'Indoor', color: '#3B82F6' },
      { id: 'tag-2', name: 'Main Entrance', color: '#10B981' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }
}

export const handlers = [
  // Camera endpoints
  http.get('/api/cameras', () => {
    const response: PaginatedResponse<Camera> = {
      items: [
        createMockCamera({ 
          id: 'camera-1', 
          name: 'Test Camera 1',
          rtsp_url: 'rtsp://192.168.1.100:554/stream1',
          is_active: true,
          status_message: 'Connected and streaming'
        }),
        createMockCamera({ 
          id: 'camera-2', 
          name: 'Test Camera 2',
          rtsp_url: 'rtsp://192.168.1.101:554/stream1',
          is_active: false,
          status_message: 'Connection timeout'
        }),
      ],
      total: 2,
      page: 1,
      size: 10,
      pages: 1
    }
    return HttpResponse.json(response)
  }),

  http.get('/api/cameras/:id', ({ params }) => {
    const { id } = params
    const camera: Camera = createMockCamera({ 
      id: id as string,
      name: `Camera ${id}`,
      rtsp_url: `rtsp://192.168.1.100:554/stream${id}`,
      is_active: true,
      status_message: 'Connected and streaming',
      stream_frame_width: 1920,
      stream_frame_height: 1080,
      stream_max_length: 7200,
      stream_quality: 90,
      stream_fps: 25,
      stream_skip_frames: 1,
      demographics_config: {
        id: 'config-1',
        camera_id: id as string,
        track_history_max_length: 30,
        exit_threshold: 75,
        min_track_duration: 3,
        detection_confidence_threshold: 0.6,
        demographics_confidence_threshold: 0.4,
        min_track_updates: 5,
        box_area_threshold: 0.15,
        save_interval: 300,
        frame_skip_interval: 2.5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    })
    return HttpResponse.json(camera)
  }),

  // Demographics endpoints
  http.post('/api/demographics/config', async ({ request }) => {
    const body = await request.json() as CreateDemographicsConfigPayload
    const config: DemographicsConfig = {
      id: 'new-config-id',
      camera_id: body.camera_id,
      track_history_max_length: body.track_history_max_length,
      exit_threshold: body.exit_threshold,
      min_track_duration: body.min_track_duration,
      detection_confidence_threshold: body.detection_confidence_threshold,
      demographics_confidence_threshold: body.demographics_confidence_threshold,
      min_track_updates: body.min_track_updates,
      box_area_threshold: body.box_area_threshold,
      save_interval: body.save_interval,
      frame_skip_interval: body.frame_skip_interval,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return HttpResponse.json(config)
  }),

  http.put('/api/demographics/config/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as UpdateDemographicsConfigPayload
    const config: DemographicsConfig = {
      id: id as string,
      camera_id: 'camera-1', // This would typically come from the existing config
      track_history_max_length: body.track_history_max_length,
      exit_threshold: body.exit_threshold,
      min_track_duration: body.min_track_duration,
      detection_confidence_threshold: body.detection_confidence_threshold,
      demographics_confidence_threshold: body.demographics_confidence_threshold,
      min_track_updates: body.min_track_updates,
      box_area_threshold: body.box_area_threshold,
      save_interval: body.save_interval,
      frame_skip_interval: body.frame_skip_interval,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    }
    return HttpResponse.json(config)
  }),

  http.get('/api/demographics/results', () => {
    const response: DemographicsResponse = {
      items: [],
      analytics: {
        total_count: 0,
        gender_distribution: {
          male: 0,
          female: 0
        },
        age_distribution: {
          "0-18": 0,
          "19-30": 0,
          "31-45": 0,
          "46-60": 0,
          "60+": 0
        },
        emotion_distribution: {
          angry: 0,
          fear: 0,
          happy: 0,
          neutral: 0,
          sad: 0,
          surprise: 0
        },
        ethnicity_distribution: {
          white: 0,
          african: 0,
          south_asian: 0,
          east_asian: 0,
          middle_eastern: 0
        }
      }
    }
    return HttpResponse.json(response)
  })
]