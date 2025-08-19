interface LoadingStateProps {
  isGroupedMode: boolean;
}

/**
 * Компонент для отображения состояния загрузки
 */
export default function LoadingState({ isGroupedMode }: LoadingStateProps) {
  return (
    <div className="mt-6">
      {/* Loading Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <h3 className="text-lg font-medium text-gray-900">
            {isGroupedMode
              ? "Loading CBBC Matrix Data..."
              : "Loading CBBC Data..."}
          </h3>
        </div>
        <p className="text-center text-gray-600 mb-4">
          This may take a few moments as we&apos;re processing a large amount of
          data
        </p>
        <div className="flex justify-center space-x-2">
          <div className="animate-pulse bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Fetching data...
          </div>
          {isGroupedMode && (
            <>
              <div className="animate-pulse bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Processing matrix...
              </div>
              <div className="animate-pulse bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Building table...
              </div>
            </>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isGroupedMode ? (
        <GroupedLoadingSkeleton />
      ) : (
        <SingleDateLoadingSkeleton />
      )}
    </div>
  );
}

function SingleDateLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(10)].map((_, i) => (
                <th key={i} className="px-6 py-3 text-left">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {[...Array(10)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupedLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="flex-1 h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center space-x-2">
          <div className="animate-bounce inline-block mr-2">⏳</div>
          <span>Loading progress</span>
          <span>Please wait...</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          <div className="animate-bounce inline-block mr-2">⏳</div>
          Data is being prepared for display
        </div>
      </div>
    </div>
  );
}
