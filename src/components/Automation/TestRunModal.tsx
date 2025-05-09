import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Play, X, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { ExecutionService } from '../../lib/services/ExecutionService';
import { LogService } from '../../lib/services/LogService';

interface TestRunModalProps {
  workflowId: string;
  onClose: () => void;
}

export default function TestRunModal({ workflowId, onClose }: TestRunModalProps) {
  const [testData, setTestData] = useState('{\n  "contact": {\n    "id": "123",\n    "first_name": "John",\n    "last_name": "Doe",\n    "email": "john@example.com"\n  }\n}');
  const [logs, setLogs] = useState<Array<{
    timestamp: string;
    node_id: string;
    message: string;
    level: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when logs update
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleRunTest = async () => {
    try {
      setIsRunning(true);
      setStatus('running');
      setLogs([]);

      // Parse test data
      let parsedData;
      try {
        parsedData = JSON.parse(testData);
      } catch (error) {
        setLogs([{
          timestamp: new Date().toISOString(),
          node_id: 'system',
          message: 'Invalid JSON data',
          level: 'error'
        }]);
        setStatus('failed');
        setIsRunning(false);
        return;
      }

      // Start test execution
      const execution = await ExecutionService.test(workflowId, parsedData);
      setExecutionId(execution.id);

      // Start streaming logs
      const unsubscribe = LogService.streamLogs(execution.id, (log) => {
        setLogs(prev => [...prev, log]);
        
        if (log.message === 'Workflow execution completed') {
          setStatus('completed');
          setIsRunning(false);
          unsubscribe();
        } else if (log.level === 'error' && log.message.includes('failed')) {
          setStatus('failed');
          setIsRunning(false);
          unsubscribe();
        }
      });
    } catch (error) {
      console.error('Error running test:', error);
      setLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          node_id: 'system',
          message: `Error: ${error.message || 'Unknown error'}`,
          level: 'error'
        }
      ]);
      setStatus('failed');
      setIsRunning(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Clock size={20} className="text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'failed':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Test Workflow</h2>
            {getStatusIcon()}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Data (JSON)
          </label>
          <textarea
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            className="w-full rounded-md border-gray-300 font-mono text-sm"
            rows={5}
            disabled={isRunning}
          />
          <p className="mt-1 text-xs text-gray-500">
            Provide sample data that will be used to trigger the workflow
          </p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Execution Logs</h3>
          <div className="bg-gray-900 text-gray-100 rounded-md p-4 font-mono text-sm h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400">
                Run the test to see execution logs
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-2">
                  <span className={`${
                    log.level === 'error'
                      ? 'text-red-400'
                      : log.level === 'warning'
                      ? 'text-yellow-400'
                      : 'text-blue-400'
                  }`}>
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-gray-400"> [{log.node_id}] </span>
                  <span>{log.message}</span>
                  {log.data && (
                    <pre className="mt-1 text-xs text-gray-400 overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleRunTest}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={isRunning}
          >
            <Play size={16} />
            <span>{isRunning ? 'Running...' : 'Run Test'}</span>
          </button>
        </div>
      </Card>
    </div>
  );
}