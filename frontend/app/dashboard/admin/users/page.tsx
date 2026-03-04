'use client';

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  _count?: { bookings: number };
  bookingsCount?: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const router = useRouter();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<AdminUser[]>('/users');

      const formatted = res.data.map((u) => ({
        ...u,
        bookingsCount: u._count?.bookings ?? 0,
      }));

      setUsers(formatted);
    } catch {
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  const toggleStatus = async (id: number) => {
    await api.patch(`/users/${id}/toggle-status`);
    loadUsers();
  };

  /* Pagination Logic */
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-white mb-8">Manage Users</h1>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="py-4 px-6 text-left">ID</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Role</th>
              <th className="py-4 px-6 text-left">Bookings</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-4 px-6">{user.id}</td>

                  <td className="py-4 px-6 font-medium text-white">
                    {user.name}
                  </td>

                  <td className="py-4 px-6">{user.email}</td>

                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-md bg-white/10 text-xs">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-4 px-6">{user.bookingsCount}</td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/admin/users/${user.id}/edit`)
                        }
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/users/${user.id}/bookings`,
                          )
                        }
                        className="px-4 py-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
                      >
                        Bookings
                      </button>

                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
                      >
                        {user.isActive ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 p-6 border-t border-white/5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-30"
          >
            ‹
          </button>

          <div className="px-4 py-1 bg-blue-600 text-white rounded-md">
            {currentPage}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
