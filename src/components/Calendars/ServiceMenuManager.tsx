import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Plus, Edit2, Trash2, Clock, Users } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: number;
  description?: string;
  price?: number;
  max_seats?: number;
  color?: string;
  buffer_before?: number;
  buffer_after?: number;
}

export default function ServiceMenuManager() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Initial Consultation',
      duration: 60,
      description: 'First meeting to discuss project requirements',
      price: 0,
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'Group Training',
      duration: 120,
      description: 'Group training session',
      price: 99,
      max_seats: 10,
      color: '#10B981'
    }
  ]);

  const [editingService, setEditingService] = useState<Service | null>(null);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Service Menu</h3>
          <button className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New Service</span>
          </button>
        </div>

        <div className="space-y-4">
          {services.map(service => (
            <div
              key={service.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: service.color }}
                  />
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span>{service.duration} minutes</span>
                </div>

                {service.max_seats && (
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>Up to {service.max_seats} people</span>
                  </div>
                )}

                {service.price !== undefined && (
                  <div>
                    <span className="font-medium">
                      {service.price === 0 ? 'Free' : `$${service.price}`}
                    </span>
                  </div>
                )}
              </div>

              {(service.buffer_before || service.buffer_after) && (
                <div className="pt-4 border-t">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Buffer Times</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {service.buffer_before && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Before:</span>
                        <span>{service.buffer_before} minutes</span>
                      </div>
                    )}
                    {service.buffer_after && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">After:</span>
                        <span>{service.buffer_after} minutes</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}