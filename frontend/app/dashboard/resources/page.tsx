'use client';

import { useEffect, useState, useCallback } from 'react';
import { Table, Button } from 'antd';
import api from '../../services/api';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';

interface Resource {
  id: number;
  name: string;
  description: string;
  quantity: number;
  status: string;
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<Resource[]>('/resources/with-status');
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const columns: ColumnsType<Resource> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Status',
      render: (_, record) => {
        const color =
          record.status === 'AVAILABLE'
            ? '#22c55e'
            : record.status === 'BOOKED'
              ? '#ef4444'
              : '#f59e0b';

        return (
          <span
            style={{
              border: `1px solid ${color}`,
              color,
              padding: '4px 12px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {record.status}
          </span>
        );
      },
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button
          className="resource-btn"
          onClick={() => router.push(`/dashboard/resources/${record.id}`)}
        >
          View / Book
        </Button>
      ),
    },
  ];

  return (
    <div className="resources-wrapper">
      <h2 className="section-title">All Resources</h2>

      {!isMobile && (
        <Table
          rowKey="id"
          dataSource={resources}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
          className="dark-table"
        />
      )}

      {isMobile && (
        <div className="mobile-resource-list">
          {resources.map((r) => {
            const color =
              r.status === 'AVAILABLE'
                ? '#22c55e'
                : r.status === 'BOOKED'
                  ? '#ef4444'
                  : '#f59e0b';

            return (
              <div key={r.id} className="resource-mobile-card">
                <h3 className="m-title">{r.name}</h3>

                <p className="m-text">{r.description}</p>

                <p className="m-text">Qty: {r.quantity}</p>

                <span
                  className="mobile-status"
                  style={{ borderColor: color, color }}
                >
                  {r.status}
                </span>

                <Button
                  className="resource-btn"
                  block
                  onClick={() => router.push(`/dashboard/resources/${r.id}`)}
                >
                  View / Book
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .resources-wrapper {
          padding: 28px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
        }

        .section-title {
          color: white;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .resource-btn {
          border-radius: 10px;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border: none;
          font-weight: 600;
          transition: 0.3s ease;
        }

        .resource-btn:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        /* TABLE DARK */
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

        :global(.dark-table .ant-table-tbody > tr:hover > td) {
          background: rgba(255, 255, 255, 0.04) !important;
        }

        /* Mobile */
        .mobile-resource-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .resource-mobile-card {
          padding: 18px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .m-title {
          color: white;
          font-size: 16px;
          font-weight: 600;
        }

        .m-text {
          color: #9ca3af;
          font-size: 14px;
        }

        .mobile-status {
          display: inline-block;
          margin: 8px 0;
          padding: 4px 12px;
          border: 1px solid;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ResourcesPage;
