'use client';

import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import api from '@/app/services/api';

interface Booking {
  id: number;
  resource: { name: string };
  startTime: string;
  endTime: string;
  status: string;
}

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/me');

        const sorted = res.data
          .sort(
            (a, b) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
          )
          .slice(0, 5);

        setBookings(sorted);
      } catch (err) {
        console.log('Failed to load recent bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const columns = [
    {
      title: 'Resource',
      dataIndex: ['resource', 'name'],
      key: 'resource',
    },
    {
      title: 'Date',
      render: (record: Booking) =>
        new Date(record.startTime).toLocaleDateString(),
    },
    {
      title: 'Time',
      render: (record: Booking) => {
        const start = new Date(record.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = new Date(record.endTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Status',
      render: (record: Booking) => {
        const color =
          record.status === 'APPROVED'
            ? '#22c55e'
            : record.status === 'PENDING'
              ? '#f59e0b'
              : '#ef4444';

        return (
          <Tag
            style={{
              background: 'transparent',
              border: `1px solid ${color}`,
              color,
              fontWeight: 600,
              borderRadius: 8,
              padding: '2px 10px',
            }}
          >
            {record.status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="recent-card">
      <h2 className="section-title">Recent Bookings</h2>

      {!isMobile && (
        <Table
          columns={columns}
          dataSource={bookings}
          pagination={false}
          rowKey="id"
          loading={loading}
          className="dark-table"
        />
      )}

      {isMobile && (
        <div className="mobile-bookings">
          {bookings.map((b) => {
            const color =
              b.status === 'APPROVED'
                ? '#22c55e'
                : b.status === 'PENDING'
                  ? '#f59e0b'
                  : '#ef4444';

            return (
              <div key={b.id} className="mobile-card">
                <p className="m-title">{b.resource.name}</p>

                <p className="m-text">
                  {new Date(b.startTime).toLocaleDateString()}
                </p>

                <p className="m-text">
                  {new Date(b.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {new Date(b.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                <span
                  className="mobile-status"
                  style={{
                    borderColor: color,
                    color,
                  }}
                >
                  {b.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        /* Remove white loader background */
        :global(.dark-table .ant-table-placeholder) {
          background: transparent !important;
        }

        :global(.dark-table .ant-empty-description) {
          color: #9ca3af;
        }

        :global(.dark-table .ant-spin-container::after) {
          background: transparent !important;
        }
        .recent-card {
          padding: 28px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
          margin-bottom: 28px;
        }

        .section-title {
          color: white;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        /* TABLE DARK THEME */
        :global(.dark-table .ant-table) {
          background: transparent;
          color: white;
        }

        :global(.dark-table .ant-table-thead > tr > th) {
          background: transparent;
          color: #9ca3af;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        :global(.dark-table .ant-table-tbody > tr > td) {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* REMOVE WHITE HOVER */
        :global(.dark-table .ant-table-tbody > tr:hover > td) {
          background: rgba(255, 255, 255, 0.04) !important;
        }

        /* MOBILE */

        .mobile-bookings {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-card {
          padding: 18px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
        }

        .mobile-card:hover {
          transform: translateY(-4px);
        }

        .m-title {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 6px;
        }

        .m-text {
          font-size: 14px;
          color: #9ca3af;
          margin: 2px 0;
        }

        .mobile-status {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 12px;
          border: 1px solid;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
