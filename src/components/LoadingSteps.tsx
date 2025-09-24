
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_MESSAGES } from '../../constants';

const LoadingSteps: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative h-10 w-full overflow-hidden">
            <AnimatePresence>
                <motion.p
                    key={index}
                    className="absolute w-full text-lg text-gray-600 dark:text-gray-400"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {LOADING_MESSAGES[index]}
                </motion.p>
            </AnimatePresence>
        </div>
    </div>
  );
};

export default LoadingSteps;
