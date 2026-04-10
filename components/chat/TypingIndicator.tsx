interface TypingIndicatorProps {
  modoColor?: string;
}

export function TypingIndicator({ modoColor = 'from-blue-500 to-blue-600' }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-[#e9ecef] rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${modoColor} flex items-center justify-center`}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <div className="flex gap-1.5 items-center">
            <div
              className="w-2 h-2 bg-[#6c757d] rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-[#6c757d] rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 bg-[#6c757d] rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
