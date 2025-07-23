import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating, maxRating = 5, size = 'default', interactive = false, onRatingChange }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        
        return (
          <Star
            key={index}
            className={`
              ${sizeClasses[size]}
              ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
              ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}
            `}
            onClick={() => handleStarClick(starRating)}
          />
        );
      })}
      {rating > 0 && (
        <span className="ml-1 text-sm text-muted-foreground">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

