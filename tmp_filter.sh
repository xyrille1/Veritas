#!/bin/sh
if [ -f apps/web/.env.local.example ]; then
  sed -i 's|https://hooks\.slack\.com/services/[A-Za-z0-9/_-]*|your_slack_incoming_webhook_url_here|g' apps/web/.env.local.example
fi
