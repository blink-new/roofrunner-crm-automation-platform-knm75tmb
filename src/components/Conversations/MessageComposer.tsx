import React, { useState } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import BotSelector from './BotSelector';
import TemplateDropdown from './TemplateDropdown';

interface MessageComposerProps {
  onSend: (content: string, attachments?: File[]) => Promise<void>;
  disabled?: boolean;
}

export default function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() && attachments.length === 0) return;
    
    try {
      setIsSubmitting(true);
      await onSend(message, attachments);
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 bg-gray-50 rounded-lg">
          <TextareaAutosize
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none"
            minRows={1}
            maxRows={5}
            disabled={disabled || isSubmitting}
          />
        </div>

        <div className="flex items-center gap-1">
          <TemplateDropdown
            onSelect={(content) => setMessage(prev => prev + content)}
          />
          
          <BotSelector
            onSelect={(botId) => {
              // Handle bot selection
            }}
          />

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Paperclip size={16} />
          </button>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Smile size={16} />
          </button>

          <button
            onClick={handleSubmit}
            disabled={disabled || isSubmitting || (!message.trim() && attachments.length === 0)}
            className="p-2 text-white bg-primary-500 hover:bg-primary-600 rounded-md disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="mt-2 flex gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm"
            >
              <span className="truncate max-w-[200px]">{file.name}</span>
              <button
                onClick={() => setAttachments(files => files.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}