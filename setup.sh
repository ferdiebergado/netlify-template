#!/usr/bin/env sh

[ -z $(command -v netlify) ] && npm i -g netlify-cli &
[ -z "$(npx playwright install --list | grep -i ".cache/ms-playwright/chromium")" ] && npx playwright install --with-deps &
[ ! -f "./public/mockServiceWorker.js" ] && npx msw init ./public --save &
[ ! -f "./local.db" ] && npm run create-db &
[ ! -f .env ] && mv .env.example .env