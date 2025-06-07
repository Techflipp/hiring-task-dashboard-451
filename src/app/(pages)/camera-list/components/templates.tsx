import { Camera, Tag as CameraTag } from '@/types/camera';
import { InputSwitch } from 'primereact/inputswitch';
import { Tag } from 'primereact/tag';
import React, { useState } from 'react';

export const nameTemplate = (rowData: Camera) => (
    <span className="font-semibold text-white">{rowData.name}</span>
);

export const activeTemplate = (rowData: Camera) => {
    const [checked, setChecked] = useState(true);
    return (
        <div className="flex justify-content-center align-items-center">
            <InputSwitch
                checked={checked}
                onChange={e => setChecked(e.value)}
                aria-label='Active'
                aria-labelledby='active'
            />
        </div>
    );
};

export const tagsTemplate = (rowData: Camera) => (
    <div className="flex flex-wrap gap-2">
        {rowData.tags.map((tag: CameraTag) => (
            <Tag
                key={tag.id}
                value={tag.name}
                style={{
                    backgroundColor: tag.color,
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                }}
                className="px-3 py-1"
            />
        ))}
    </div>
);
