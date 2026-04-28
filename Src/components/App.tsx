// src/App.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'

interface Task {
  id: number
  title: string
  completed: boolean
}

// Имитация задержки (эмуляция axios)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  // Загружаем задачи из localStorage при первом рендере
  useEffect(() => {
    const saved = localStorage.getItem('tasks')
    if (saved) {
      setTasks(JSON.parse(saved))
    }
  }, [])

  // Сохраняем задачи при каждом изменении
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Эмулированный API-запрос через axios
  const apiCall = async (method: 'get' | 'post' | 'patch' | 'delete', url: string, data?: any) => {
    setLoading(true)
    await delay(300) // фейковая задержка сети
    try {
      switch (method) {
        case 'get':
          return { data: tasks }
        case 'post':
          const newItem = { id: Date.now(), ...data }
          return { data: newItem }
        case 'patch':
          return { data: { ...data } }
        case 'delete':
          return { data: null }
        default:
          return { data: null }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async () => {
    if (!newTask.trim()) return

    try {
      await apiCall('post', '/tasks', { title: newTask, completed: false })
      const task: Task = { id: Date.now(), title: newTask, completed: false }
      setTasks(prev => [task, ...prev])
      setNewTask('')
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const handleToggleTask = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (task) {
        await apiCall('patch', `/tasks/${id}`, { completed: !task.completed })
        setTasks(prev => prev.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ))
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await apiCall('delete', `/tasks/${id}`)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleClearAll = () => {
    setTasks([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          {tasks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition"
            >
              Clear All Tasks
            </button>
          )}
        </div>

        {/* Форма добавления */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddTask}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
            disabled={!newTask.trim()}
          >
            Add Task
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {/* Список задач */}
        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="w-5 h-5 accent-indigo-500 cursor-pointer"
              />
              <span
                className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
              >
                {task.title}
              </span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-3 py-1 text-red-500 hover:bg-red-50 rounded transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {/* Счётчик */}
        {tasks.length > 0 && (
          <p className="text-center text-gray-500 mt-4">
            {tasks.filter(t => t.completed).length} of {tasks.length} completed
          </p>
        )}

        {/* Пустое состояние */}
        {!loading && tasks.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400 text-lg">Your task list is empty</p>
            <p className="text-gray-400 text-sm mt-2">Start by adding a new task</p>
          </div>
        )}
      </div>
    </div>
  )
}
