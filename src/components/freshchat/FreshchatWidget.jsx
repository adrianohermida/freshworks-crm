import React, { useEffect } from 'react';

const FRESHCHAT_APP_ID = '9e305607-b1d6-4f87-ac38-695749f55932';
const FRESHCHAT_DOMAIN = 'msdk.eu.freshchat.com';

export default function FreshchatWidget() {
  useEffect(() => {
    // Inicializar Freshchat widget
    window.fcSettings = {
      token: FRESHCHAT_APP_ID,
      host: `https://${FRESHCHAT_DOMAIN}`
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://${FRESHCHAT_DOMAIN}/js/widget.js`;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null; // Widget é injetado no DOM pelo script do Freshchat
}