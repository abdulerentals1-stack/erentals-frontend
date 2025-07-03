// components/admin/ProductTable.jsx
'use client';

import { Pencil, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductTable({ columns = [], data = [], onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
        <thead className="bg-gray-100 dark:bg-zinc-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-zinc-200 uppercase"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-zinc-200 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
          {data.map((item) => (
            <tr key={item._id}>
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-3 text-sm text-gray-900 dark:text-zinc-100">
                  {item[col.accessor]}
                </td>
              ))}
              <td className="px-4 py-3 flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onView(item)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
