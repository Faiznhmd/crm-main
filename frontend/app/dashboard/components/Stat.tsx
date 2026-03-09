'use client';

import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import api from '@/app/services/api';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

interface Booking {
  id: number;
  status: string;
}

export default function Stats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/me');

        const bookings = res.data;

        const total = bookings.length;
        const active = bookings.filter(
          (b) =>
            b.status === 'APPROVED' ||
            b.status === 'PENDING' ||
            b.status === 'IN_PROGRESS',
        ).length;

        const cancelled = bookings.filter(
          (b) => b.status === 'CANCELLED' || b.status === 'REJECTED',
        ).length;

        setStats({ total, active, cancelled });
      } catch (err) {
        console.log('Failed to load stats');
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: 'Total Bookings',
      value: stats.total,
      icon: <CheckCircleOutlined />,
      gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    },
    {
      label: 'Active Bookings',
      value: stats.active,
      icon: <ClockCircleOutlined />,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    },
    {
      label: 'Cancelled / Rejected',
      value: stats.cancelled,
      icon: <CloseCircleOutlined />,
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    },
  ];

  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 28 }}>
      {statItems.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={8}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: item.gradient }}>
              {item.icon}
            </div>

            <div className="stat-content">
              <p className="stat-label">{item.label}</p>
              <h2 className="stat-value">{item.value}</h2>
            </div>
          </div>
        </Col>
      ))}

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
        .stat-card {
          position: relative;
          padding: 26px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          gap: 18px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 35px 80px rgba(0, 0, 0, 0.7);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .stat-card {
            padding: 20px;
          }

          .stat-value {
            font-size: 24px;
          }
        }
      `}</style>
    </Row>
  );
}
