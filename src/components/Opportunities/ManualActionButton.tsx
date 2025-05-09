import React, { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';

interface ManualActionButtonProps {
  type: 'call' | 'sms';
  contactId: string;
  dealId: string;
  onAction: () => Promise<void>;
}

export default function ManualActionButton({
  type,
  contactId,
  dealId,
  onAction
}: ManualActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onAction();
    } catch (error) {
      console.error(`Error performing ${type} action:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
      title={type === 'call' ? 'Make call' : 'Send SMS'}
    >
      {type === 'call' ? (
        <Phone size={16} />
      ) : (
        <MessageSquare size={16} />
      )}
    </button>
  );
}