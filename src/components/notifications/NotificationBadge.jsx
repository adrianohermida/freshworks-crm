import React from 'react';
import { Bell } from 'lucide-react';

/**
 * Notification badge component
 * Temporarily disabled to prevent rate limit violations
 * TODO: Re-enable with manual trigger only (no automatic polling)
 */
export default function NotificationBadge() {
  // Disabled: no automatic polling to avoid 429 rate limits
  return (
    <div className="relative">
      <Bell className="w-5 h-5" />
    </div>
  );
}