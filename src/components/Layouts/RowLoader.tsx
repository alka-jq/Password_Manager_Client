import React from 'react';

const RowLoader: React.FC<{ rows?: number; colSpan?: number }> = ({
  rows = 5,
  colSpan = 6,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          <td colSpan={colSpan}>
            <div className="animate-pulse w-full h-6 bg-gray-200 dark:bg-gray-700 rounded my-2" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default RowLoader;
