import React from 'react';
import { Card, Typography, Divider } from 'antd';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

interface GenericCardWrapperProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  className?: string;
  loading?: boolean;
}

const GenericCardWrapper: React.FC<GenericCardWrapperProps> = ({
  title,
  subtitle,
  children,
  footer,
  width = 500,
  className = '',
  loading = false
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'auto'
    }}>
      <Card
        style={{ 
          width: width, 
          boxShadow: '0 3px 3px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px'
        }}
        className={className}
        loading={loading}
      >
        {/* Header Section with Logo and Title */}
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            {title && (
              <Title level={3} style={{ margin: 0, marginBottom: '8px' }}>
                {title}
              </Title>
            )}
            {subtitle && (
              <Text type="secondary" style={{ fontSize: '15px' }}>
                {subtitle}
              </Text>
            )}
          </div>
        )}

        {/* Main Content */}
        <div style={{ marginBottom: footer ? '24px' : 0 }}>
          {children}
        </div>

        {/* Footer Section */}
        {footer && (
          <>
            <Divider style={{ margin: '24px 0' }} />
            <div style={{ textAlign: 'center' }}>
              {footer}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default GenericCardWrapper;