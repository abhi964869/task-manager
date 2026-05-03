# Team Task Manager (Linear Flow)

An ultra-modern, high-performance team task management application built for elite product teams. 

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Database**: PostgreSQL (Optimized for Vercel Postgres)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Credentials)
- **Validation**: Zod

## Features
- **Role-Based Access Control**: Admins can manage projects, team members, and tasks. Members can update their assigned tasks.
- **Dynamic Kanban Board**: Effortlessly move tasks between statuses.
- **Priorities & Deadlines**: Mark tasks as Low, Medium, High, or Urgent. Overdue tasks are highlighted automatically.
- **Beautiful UI/UX**: Dark mode by default, glassmorphism panels, subtle neon glows, and 60fps micro-animations.

---

## Deploy to Vercel via GitHub

This project is fully optimized for **Vercel** deployment with **Vercel Postgres**.

### 1. Push to GitHub
1. Initialize a Git repository if you haven't already: `git init`
2. Commit your code: `git add . && git commit -m "Initial commit"`
3. Push to your GitHub account.

### 2. Set up Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import the GitHub repository you just pushed.
4. **DO NOT** click deploy yet. 

### 3. Provision Vercel Postgres
1. In the Vercel project deployment screen, go to the **Storage** tab.
2. Click **Create Database** -> **Postgres**.
3. Accept the default configuration and click **Create**.
4. Vercel will automatically add the necessary environment variables (like `POSTGRES_URL`) to your project.

### 4. Configure Environment Variables
1. Go to your Vercel Project **Settings** -> **Environment Variables**.
2. Add the following variables:
   - `DATABASE_URL`: Set this to exactly the same value as `POSTGRES_URL` (or reference it directly if preferred).
   - `DIRECT_URL`: Set this to exactly the same value as `POSTGRES_URL_NON_POOLING` (needed by Prisma for migrations).
   - `NEXTAUTH_SECRET`: Generate a random secure string (e.g., using `openssl rand -base64 32`) and paste it here.
   - `NEXTAUTH_URL`: Your Vercel production domain (e.g., `https://your-project.vercel.app`).

### 5. Deploy and Migrate
1. Go back to the **Deployments** tab and click **Deploy**.
2. Vercel will automatically run the `postinstall` script (`prisma generate`) and build the application.
3. Once deployed, you need to sync the database schema. Since this is a serverless environment, you can run the push command locally targeting the Vercel database:
   - Copy the `POSTGRES_URL` from Vercel to your local `.env` file as `DATABASE_URL`.
   - Run `npx prisma db push` locally to create the tables in your Vercel Postgres database.
   - Alternatively, you can run a script or add `npx prisma db push` to the build step (not recommended for production).

Your app is now live and fully functional!

---

## Local Development (PostgreSQL)

If you want to run the app locally using a PostgreSQL database:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` with your local Postgres connection string.

3. **Sync Database**:
   ```bash
   npx prisma db push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
