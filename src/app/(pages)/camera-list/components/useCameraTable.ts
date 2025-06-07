import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchCameras } from '@/app/(pages)/camera-list/components/cameraServices';
import { Camera, CameraData, items } from '@/types/camera';

export const useCameraTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getQueryParam = (param: string, fallback: string) =>
        searchParams.get(param) || fallback;

    const [search, setSearch] = useState(getQueryParam('camera_name', ''));
    const [page, setPage] = useState(Number(getQueryParam('page', '1')));
    const [size, setSize] = useState(Number(getQueryParam('size', '10')));

    const updateURL = useCallback((newSearch: string, newPage: number, newSize: number) => {
        const params = new URLSearchParams();
        if (newSearch) params.set('camera_name', newSearch);
        params.set('page', newPage.toString());
        params.set('size', newSize.toString());
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router]);

    useEffect(() => {
        setSearch(getQueryParam('camera_name', ''));
        setPage(Number(getQueryParam('page', '1')));
        setSize(Number(getQueryParam('size', '10')));
    }, [searchParams]);

    const { data, isLoading, error } = useQuery<items[] | CameraData | any | null>({
        queryKey: ['cameras', search, page, size],
        queryFn: () => fetchCameras({ camera_name: search, page, size }),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
        if (value.length >= 2 || value.length === 0) {
            updateURL(value, 1, size);
        }
    };

    const handlePageChange = (e: any) => {
        const newPage = e.page + 1;
        setPage(newPage);
        updateURL(search, newPage, size);
    };

    const handlePageSizeChange = (newSize: number) => {
        setSize(newSize);
        setPage(1);
        updateURL(search, 1, newSize);
    };

    const onRowClick = (event: any) => {
        const rowData = event.data as Camera;
        router.push(`/camera-detail/${rowData.id}`);
    };

    return {
        data,
        isLoading,
        error,
        page,
        search,
        size,
        setSearch,
        handleSearchChange,
        handlePageChange,
        handlePageSizeChange,
        onRowClick,
    };
};
