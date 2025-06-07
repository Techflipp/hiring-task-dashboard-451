export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Camera {
    id: string;
    name: string;
    tags: Tag[];
    is_active: boolean;
}

export interface CameraResponse {
    data?: Camera[];
    items?: Camera[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
}

export interface CameraPageProps {
    initialData: CameraResponse;
    initialSearch: string;
    initialPage: number;
    initialSize: number;
}

export interface TagType {
    id: string;
    name: string;
    color: string;
}

export interface items {
    id: string;
    name: string;
    rtsp_url: string;
    tags: TagType[];
    is_active: boolean;
    snapshot?: string;
    total?: number | string;
    page?: number | string;
    pages?: number | string;
    size?: number | string;
}

export interface CameraData {
    id: string;
    name: string;
    rtsp_url: string;
    tags: TagType[];
    is_active: boolean;
    snapshot?: string;
    total?: number | string;
    page?: number | string;
    pages?: number | string;
    size?: number | string;
}