import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import FraudDetectionForm from './components/FraudDetectionForm';
import ResultsDisplay from './components/ResultsDisplay';
import { ModelProvider } from './context/ModelContext';
import { Shield, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [modelPrediction, setModelPrediction] = useState<{
    prediction: number;
    features: number[];
  } | null>(null);

  return (
    <ModelProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <motion.div 
                className="inline-flex items-center justify-center p-4 mb-4 bg-blue-100 rounded-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {showResults && modelPrediction?.prediction && modelPrediction.prediction > 0.5 ? (
                  <ShieldAlert size={36} className="text-red-500" />
                ) : (
                  <Shield size={36} className="text-blue-500" />
                )}
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                Credit Card Fraud Detection
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Enter transaction details to check if it's potentially fraudulent using our advanced machine learning model.
              </p>
            </motion.div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {!showResults ? (
                <FraudDetectionForm 
                  setShowResults={setShowResults} 
                  setModelPrediction={setModelPrediction}
                />
              ) : (
                <ResultsDisplay 
                  prediction={modelPrediction?.prediction || 0}
                  features={modelPrediction?.features || []}
                  onReset={() => setShowResults(false)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </ModelProvider>
  );
}

export default App;