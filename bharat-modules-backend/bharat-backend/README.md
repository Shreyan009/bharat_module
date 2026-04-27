# Bharat Modules Backend

Node.js + Express backend for Bharat Modules B2B platform.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```

3. **Database Setup**
   Ensure your PostgreSQL database is running and `DATABASE_URL` is set.
   ```bash
   npm run db:setup
   npm run db:seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Server will start on port 4000 (or as specified in .env).
