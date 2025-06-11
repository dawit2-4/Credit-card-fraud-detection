import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useModelContext } from '../context/ModelContext';
import { CreditCard, DollarSign, Clock, AlertCircle, MapPin, Building, Calendar, Hash } from 'lucide-react';
import generateRandomFeatures from '../utils/generateRandomFeatures';

interface FraudDetectionFormProps {
  setShowResults: (show: boolean) => void;
  setModelPrediction: (prediction: { prediction: number; features: number[] }) => void;
}

const FraudDetectionForm: React.FC<FraudDetectionFormProps> = ({ 
  setShowResults, 
  setModelPrediction 
}) => {
  const { model, modelLoaded } = useModelContext();
  const [amount, setAmount] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [merchantId, setMerchantId] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [merchantType, setMerchantType] = useState<string>('');
  const [cardLastDigits, setCardLastDigits] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !time) {
      toast.error('Amount and time are required fields');
      return;
    }
    
    if (!modelLoaded || !model) {
      toast.error('Model is still loading. Please wait a moment and try again.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate random features for V1-V28 for demonstration
      const features = generateRandomFeatures(
        parseFloat(amount), 
        parseFloat(time),
        merchantId,
        postalCode,
        merchantType,
        cardLastDigits
      );
      
      // Make prediction with TensorFlow.js model
      const tensorInput = window.tf.tensor2d([features], [1, 30]);
      const prediction = model.predict(tensorInput);
      const predictionValue = (await prediction.data())[0];
      
      // Cleanup tensors to prevent memory leaks
      tensorInput.dispose();
      prediction.dispose();
      
      setModelPrediction({
        prediction: predictionValue,
        features: features
      });
      
      setShowResults(true);
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const merchantTypes = [
    'Retail',
    'Restaurant',
    'Travel',
    'Entertainment',
    'Healthcare',
    'Online Services',
    'Other'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Transaction Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Field */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-1">
              <DollarSign className="h-4 w-4" />
              <span>Transaction Amount *</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (e.g. 123.45)"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </motion.div>
          
          {/* Time Field */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-1">
              <Clock className="h-4 w-4" />
              <span>Time (seconds from first transaction) *</span>
            </label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Enter time in seconds"
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </motion.div>

          {/* Merchant ID Field */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-1">
              <Building className="h-4 w-4" />
              <span>Merchant ID</span>
            </label>
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="Enter merchant ID"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </motion.div>

          {/* Postal Code Field */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-1">
              <MapPin className="h-4 w-4" />
              <span>Postal Code</span>
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal code"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </motion.div>

          {/* Merchant Type Field */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-1">
              <Building className="h-4 w-4" />
              <span>Merchant Type</span>
            </label>
            <select
              value={merchantType}
              onChange={(e) => setMerchantType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select merchant type</option>
              {merchantTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </motion.div>

          {/* Card Last Digits Field */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-1">
              <Hash className="h-4 w-4" />
              <span>Card Last 4 Digits</span>
            </label>
            <input
              type="text"
              value={cardLastDigits}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setCardLastDigits(value);
              }}
              placeholder="Enter last 4 digits"
              maxLength={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </motion.div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              This demo will generate random values for the 28 principal components (V1-V28) 
              based on your input. In a real application, these would be calculated from 
              actual transaction data.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !modelLoaded}
            className={`
              flex items-center justify-center space-x-2
              px-6 py-3 rounded-lg font-medium text-white
              shadow-md transition-all
              ${!modelLoaded || loading 
                ? 'bg-slate-400' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Check Transaction</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
      
      {!modelLoaded && (
        <div className="mt-6 text-center text-sm text-slate-600">
          <div className="flex justify-center items-center space-x-2">
            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading fraud detection model...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FraudDetectionForm;