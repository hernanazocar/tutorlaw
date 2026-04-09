export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 text-[#1e3a5f]">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-[#c9a96e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-[#c9a96e] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-[#c9a96e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm font-sans text-[#0d1f35]/60">TutorLaw está pensando...</span>
    </div>
  );
}
