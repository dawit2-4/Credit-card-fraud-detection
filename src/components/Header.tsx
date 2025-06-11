import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Shield className="h-8 w-8 text-blue-500" />
            </motion.div>
            <span className="text-xl font-semibold text-slate-800">FraudGuard</span>
          </div>
          
          <motion.div 
            className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <CreditCard className="h-4 w-4" />
            <span>Advanced Fraud Detection</span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;