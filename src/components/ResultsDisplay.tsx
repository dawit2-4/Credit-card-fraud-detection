import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, ShieldAlert } from 'lucide-react';
import FeaturesChart from './FeaturesChart';

interface ResultsDisplayProps {
  prediction: number;
  features: number[];
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  prediction, 
  features, 
  onReset 
}) => {
  const isFraudulent = prediction > 0.5;
  const confidencePercentage = isFraudulent 
    ? (prediction * 100).toFixed(2) 
    : ((1 - prediction) * 100).toFixed(2);
  
  // Extract Time and Amount from features
  const time = features[0];
  const amount = features[1];
  
  // Get V1-V28 components to display
  const vComponents = features.slice(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8"
    >
      <div className="flex items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </motion.button>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <div className={`
          flex items-center p-4 rounded-lg
          ${isFraudulent ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}
        `}>
          <div className="flex-shrink-0 mr-4">
            {isFraudulent ? (
              <div className="p-2 bg-red-100 rounded-full">
                <ShieldAlert className="h-8 w-8 text-red-500" />
              </div>
            ) : (
              <div className="p-2 bg-green-100 rounded-full">
                <ShieldCheck className="h-8 w-8 text-green-500" />
              </div>
            )}
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-1 ${isFraudulent ? 'text-red-700' : 'text-green-700'}`}>
              {isFraudulent ? 'Potential Fraud Detected' : 'Transaction Appears Legitimate'}
            </h3>
            <p className={`text-sm ${isFraudulent ? 'text-red-600' : 'text-green-600'}`}>
              Our model is {confidencePercentage}% confident in this assessment
            </p>
          </div>
        </div>
      </motion.div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Transaction Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Amount</p>
            <p className="text-xl font-medium text-slate-800">${amount.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Time (seconds)</p>
            <p className="text-xl font-medium text-slate-800">{time.toFixed(0)}</p>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Feature Visualization</h3>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <FeaturesChart features={vComponents} />
        </div>
        <div className="mt-4 text-sm text-slate-500">
          <p>
            The chart above shows the 28 principal components (V1-V28) used by our model to make the prediction.
            These components are derived from a PCA transformation of the original transaction data.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsDisplay;