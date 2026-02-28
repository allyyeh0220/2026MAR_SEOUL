import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

export function TrashBin() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash-bin',
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl border-2 ${
        isOver 
          ? 'bg-red-500 border-red-600 scale-110' 
          : 'bg-white border-red-500'
      }`}
    >
      <Trash2 className={`w-8 h-8 ${isOver ? 'text-white' : 'text-red-500'}`} />
    </div>
  );
}
