
import React from 'react';
import Tooltip from './Tooltip';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  // Add showTooltips prop for visual consistency and fixing interface mismatches
  showTooltips?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, activeCategory, onSelect, showTooltips = true }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-6 custom-scrollbar no-scrollbar">
      {categories.map(cat => {
        const button = (
          <button 
            onClick={() => onSelect(cat)}
            className={`px-8 py-3.5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap border ${
              cat === activeCategory 
                ? 'bg-[#10141A] text-white shadow-2xl shadow-black/20 border-[#10141A]' 
                : 'bg-white text-slate-400 border-white hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        );

        // Conditionally wrap in Tooltip based on showTooltips prop
        return showTooltips ? (
          <Tooltip key={cat} text={`Показать трендовые видео в категории "${cat}"`}>
            {button}
          </Tooltip>
        ) : (
          <React.Fragment key={cat}>
            {button}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FilterBar;
