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
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.2"/>
                <path d="M6 10.5V15C6 15 8 17 12 17C16 17 18 15 18 15V10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="1" fill="white"/>
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
