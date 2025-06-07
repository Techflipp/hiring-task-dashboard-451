'use client';

import { Tag } from 'primereact/tag';
import { TagType } from '@/types/camera';

interface CameraTagsProps {
    tags: TagType[];
}

const CameraTags: React.FC<CameraTagsProps> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex align-items-center gap-2">
                <i className="pi pi-tags text-primary"></i>
                Tags
            </h3>
            <div className="flex gap-2 flex-wrap">
                {tags.map(tag => (
                    <Tag
                        key={tag.id}
                        value={tag.name}
                        style={{
                            backgroundColor: tag.color,
                            color: '#ffffff',
                            fontWeight: '500',
                            textTransform: 'capitalize',
                        }}
                        className="px-3 py-2 border-round-lg shadow-1 text-sm text-center"
                    />
                ))}
            </div>
        </div>
    );
};

export default CameraTags;
