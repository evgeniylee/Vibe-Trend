
import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-white/80 backdrop-blur-xl text-slate-800 text-[10px] font-bold leading-relaxed rounded-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-[100] shadow-2xl border border-white/40 shadow-blue-900/5">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/80"></div>
      </div>
    </div>
  );
};

export const InfoBadge: React.FC<{ text: string }> = ({ text }) => (
  <Tooltip text={text}>
    <div className="ml-2 w-4 h-4 rounded-full border border-current opacity-30 flex items-center justify-center text-[9px] font-black cursor-help hover:opacity-100 transition-opacity">
      ?
    </div>
  </Tooltip>
);

export default Tooltip;
