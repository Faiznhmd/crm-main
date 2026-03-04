'use client';

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  status: string;
  startTime: string;
  endTime: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  resource: {
    id: number;
    name: string;
    type: string;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  >('PENDING');

  const router = useRouter();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get<Booking[]>('/bookings');
      setBookings(res.data);
    } catch {
      console.log('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const approveBooking = async (id: number) => {
    await api.patch(`/bookings/${id}/approve`);
    loadBookings();
  };

  const rejectBooking = async (id: number) => {
    await api.patch(`/bookings/${id}/reject`);
    loadBookings();
  };

  const filteredBookings =
    activeTab === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Booking Management
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-6">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'ALL'
                ? 'All Bookings'
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-6 text-white">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="py-5 px-8 text-left">ID</th>
                    <th className="py-5 px-8 text-left">User</th>
                    <th className="py-5 px-8 text-left">Resource</th>
                    <th className="py-5 px-8 text-left">Time</th>
                    <th className="py-5 px-8 text-left">Status</th>
                    <th className="py-5 px-8 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/admin/bookings/${b.id}`)
                      }
                    >
                      <td className="py-6 px-8 text-white">{b.id}</td>

                      <td className="py-6 px-8">
                        <div className="text-white font-medium">
                          {b.user.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {b.user.email}
                        </div>
                      </td>

                      <td className="py-6 px-8">
                        <div className="text-white font-medium">
                          {b.resource.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {b.resource.type}
                        </div>
                      </td>

                      <td className="py-6 px-8 text-gray-300 text-sm">
                        {new Date(b.startTime).toLocaleString()}
                        <br /> → {new Date(b.endTime).toLocaleString()}
                      </td>

                      <td className="py-6 px-8">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                            b.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : b.status === 'APPROVED'
                                ? 'bg-green-500/20 text-green-400'
                                : b.status === 'REJECTED'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td
                        className="py-6 px-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {b.status === 'PENDING' && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => approveBooking(b.id)}
                              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectBooking(b.id)}
                              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
