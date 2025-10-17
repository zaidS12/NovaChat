/**
 * AI Configuration Modal Component
 * 
 * Modal for configuring AI API settings and testing both APIs.
 * Allows users to set API keys and view comparison data.
 * 
 * @author NovaChat Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, TestTube, CheckCircle, XCircle, Info } from 'lucide-react';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { testBothAPIs, setOpenAIAPIKey, getAPIConfig } from '../../utils/aiApi';

/**
 * AI Configuration Modal Component
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to close the modal
 * @returns {JSX.Element} The AI configuration modal
 */
const AIConfigModal = ({ isOpen, onClose }) => {
  // ==================== STATE ====================
  const [openaiKey, setOpenaiKey] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [config, setConfig] = useState(null);

  // ==================== EFFECTS ====================
  
  useEffect(() => {
    if (isOpen) {
      setConfig(getAPIConfig());
    }
  }, [isOpen]);

  // ==================== HANDLERS ====================

  /**
   * Handle API key save
   */
  const handleSaveKey = () => {
    if (openaiKey.trim()) {
      setOpenAIAPIKey(openaiKey.trim());
      setConfig(getAPIConfig());
      setOpenaiKey('');
    }
  };

  /**
   * Handle API testing
   */
  const handleTestAPIs = async () => {
    setIsTesting(true);
    setTestResults(null);
    
    try {
      const testMessages = [
        { sender: 'user', content: 'Hello, how are you?' }
      ];
      
      const results = await testBothAPIs(testMessages);
      setTestResults(results);
    } catch (error) {
      console.error('Error testing APIs:', error);
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  // ==================== RENDER HELPERS ====================

  /**
   * Render API status indicator
   */
  const renderAPIStatus = (apiName, isConfigured, isSuccess, response) => {
    const getStatusIcon = () => {
      if (!isConfigured) return <XCircle className="w-5 h-5 text-gray-400" />;
      if (isSuccess) return <CheckCircle className="w-5 h-5 text-green-500" />;
      return <XCircle className="w-5 h-5 text-red-500" />;
    };

    const getStatusText = () => {
      if (!isConfigured) return 'Not configured';
      if (isSuccess) return 'Working';
      return 'Error';
    };

    const getStatusColor = () => {
      if (!isConfigured) return 'text-gray-500';
      if (isSuccess) return 'text-green-600';
      return 'text-red-600';
    };

    return (
      <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
        {getStatusIcon()}
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            {apiName}
          </h4>
          <p className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          {response && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Response: {response.text?.substring(0, 100)}...
            </p>
          )}
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                AI Configuration
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* API Configuration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {config && (
                  <>
                    {renderAPIStatus(
                      'Gemini API',
                      config.gemini.configured,
                      testResults?.gemini?.success,
                      testResults?.gemini?.response
                    )}
                    {renderAPIStatus(
                      'OpenAI API',
                      config.openai.configured,
                      testResults?.openai?.success,
                      testResults?.openai?.response
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* OpenAI API Key Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OpenAI API Key</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enter your OpenAI API key to enable dual AI responses
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="sk-..."
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    />
                    <Button
                      onClick={handleSaveKey}
                      disabled={!openaiKey.trim()}
                      className="px-4"
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your API key is stored locally and never sent to our servers
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* API Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test APIs</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Test both APIs to see which one provides better responses
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleTestAPIs}
                    disabled={isTesting}
                    className="w-full"
                  >
                    {isTesting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Testing APIs...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <TestTube className="w-4 h-4" />
                        <span>Test Both APIs</span>
                      </div>
                    )}
                  </Button>

                  {/* Test Results */}
                  {testResults && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        Test Results
                      </h4>
                      
                      {testResults.error ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Error: {testResults.error}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Gemini Results */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                              Gemini API
                            </h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Status: {testResults.gemini.success ? 'Success' : 'Failed'}
                            </p>
                            {testResults.gemini.response && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Response: {testResults.gemini.response.text}
                              </p>
                            )}
                            {testResults.gemini.error && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                Error: {testResults.gemini.error}
                              </p>
                            )}
                          </div>

                          {/* OpenAI Results */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                              OpenAI API
                            </h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Status: {testResults.openai.success ? 'Success' : 'Failed'}
                            </p>
                            {testResults.openai.response && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Response: {testResults.openai.response.text}
                              </p>
                            )}
                            {testResults.openai.error && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                Error: {testResults.openai.error}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Information */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Both APIs respond to your message simultaneously</li>
                  <li>• Responses are scored based on quality metrics</li>
                  <li>• The best response is automatically selected</li>
                  <li>• You can see which API provided the response</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIConfigModal;

