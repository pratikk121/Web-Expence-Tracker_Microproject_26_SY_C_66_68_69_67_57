<?php
header('Content-Type: application/manifest+json');
?>{
  "name": "Web Expense Tracker",
  "short_name": "Expenses",
  "start_url": "./login.html",
  "id": "./login.html",
  "scope": "./",
  "display": "standalone",
  "background_color": "#050505",
  "theme_color": "#050505",
  "orientation": "portrait",
  "description": "An offline-capable web expense tracker with a glassmorphic design.",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
