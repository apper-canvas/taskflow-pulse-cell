import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-surface-400 mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-surface-800 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-surface-700 mb-4">Page Not Found</h2>
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist. Let's get you back to your tasks!
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-card hover:shadow-glow"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Back to TaskFlow</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound