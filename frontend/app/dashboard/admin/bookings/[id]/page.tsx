'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/services/api';

interface BookingDetails {
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
    location?: string | null;
  };
}

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await api.get<BookingDetails>(`/bookings/${id}`);
      setBooking(res.data);
    } catch {
      alert('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    await api.patch(`/bookings/${id}/approve`);
    fetchBooking();
  };

  const reject = async () => {
    await api.patch(`/bookings/${id}/reject`);
    fetchBooking();
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  if (!booking) return <div className="p-8 text-white">Booking not found.</div>;

  const statusStyle =
    booking.status === 'PENDING'
      ? 'bg-yellow-500/20 text-yellow-400'
      : booking.status === 'APPROVED'
        ? 'bg-green-500/20 text-green-400'
        : booking.status === 'REJECTED'
          ? 'bg-red-500/20 text-red-400'
          : 'bg-blue-500/20 text-blue-400';

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">
          Booking Details
        </h1>

        {/* Main Glass Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Booking Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Booking Info</h2>

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusStyle}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="space-y-2 text-gray-300 text-sm">
              <p>
                <span className="text-gray-400">Booking ID:</span> {booking.id}
              </p>
              <p>
                <span className="text-gray-400">Start:</span>{' '}
                {new Date(booking.startTime).toLocaleString()}
              </p>
              <p>
                <span className="text-gray-400">End:</span>{' '}
                {new Date(booking.endTime).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* User Info */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              User Information
            </h2>

            <div className="space-y-2 text-gray-300 text-sm">
              <p>
                <span className="text-gray-400">Name:</span> {booking.user.name}
              </p>
              <p>
                <span className="text-gray-400">Email:</span>{' '}
                {booking.user.email}
              </p>
              <p>
                <span className="text-gray-400">User ID:</span>{' '}
                {booking.user.id}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Resource Info */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Resource Information
            </h2>

            <div className="space-y-2 text-gray-300 text-sm">
              <p>
                <span className="text-gray-400">Name:</span>{' '}
                {booking.resource.name}
              </p>
              <p>
                <span className="text-gray-400">Type:</span>{' '}
                {booking.resource.type}
              </p>
              <p>
                <span className="text-gray-400">Resource ID:</span>{' '}
                {booking.resource.id}
              </p>
              <p>
                <span className="text-gray-400">Location:</span>{' '}
                {booking.resource.location || 'N/A'}
              </p>
            </div>
          </div>

          {/* Actions */}
          {booking.status === 'PENDING' && (
            <>
              <div className="border-t border-white/10 pt-6 flex gap-4">
                <button
                  onClick={approve}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  Approve
                </button>

                <button
                  onClick={reject}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
