import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TaskMapped, TaskColumn, TaskStatus } from '../../types/task';
import { 
  DndContext, 
  DragOverlay, 
  type DragEndEvent, 
  type DragStartEvent, 
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import TaskCard from './components/TaskCard';
import TaskFilters from './components/TaskFilters';
import { useTaskContext } from '../../context/TaskContext';


interface KanbanBoardProps {
  onDeleteTask: (id: string, title: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onDeleteTask }) => {
  const { tasks, updateTask, setIsModalVisible, setEditingTask, isLoading } = useTaskContext();
  const [columns, setColumns] = useState<TaskColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      tasks: []
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      tasks: []
    },
    {
      id: 'completed',
      title: 'Completed',
      status: 'completed',
      tasks: []
    }
  ]);

  const [activeTask, setActiveTask] = useState<TaskMapped | null>(null);
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: string;
    assignee?: string;
  }>({});

  // Configure sensors for better drag/drop experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced distance for faster drag activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update columns when tasks change
  useEffect(() => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.status === column.status)
      }))
    );
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find(t => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    
    // Determine the new status based on what was dropped over
    let newStatus: TaskStatus | null = null;
    
    // Check if dropped over a column
    const columnIds = ['todo', 'in-progress', 'completed'];
    if (columnIds.includes(over.id as string)) {
      newStatus = over.id as TaskStatus;
    } else {
      // Dropped over a task, find which column it belongs to
      const targetTask = tasks.find(t => t.id === over.id);
      if (targetTask) {
        newStatus = targetTask.status;
      }
    }

    if (!newStatus) return;

    // Find the task being moved
    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove || taskToMove.status === newStatus) return;

    // Optimistic update - update UI immediately
    setColumns(prevColumns => 
      prevColumns.map(column => {
        if (column.status === taskToMove.status) {
          // Remove from old column
          return {
            ...column,
            tasks: column.tasks.filter(t => t.id !== taskId)
          };
        } else if (column.status === newStatus) {
          // Add to new column
          return {
            ...column,
            tasks: [...column.tasks, { ...taskToMove, status: newStatus }]
          };
        }
        return column;
      })
    );

    // Update the task status in backend
    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      // Error is already handled by the mutation
      // Revert to original state by refetching
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          tasks: tasks.filter(task => task.status === column.status)
        }))
      );
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: TaskMapped) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const getFilteredTasks = (tasks: TaskMapped[]) => {
    return tasks.filter(task => {
        if (filter.status && task.status !== filter.status) return false;

      return true;
    });
  };

  // Droppable Column Component
  const DroppableColumn: React.FC<{ columnId: string; children: React.ReactNode; isEmpty: boolean }> = ({ columnId, children, isEmpty }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: columnId,
    });

    return (
      <div
        ref={setNodeRef}
        className="kanban-column-scroll"
        style={{
          minHeight: '100%',
          height: '100%',
          backgroundColor: isOver ? '#f0f5ff' : 'transparent',
          borderRadius: '8px',
          transition: 'background-color 0.2s ease',
          overflow: isEmpty ? 'visible' : 'auto',
          paddingBottom: '8px',
          paddingRight: '2px',
          border: isOver ? '2px dashed #1890ff' : '2px dashed transparent',
        }}
      >
        {children}
      </div>
    );
  };


  if (isLoading) {
    return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      background: '#f5f5f5', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>

      <TaskFilters filter={filter} onFilterChange={setFilter} />

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px',
          marginTop: '24px',
          flex: 1,
          overflow: 'hidden'
        }}>
          {columns.map(column => {
            const filteredTasks = getFilteredTasks(column.tasks);
            
            return (
              <div key={column.id} style={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}>
                <Card
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{column.title}</span>
                        <span style={{ 
                          background: '#f0f0f0', 
                          color: '#595959',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: 500
                        }}>
                          {filteredTasks.length}
                        </span>
                      </div>
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={handleAddTask}
                        style={{ borderRadius: '6px' }}
                      >
                        Add
                      </Button>
                    </div>
                  }
                  style={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    background: '#fafafa'
                  }}
                  headStyle={{
                    borderBottom: '1px solid #e8e8e8',
                    background: '#ffffff',
                    borderRadius: '12px 12px 0 0',
                    padding: '12px 16px'
                  }}
                  bodyStyle={{ 
                    padding: '12px',
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fafafa'
                  }}
                >
                  <DroppableColumn columnId={column.id} isEmpty={filteredTasks.length === 0}>
                    <SortableContext
                      items={filteredTasks.map(task => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div style={{ minHeight: '100%', position: 'relative' }}>
                        {filteredTasks.length === 0 ? (
                          <div style={{ 
                            textAlign: 'center', 
                            color: '#8c8c8c', 
                            padding: '48px 20px',
                            border: '2px dashed #d9d9d9',
                            borderRadius: '12px',
                            margin: '4px 0',
                            background: '#ffffff'
                          }}>
                            <div style={{ 
                              fontSize: '13px',
                              marginBottom: '12px',
                              fontWeight: 500
                            }}>
                              No tasks yet
                            </div>
                            <Button
                              type="link"
                              onClick={handleAddTask}
                              style={{ 
                                fontSize: '12px',
                                padding: '0'
                              }}
                            >
                              + Add your first task
                            </Button>
                          </div>
                        ) : (
                          <>
                            {filteredTasks.map(task => (
                              <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={onDeleteTask}
                              />
                            ))}
                            {/* Extra droppable space at bottom */}
                            <div style={{ 
                              minHeight: '200px', 
                              width: '100%',
                              position: 'relative'
                            }} />
                          </>
                        )}
                      </div>
                    </SortableContext>
                  </DroppableColumn>
                </Card>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card
              style={{ 
                transform: 'rotate(5deg)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{activeTask.title}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {activeTask.description}
              </div>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
