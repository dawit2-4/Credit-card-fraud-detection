import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

// Define the shape of our context
interface ModelContextType {
  model: any;
  modelLoaded: boolean;
  modelError: string | null;
}

// Create the context with default values
const ModelContext = createContext<ModelContextType>({
  model: null,
  modelLoaded: false,
  modelError: null
});

// Hook for easy context consumption
export const useModelContext = () => useContext(ModelContext);

// Provider component that loads the model and makes it available
export const ModelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [model, setModel] = useState<any>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        // Make sure TensorFlow.js is loaded
        if (!window.tf) {
          throw new Error('TensorFlow.js is not loaded');
        }

        // Load model, extract the UInt8Array data from model.weights.h5
        const loadedModel = await window.tf.loadLayersModel('/model.json');
        
        // If component is still mounted, update state
        if (isMounted) {
          setModel(loadedModel);
          setModelLoaded(true);
          toast.success('Fraud detection model loaded successfully');
        }
      } catch (error) {
        console.error('Error loading model:', error);
        
        if (isMounted) {
          setModelError('Failed to load model');
          toast.error('Error loading model. Using a fallback prediction method.');
          
          // Create a simple fallback model for demonstration purposes
          const fallbackModel = {
            predict: (tensor: any) => {
              // Simple random prediction for demonstration
              const randomPrediction = Math.random() < 0.15 ? 0.7 + Math.random() * 0.3 : Math.random() * 0.3;
              return {
                data: async () => [randomPrediction],
                dispose: () => {}
              };
            }
          };
          
          setModel(fallbackModel);
          setModelLoaded(true);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ModelContext.Provider value={{ model, modelLoaded, modelError }}>
      {children}
    </ModelContext.Provider>
  );
};