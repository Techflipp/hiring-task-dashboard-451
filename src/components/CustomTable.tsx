"use client";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

interface Column<T> {
  key: keyof T | string; // Allow both actual keys and custom strings
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T extends { id?: string; _id?: string }> {
  columns: Array<Column<T>>;
  data: T[];
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function CustomTable<T extends { id?: string; _id?: string }>({ columns, data, showActions = false, onEdit, onDelete }: TableProps<T>) {
  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (index: number) => {
    setShowMenuIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSafeReactNode = (value: unknown): React.ReactNode => {
    if (React.isValidElement(value)) return value;
    if (value === null || value === undefined) return null;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return JSON.stringify(value);
  };

  const rows = useMemo(() => {
    return data.map((item, index) => (
      <tr
        key={(item.id || item._id) as string}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        {columns.map((column) => (
          <td key={column.key.toString()} className="px-4 py-2">
            {column.render ? column.render(item) : column.key in item ? getSafeReactNode(item[column.key as keyof T]) : null}
          </td>
        ))}

        {showActions && (
          <td className="px-6 py-4 relative">
            <div onClick={() => toggleMenu(index)} className="relative">
              <HiOutlineDotsVertical className="w-[24px] h-[24px] cursor-pointer text-[#E8E8E8]" />
              {showMenuIndex === index && (
                <div
                  ref={popupRef}
                  className={`absolute z-10 w-[100px] p-2 bg-white border rounded-md flex flex-col gap-1 ${
                    index === data.length - 1 ? "-top-[70px]" : "top-6"
                  } -left-10`}
                >
                  {onEdit && (
                    <button onClick={() => onEdit((item._id || item.id) as string)} className="text-left hover:bg-gray-100 p-1">
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete((item._id || item.id) as string)} className="text-left text-red-500 hover:bg-gray-100 p-1">
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </td>
        )}
      </tr>
    ));
  }, [data, columns, showActions, showMenuIndex, onEdit, onDelete]);

  return (
    <div className="overflow-y-auto h-[500px] border border-gray-200">
      {data.length > 0 ? (
        <table className="min-w-full text-left border rounded-lg rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col.key.toString()} className="px-6 py-3 !font-normal">
                  {col.label}
                </th>
              ))}
              {showActions && <th className="px-6 py-3 !font-normal">Actions</th>}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      ) : (
        <div className="flex justify-center items-center h-[200px]">
          <p className="w-[300px] text-center">No data available</p>
        </div>
      )}
    </div>
  );
}

export default CustomTable
