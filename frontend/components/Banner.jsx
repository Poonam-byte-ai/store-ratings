import React from 'react';

// Small inline status banner for error/success messages on forms.
export default function Banner({ type = 'error', message }) {
  if (!message) return null;
  return <div className={`banner banner-${type}`}>{message}</div>;
}
