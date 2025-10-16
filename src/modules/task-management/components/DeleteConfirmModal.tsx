import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface DeleteConfirmModalProps {
  visible: boolean;
  taskTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  taskTitle,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>Delete Task</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" danger onClick={onConfirm}>
          Delete
        </Button>,
      ]}
      width={400}
    >
      <div style={{ padding: '16px 0' }}>
        <Text>
          Are you sure you want to delete the task{' '}
          <Text strong style={{ color: 'red' }}>
            "{taskTitle}"
          </Text>
          ? This action cannot be undone.
        </Text>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
