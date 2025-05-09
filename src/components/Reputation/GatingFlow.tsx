import React, { useState } from 'react';
import { Star, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '../ui/card';

interface GatingFlowProps {
  enabled: boolean;
  threshold: number;
  onEnableChange: (enabled: boolean) => void;
  onThresholdChange: (threshold: number) => void;
}

export default function GatingFlow({
  enabled,
  threshold,
  onEnableChange,
  onThresholdChange
}: GatingFlowProps) {
  const [previewRating, setPreviewRating] = useState(4);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Review Gating</h3>
        <p className="text-sm text-gray-600 mb-4">
          Review gating helps you collect feedback from all customers while directing only satisfied customers to leave public reviews. This helps maintain a positive online reputation.
        </p>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onEnableChange(e.target.checked)}
              className="rounded border-gray-300 text-primary-600"
            />
            <span className="ml-2 text-sm text-gray-700">
              Enable review gating
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500 ml-6">
            Customers will be asked to rate their experience before being directed to leave a public review.
          </p>
        </div>
        
        {enabled && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating Threshold
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={threshold}
                  onChange={(e) => onThresholdChange(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="font-medium">{threshold}+</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Only customers who rate their experience at or above this threshold will be directed to leave a public review.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Preview Gating Flow</h4>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h5 className="font-medium mb-4 text-center">Step 1: Initial Rating</h5>
                  <div className="text-center mb-4">
                    <p className="mb-2">How would you rate your experience?</p>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setPreviewRating(rating)}
                          className={`p-1 rounded-full ${
                            previewRating >= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star size={24} fill={previewRating >= rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                    <button className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md">
                      Submit
                    </button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h5 className="font-medium mb-4 text-center">Step 2: Conditional Path</h5>
                  <div className="text-center mb-4">
                    {previewRating >= threshold ? (
                      <div>
                        <ThumbsUp size={48} className="mx-auto text-green-500 mb-2" />
                        <p className="mb-4">Thank you for your positive feedback!</p>
                        <p className="mb-4">Would you mind sharing your experience on Google?</p>
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-md inline-flex items-center gap-2">
                          <span>Leave a Review</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ThumbsDown size={48} className="mx-auto text-red-500 mb-2" />
                        <p className="mb-4">We're sorry to hear about your experience.</p>
                        <p className="mb-4">Please let us know how we can improve:</p>
                        <textarea
                          className="w-full rounded-md border-gray-300 mb-2"
                          rows={3}
                          placeholder="Your feedback..."
                        ></textarea>
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-md">
                          Submit Feedback
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}