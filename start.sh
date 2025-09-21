export GOOGLE_CLIENT_ID=116750545961-k22ajbftbikioa14rk2jhr7b04lm6am2.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET=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
export GOOGLE_REDIRECT_URI=https://portal-anwalts.ai/api/auth/google/callback
export NODE_ENV=production
export BACKEND_BASE="http://127.0.0.1:8000"
export NITRO_PORT=3000
export NITRO_HOST=0.0.0.0

# Kill any existing Node.js server
pkill -f 'node.*index.mjs' 2>/dev/null

# Start the server
exec node .output/server/index.mjs
