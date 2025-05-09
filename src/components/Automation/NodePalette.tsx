import React from 'react';
import { 
  Zap,
  GitBranch,
  Mail,
  MessageSquare,
  Clock,
  Tag,
  DollarSign,
  Globe,
  Code,
  Table,
  MessageCircle,
  Flag
} from 'lucide-react';
import { NodeType } from '../../types/automations';

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  const nodeTypes = [
    {
      type: 'trigger' as NodeType,
      label: 'Triggers',
      items: [
        { icon: Zap, label: 'Contact Created' },
        { icon: Tag, label: 'Tag Added' },
        { icon: DollarSign, label: 'Deal Won' },
        { icon: MessageSquare, label: 'Message Received' },
        { icon: Clock, label: 'Task Completed' }
      ]
    },
    {
      type: 'condition' as NodeType,
      label: 'Conditions',
      items: [
        { icon: GitBranch, label: 'If/Else' },
        { icon: GitBranch, label: 'Switch' }
      ]
    },
    {
      type: 'action' as NodeType,
      label: 'Actions',
      items: [
        { icon: Mail, label: 'Send Email' },
        { icon: MessageSquare, label: 'Send SMS' },
        { icon: Tag, label: 'Add Tag' },
        { icon: Globe, label: 'Call Webhook' }
      ]
    },
    {
      type: 'delay' as NodeType,
      label: 'Delays',
      items: [
        { icon: Clock, label: 'Wait Time' },
        { icon: Clock, label: 'Wait Until' }
      ]
    },
    {
      type: 'goal' as NodeType,
      label: 'Goals',
      items: [
        { icon: Flag, label: 'Goal' }
      ]
    },
    {
      type: 'action' as NodeType,
      label: 'Premium Actions',
      items: [
        { icon: Code, label: 'Custom Code', premium: true },
        { icon: Table, label: 'Google Sheets', premium: true },
        { icon: MessageCircle, label: 'Slack', premium: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {nodeTypes.map((section) => (
        <div key={section.type + section.label}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{section.label}</h3>
          <div className="space-y-2">
            {section.items.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-left"
                onClick={() => onAddNode(section.type)}
              >
                <item.icon size={16} className="text-gray-500" />
                <span className="text-sm">{item.label}</span>
                {item.premium && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                    Premium
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}