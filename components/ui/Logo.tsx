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
      {/* Logo Icon - Birrete graduación + Escala justicia */}
      <div className={`${sizes[size].container} rounded-xl bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center shadow-sm`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[65%] h-[65%]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Birrete de graduación */}
          <path
            d="M12 3L2 8L12 13L22 8L12 3Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="white"
            fillOpacity="0.2"
          />
          <path
            d="M6 10.5V15C6 15 8 17 12 17C16 17 18 15 18 15V10.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Borla del birrete */}
          <path
            d="M12 13V16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="17"
            r="1"
            fill="white"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={`font-sans font-bold ${sizes[size].text} tracking-tight`}>
          <span className="text-[#212529]">Tutor</span>
          <span className="text-[#0066ff]">Law</span>
        </div>
      )}
    </div>
  );
}
