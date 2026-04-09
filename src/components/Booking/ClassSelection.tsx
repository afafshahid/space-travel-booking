import React from 'react';
import type { Trip, SeatClass } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Crown, Briefcase, Users } from 'lucide-react';

interface ClassSelectionProps {
  trip: Trip;
  selected: SeatClass;
  onSelect: (cls: SeatClass) => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({ trip, selected, onSelect }) => {
  const classes: { key: SeatClass; label: string; price: number; icon: React.ReactNode; perks: string[] }[] = [
    {
      key: 'economy',
      label: 'Economy',
      price: trip.economy_price,
      icon: <Users size={20} className="text-green-400" />,
      perks: ['Standard seat', 'Meal included', 'Window view'],
    },
    {
      key: 'business',
      label: 'Business',
      price: trip.business_price,
      icon: <Briefcase size={20} className="text-blue-400" />,
      perks: ['Extra legroom', 'Premium meals', 'Priority boarding', 'Lounge access'],
    },
    {
      key: 'first_class',
      label: 'First Class',
      price: trip.first_class_price,
      icon: <Crown size={20} className="text-amber-400" />,
      perks: ['Private suite', 'Gourmet dining', 'Personal AI assistant', 'Spacewalk option', 'VIP boarding'],
    },
  ];

  return (
    <div className="space-y-3">
      {classes.map((cls) => (
        <button
          key={cls.key}
          onClick={() => onSelect(cls.key)}
          className={`w-full text-left p-4 rounded-xl border transition-all ${
            selected === cls.key
              ? 'border-purple-500 bg-purple-600/10'
              : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {cls.icon}
              <span className="font-semibold text-white">{cls.label}</span>
            </div>
            <span className="text-lg font-bold gradient-text">{formatPrice(cls.price)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cls.perks.map((perk) => (
              <span
                key={perk}
                className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400"
              >
                {perk}
              </span>
            ))}
          </div>
          {selected === cls.key && (
            <div className="mt-2 text-xs text-purple-400 font-medium">✓ Selected</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ClassSelection;
