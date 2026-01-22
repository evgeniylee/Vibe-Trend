
import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 bg-[#10141A] text-white text-[10px] font-bold leading-relaxed rounded-2xl shadow-2xl z-[999] animate-in fade-in zoom-in-95 duration-200">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#10141A]"></div>
        </div>
      )}
    </div>
  );
};

export const InfoBadge: React.FC<{ text: string }> = ({ text }) => (
  <Tooltip text={text}>
    <div className="ml-2 w-5 h-5 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center text-[10px] font-black cursor-help hover:border-[#83A2DB] hover:text-[#83A2DB] transition-all shadow-sm">
      ?
    </div>
  </Tooltip>
);

export default Tooltip;
