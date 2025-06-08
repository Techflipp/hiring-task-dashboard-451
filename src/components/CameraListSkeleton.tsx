export function CameraListSkeleton() {
    return (
      <div className="w-full">
        <table className="w-full border-collapse animate-pulse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div></th>
              <th className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div></th>
              <th className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b dark:border-gray-600">
                <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div></td>
                <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div></td>
                <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }