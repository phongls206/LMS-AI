import React from 'react';

interface EtcLogoProps {
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
  className?: string;
  onClick?: () => void;
}

export const EtcLogo: React.FC<EtcLogoProps> = ({
  size = 'md',
  collapsed = false,
  className = '',
  onClick,
}) => {
  // If collapsed (e.g., in mini sidebar)
  if (collapsed) {
    return (
      <div
        onClick={onClick}
        className={`w-10 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0 ${className}`}
        title="ETC ENGLISH CENTER"
      >
        <img
          src="/etc-logo.png"
          alt="ETC Logo"
          className="w-9 h-7 object-contain rounded-md select-none"
        />
      </div>
    );
  }

  // Sizing configurations
  const sizeStyles = {
    sm: {
      img: 'w-8 h-6.5',
      text: 'text-[10px] tracking-wider leading-none',
      gap: 'space-x-2',
    },
    md: {
      img: 'w-10 h-8',
      text: 'text-[12px] tracking-wider leading-none',
      gap: 'space-x-2.5',
    },
    lg: {
      img: 'w-16 h-13',
      text: 'text-base sm:text-lg tracking-wider leading-none',
      gap: 'space-x-3.5',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeStyles.gap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Exact Logo from File Image 1 */}
      <img
        src="/etc-logo.png"
        alt="ETC Logo"
        className={`${sizeStyles.img} object-contain shrink-0 rounded-md select-none drop-shadow-sm`}
      />

      {/* Stacked ENGLISH / CENTER — 100% visible on both dark and light mode */}
      <div className="flex flex-col text-left select-none leading-none justify-center">
        <span
          className={`${sizeStyles.text} etc-brand-text font-black uppercase transition-colors`}
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif",
          }}
        >
          ENGLISH
        </span>
        <span
          className={`${sizeStyles.text} etc-brand-text font-black uppercase mt-0.5 transition-colors`}
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif",
          }}
        >
          CENTER
        </span>
      </div>
    </div>
  );
};
