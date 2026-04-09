export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-3 px-5 py-3.5 rounded-2xl bg-white border border-[#e9ecef] shadow-sm max-w-fit">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm font-sans text-[#6c757d]">Pensando...</span>
    </div>
  );
}
