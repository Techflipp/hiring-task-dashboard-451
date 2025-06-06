# TechFlipp Frontend Task

## 📄 Documentation

For full details and extended explanations, please refer to the [View Full Documentation](https://docs.google.com/document/d/1GYiC0YiDbTOg1x1-IvqKOYzmvQyo_OMHUygb5Bc_WKQ/edit?usp=sharing).

## Overview

👋 This is a NextJS interview challenge. Please fork this repo, and push your code to a branch in your forked repo (following the instructions below).

You are tasked with building a responsive frontend application that interfaces with our Camera Management API. The application will allow users to manage cameras and view demographic analytics data collected by these cameras.

## Submission

Please fork this repository and submit your solution as a pull request. Include in your README:

- Setup instructions
- Overview of your implementation
- Any assumptions or design decisions
- Screenshots of the UI

If you have any questions or need assistance, feel free to open an issue in the main repository. We're here to help!

## Requirements

### 1. Camera List Page

- Implement a paginated view of cameras
- Allow users to control how many items appear per page
- Provide a way to search for cameras by name
- Display relevant camera information in a user-friendly manner

### 2. Camera Detail Page

- Create a view showing comprehensive camera information
- Design an intuitive layout for camera details

### 3. Camera Update Functionality

- Develop a user interface for updating camera details
- Implement appropriate validation with meaningful feedback
- Consider the user experience during form submission

### 4. Demographics Configuration

- Enable users to create or edit demographics configuration for cameras - one to one relationship with camera
- Design form controls appropriate for each configuration parameter
- Ensure proper validation of configuration values

### 5. Demographics Results & Analytics

- Implement filtering capabilities for the data
- Create informative visualizations that convey demographic insights like charts, graphs, tables, etc.

## Technical Requirements

- Build the application using Next.js, following its best practices for routing, data fetching, and component organization
- Implement responsive design that works well across different devices
- Let your imagination make the design of the task responsive.

## Nice-to-Have Technical Features

The following features would enhance your solution:

- Different rendering ways as needed (SSR, ISR, SSG, etc.)
- Skeleton loading states to improve perceived performance
- Seamless data refresh mechanisms
- Render error messages in form fields
- Optimistic UI updates for a better user experience
- Organized state management
- Use React Query (TanStack Query) for fetching and caching data.
- Creative and intuitive UI/UX design
- SEO and performance optimizations
- Unit tests for key components

## API Specification

**Base URL**: https://task-451-api.ryd.wafaicloud.com/
**Schema**: https://task-451-api.ryd.wafaicloud.com/docs

### Enum Definitions

#### Genders

```
MALE = "male"
FEMALE = "female"
```

#### Ages

```
ZERO_EIGHTEEN = "0-18"
NINETEEN_THIRTY = "19-30"
THIRTYONE_FORTYFIVE = "31-45"
FORTYSIX_SIXTY = "46-60"
SIXTYPLUS = "60+"
```

#### Emotions

```
ANGRY = "angry"
FEAR = "fear"
HAPPY = "happy"
NEUTRAL = "neutral"
SAD = "sad"
SURPRISE = "surprise"
```

#### Ethnic Groups

```
WHITE = "white"
AFRICAN = "african"
SOUTH_ASIAN = "south_asian"
EAST_ASIAN = "east_asian"
MIDDLE_EASTERN = "middle_eastern"
```

### Tags Endpoint

#### 1. List All Tags

```
GET /tags/
```

Response: List of all available tags

### Camera Endpoints

#### 1. List Cameras

```
GET /cameras/
Query Parameters:
- page: int (default=1) - Page number
- size: int (default=20) - Items per page
- camera_name: string (optional) - Filter by camera name
```

Response: Paginated list of cameras

#### 2. Get Camera Details

```
GET /cameras/{camera_id}
```

Response: Detailed camera information including demographics config if it exists

#### 3. Update Camera

```
PUT /cameras/{camera_id}
Body: {
  "name": string,
  "rtsp_url": string,
  "stream_frame_width": int (optional, min=1, max=2560),
  "stream_frame_height": int (optional, min=1, max=2560),
  "stream_max_length": int (optional, min=0, max=10000),
  "stream_quality": int (optional, min=80, max=100),
  "stream_fps": int (optional, min=1, max=120),
  "stream_skip_frames": int (optional, min=0, max=100),
  "tags": array of tag ids (optional)
}
```

### Demographics Endpoints

#### 1. Create Demographics Configuration

```
POST /demographics/config
Body: {
  "camera_id": string,
  "track_history_max_length": int (optional, min=1, max=100),
  "exit_threshold": int (optional, min=1, max=300),
  "min_track_duration": int (optional, min=1, max=60),
  "detection_confidence_threshold": float (optional, min=0.1, max=1.0),
  "demographics_confidence_threshold": float (optional, min=0.1, max=1.0),
  "min_track_updates": int (optional, min=1, max=100),
  "box_area_threshold": float (optional, min=0.05, max=1.0),
  "save_interval": int (optional, min=300, max=1800),
  "frame_skip_interval": float (optional, min=0.1, max=5.0)
}
```

#### 2. Update Demographics Configuration

```
PUT /demographics/config/{config_id}
Body: {
  "track_history_max_length": int (optional, min=1, max=100),
  "exit_threshold": int (optional, min=1, max=300),
  "min_track_duration": int (optional, min=1, max=60),
  "detection_confidence_threshold": float (optional, min=0.1, max=1.0),
  "demographics_confidence_threshold": float (optional, min=0.1, max=1.0),
  "min_track_updates": int (optional, min=1, max=100),
  "box_area_threshold": float (optional, min=0.05, max=1.0),
  "save_interval": int (optional, min=300, max=1800),
  "frame_skip_interval": float (optional, min=0.1, max=5.0)
}
```

#### 3. Get Demographics Results

```
GET /demographics/results
Query Parameters:
- camera_id: string (required)
- gender: string (optional) - Filter by gender
- age: string (optional) - Filter by age group
- emotion: string (optional) - Filter by emotion
- ethnicity: string (optional) - Filter by ethnicity
- start_date: datetime (optional) - Filter by start date
- end_date: datetime (optional) - Filter by end date
```

Response: List of demographics results and analytics data

## Evaluation Criteria

Your submission will be evaluated based on:

- Feature completeness according to requirements
- Code quality and organization
- UI/UX design and responsiveness
- Performance optimizations
- Unit test coverage
- Error handling
