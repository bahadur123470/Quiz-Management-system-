import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass-card p-8 group/card hover:border-white/20 transition-all duration-500 ${className}`}
      {...props}
    >
      {/* Premium Highlight Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
