import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...newTask, updatedAt: new Date().toISOString() }
          : task
      ))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      // Create new task
      const task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks([task, ...tasks])
      toast.success('Task created successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    })
    setShowForm(false)
    setEditingTask(null)
  }

  const handleEdit = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate
    })
    setEditingTask(task)
    setShowForm(true)
  }

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-surface-600 bg-surface-50 border-surface-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle'
      case 'medium': return 'Clock'
      case 'low': return 'CheckCircle2'
      default: return 'Circle'
    }
  }

  const getDateDisplay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return `Overdue (${format(date, 'MMM dd')})`
    return format(date, 'MMM dd')
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'overdue' && task.dueDate && isPast(new Date(task.dueDate)) && !task.completed)

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && !t.completed).length
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Stats Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {[
          { label: 'Total', value: taskStats.total, icon: 'List', color: 'primary' },
          { label: 'Completed', value: taskStats.completed, icon: 'CheckCircle2', color: 'green-500' },
          { label: 'Pending', value: taskStats.pending, icon: 'Clock', color: 'amber-500' },
          { label: 'Overdue', value: taskStats.overdue, icon: 'AlertTriangle', color: 'red-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-card rounded-2xl p-4 sm:p-6 text-center group"
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-${stat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <ApperIcon name={stat.icon} className={`w-6 h-6 sm:w-8 sm:h-8 text-${stat.color}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-surface-800 mb-1">{stat.value}</div>
            <div className="text-sm sm:text-base text-surface-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card rounded-2xl p-4 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-surface-800">Task Management</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name={showForm ? "X" : "Plus"} className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{showForm ? 'Cancel' : 'Add Task'}</span>
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-sm sm:text-base"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-full sm:w-auto text-sm sm:text-base"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </motion.div>

      {/* Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-surface-800 mb-4 sm:mb-6">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title..."
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="input-field text-sm sm:text-base"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="input-field text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Add description..."
                      rows="3"
                      className="input-field resize-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary text-sm sm:text-base"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-8 sm:p-12 text-center"
            >
              <ApperIcon name="CheckCircle" className="w-16 h-16 sm:w-20 sm:h-20 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-surface-600 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
              </h3>
              <p className="text-surface-500 text-sm sm:text-base">
                {tasks.length === 0 
                  ? 'Create your first task to get started!' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`task-card ${task.completed ? 'task-card-completed' : ''} priority-${task.priority} group`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleComplete(task.id)}
                      className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-surface-300 hover:border-primary'
                      }`}
                    >
                      {task.completed && (
                        <ApperIcon name="Check" className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      )}
                    </motion.button>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm sm:text-base mb-1 ${
                        task.completed 
                          ? 'line-through text-surface-500' 
                          : 'text-surface-800'
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={`text-xs sm:text-sm mb-2 ${
                          task.completed 
                            ? 'line-through text-surface-400' 
                            : 'text-surface-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          <ApperIcon name={getPriorityIcon(task.priority)} className="w-3 h-3" />
                          <span className="capitalize">{task.priority}</span>
                        </span>
                        {task.dueDate && (
                          <span className={`text-xs px-2 py-1 rounded-lg ${
                            isPast(new Date(task.dueDate)) && !task.completed
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-surface-50 text-surface-600 border border-surface-200'
                          }`}>
                            {getDateDisplay(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(task)}
                      className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-surface-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default MainFeature