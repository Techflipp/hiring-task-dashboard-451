'use client';

import React from 'react';
import { Tag } from '@/modules/cameras/demographics/layouts/Demographics';

type TagsProps = {
    tags: Tag[];
    selectedTagIds: Tag[];
    onTagSelect: (tag: Tag) => void;
    onTagRemove: (tagId: string) => void;
};

const Tags = ({ tags, selectedTagIds, onTagSelect, onTagRemove }: TagsProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
                {tags.map(tag => {
                    const isSelected = selectedTagIds.some(t => t.id === tag.id);
                    return (
                        <span
                            key={tag.id}
                            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                                isSelected ? 'border-2 border-blue-500' : ''
                            }`}
                            style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                                border: `1px solid ${tag.color}`,
                            }}
                            onClick={() => (isSelected ? onTagRemove(tag.id) : onTagSelect(tag))}
                        >
                            {tag.name} {isSelected && '❌'}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default Tags;
