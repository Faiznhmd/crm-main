'use client';

import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import api from '../../services/api';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';

interface ResourceInfo {
  id: number;
  name: string;
}

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  resource: ResourceInfo;
}

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get<Booking[]>('/bookings/me');
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* 🔥 Premium Status Styling */
  const getStatusStyle = (status: Booking['status']) => {
    if (status === 'APPROVED' || status === 'COMPLETED') {
      return {
        color: '#22c55e',
        background: 'rgba(34,197,94,0.12)',
        // border: '1px solid rgba(34,197,94,0.6)',
        boxShadow: '0 0 10px rgba(34,197,94,0.3)',
      };
    }

    if (status === 'PENDING') {
      return {
        color: '#f59e0b',
        background: 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.6)',
        boxShadow: '0 0 10px rgba(245,158,11,0.3)',
      };
    }

    return {
      color: '#ef4444',
      background: 'rgba(239,68,68,0.12)',
      border: '1px solid rgba(239,68,68,0.6)',
      boxShadow: '0 0 10px rgba(239,68,68,0.3)',
    };
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Resource',
      render: (_, record) => (
        <span className="resource-name">{record.resource.name}</span>
      ),
    },
    {
      title: 'Start Time',
      render: (_, record) => new Date(record.startTime).toLocaleString(),
    },
    {
      title: 'End Time',
      render: (_, record) => new Date(record.endTime).toLocaleString(),
    },
    {
      title: 'Status',
      render: (_, record) => (
        <span className="status-pill" style={getStatusStyle(record.status)}>
          {record.status}
        </span>
      ),
    },
    {
      title: 'Booked On',
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button
          className="action-btn"
          onClick={() =>
            router.push(`/dashboard/resources/${record.resource.id}`)
          }
        >
          Continue
        </Button>
      ),
    },
  ];

  return (
    <div className="bookings-wrapper">
      <div className="header">
        <div>
          <h2 className="title">My Bookings</h2>
          <p className="subtitle">Manage and continue your bookings</p>
        </div>

        <Button
          className="action-btn"
          onClick={() => router.push('/dashboard/resources')}
        >
          All Resources
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={bookings}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
        className="dark-table"
      />

      <style jsx>{`
        /* FIX WHITE LOADER */
        :global(.dark-table .ant-table-placeholder) {
          background: transparent !important;
        }

        :global(.dark-table .ant-spin-container::after) {
          background: transparent !important;
        }

        :global(.dark-table .ant-empty-description) {
          color: #9ca3af;
        }

        :global(.dark-table .ant-table-cell) {
          background: transparent !important;
        }
        .bookings-wrapper {
          padding: 32px;
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.06),
            rgba(255, 255, 255, 0.03)
          );
          backdrop-filter: blur(30px);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
          color: white;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .subtitle {
          color: #9ca3af;
          font-size: 14px;
        }

        .resource-name {
          font-weight: 600;
          color: white;
        }

        .status-pill {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .action-btn {
          border-radius: 10px;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border: none;
          color: white;
          font-weight: 600;
          transition: 0.3s ease;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
        }

        /* TABLE STYLING */

        :global(.dark-table .ant-table) {
          background: transparent;
          color: white;
        }

        :global(.dark-table .ant-table-thead > tr > th) {
          background: transparent;
          color: #9ca3af;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        :global(.dark-table .ant-table-tbody > tr > td) {
          background: transparent;
          padding: 18px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          transition: 0.2s ease;
        }

        :global(.dark-table .ant-table-tbody > tr:hover > td) {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        /* PAGINATION */

        :global(.ant-pagination-item) {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          border-radius: 8px;
        }

        :global(.ant-pagination-item-active) {
          // background: linear-gradient(90deg, #3b82f6, #6366f1);
        }

        :global(.ant-pagination-item a) {
          color: white;
        }
      `}</style>
    </div>
  );
}
