'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import api from '@/app/services/api';

const { Sider, Content } = Layout;

interface UserMeResponse {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'USER' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<UserMeResponse>('/auth/me');

        setRole(res.data.role); // ✅ set role
        setIsAuthenticated(true); // ✅ user is logged in
      } catch (error) {
        setRole(null); // ❌ no user
        setIsAuthenticated(false); // ❌ not logged in
      }
    };

    fetchUser();
  }, []);

  /* Detect screen size */
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 992);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  /* Fetch user role */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<UserMeResponse>('/auth/me');
        setRole(res.data.role);
      } catch {}
    };
    fetchUser();
  }, []);

  const adminMenu = [
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: '/dashboard',
      icon: <DashboardOutlined />,
    },
    {
      label: 'Resources',
      key: 'admin-resources',
      icon: <AppstoreOutlined />,
      children: [
        {
          label: <Link href="/dashboard/admin/resources">All Resources</Link>,
          key: '/dashboard/admin/resources',
        },
        {
          label: (
            <Link href="/dashboard/admin/resources/create">
              Create Resource
            </Link>
          ),
          key: '/dashboard/admin/resources/create',
        },
      ],
    },
    {
      label: <Link href="/dashboard/admin/bookings">Bookings</Link>,
      key: '/dashboard/admin/bookings',
      icon: <BookOutlined />,
    },
    {
      label: <Link href="/dashboard/admin/users">Users</Link>,
      key: '/dashboard/admin/users',
      icon: <UserOutlined />,
    },
    {
      label: <Link href="/auth/logout">Logout</Link>,
      key: '/auth/logout',
      icon: <LogoutOutlined />,
    },
  ];

  const userMenu = [
    {
      label: <Link href="/">Dashboard</Link>,
      key: '/dashboard',
      icon: <DashboardOutlined />,
    },
    {
      label: <Link href="/dashboard/resources">Browse</Link>,
      key: '/dashboard/resources',
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link href="/dashboard/bookings">My Bookings</Link>,
      key: '/dashboard/bookings',
      icon: <BookOutlined />,
    },
    {
      label: <Link href="/dashboard/profile">Profile</Link>,
      key: '/dashboard/profile',
      icon: <UserOutlined />,
    },
    {
      label: <Link href="/auth/logout">Logout</Link>,
      key: '/auth/logout',
      icon: <LogoutOutlined />,
    },
  ];

  const publicMenu = [
    {
      label: <Link href="/">Home</Link>,
      key: '/',
      icon: <DashboardOutlined />,
    },
    {
      label: <Link href="/auth/login">Login</Link>,
      key: '/auth/login',
      icon: <UserOutlined />,
    },
  ];

  const currentMenu = !isAuthenticated
    ? publicMenu
    : role === 'ADMIN'
      ? adminMenu
      : userMenu;

  const SidebarContent = (
    <>
      <div className="logo">
        <Link href="">CRM</Link>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={currentMenu}
        style={{ background: 'transparent', border: 'none' }}
      />
    </>
  );

  return (
    <Layout className="main-layout">
      {/* Desktop Fixed Sidebar */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(val) => setCollapsed(val)}
          width={240}
          collapsedWidth={80}
          className="sidebar"
          style={{
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            bottom: 0,
            overflow: 'auto',
          }}
        >
          {SidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          width={260}
          mask={false}
          styles={{
            body: {
              padding: 0,
              background: 'linear-gradient(180deg, #0f172a, #1e293b)',
            },
            header: {
              background: 'linear-gradient(180deg, #0f172a, #1e293b)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            },
            content: {
              background: 'linear-gradient(180deg, #0f172a, #1e293b)',
            },
          }}
          closeIcon={<span style={{ color: 'white' }}>✕</span>}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Content Layout */}
      <Layout
        className="content-layout"
        style={{
          marginLeft: !isMobile ? (collapsed ? 80 : 240) : 0,
          transition: 'all 0.2s ease',
        }}
      >
        {isMobile && (
          <div className="mobile-header">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileOpen(true)}
            />
            <Link className="mobile-title cursor-pointer " href="/">
              CRM
            </Link>
          </div>
        )}

        <Content className="content-area">{children}</Content>
      </Layout>

      <style jsx global>{`
        .main-layout {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a, #111827);
        }

        .sidebar {
          background: linear-gradient(180deg, #0f172a, #1e293b);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 1px;
        }

        .content-layout {
          background: transparent;
          min-height: 100vh;
        }

        .content-area {
          margin: 24px;
          padding: 28px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          color: white;
          overflow-y: auto;
          min-height: calc(100vh - 48px);
        }

        .mobile-header {
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          color: white;
        }

        .mobile-title {
          font-size: 18px;
          font-weight: 600;
          margin-left: 12px;
        }

        .ant-menu-item-selected {
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.4),
            rgba(99, 102, 241, 0.4)
          ) !important;
          border-radius: 8px;
        }

        .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-radius: 8px;
        }
      `}</style>
    </Layout>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { Layout, Menu, Drawer, Button } from 'antd';
// import {
//   DashboardOutlined,
//   AppstoreOutlined,
//   BookOutlined,
//   UserOutlined,
//   LogoutOutlined,
//   MenuOutlined,
// } from '@ant-design/icons';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';

// const { Sider, Content } = Layout;

// export default function AppLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // ✅ DERIVED AUTH (NO STATE, NO WARNING)
//   const token =
//     typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   const isAuthenticated = !!token;

//   // ✅ MOBILE CHECK
//   useEffect(() => {
//     const checkScreen = () => setIsMobile(window.innerWidth < 992);
//     checkScreen();
//     window.addEventListener('resize', checkScreen);
//     return () => window.removeEventListener('resize', checkScreen);
//   }, []);

//   // ❌ NOT LOGGED IN → NO SIDEBAR
//   if (!isAuthenticated) {
//     return <>{children}</>;
//   }

//   // ✅ MENU ITEMS
//   const menuItems = [
//     {
//       label: <Link href="/dashboard">Dashboard</Link>,
//       key: '/dashboard',
//       icon: <DashboardOutlined />,
//     },
//     {
//       label: <Link href="/dashboard/resources">Browse</Link>,
//       key: '/dashboard/resources',
//       icon: <AppstoreOutlined />,
//     },
//     {
//       label: <Link href="/dashboard/bookings">My Bookings</Link>,
//       key: '/dashboard/bookings',
//       icon: <BookOutlined />,
//     },
//     {
//       label: <Link href="/dashboard/profile">Profile</Link>,
//       key: '/dashboard/profile',
//       icon: <UserOutlined />,
//     },
//     {
//       label: (
//         <span
//           onClick={() => {
//             localStorage.removeItem('token');
//             router.push('/');
//           }}
//           style={{ cursor: 'pointer' }}
//         >
//           Logout
//         </span>
//       ),
//       key: '/logout',
//       icon: <LogoutOutlined />,
//     },
//   ];

//   const SidebarContent = (
//     <>
//       <div className="logo">
//         <Link href="/">CRM</Link>
//       </div>

//       <Menu
//         theme="dark"
//         mode="inline"
//         selectedKeys={[pathname]}
//         items={menuItems}
//         style={{ background: 'transparent', border: 'none' }}
//       />
//     </>
//   );

//   return (
//     <Layout className="main-layout">
//       {/* Desktop Sidebar */}
//       {!isMobile && (
//         <Sider
//           collapsible
//           collapsed={collapsed}
//           onCollapse={(val) => setCollapsed(val)}
//           width={240}
//           collapsedWidth={80}
//           className="sidebar"
//         >
//           {SidebarContent}
//         </Sider>
//       )}

//       {/* Mobile Drawer */}
//       {isMobile && (
//         <Drawer
//           placement="left"
//           open={mobileOpen}
//           onClose={() => setMobileOpen(false)}
//           width={260}
//         >
//           {SidebarContent}
//         </Drawer>
//       )}

//       {/* Content */}
//       <Layout
//         style={{
//           marginLeft: !isMobile ? (collapsed ? 80 : 240) : 0,
//           transition: 'all 0.2s ease',
//         }}
//       >
//         {isMobile && (
//           <div className="mobile-header">
//             <Button
//               type="text"
//               icon={<MenuOutlined />}
//               onClick={() => setMobileOpen(true)}
//             />
//             <Link href="/" className="mobile-title">
//               CRM
//             </Link>
//           </div>
//         )}

//         <Content className="content-area">{children}</Content>
//       </Layout>

//       {/* GLOBAL STYLES */}
//       <style jsx global>{`
//         .main-layout {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #0f172a, #111827);
//         }

//         .sidebar {
//           background: linear-gradient(180deg, #0f172a, #1e293b);
//         }

//         .logo {
//           height: 70px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 700;
//           font-size: 20px;
//         }

//         .content-area {
//           margin: 24px;
//           padding: 28px;
//           border-radius: 16px;
//           background: rgba(255, 255, 255, 0.05);
//           color: white;
//           min-height: calc(100vh - 48px);
//         }

//         .mobile-header {
//           height: 60px;
//           display: flex;
//           align-items: center;
//           padding: 0 16px;
//           color: white;
//         }

//         .mobile-title {
//           font-size: 18px;
//           font-weight: 600;
//           margin-left: 12px;
//         }
//       `}</style>
//     </Layout>
//   );
// }
