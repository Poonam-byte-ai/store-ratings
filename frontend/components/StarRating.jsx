import React from 'react';

// Interactive if onRate is passed, otherwise a read-only display.
export default function StarRating({ value = 0, onRate, size = 'md' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`star-rating star-${size}`}>
      {stars.map((n) => (
        <span
          key={n}
          className={`star ${n <= Math.round(value) ? 'filled' : ''} ${onRate ? 'clickable' : ''}`}
          onClick={() => onRate && onRate(n)}
          role={onRate ? 'button' : undefined}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
