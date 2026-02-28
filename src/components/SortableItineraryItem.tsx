import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItineraryCard } from './ItineraryCard';
import { ItineraryItem } from '../data/itinerary';

interface SortableItineraryItemProps {
  item: ItineraryItem;
  onClick: () => void;
}

export function SortableItineraryItem({ item, onClick }: SortableItineraryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative' as const,
    touchAction: 'pan-y', // Allow vertical scrolling, but prevent horizontal interference if needed
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ItineraryCard item={item} onClick={onClick} />
    </div>
  );
}
