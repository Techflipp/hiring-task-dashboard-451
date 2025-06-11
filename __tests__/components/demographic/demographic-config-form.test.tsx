import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsConfigForm } from '../../../components/demographics/config-form';
import { DemographicsConfig } from '../../../lib/types';

// Mock UI components
jest.mock('../../../components/ui/button', () => ({
  Button: ({ children, onClick, type, disabled, className, variant }: any) => (
    <button 
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../../components/ui/input', () => ({
  Input: React.forwardRef(({ ...props }: any, ref: any) => (
    <input {...props} ref={ref} />
  )),
}));

jest.mock('../../../components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Users: () => <div data-testid="users-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  BarChart3: () => <div data-testid="barchart-icon" />,
  Timer: () => <div data-testid="timer-icon" />,
  Save: () => <div data-testid="save-icon" />,
  RotateCcw: () => <div data-testid="rotate-icon" />,
  Info: () => <div data-testid="info-icon" />,
}));

// Mock react-hook-form
const mockRegister = jest.fn((name) => ({
  name,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ref: jest.fn(),
}));

const mockHandleSubmit = jest.fn((fn) => (e: any) => {
  e?.preventDefault?.();
  fn({
    track_history_max_length: 30,
    exit_threshold: 75,
    min_track_duration: 3,
    detection_confidence_threshold: 0.6,
    demographics_confidence_threshold: 0.4,
    min_track_updates: 5,
    box_area_threshold: 0.15,
    save_interval: 300,
    frame_skip_interval: 2.5,
  });
});

const mockWatch = jest.fn(() => ({
  track_history_max_length: 30,
  exit_threshold: 75,
  min_track_duration: 3,
  detection_confidence_threshold: 0.6,
  demographics_confidence_threshold: 0.4,
  min_track_updates: 5,
  box_area_threshold: 0.15,
  save_interval: 300,
  frame_skip_interval: 2.5,
}));

const mockReset = jest.fn();
const mockSetValue = jest.fn();
const mockFormState = { errors: {} };

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    formState: mockFormState,
    watch: mockWatch,
    setValue: mockSetValue,
    reset: mockReset,
  })),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(() => jest.fn()),
}));

jest.mock('zod', () => ({
  z: {
    object: jest.fn(() => ({
      min: jest.fn(() => ({ 
        max: jest.fn(() => ({ 
          int: jest.fn(() => ({})) 
        })) 
      })),
    })),
    number: jest.fn(() => ({
      min: jest.fn(() => ({ 
        max: jest.fn(() => ({ 
          int: jest.fn(() => ({})) 
        })) 
      })),
    })),
  },
}));

const mockConfig: DemographicsConfig = {
  id: 'config-1',
  camera_id: 'camera-1',
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
  updated_at: '2024-01-02T00:00:00Z'
};

describe('DemographicsConfigForm', () => {
  const defaultProps = {
    cameraId: 'camera-1',
    onSubmit: jest.fn(),
    isLoading: false,
    isEditMode: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockFormState, { errors: {} });
    
    // Mock window.history.back
    Object.defineProperty(window, 'history', {
      value: { back: jest.fn() },
      writable: true
    });
  });

  describe('Basic Rendering', () => {
    it('renders all main form sections', () => {
      render(<DemographicsConfigForm {...defaultProps} />);

      expect(screen.getByText('Tracking Parameters')).toBeInTheDocument();
      expect(screen.getByText('Detection Confidence')).toBeInTheDocument();
      expect(screen.getByText('Processing Settings')).toBeInTheDocument();
      expect(screen.getByText('Performance Impact')).toBeInTheDocument();
    });

    it('renders key form fields', () => {
      render(<DemographicsConfigForm {...defaultProps} />);

      // Check that register was called for main fields
      expect(mockRegister).toHaveBeenCalledWith('track_history_max_length', { valueAsNumber: true });
      expect(mockRegister).toHaveBeenCalledWith('exit_threshold', { valueAsNumber: true });
      expect(mockRegister).toHaveBeenCalledWith('detection_confidence_threshold', { valueAsNumber: true });
      expect(mockRegister).toHaveBeenCalledWith('save_interval', { valueAsNumber: true });
    });

    it('shows create mode button text when not in edit mode', () => {
      render(<DemographicsConfigForm {...defaultProps} />);

      expect(screen.getByText('Create Configuration')).toBeInTheDocument();
    });

    it('shows update mode button text when in edit mode', () => {
      render(<DemographicsConfigForm {...defaultProps} config={mockConfig} isEditMode={true} />);

      expect(screen.getByText('Update Configuration')).toBeInTheDocument();
    });
  });

  describe('Real-time Value Display', () => {
    it('displays formatted values with units', () => {
      render(<DemographicsConfigForm {...defaultProps} config={mockConfig} />);

      // Use flexible text matchers since the HTML contains whitespace
      expect(screen.getByText(/1m/)).toBeInTheDocument(); // exit_threshold (75s = 1m)
      expect(screen.getByText(/3s/)).toBeInTheDocument(); // min_track_duration
      expect(screen.getByText(/5m/)).toBeInTheDocument(); // save_interval (300s = 5m)
      expect(screen.getByText(/60%/)).toBeInTheDocument(); // detection_confidence_threshold (0.6 = 60%)
      expect(screen.getByText(/40%/)).toBeInTheDocument(); // demographics_confidence_threshold (0.4 = 40%)
      expect(screen.getByText(/15\.0%/)).toBeInTheDocument(); // box_area_threshold (0.15 = 15.0%)
    });
  });

  describe('Form Interactions', () => {
    it('has functional reset button', async () => {
      const user = userEvent.setup();
      render(<DemographicsConfigForm {...defaultProps} />);

      const resetButton = screen.getByText('Reset to Defaults');
      await user.click(resetButton);

      expect(mockReset).toHaveBeenCalled();
    });

    it('has functional cancel button', () => {
      const mockHistoryBack = jest.fn();
      Object.defineProperty(window, 'history', {
        value: { back: mockHistoryBack },
        writable: true
      });

      render(<DemographicsConfigForm {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockHistoryBack).toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with correct data structure', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      
      render(<DemographicsConfigForm {...defaultProps} onSubmit={onSubmit} />);

      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          track_history_max_length: 30,
          exit_threshold: 75,
          min_track_duration: 3,
          detection_confidence_threshold: 0.6,
          demographics_confidence_threshold: 0.4,
          min_track_updates: 5,
          box_area_threshold: 0.15,
          save_interval: 300,
          frame_skip_interval: 2.5
        })
      );
    });

    it('shows loading state during submission', () => {
      render(<DemographicsConfigForm {...defaultProps} isLoading={true} />);

      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(screen.getByText('Creating...')).toBeDisabled();
    });

    it('shows correct loading text for edit mode', () => {
      render(<DemographicsConfigForm {...defaultProps} isEditMode={true} isLoading={true} />);

      expect(screen.getByText('Updating...')).toBeInTheDocument();
    });

    it('disables all buttons during loading', () => {
      render(<DemographicsConfigForm {...defaultProps} isLoading={true} />);

      expect(screen.getByText('Creating...')).toBeDisabled();
      expect(screen.getByText('Reset to Defaults')).toBeDisabled();
      expect(screen.getByText('Cancel')).toBeDisabled();
    });
  });

  describe('Performance Impact Information', () => {
    it('displays performance guidance', () => {
      render(<DemographicsConfigForm {...defaultProps} />);

      expect(screen.getByText('Performance Impact')).toBeInTheDocument();
      expect(screen.getByText(/Higher confidence thresholds/)).toBeInTheDocument();
      expect(screen.getByText(/Lower frame skip interval/)).toBeInTheDocument();
      expect(screen.getByText(/Longer save intervals/)).toBeInTheDocument();
      expect(screen.getByText(/Larger box area threshold/)).toBeInTheDocument();
    });
  });

  describe('Form Validation Errors', () => {
    it('displays validation errors when present', () => {
      // Mock form state with errors
      Object.assign(mockFormState, { 
        errors: { 
          track_history_max_length: { message: 'Maximum track history is 200' } 
        } 
      });

      render(<DemographicsConfigForm {...defaultProps} />);

      expect(screen.getByText('Maximum track history is 200')).toBeInTheDocument();
    });
  });

  describe('Important Notes', () => {
    it('displays important usage notes', () => {
      render(<DemographicsConfigForm {...defaultProps} />);

      expect(screen.getByText(/Changes will take effect immediately after saving/)).toBeInTheDocument();
      expect(screen.getByText(/Demographics processing will restart with new parameters/)).toBeInTheDocument();
    });
  });
});