import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Drawer, Dropdown, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setDrawerVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/task-management',
      icon: <UserOutlined />,
      label: 'Task Management',
    },
  ];

  // Dropdown menu items for user
  const userMenuItems = [
 
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
        navigate('/auth/login');
      },
    },
  ];

  // Get current selected key based on location
  const getSelectedKey = () => {
    const path = location.pathname;
    return menuItems.find(item => path.startsWith(item.key))?.key || '/task-management';
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const menuContent = (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      items={menuItems}
      onClick={handleMenuClick}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="demo-logo-vertical" style={{ height: 32, margin: 16 }} />
          {menuContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
          width={250}
        >
          <div className="demo-logo-vertical" style={{ height: 32, margin: 16 }} />
          {menuContent}
        </Drawer>
      )}

      <Layout 
        style={{ 
          marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header 
          style={{ 
            padding: 0, 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            )}
            <h2 style={{ margin: 0, color: '#1890ff', fontSize: isMobile ? '18px' : '20px' }}>
              Task Management
            </h2>
          </div>
          
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Avatar 
              style={{ 
                backgroundColor: '#1890ff',
                cursor: 'pointer',
                marginRight: '16px'
              }}
              size={32}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </Dropdown>
        </Header>
        
        <Content
          style={{
            margin: isMobile ? '16px 8px' : '24px 16px',
            padding: isMobile ? 16 : 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;