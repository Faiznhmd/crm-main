'use client';

import { Collapse } from 'antd';

const { Panel } = Collapse;

export default function FAQ() {
  return (
    <div className="faq-card">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <Collapse
        accordion
        bordered={false}
        expandIconPosition="end"
        className="faq-collapse"
      >
        <Panel header="How do I book a resource?" key="1">
          Go to Browse Resources → Select → Pick a time slot → Book.
        </Panel>

        <Panel header="Can I cancel a booking?" key="2">
          Yes, go to My Bookings → Cancel.
        </Panel>

        <Panel header="Why was my booking rejected?" key="3">
          Resource may be unavailable or under maintenance.
        </Panel>
      </Collapse>

      <style jsx>{`
        .faq-card {
          padding: 30px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          margin-bottom: 50px;
          transition: all 0.3s ease;
        }

        .faq-card:hover {
          transform: translateY(-4px);
        }

        .faq-title {
          color: white;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        :global(.faq-collapse) {
          background: transparent;
        }

        :global(.ant-collapse-item) {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px !important;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        :global(.ant-collapse-header) {
          color: white !important;
          font-weight: 500;
        }

        :global(.ant-collapse-content) {
          background: transparent;
          color: #9ca3af;
        }

        :global(.ant-collapse-content-box) {
          padding: 16px 20px;
        }

        :global(.ant-collapse-expand-icon) {
          color: #6366f1 !important;
        }
      `}</style>
    </div>
  );
}
