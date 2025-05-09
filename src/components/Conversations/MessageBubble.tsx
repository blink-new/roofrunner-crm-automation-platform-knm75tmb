import React from 'react';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { Message } from '../../types/conversations';
import { cn } from '../../utils/cn';

interface MessageBubbleProps {
  message: Message;
  isOutgoing: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOutgoing }) => {
  return (
    <div className={cn(
      'flex flex-col max-w-[70%]',
      isOutgoing ? 'ml-auto items-end' : 'mr-auto items-start'
    )}>
      <div className={cn(
        'rounded-lg px-4 py-2',
        isOutgoing ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-900'
      )}>
        {message.content}
        
        {message.attachment && (
          <div className={cn(
            'flex items-center gap-2 mt-2 p-2 rounded',
            isOutgoing ? 'bg-primary-600' : 'bg-gray-200'
          )}>
            <Download size={16} />
            <span className="text-sm flex-1 truncate">
              {message.attachment.filename}
            </span>
            <button className="text-sm font-medium hover:underline">
              Download
            </button>
          </div>
        )}
      </div>
      
      <span className="text-xs text-gray-500 mt-1">
        {format(message.timestamp, 'h:mm a')}
      </span>
    </div>
  );
};

export default MessageBubble;