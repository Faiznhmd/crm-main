'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/services/api';

type AdminUserDetails = {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  isActive: boolean;
};

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'STUDENT' as 'STUDENT' | 'STAFF' | 'ADMIN',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      const res = await api.get<AdminUserDetails>(`/users/${id}`);
      setForm({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      });
    };

    loadUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch(`/users/${id}`, form);
      router.push('/dashboard/admin/users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-white">Edit User</h1>

          <button
            onClick={() => router.push(`/dashboard/admin/users/${id}/bookings`)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            View Bookings
          </button>
        </div>

        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="STUDENT" className="bg-[#1f2937] text-white">
                  STUDENT
                </option>
                <option value="STAFF" className="bg-[#1f2937] text-white">
                  STAFF
                </option>
                <option value="ADMIN" className="bg-[#1f2937] text-white">
                  ADMIN
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
