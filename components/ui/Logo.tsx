interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg' },
    md: { container: 'w-10 h-10', text: 'text-xl' },
    lg: { container: 'w-12 h-12', text: 'text-2xl' }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon - Escudo de ley moderno */}
      <div className={`${sizes[size].container} rounded-xl bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center shadow-sm`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[60%] h-[60%]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L4 5V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V5L12 2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`font-sans font-bold ${sizes[size].text} text-[#212529] tracking-tight`}>
          TutorLaw
        </span>
      )}
    </div>
  );
}
