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
  // Sizing configurations
  const sizeStyles = {
    sm: {
      etc: 'text-xl tracking-tighter',
      text: 'text-[10px] tracking-wider leading-none',
      gap: 'space-x-2',
    },
    md: {
      etc: 'text-2xl sm:text-[26px] tracking-tighter',
      text: 'text-[12px] tracking-wider leading-none',
      gap: 'space-x-2.5',
    },
    lg: {
      etc: 'text-4xl sm:text-5xl tracking-tighter',
      text: 'text-base sm:text-lg tracking-wider leading-none',
      gap: 'space-x-3.5',
    },
  }[size];

  // If collapsed (e.g., in mini sidebar)
  if (collapsed) {
    return (
      <div
        onClick={onClick}
        className={`w-10 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0 ${className}`}
        title="ETC ENGLISH CENTER"
      >
        <span
          className="font-black text-xl bg-gradient-to-r from-[#14d8e4] via-[#3d84c4] to-[#7259c9] bg-clip-text text-transparent select-none"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif",
          }}
        >
          ETC
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeStyles.gap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Gradient ETC — 100% transparent background, no black box */}
      <span
        className={`${sizeStyles.etc} font-black bg-gradient-to-r from-[#14d8e4] via-[#3d84c4] to-[#7259c9] bg-clip-text text-transparent select-none shrink-0 drop-shadow-sm`}
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif",
        }}
      >
        ETC
      </span>

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
