'use client';

export const showSuccessToast = (
    toastRef: any,
    summary = 'Success',
    detail = 'Operation completed successfully',
    life = 4000
) => {
    toastRef.current?.show({
        severity: 'success',
        summary,
        detail,
        life,
    });
};

export const showErrorToast = (
    toastRef: any,
    summary = 'Error',
    detail = 'Something went wrong',
    life = 4000
) => {
    toastRef.current?.show({
        severity: 'error',
        summary,
        detail,
        life,
    });
};
