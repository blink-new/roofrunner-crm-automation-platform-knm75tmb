import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, GripVertical } from 'lucide-react';

export default function PipelineSettings() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pipeline Settings</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Stage
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              <div>
                <h3 className="font-medium">Lead</h3>
                <p className="text-sm text-gray-500">Initial contact with potential client</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              <div>
                <h3 className="font-medium">Proposal</h3>
                <p className="text-sm text-gray-500">Proposal sent to client</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              <div>
                <h3 className="font-medium">Negotiation</h3>
                <p className="text-sm text-gray-500">Discussing terms and pricing</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              <div>
                <h3 className="font-medium">Closed Won</h3>
                <p className="text-sm text-gray-500">Deal successfully closed</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}