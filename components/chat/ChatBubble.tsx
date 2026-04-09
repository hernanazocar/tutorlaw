import { Message } from '@/lib/types';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
        isUser
          ? 'bg-[#0066ff] text-white shadow-sm'
          : 'bg-white border border-[#e9ecef] text-[#212529] shadow-sm'
      }`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V5L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-sans font-semibold text-[#6c757d]">TutorLaw</span>
          </div>
        )}
        <div className="font-sans text-[15px] whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
