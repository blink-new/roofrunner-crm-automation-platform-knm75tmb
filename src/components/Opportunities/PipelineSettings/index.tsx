import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, GripVertical, Edit2, Trash2 } from 'lucide-react';
import Breadcrumbs from '../../Navigation/Breadcrumbs';

interface Pipeline {
  id: string;
  name: string;
  stages: {
    id: string;
    name: string;
    description: string;
    color?: string;
  }[];
}

export default function PipelineSettings() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Default Pipeline',
      stages: [
        { id: '1', name: 'New', description: 'Initial contact with potential client' },
        { id: '2', name: 'Qualified', description: 'Prospect has been qualified' },
        { id: '3', name: 'Proposal', description: 'Proposal sent to client' },
        { id: '4', name: 'Negotiation', description: 'Discussing terms and pricing' },
        { id: '5', name: 'Closed Won', description: 'Deal successfully closed' }
      ]
    }
  ]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Opportunities', path: '/opportunities' },
            { label: 'Pipeline Settings', path: '/opportunities/pipelines', active: true }
          ]}
        />
        <div className="flex items-center justify-between mt-2">
          <h1>Pipeline Settings</h1>
          <Button className="bg-primary-500 hover:bg-primary-600">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Pipeline
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {pipelines.map((pipeline) => (
          <Card key={pipeline.id} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{pipeline.name}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Pipeline
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {pipeline.stages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div>
                      <h3 className="font-medium">{stage.name}</h3>
                      <p className="text-sm text-gray-500">{stage.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Stage
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}