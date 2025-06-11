import React from 'react';
import { Tag } from '@/lib/types';
import { Tag as TagIcon } from 'lucide-react';

interface TagListProps {
  tags: Tag[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  maxVisible = 3,
  size = 'md',
  showIcon = true,
}) => {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  const sizeConfig = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <div className="flex items-center flex-wrap gap-2">
      {showIcon && <TagIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      {visibleTags.map((tag) => (
        <span
          key={tag.id}
          className={`text-white rounded-full ${sizeConfig[size]}`}
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className={`bg-gray-200 text-gray-700 rounded-full ${sizeConfig[size]}`}
        >
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};