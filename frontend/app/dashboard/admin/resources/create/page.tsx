'use client';

import { useState } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function CreateResourcePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    type: '',
    location: '',
    description: '',
    status: 'AVAILABLE',
    maxDuration: '',
    requiresApproval: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm({ ...form, [name]: target.checked });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        maxDuration: form.maxDuration ? Number(form.maxDuration) : null,
      };

      await api.post('/resources', payload);

      router.push('/dashboard/admin/resources');
    } catch {
      alert('Resource creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Create New Resource
          </h1>
          <p className="text-gray-400 mt-1">Add a new resource to the system</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Type *</label>
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                placeholder="EQUIPMENT / LAB / ROOM"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition appearance-none"
              >
                <option value="AVAILABLE" className="bg-[#1f2937] text-white">
                  AVAILABLE
                </option>
                <option value="BOOKED" className="bg-[#1f2937] text-white">
                  BOOKED
                </option>
                <option value="MAINTENANCE" className="bg-[#1f2937] text-white">
                  MAINTENANCE
                </option>
              </select>
            </div>

            {/* Max Duration */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Max Duration (Hours)
              </label>
              <input
                type="number"
                name="maxDuration"
                value={form.maxDuration}
                onChange={handleChange}
                min="1"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* Requires Approval */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="requiresApproval"
                checked={form.requiresApproval}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600"
              />
              <label className="text-gray-300 text-sm">Requires Approval</label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-60"
              >
                {loading ? 'Creating...' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
