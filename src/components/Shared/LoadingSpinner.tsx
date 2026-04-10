import React from 'react';
import { Rocket } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', size = 'md' }) => {
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const iconSize = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div
          className="rounded-full border-2 border-purple-900 animate-spin"
          style={{
            width: iconSize + 16,
            height: iconSize + 16,
            borderTopColor: '#7c3aed',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Rocket size={iconSize / 2} className="text-purple-400 animate-pulse" />
        </div>
      </div>
      {message && <p className="text-slate-400 text-sm animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
