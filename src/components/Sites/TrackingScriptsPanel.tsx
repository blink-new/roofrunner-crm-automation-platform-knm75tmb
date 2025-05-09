import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { TrackingService } from '../../lib/services/TrackingService';

interface TrackingScriptsPanelProps {
  pageId: string;
}

export default function TrackingScriptsPanel({ pageId }: TrackingScriptsPanelProps) {
  const [headerScripts, setHeaderScripts] = useState<string[]>([]);
  const [footerScripts, setFooterScripts] = useState<string[]>([]);
  const [newHeaderScript, setNewHeaderScript] = useState('');
  const [newFooterScript, setNewFooterScript] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationIssues, setValidationIssues] = useState<{
    type: 'error' | 'warning';
    message: string;
  }[]>([]);

  useEffect(() => {
    loadTrackingScripts();
  }, [pageId]);

  const loadTrackingScripts = async () => {
    try {
      setLoading(true);
      const scripts = await TrackingService.getTrackingScripts(pageId);
      setHeaderScripts(scripts.header || []);
      setFooterScripts(scripts.footer || []);
    } catch (error) {
      console.error('Error loading tracking scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await TrackingService.updateTrackingScripts(pageId, {
        header: headerScripts,
        footer: footerScripts
      });
    } catch (error) {
      console.error('Error saving tracking scripts:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHeaderScript = async () => {
    if (!newHeaderScript.trim()) return;
    
    try {
      const validation = await TrackingService.validateTrackingScript(newHeaderScript);
      
      if (!validation.valid) {
        setValidationIssues(validation.issues);
        return;
      }
      
      setHeaderScripts([...headerScripts, newHeaderScript]);
      setNewHeaderScript('');
      setValidationIssues([]);
    } catch (error) {
      console.error('Error validating script:', error);
    }
  };

  const handleAddFooterScript = async () => {
    if (!newFooterScript.trim()) return;
    
    try {
      const validation = await TrackingService.validateTrackingScript(newFooterScript);
      
      if (!validation.valid) {
        setValidationIssues(validation.issues);
        return;
      }
      
      setFooterScripts([...footerScripts, newFooterScript]);
      setNewFooterScript('');
      setValidationIssues([]);
    } catch (error) {
      console.error('Error validating script:', error);
    }
  };

  const handleRemoveHeaderScript = (index: number) => {
    setHeaderScripts(headerScripts.filter((_, i) => i !== index));
  };

  const handleRemoveFooterScript = (index: number) => {
    setFooterScripts(footerScripts.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Tracking Scripts</h2>
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Scripts'}</span>
          </button>
        </div>

        {validationIssues.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Script Validation Issues
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {validationIssues.map((issue, index) => (
                      <li key={index}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Header Scripts</h3>
            <p className="text-sm text-gray-500 mb-4">
              These scripts will be added to the <code>&lt;head&gt;</code> section of your page.
            </p>
            
            <div className="space-y-4">
              {headerScripts.map((script, index) => (
                <div key={index} className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <pre className="text-xs overflow-x-auto flex-1">
                      {script.length > 100 ? `${script.substring(0, 100)}...` : script}
                    </pre>
                    <button
                      onClick={() => handleRemoveHeaderScript(index)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="border rounded-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Header Script
                </label>
                <textarea
                  value={newHeaderScript}
                  onChange={(e) => setNewHeaderScript(e.target.value)}
                  className="w-full rounded-md border-gray-300 font-mono text-sm"
                  rows={4}
                  placeholder="<!-- Paste your script here -->"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleAddHeaderScript}
                    className="btn btn-secondary"
                    disabled={!newHeaderScript.trim()}
                  >
                    Add Script
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Footer Scripts</h3>
            <p className="text-sm text-gray-500 mb-4">
              These scripts will be added just before the closing <code>&lt;/body&gt;</code> tag.
            </p>
            
            <div className="space-y-4">
              {footerScripts.map((script, index) => (
                <div key={index} className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <pre className="text-xs overflow-x-auto flex-1">
                      {script.length > 100 ? `${script.substring(0, 100)}...` : script}
                    </pre>
                    <button
                      onClick={() => handleRemoveFooterScript(index)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="border rounded-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Footer Script
                </label>
                <textarea
                  value={newFooterScript}
                  onChange={(e) => setNewFooterScript(e.target.value)}
                  className="w-full rounded-md border-gray-300 font-mono text-sm"
                  rows={4}
                  placeholder="<!-- Paste your script here -->"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleAddFooterScript}
                    className="btn btn-secondary"
                    disabled={!newFooterScript.trim()}
                  >
                    Add Script
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}