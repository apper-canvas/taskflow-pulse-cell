import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState(null)

  const logout = () => {
    setUser(null)
    // Add any additional logout logic here
  }

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
      }
    }
  }, [])
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 glass-card mx-4 mt-4 sm:mx-6 sm:mt-6 lg:mx-8 lg:mt-8 rounded-2xl"
      >
        <div className="px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-glow">
                <ApperIcon name="CheckSquare" className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-sm sm:text-base text-surface-600 hidden sm:block">
                  Smart Task Management
                </p>
              </div>
</motion.div>

            <div className="flex items-center space-x-3">
              {user && (
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-sm text-surface-600">
                    Welcome, {user.firstName || user.name || 'User'}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="p-2 rounded-xl glass-card hover:shadow-card transition-all duration-200 text-surface-600 hover:text-red-600"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-xl glass-card hover:shadow-card transition-all duration-200"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12"
      >
        <MainFeature />
      </motion.main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 text-center py-8 px-4"
      >
        <div className="glass-card rounded-2xl py-6 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Zap" className="w-4 h-4 text-primary" />
              <span className="text-sm text-surface-600">Boost your productivity</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-surface-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Target" className="w-4 h-4 text-secondary" />
              <span className="text-sm text-surface-600">Achieve your goals</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-surface-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Sparkles" className="w-4 h-4 text-accent" />
              <span className="text-sm text-surface-600">Stay organized</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home