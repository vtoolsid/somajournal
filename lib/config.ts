/**
 * Application Configuration
 * 
 * Centralized configuration management for feature flags,
 * environment settings, and runtime options.
 */

export const config = {
  // Prototype Mode - Use mock data instead of real API calls
  prototypeMode: process.env.NEXT_PUBLIC_PROTOTYPE_MODE === 'true',
  
  // API Configuration
  api: {
    pythonServerUrl: process.env.PYTHON_API_URL || 'http://localhost:8000',
    timeout: 10000, // 10 seconds
  },
  
  // Mock Data Settings
  mockData: {
    // Simulate realistic API delay
    simulatedDelay: 1500, // 1.5 seconds
    
    // Enable console logging for mock operations
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  },
  
  // Feature Flags
  features: {
    // Enable/disable specific features
    psychosomaticAnalysis: true,
    gptEnhancement: true,
    realTimePreview: true,
  },
  
  // Development Settings
  development: {
    // Show development helpers
    showPrototypeBadge: true,
    logApiCalls: process.env.NODE_ENV === 'development',
  }
};

/**
 * Helper function to check if we're in prototype mode
 */
export function isPrototypeMode(): boolean {
  return config.prototypeMode;
}

/**
 * Helper function to get simulated delay for mock operations
 */
export function getMockDelay(): number {
  return config.mockData.simulatedDelay;
}

/**
 * Log debug messages in development/prototype mode
 */
export function debugLog(message: string, data?: any): void {
  if (config.mockData.debugMode || config.development.logApiCalls) {
    console.log(`[Prototype] ${message}`, data || '');
  }
}