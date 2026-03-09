'use client';

import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="hero-wrapper">
      <div className="hero-card">
        <h1 className="hero-title">
          Welcome to <span>Campus Resource Management</span>
        </h1>

        <p className="hero-text">
          Browse resources, check availability, and manage your bookings — all
          inside one powerful dashboard.
        </p>

        <Link href="/dashboard/resources">
          <Button size="large" icon={<SearchOutlined />} className="hero-btn">
            Browse Resources
          </Button>
        </Link>
      </div>

      <style jsx>{`
        .hero-wrapper {
          margin-bottom: 32px;
        }

        .hero-card {
          position: relative;
          padding: 50px 40px;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.12),
            rgba(99, 102, 241, 0.12)
          );
          backdrop-filter: blur(30px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .hero-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
        }

        .hero-title {
          font-size: 34px;
          font-weight: 800;
          color: white;
          margin-bottom: 14px;
          line-height: 1.2;
        }

        .hero-title span {
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-text {
          font-size: 16px;
          color: #9ca3af;
          margin-bottom: 26px;
          max-width: 600px;
        }

        .hero-btn {
          border-radius: 12px;
          height: 48px;
          padding: 0 26px;
          font-weight: 600;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border: none;
          transition: all 0.3s ease;
        }

        .hero-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hero-card {
            padding: 32px 22px;
          }

          .hero-title {
            font-size: 24px;
            text-align: center;
          }

          .hero-text {
            font-size: 14px;
            text-align: center;
          }

          .hero-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
