import React from 'react';
import { Card, Button, Tag, Dropdown } from 'antd';
import { MoreOutlined, CalendarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskMapped } from '../../../types/task';


interface TaskCardProps {
  task: TaskMapped;
  onEdit: (task: TaskMapped) => void;
  onDelete: (id: string, title: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'default';
      case 'in-progress': return 'processing';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => onEdit(task),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
          onClick: () => onDelete(task.id, task.title),
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Stop propagation for dropdown to prevent drag interference
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDropdownMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      ref={setNodeRef}
      style={{
        ...style,
        marginBottom: '10px',
        border: isDragging ? '2px solid #1890ff' : '1px solid #e8e8e8',
        boxShadow: isDragging 
          ? '0 12px 24px rgba(24, 144, 255, 0.25)' 
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '8px',
        background: '#ffffff',
      }}
      size="small"
      hoverable={!isDragging}
      bodyStyle={{ padding: '12px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div 
          {...attributes}
          {...listeners}
          style={{ flex: 1, cursor: 'grab', userSelect: 'none' }}
        >
          <div style={{ 
            fontWeight: 600, 
            marginBottom: '6px', 
            fontSize: '14px',
            color: '#262626',
            lineHeight: '1.4'
          }}>
            {task.title}
          </div>
          {task.description && (
            <div style={{ 
              color: '#8c8c8c', 
              fontSize: '12px', 
              marginBottom: '10px',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {task.description}
            </div>
          )}
        </div>
        <div 
          onClick={handleDropdownClick} 
          onMouseDown={handleDropdownMouseDown}
          style={{ 
            pointerEvents: 'auto', 
            zIndex: 10,
            marginTop: '-4px',
            marginRight: '-4px'
          }}
        >
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button 
              type="text" 
              size="small" 
              icon={<MoreOutlined />}
              style={{ 
                color: '#8c8c8c',
                padding: '2px 6px'
              }}
            />
          </Dropdown>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: task.description ? '0' : '8px'
      }}>
        <Tag 
          color={getStatusColor(task.status)}
          style={{ 
            margin: 0,
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 500,
            textTransform: 'capitalize'
          }}
        >
          {task.status.replace('-', ' ')}
        </Tag>
        
        {task.dueDate && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            fontSize: '11px',
            color: '#8c8c8c'
          }}>
            <CalendarOutlined />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
