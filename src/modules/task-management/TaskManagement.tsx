import  { useState } from "react";
import KanbanBoard from "./Taskkanban"
import TaskListing from "./TaskListing"
import { Button, Card } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import TaskModal from "./components/TaskModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { useTaskContext } from "../../context/TaskContext";

function TaskManagement() {
  const [view, setView] = useState<'kanban' | 'listing'>('kanban');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);
  
  const { isModalVisible, setIsModalVisible, deleteTask, editingTask } = useTaskContext();

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id);
        setDeleteModalVisible(false);
        setTaskToDelete(null);
      } catch {
        // Error is already handled by the mutation
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  const openDeleteModal = (id: string, title: string) => {
    setTaskToDelete({ id, title });
    setDeleteModalVisible(true);
  };

  return (
    <>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'black' }}>
            Task Management Board
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Manage your tasks with drag and drop functionality or table view
          </p>
        </div>
        <Card size="small" style={{ background: '#f5f5f5' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              type={view === 'kanban' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setView('kanban')}
            >
              Kanban View
            </Button>
            <Button 
              type={view === 'listing' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              onClick={() => setView('listing')}
            >
              Table View
            </Button>
          </div>
        </Card>
      </div>
      
      {view === 'kanban' ? (
        <KanbanBoard onDeleteTask={openDeleteModal} />
      ) : (
        <TaskListing onDeleteTask={openDeleteModal} />
      )}

      {/* Task Modal */}
      <TaskModal
        key={editingTask ? editingTask.id : 'new'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={deleteModalVisible}
        taskTitle={taskToDelete?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

export default TaskManagement