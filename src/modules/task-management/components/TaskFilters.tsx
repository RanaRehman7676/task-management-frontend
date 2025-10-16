import React from 'react';
import { Card, Select, Button } from 'antd';
import { ClearOutlined, FilterOutlined } from '@ant-design/icons';
import type { TaskStatus } from '../../../types/task';


const { Option } = Select;

interface TaskFiltersProps {
  filter: {
    status?: TaskStatus;
    priority?: string;
    assignee?: string;
  };
  onFilterChange: (filter: {
    status?: TaskStatus;
    priority?: string;
    assignee?: string;
  }) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filter, onFilterChange }) => {
  const handleFilterChange = (key: string, value: TaskStatus | string) => {
    onFilterChange({ ...filter, [key]: value as TaskStatus | string });
  };

  const hasActiveFilters = Object.values(filter).some(value => value !== undefined && value !== '');

  return (
    <Card size="small" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilterOutlined style={{ color: '#666' }} />
          <span style={{ fontWeight: 'bold', color: '#666' }}>Filters:</span>
        </div>

        <Select
          placeholder="All Status"
          style={{ width: 120 }}
          value={filter.status}
          onChange={(value) => handleFilterChange('status', value)}
          allowClear
        >
          <Option value="todo">To Do</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
        {hasActiveFilters && (
          <Button
            icon={<ClearOutlined />}
            onClick={() => onFilterChange({})}
            size="small"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TaskFilters;
