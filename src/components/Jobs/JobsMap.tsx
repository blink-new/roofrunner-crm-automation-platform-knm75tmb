import React from 'react';
import { Job } from '../../types/jobs';

interface JobsMapProps {
  jobs: Job[];
  onJobClick: (jobId: string) => void;
}

export default function JobsMap({ jobs, onJobClick }: JobsMapProps) {
  return (
    <div className="h-[600px] bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Map integration coming soon...</p>
    </div>
  );
}