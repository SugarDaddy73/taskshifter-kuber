# TaskShifter API tests (tests-js)

## Setup

1. Copy `.env.example` to `.env` and edit if needed:
   - API_BASE_URL (default: http://localhost:7700)
   - ENABLE_LOGS (true/false)

2. Install dependencies:
   npm install

3. Run tests:
   npm test

Notes:
- Jest runs in-band to keep test execution sequential.
- Tests use ESM imports. We pass NODE_OPTIONS=--experimental-vm-modules via npm script.
- If your Node version is older, update Node to >= 18 recommended.
