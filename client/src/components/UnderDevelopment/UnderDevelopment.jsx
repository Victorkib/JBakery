import { motion } from 'framer-motion';
import { FaTools, FaRocket, FaLightbulb, FaRegSmile } from 'react-icons/fa';

const UnderDevelopment = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 max-w-2xl w-full text-center shadow-2xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <FaTools className="inline-block" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Under Development</h1>
        <p className="text-lg mb-6">
          We're working hard to bring you an amazing experience. This page is
          currently under construction, but we're excited to show you what we've
          been building!
        </p>
        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="flex items-center justify-center p-4 bg-white bg-opacity-20 rounded-lg">
            <FaRocket className="text-3xl mr-2" />
            <span>Launching Soon</span>
          </div>
          <div className="flex items-center justify-center p-4 bg-white bg-opacity-20 rounded-lg">
            <FaLightbulb className="text-3xl mr-2" />
            <span>Innovative Features</span>
          </div>
        </motion.div>
        <motion.p
          className="text-sm text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Stay tuned for updates and feel free to explore the rest of our site!
        </motion.p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <FaRegSmile className="text-4xl inline-block" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default UnderDevelopment;
