'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { useRouter } from 'next/navigation';
import api from '@/app/services/api';

interface Resource {
  id: number;
  name: string;
  status: string;
}

export default function Recommended() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get<Resource[]>('/resources');
        setResources(res.data.slice(0, 3));
      } catch (err) {
        console.log('Failed to fetch resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const statusColor = (s: string) =>
    s === 'AVAILABLE' ? '#22c55e' : s === 'MAINTENANCE' ? '#ef4444' : '#f59e0b';

  return (
    <div className="recommended-wrapper">
      <h2 className="section-title">Top Resources</h2>

      <Row gutter={[24, 24]}>
        {resources.map((item) => {
          const color = statusColor(item.status);

          return (
            <Col key={item.id} xs={24} sm={12} md={8}>
              <div className="resource-card">
                <div className="card-content">
                  <h3 className="resource-title">{item.name}</h3>

                  <span
                    className="status-badge"
                    style={{
                      borderColor: color,
                      color,
                      // paddingBottom: '10px',
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <Button
                  size="middle"
                  disabled={item.status !== 'AVAILABLE'}
                  className="resource-btn"
                  onClick={() => router.push(`/dashboard/resources/${item.id}`)}
                  style={{ marginTop: '15px' }}
                >
                  Book Now
                </Button>
              </div>
            </Col>
          );
        })}
      </Row>

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
        .recommended-wrapper {
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
          margin-bottom: 24px;
        }

        .resource-card {
          height: 100%;
          padding: 26px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .resource-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
        }

        .card-content {
          text-align: center;
        }

        .resource-title {
          color: white;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border: 1px solid;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          background: transparent;
        }

        .resource-btn {
          margin-top: 22px;
          border-radius: 12px;
          height: 42px;
          font-weight: 600;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border: none;
          transition: all 0.3s ease;
        }

        .resource-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .recommended-wrapper {
            padding: 22px;
          }

          .resource-card {
            padding: 22px;
          }

          .resource-title {
            font-size: 15px;
          }

          .resource-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
