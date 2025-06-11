/**
 * Generates random feature values for the 28 principal components (V1-V28)
 * based on the provided transaction details.
 * 
 * In a real application, these would be calculated from actual transaction data.
 * This is only for demonstration purposes.
 * 
 * @param amount - Transaction amount
 * @param time - Transaction time (seconds from first transaction)
 * @param merchantId - Optional merchant identifier
 * @param postalCode - Optional postal code
 * @param merchantType - Optional merchant category
 * @param cardLastDigits - Optional last 4 digits of card
 * @returns Array of 30 features (time, amount, V1-V28)
 */
const generateRandomFeatures = (
  amount: number,
  time: number,
  merchantId?: string,
  postalCode?: string,
  merchantType?: string,
  cardLastDigits?: string
): number[] => {
  // Normalize amount and time
  const normalizedAmount = amount / 1000; // Scale down larger amounts
  const normalizedTime = time / 86400; // Scale by seconds in a day
  
  // Additional factors based on new inputs
  const merchantFactor = merchantId ? merchantId.length / 10 : 0.5;
  const locationFactor = postalCode ? parseInt(postalCode.substring(0, 1)) / 9 : 0.5;
  const typeFactor = merchantType === 'Online Services' ? 0.7 : 0.3;
  const cardFactor = cardLastDigits ? parseInt(cardLastDigits) / 9999 : 0.5;
  
  // Random factors to influence the feature generation based on inputs
  const amountFactor = amount > 500 ? 0.8 : 0.2; // Higher amounts have different patterns
  const timeFactor = (time % 86400) < 28800 ? 0.7 : 0.3; // Night vs day pattern
  
  // Generate 28 random features with some patterns
  const features: number[] = [];
  
  // Add time and amount as the first two features
  features.push(normalizedTime);
  features.push(normalizedAmount);
  
  // Generate the 28 principal components (V1-V28)
  for (let i = 0; i < 28; i++) {
    // Base random value between -1 and 1
    let value = (Math.random() * 2 - 1);
    
    // Apply some patterns based on all inputs
    if (i < 7) {
      // First 7 features influenced by amount and merchant type
      value = value * (0.3 + amountFactor * 0.4 + typeFactor * 0.3);
    } else if (i < 14) {
      // Next 7 features influenced by time and location
      value = value * (0.3 + timeFactor * 0.4 + locationFactor * 0.3);
    } else if (i < 21) {
      // Next 7 features influenced by merchant and card
      value = value * (0.3 + merchantFactor * 0.4 + cardFactor * 0.3);
    } else {
      // Last 7 features influenced by all factors
      value = value * (
        0.2 + 
        amountFactor * 0.2 + 
        timeFactor * 0.2 + 
        merchantFactor * 0.2 + 
        cardFactor * 0.2
      );
    }
    
    // Add some more variance to certain features
    if (i % 5 === 0) {
      value = value * 1.5;
    }
    
    // Sometimes flip the sign for more variance
    if (Math.random() > 0.7) {
      value = -value;
    }
    
    // Further tweak for high amounts (potential fraud signals)
    if (amount > 1000 && i % 7 === 0) {
      value = value * 2;
    }
    
    // Add to the feature list
    features.push(value);
  }
  
  return features;
};

export default generateRandomFeatures;