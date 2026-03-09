'use client';

export default function PageWrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="wrapper">
      {title && (
        <div className="header">
          <div className="header-text">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="divider" />
        </div>
      )}

      <div className="content">{children}</div>

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
        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 36px;
          width: 100%;
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .header-text h1 {
          font-size: 30px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, #ffffff, #9ca3af);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-text p {
          color: #9ca3af;
          margin-top: 8px;
          font-size: 15px;
          max-width: 600px;
        }

        .divider {
          height: 1px;
          width: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(99, 102, 241, 0.5),
            transparent
          );
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Tablet */
        @media (max-width: 992px) {
          .header-text h1 {
            font-size: 26px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .wrapper {
            gap: 28px;
          }

          .header-text h1 {
            font-size: 22px;
          }

          .header-text p {
            font-size: 14px;
          }

          .content {
            gap: 22px;
          }
        }
      `}</style>
    </div>
  );
}
