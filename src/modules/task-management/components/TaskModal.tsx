import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import GenericInput from '../../../componnets/GenericInput';
import moment from 'moment';
import { useTaskContext } from '../../../context/TaskContext';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const { editingTask, addTask, updateTask, setIsModalVisible, setEditingTask } = useTaskContext();

  useEffect(() => {
    if (visible) {
      // Always reset first to clear any stale data
      form.resetFields();
      
      // Then populate if editing
      if (editingTask) {
        // Use a slight delay to ensure reset completes first
        const timer = setTimeout(() => {
          form.setFieldsValue({
            title: editingTask.title,
            description: editingTask.description || '',
            status: editingTask.status,
            dueDate: editingTask.dueDate ? moment(editingTask.dueDate) : null,
          });
        }, 50);
        
        return () => clearTimeout(timer);
      }
    }
  }, [visible, editingTask, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const taskData = {
        title: values.title,
        description: values.description || '',
        status: values.status,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : undefined,
      };

      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask(taskData);
      }

      form.resetFields();
      setIsModalVisible(false);
      setEditingTask(null);
    } catch {
      // Error is already handled by the mutation
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingTask(null);
    onCancel();
  };

  return (
    <Modal
      title={editingTask ? 'Edit Task' : 'Create New Task'}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {editingTask ? 'Update Task' : 'Create Task'}
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <GenericInput
          name="title"
          label="Task Title"
          type="text"
          placeholder="Enter task title"
          rules={[
            { required: true, message: 'Please enter task title!' },
            { min: 3, message: 'Title must be at least 3 characters!' }
          ]}
        />

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            rows={4}
            placeholder="Enter task description"
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Select placeholder="Select status">
            <Option value="todo">To Do</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date"
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Select due date"
            minDate={dayjs().startOf('day')}

          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
