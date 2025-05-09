import React, { useState, useEffect } from 'react';
import { Save, Palette, Type, Maximize, Square } from 'lucide-react';
import { Card } from '../ui/card';
import { ThemeService } from '../../lib/services/ThemeService';

interface ThemeSettingsProps {
  themeId?: string;
  onSave?: (themeId: string) => void;
}

export default function ThemeSettings({ themeId, onSave }: ThemeSettingsProps) {
  const [theme, setTheme] = useState<any>({
    name: 'Default Theme',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F97316',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    typography: {
      heading_font: 'Inter',
      body_font: 'Inter',
      base_size: '16px',
      scale_ratio: 1.2
    },
    spacing: {
      base_unit: '16px',
      scale_ratio: 1.5
    },
    borders: {
      radius: '4px',
      width: '1px'
    }
  });
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(themeId ? true : false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadThemes();
    if (themeId) {
      loadTheme();
    }
  }, [themeId]);

  const loadThemes = async () => {
    try {
      const data = await ThemeService.getThemes();
      setThemes(data);
    } catch (error) {
      console.error('Error loading themes:', error);
    }
  };

  const loadTheme = async () => {
    try {
      setLoading(true);
      const data = await ThemeService.getTheme(themeId!);
      setTheme(data);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      let savedTheme;
      if (themeId) {
        savedTheme = await ThemeService.updateTheme(themeId, theme);
      } else {
        savedTheme = await ThemeService.createTheme(theme);
      }
      
      if (onSave) {
        onSave(savedTheme.id);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectTheme = async (id: string) => {
    try {
      setLoading(true);
      const data = await ThemeService.getTheme(id);
      setTheme(data);
      if (onSave) {
        onSave(id);
      }
    } catch (error) {
      console.error('Error selecting theme:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6 animate-pulse">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Theme Settings</h2>
          <div className="flex gap-2">
            <select
              value={themeId || ''}
              onChange={(e) => handleSelectTheme(e.target.value)}
              className="rounded-md border-gray-300"
            >
              <option value="">Select a theme</option>
              {themes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button
              onClick={handleSave}
              className="btn btn-primary inline-flex items-center gap-2"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Theme'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={20} className="text-primary-500" />
              <h3 className="text-lg font-medium">Colors</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.colors.primary}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, primary: e.target.value }
                    })}
                    className="h-10 w-10 rounded-md border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.colors.primary}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, primary: e.target.value }
                    })}
                    className="flex-1 rounded-md border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.colors.secondary}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, secondary: e.target.value }
                    })}
                    className="h-10 w-10 rounded-md border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.colors.secondary}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, secondary: e.target.value }
                    })}
                    className="flex-1 rounded-md border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.colors.accent}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, accent: e.target.value }
                    })}
                    className="h-10 w-10 rounded-md border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.colors.accent}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, accent: e.target.value }
                    })}
                    className="flex-1 rounded-md border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.colors.background}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, background: e.target.value }
                    })}
                    className="h-10 w-10 rounded-md border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.colors.background}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, background: e.target.value }
                    })}
                    className="flex-1 rounded-md border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.colors.text}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, text: e.target.value }
                    })}
                    className="h-10 w-10 rounded-md border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.colors.text}
                    onChange={(e) => setTheme({
                      ...theme,
                      colors: { ...theme.colors, text: e.target.value }
                    })}
                    className="flex-1 rounded-md border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Type size={20} className="text-primary-500" />
              <h3 className="text-lg font-medium">Typography</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading Font
                </label>
                <select
                  value={theme.typography.heading_font}
                  onChange={(e) => setTheme({
                    ...theme,
                    typography: { ...theme.typography, heading_font: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body Font
                </label>
                <select
                  value={theme.typography.body_font}
                  onChange={(e) => setTheme({
                    ...theme,
                    typography: { ...theme.typography, body_font: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Font Size
                </label>
                <input
                  type="text"
                  value={theme.typography.base_size}
                  onChange={(e) => setTheme({
                    ...theme,
                    typography: { ...theme.typography, base_size: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale Ratio
                </label>
                <input
                  type="number"
                  value={theme.typography.scale_ratio}
                  onChange={(e) => setTheme({
                    ...theme,
                    typography: { ...theme.typography, scale_ratio: parseFloat(e.target.value) }
                  })}
                  className="w-full rounded-md border-gray-300"
                  step="0.1"
                  min="1"
                  max="2"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Maximize size={20} className="text-primary-500" />
              <h3 className="text-lg font-medium">Spacing</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Unit
                </label>
                <input
                  type="text"
                  value={theme.spacing.base_unit}
                  onChange={(e) => setTheme({
                    ...theme,
                    spacing: { ...theme.spacing, base_unit: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale Ratio
                </label>
                <input
                  type="number"
                  value={theme.spacing.scale_ratio}
                  onChange={(e) => setTheme({
                    ...theme,
                    spacing: { ...theme.spacing, scale_ratio: parseFloat(e.target.value) }
                  })}
                  className="w-full rounded-md border-gray-300"
                  step="0.1"
                  min="1"
                  max="2"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Square size={20} className="text-primary-500" />
              <h3 className="text-lg font-medium">Borders</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Radius
                </label>
                <input
                  type="text"
                  value={theme.borders.radius}
                  onChange={(e) => setTheme({
                    ...theme,
                    borders: { ...theme.borders, radius: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Width
                </label>
                <input
                  type="text"
                  value={theme.borders.width}
                  onChange={(e) => setTheme({
                    ...theme,
                    borders: { ...theme.borders, width: e.target.value }
                  })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Theme Preview</h3>
            <div className="border rounded-lg p-6" style={{ 
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontFamily: theme.typography.body_font
            }}>
              <h1 style={{ 
                color: theme.colors.primary,
                fontFamily: theme.typography.heading_font,
                fontSize: `calc(${theme.typography.base_size} * ${theme.typography.scale_ratio} * ${theme.typography.scale_ratio})`
              }}>
                Heading 1
              </h1>
              <h2 style={{ 
                color: theme.colors.primary,
                fontFamily: theme.typography.heading_font,
                fontSize: `calc(${theme.typography.base_size} * ${theme.typography.scale_ratio})`
              }}>
                Heading 2
              </h2>
              <p style={{ marginTop: theme.spacing.base_unit }}>
                This is a paragraph of text that demonstrates the body font and text color.
              </p>
              <div style={{ 
                marginTop: theme.spacing.base_unit,
                display: 'flex',
                gap: theme.spacing.base_unit
              }}>
                <button style={{ 
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  padding: `calc(${theme.spacing.base_unit} / 2) ${theme.spacing.base_unit}`,
                  borderRadius: theme.borders.radius,
                  border: 'none'
                }}>
                  Primary Button
                </button>
                <button style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: 'white',
                  padding: `calc(${theme.spacing.base_unit} / 2) ${theme.spacing.base_unit}`,
                  borderRadius: theme.borders.radius,
                  border: 'none'
                }}>
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}