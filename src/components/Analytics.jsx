import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function Analytics({ eventName, properties }) {
  useEffect(() => {
    if (eventName) {
      try {
        base44.analytics.track({
          eventName,
          properties: properties || {}
        });
      } catch (err) {
        // Silently skip if tracking unavailable
      }
    }
  }, [eventName]);

  return null;
}