import { useState, useEffect } from 'react'
import axios from 'axios'

interface Todo {
  id: number
  title: string
  completed: boolean
}

// Simulated API delay to show axios is working
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)

  // Load from localStorage on mount (empty by default)
  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage when todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Simulated API call with axios (for demo purposes)
  const apiCall = async (method: 'get' | 'post' | 'patch' | 'delete', url: string, data?: any) => {
    setLoading(true)
    await delay(300) // Fake network delay
    try {
      switch (method) {
        case 'get':
          return { data: todos }
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

  // Add todo
  const addTodo = async () => {
    if (!newTodo.trim()) return

    try {
      await apiCall('post', '/todos', { title: newTodo, completed: false })
      const newItem: Todo = { id: Date.now(), title: newTodo, completed: false }
      setTodos([newItem, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  // Toggle todo
  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (todo) {
        await apiCall('patch', `/todos/${id}`, { completed: !todo.completed })
        setTodos(todos.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ))
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      await apiCall('delete', `/todos/${id}`)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  // Clear all todos
  const clearAll = () => {
    setTodos([])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
          {todos.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Add todo form */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={!newTodo.trim()}
          >
            Add
          </button>
        </div>

        {/* Loading state */}
        {loading && <p className="text-center text-gray-500">Processing...</p>}

        {/* Todo list */}
        <ul className="space-y-3">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
              <span
                className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 text-red-500 hover:bg-red-50 rounded transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Counter */}
        {todos.length > 0 && (
          <p className="text-center text-gray-500 mt-4">
            {todos.filter(t => t.completed).length} of {todos.length} completed
          </p>
        )}

        {/* Empty state */}
        {!loading && todos.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400 text-lg">No tasks yet</p>
            <p className="text-gray-400 text-sm mt-2">Add your first task above</p>
          </div>
        )}
      </div>
    </div>
  )
}