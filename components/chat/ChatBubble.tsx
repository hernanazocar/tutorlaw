import { Message } from '@/lib/types';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-[#1e3a5f] text-white'
          : 'bg-white border border-[#e8e4da] text-[#0a1628]'
      }`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚖️</span>
            <span className="text-xs font-sans font-semibold text-[#c9a96e]">TutorLaw</span>
          </div>
        )}
        <div className="font-sans text-sm md:text-base whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
