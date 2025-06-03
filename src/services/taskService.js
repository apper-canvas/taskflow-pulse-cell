const { ApperClient } = window.ApperSDK

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const TABLE_NAME = 'task'

// All fields from the task table
const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'priority', 'due_date', 'completed', 'created_at', 'updated_at'
]

// Only updateable fields for create/update operations
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at', 'updated_at'
]

export const fetchAllTasks = async (userId = null) => {
  try {
    const params = {
      fields: ALL_FIELDS,
      orderBy: [
        {
          fieldName: 'created_at',
          SortType: 'DESC'
        }
      ]
    }

    // Filter by current user if userId provided
    if (userId) {
      params.where = [
        {
          fieldName: 'Owner',
          operator: 'ExactMatch',
          values: [userId]
        }
      ]
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params)
    
    if (!response || !response.data) {
      return []
    }

    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

export const getTaskById = async (taskId) => {
  try {
    const params = {
      fields: ALL_FIELDS
    }

    const response = await apperClient.getRecordById(TABLE_NAME, taskId, params)
    
    if (!response || !response.data) {
      return null
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error)
    throw error
  }
}

export const createTask = async (taskData, userId) => {
  try {
    // Filter to only include updateable fields
    const filteredData = {}
    UPDATEABLE_FIELDS.forEach(field => {
      if (taskData.hasOwnProperty(field) && taskData[field] !== undefined) {
        filteredData[field] = taskData[field]
      }
    })

    // Set owner to current user
    if (userId) {
      filteredData.Owner = userId
    }

    // Set creation timestamp
    filteredData.created_at = new Date().toISOString()
    filteredData.updated_at = new Date().toISOString()

    const params = {
      records: [filteredData]
    }

    const response = await apperClient.createRecord(TABLE_NAME, params)

    if (response && response.success && response.results && response.results.length > 0) {
      const result = response.results[0]
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.message || 'Failed to create task')
      }
    } else {
      throw new Error('Failed to create task')
    }
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const updateTask = async (taskId, taskData) => {
  try {
    // Filter to only include updateable fields
    const filteredData = { Id: taskId }
    UPDATEABLE_FIELDS.forEach(field => {
      if (taskData.hasOwnProperty(field) && taskData[field] !== undefined) {
        filteredData[field] = taskData[field]
      }
    })

    // Update modification timestamp
    filteredData.updated_at = new Date().toISOString()

    const params = {
      records: [filteredData]
    }

    const response = await apperClient.updateRecord(TABLE_NAME, params)

    if (response && response.success && response.results && response.results.length > 0) {
      const result = response.results[0]
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.message || 'Failed to update task')
      }
    } else {
      throw new Error('Failed to update task')
    }
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const deleteTask = async (taskId) => {
  try {
    const params = {
      RecordIds: Array.isArray(taskId) ? taskId : [taskId]
    }

    const response = await apperClient.deleteRecord(TABLE_NAME, params)

    if (response && response.success) {
      return true
    } else {
      throw new Error('Failed to delete task')
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}