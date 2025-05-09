import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SEOService } from '../../lib/services/SEOService';
import { PageMeta } from '../../types/sites';

interface SEOSettingsProps {
  pageId: string;
  meta: PageMeta;
  onUpdate: (meta: PageMeta) => void;
}

export default function SEOSettings({ pageId, meta, onUpdate }: SEOSettingsProps) {
  const [localMeta, setLocalMeta] = useState<PageMeta>(meta);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [seoIssues, setSeoIssues] = useState<{
    type: 'error' | 'warning' | 'info';
    message: string;
  }[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setLocalMeta(meta);
  }, [meta]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await SEOService.updatePageSEO(pageId, localMeta);
      onUpdate(localMeta);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeSEO = async () => {
    try {
      setIsAnalyzing(true);
      const analysis = await SEOService.analyzeSEO(pageId);
      setSeoScore(analysis.score);
      setSeoIssues(analysis.issues);
      setRecommendations(analysis.recommendations);
    } catch (error) {
      console.error('Error analyzing SEO:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">SEO Settings</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAnalyzeSEO}
              className="btn btn-secondary inline-flex items-center gap-2"
              disabled={isAnalyzing}
            >
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze SEO'}</span>
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary inline-flex items-center gap-2"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {seoScore !== null && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">SEO Analysis</h3>
              <div className="flex items-center gap-2">
                <div className="text-sm">Score:</div>
                <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                  seoScore >= 80 ? 'bg-green-100 text-green-800' :
                  seoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {seoScore}/100
                </div>
              </div>
            </div>
            
            {seoIssues.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Issues:</h4>
                <ul className="space-y-1 text-sm">
                  {seoIssues.map((issue, index) => (
                    <li key={index} className={`flex items-start gap-2 ${
                      issue.type === 'error' ? 'text-red-600' :
                      issue.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      <span>•</span>
                      <span>{issue.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                <ul className="space-y-1 text-sm">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span>•</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={localMeta.title || ''}
              onChange={(e) => setLocalMeta({ ...localMeta, title: e.target.value })}
              className="w-full rounded-md border-gray-300"
              placeholder="Enter page title"
            />
            <p className="mt-1 text-xs text-gray-500">
              Recommended length: 50-60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={localMeta.description || ''}
              onChange={(e) => setLocalMeta({ ...localMeta, description: e.target.value })}
              className="w-full rounded-md border-gray-300"
              rows={3}
              placeholder="Enter page description"
            />
            <p className="mt-1 text-xs text-gray-500">
              Recommended length: 150-160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canonical URL
            </label>
            <input
              type="text"
              value={localMeta.canonical_url || ''}
              onChange={(e) => setLocalMeta({ ...localMeta, canonical_url: e.target.value })}
              className="w-full rounded-md border-gray-300"
              placeholder="https://example.com/page"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use this to avoid duplicate content issues
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Social Media</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Graph Title
                </label>
                <input
                  type="text"
                  value={localMeta.og_title || ''}
                  onChange={(e) => setLocalMeta({ ...localMeta, og_title: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter Open Graph title"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Title that appears when shared on social media
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Graph Description
                </label>
                <textarea
                  value={localMeta.og_description || ''}
                  onChange={(e) => setLocalMeta({ ...localMeta, og_description: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={3}
                  placeholder="Enter Open Graph description"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Description that appears when shared on social media
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Graph Image URL
                </label>
                <input
                  type="text"
                  value={localMeta.og_image || ''}
                  onChange={(e) => setLocalMeta({ ...localMeta, og_image: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Image that appears when shared on social media (recommended size: 1200x630)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Advanced</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Robots Directives
                </label>
                <input
                  type="text"
                  value={localMeta.robots || ''}
                  onChange={(e) => setLocalMeta({ ...localMeta, robots: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="index, follow"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Control how search engines index this page
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}