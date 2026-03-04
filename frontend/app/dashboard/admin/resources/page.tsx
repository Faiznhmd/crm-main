'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/app/services/api';

type Booking = {
  id: number;
  userId: number;
  resourceId: number;
  startTime: string;
  endTime: string;
  status: string;
};

type Resource = {
  id: number;
  name: string;
  description?: string;
  status: string;
  bookings?: Booking[];
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Resource[]>('/resources/admin');
        setResources(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalPages = Math.ceil(resources.length / pageSize);
  const paginated = resources.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-white">All Resources</h1>
          <p className="text-gray-400 mt-1">Manage all system resources</p>
        </div>

        {/* Glass Card Container */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* HEADER */}
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-5 px-8 text-left">Name</th>
                  <th className="py-5 px-8 text-left">Description</th>
                  <th className="py-5 px-8 text-left">Bookings</th>
                  <th className="py-5 px-8 text-left">Status</th>
                  <th className="py-5 px-8 text-left">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {paginated.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-white/5 hover:bg-white/5 transition duration-200"
                  >
                    <td className="py-6 px-8 text-white font-medium">
                      {r.name}
                    </td>

                    <td className="py-6 px-8 text-gray-300">
                      {r.description || 'No description'}
                    </td>

                    <td className="py-6 px-8 text-gray-300">
                      {r.bookings?.length || 0}
                    </td>

                    <td className="py-6 px-8">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
                          r.status === 'MAINTENANCE'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : r.status === 'BOOKED'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-6 px-8">
                      <div className="flex gap-3">
                        <Link
                          href={`/dashboard/admin/resources/${r.id}`}
                          className="text-blue-400 hover:text-blue-300 font-medium transition"
                        >
                          View
                        </Link>

                        <Link
                          href={`/dashboard/admin/resources/${r.id}/edit`}
                          className="text-gray-300 hover:text-white font-medium transition"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-5 border-t border-white/10">
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                const active = n === page;

                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
