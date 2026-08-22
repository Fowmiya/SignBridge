import React from 'react';
import { useApp } from '../../context/AppContext';

export const LiveAnnouncer: React.FC = () => {
  const { screenReaderAnnouncement } = useApp();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="a11y-live-announcer"
    >
      {screenReaderAnnouncement}
    </div>
  );
};
