'use client';

import { useEffect, useState } from 'react';
import { Button } from 'antd';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  resource: {
    name: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

export default function Upcoming() {
  const [upcoming, setUpcoming] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/me');
        const now = new Date().getTime();

        const futureBookings = res.data
          .filter((b) => new Date(b.endTime).getTime() > now)
          .sort(
            (a, b) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
          );

        setUpcoming(futureBookings[0] || null);
      } catch (err) {
        console.log('Failed to fetch upcoming booking');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="upcoming-card">
      <h2 className="section-title">Upcoming Booking</h2>

      {!upcoming && !loading && (
        <div className="empty-state">
          <p>No upcoming booking scheduled.</p>

          <Button
            className="primary-btn"
            onClick={() => router.push('/dashboard/resources')}
            style={{ marginTop: '10px' }}
          >
            Book a Resource
          </Button>
        </div>
      )}

      {upcoming && (
        <div className="booking-details">
          <div className="detail-item">
            <span className="label">Resource</span>
            <span className="value">{upcoming.resource.name}</span>
          </div>

          <div className="detail-item">
            <span className="label">Date</span>
            <span className="value">
              {new Date(upcoming.startTime).toLocaleDateString()}
            </span>
          </div>

          <div className="detail-item">
            <span className="label">Time</span>
            <span className="value">
              {new Date(upcoming.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' - '}
              {new Date(upcoming.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <Button
            className="primary-btn"
            onClick={() => router.push(`/dashboard/bookings/${upcoming.id}`)}
          >
            View Booking
          </Button>
        </div>
      )}

      <style jsx>{`
        .upcoming-card {
          padding: 30px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
          margin-bottom: 28px;
          transition: all 0.3s ease;
        }

        .upcoming-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.7);
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
        }

        .empty-state {
          text-align: center;
          color: #9ca3af;
        }

        .booking-details {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .label {
          font-size: 13px;
          color: #9ca3af;
        }

        .value {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .primary-btn {
          margin-top: 18px;
          border-radius: 12px;
          height: 44px;
          font-weight: 600;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border: none;
          transition: all 0.3s ease;
        }

        .primary-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .upcoming-card {
            padding: 22px;
          }

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .primary-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
