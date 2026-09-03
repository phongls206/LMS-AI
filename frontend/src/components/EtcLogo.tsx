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
        className={`w-12 h-9 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center font-black text-xs tracking-tight shadow-sm hover:scale-105 transition-transform cursor-pointer shrink-0 ${className}`}
        title="ETC ENGLISH CENTER"
      >
        <span className="bg-gradient-to-r from-[#14d8e4] via-[#3d84c4] to-[#7259c9] bg-clip-text text-transparent select-none">
          ETC
        </span>
      </div>
    );
  }

  // Sizing configurations
  const sizeStyles = {
    sm: {
      etc: 'text-xl tracking-tighter',
      text: 'text-[10px] tracking-wider leading-none',
      gap: 'space-x-2',
    },
    md: {
      etc: 'text-2xl tracking-tighter',
      text: 'text-[12px] tracking-wider leading-none',
      gap: 'space-x-2.5',
    },
    lg: {
      etc: 'text-4xl sm:text-5xl tracking-tighter',
      text: 'text-base sm:text-lg tracking-wider leading-none',
      gap: 'space-x-3.5',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeStyles.gap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Gradient ETC */}
      <span
        className={`${sizeStyles.etc} font-black bg-gradient-to-r from-[#14d8e4] via-[#3d84c4] to-[#7259c9] bg-clip-text text-transparent select-none shrink-0 drop-shadow-sm`}
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif",
        }}
      >
        ETC
      </span>

      {/* Stacked ENGLISH / CENTER */}
      <div className="flex flex-col text-left select-none leading-none justify-center">
        <span
          className={`${sizeStyles.text} font-black text-slate-900 dark:text-white uppercase transition-colors`}
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif",
          }}
        >
          ENGLISH
        </span>
        <span
          className={`${sizeStyles.text} font-black text-slate-900 dark:text-white uppercase mt-0.5 transition-colors`}
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
