import { Tag } from "@/types/camera";

function TagsCard({ tags }: { tags: Tag[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                border: `1px solid ${tag.color}`,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TagsCard;
