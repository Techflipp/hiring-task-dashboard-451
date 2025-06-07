'use client';

import React from 'react';
import { useCameraTable } from './useCameraTable';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { pageSizeOptions } from './constants';
import { nameTemplate, activeTemplate, tagsTemplate } from './templates';

const CameraTable: React.FC = () => {
  const {
    search,
    size,
    page,
    data,
    isLoading,
    error,
    handleSearchChange,
    handlePageSizeChange,
    handlePageChange,
    onRowClick,
  } = useCameraTable();

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">
          Error loading data: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="card shadow-2 surface-card border-round-xl">
      <div className="flex justify-content-between align-items-center mb-6 gap-4 flex-wrap">
        <div className="w-full md:w-6 flex align-items-center gap-3">
          <i className="pi pi-search text-white text-xl" />
          <InputText
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search cameras..."
            aria-label="Search cameras"
            aria-describedby="search-help"
            className="w-full p-inputtext-sm text-white "
            style={{ padding: '0.75rem 1rem' }}
          />
        </div>
        <div className="flex align-items-center gap-3">
          <span className="text-sm font-medium whitespace-nowrap text-white">
            Items per page:
          </span>
          <Dropdown
            value={size}
            options={pageSizeOptions}
            onChange={e => handlePageSizeChange(e.value)}
            className="w-6rem"
            aria-label="items-per-page"
            aria-labelledby="items-per-page"
            aria-haspopup="listbox"
            aria-expanded="false"
            data-pc-section="trigger"
            aria-selected="false"
          />
        </div>
      </div>

      <DataTable
        value={data?.items || []}
        loading={isLoading}
        emptyMessage="No cameras found"
        stripedRows
        responsiveLayout="scroll"
        className="p-datatable-sm custom-camera-table"
        onRowClick={onRowClick}
        selectionMode="single"
        dataKey="id"
        rowHover
        aria-label="Cameras Table"
      >
        <Column
          field="name"
          header="Camera Name"
          body={nameTemplate}
          className="min-w-12rem text-sm font-semibold text-color"
          headerClassName="font-semibold text-color-secondary text-sm"
          style={{ padding: '1rem 1.5rem' }}
          headerStyle={{ padding: '1.25rem 1.5rem' }}
        />
        <Column
          field="is_active"
          header="Active"
          body={activeTemplate}
          className="text-center w-8rem"
          headerClassName="font-semibold text-color-secondary text-sm"
          style={{ padding: '1rem 1.5rem' }}
          headerStyle={{ padding: '1.25rem 1.5rem' }}
        />
        <Column
          field="tags"
          header="Tags"
          body={tagsTemplate}
          className="min-w-20rem text-sm"
          headerClassName="font-semibold text-color-secondary text-sm"
          style={{ padding: '1rem 1.5rem' }}
          headerStyle={{ padding: '1.25rem 1.5rem' }}
        />
      </DataTable>

      {data?.pages > 0 && (
        <div className="mt-6">
          <Paginator
            first={(page - 1) * size}
            rows={size}
            totalRecords={data.total}
            onPageChange={handlePageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            className="justify-content-center"
            style={{ padding: '1rem 0' }}
          />
        </div>
      )}

      {data && (
        <div className="mt-4 text-sm text-color-secondary text-center">
          Page {data.page} of {data.pages} ({data.total} total cameras)
        </div>
      )}
    </div>
  );
};

export default CameraTable;
