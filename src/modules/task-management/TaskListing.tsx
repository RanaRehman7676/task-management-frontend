import React, { useState } from 'react';
import { Table, Button, Tag, Space, Dropdown, Typography, Card, Select } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, PlusOutlined, } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'antd/es/table/interface';
import type { MenuProps } from 'antd';
import type { TaskMapped } from '../../types/task.ts';
import { useTaskContext } from '../../context/TaskContext.tsx';

const { Text } = Typography;
const { Option } = Select;

interface TaskListingProps {
  onDeleteTask: (id: string, title: string) => void;
}

const TaskListing: React.FC<TaskListingProps> = ({ onDeleteTask }) => {
  const { tasks, setIsModalVisible, setEditingTask, isLoading } = useTaskContext();
  const [statusFilter, setStatusFilter] = useState<string>('all');



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'default';
      case 'in-progress': return 'processing';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (task: TaskMapped) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  // Filter tasks based on status
  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter(task => task.status === statusFilter);

  const columns: ColumnsType<TaskMapped> = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: TaskMapped) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          {record.description && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </Tag>
      ),
      filters: [
        { text: 'To Do', value: 'todo' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value: boolean | Key, record: TaskMapped) => record.status === value,
    },

    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => date ? formatDate(date) : '-',
      sorter: (a: TaskMapped, b: TaskMapped) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a: TaskMapped, b: TaskMapped) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: TaskMapped) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => onDeleteTask(record.id, record.title),
          },
        ];

        return (
          <Space>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];


  if (isLoading) {
    return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Quick Status Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'end',marginBottom:"20px" }}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Option value="all">All Tasks</Option>
          <Option value="todo">To Do</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          onClick={handleAddTask}
        >
          Add New Task
        </Button>
      </div>

      {/* Tasks Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default TaskListing;