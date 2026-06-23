Simon J Cleary — Author Website
A dark, atmospheric, single-page author website for noir novelist Simon J Cleary — built with Next.js 16, Tailwind CSS 4, shadcn/ui, Prisma (SQLite), and Bun.

Live domain: https://simonjcleary.com

Table of Contents
Tech Stack
Prerequisites
Quick Start
Environment Variables
Database Setup
Seeding Content
Running Locally
Production Build & Deploy
Option A: Bare Metal / VPS with Caddy
Option B: Docker
Option C: Vercel
Option D: PM2 on a VPS
Reverse Proxy (Caddy)
Admin Panel
Podcast System
Newsletter & Supabase Sync
Internationalization (i18n)
Project Structure
API Routes
Available Scripts
Troubleshooting
Tech Stack
Layer	Technology	Version
Framework	Next.js (App Router, standalone output)	16.x
Language	TypeScript	5.x
Runtime	Bun (package manager & runner)	latest
Styling	Tailwind CSS 4 + tailwindcss-animate	4.x
UI Components	shadcn/ui (Radix UI primitives)	latest
Database ORM	Prisma	6.x
Database	SQLite (file-based)	—
Forms	React Hook Form + Zod validation	7.x / 4.x
Animations	Framer Motion	12.x
State	Zustand (persisted)	5.x
Cloud Sync	Supabase (optional, for subscriber sync)	2.x
Icons	Lucide React	latest
Fonts	Inter, Fraunces, JetBrains Mono (Google Fonts)	—
Reverse Proxy	Caddy	2.x
Prerequisites
Install these before proceeding:

# 1. Bun (preferred) — https://bun.shcurl -fsSL https://bun.sh/install | bash# 2. Node.js 18+ (if not using Bun for everything)# 3. Git# 4. Caddy (for production reverse proxy — optional)#    https://caddyserver.com/download
Quick Start
bash

# 1. Clone the repository
git clone https://github.com/C-Jay69/SIMONJCLEARY_AUTHOR_WEBSITE_230626.git
cd SIMONJCLEARY_AUTHOR_WEBSITE_230626

# 2. Install dependencies
bun install

# 3. Create your .env file (see Environment Variables section below)
cp .env.example .env
# Edit .env with your values

# 4. Set up the database
bun run db:generate
bun run db:push

# 5. Seed the database with books, journal posts, etc.
bun run prisma:seed

# 6. Start the development server
bun run dev
The site will be available at http://localhost:3000.

Environment Variables
Create a .env file in the project root. Here is the full list of supported variables:

env

# ─── Database (required) ────────────────────────────────────────
# SQLite connection string. Path is relative to the project root.
DATABASE_URL="file:./db/custom.db"

# ─── Admin Authentication (required for admin features) ─────────
# Password used to authenticate the admin panel and podcast management.
# Set this to a strong, unique password.
PODCAST_ADMIN_PASSWORD="your-secure-admin-password-here"

# ─── Supabase (optional — for cloud newsletter subscriber sync) ─
# If omitted, all newsletter signups are stored locally in SQLite only.
# If provided, subscribers are synced to Supabase in addition to local storage.
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
.env.example (copy and fill in)
env

DATABASE_URL="file:./db/custom.db"
PODCAST_ADMIN_PASSWORD="changeme-immediately"
# SUPABASE_URL=""
# SUPABASE_ANON_KEY=""
Important: Never commit your .env file to version control. The .gitignore should include .env and *.db files.

Database Setup
The project uses SQLite via Prisma. The database file lives at db/custom.db (relative to the project root).

Step 1: Generate the Prisma client
bash

bun run db:generate
This generates the @prisma/client types based on the schema in prisma/schema.prisma.

Step 2: Push the schema to the database
bash

bun run db:push
This creates (or updates) the SQLite database file and all tables. The schema includes:

Model
Purpose
Subscriber	Newsletter signups (email, name, source)
ContactMessage	Contact form submissions
Book	The Duke Savage trilogy books
JournalPost	Blog/journal entries (Craft & Dispatch categories)
EventItem	Upcoming and past readings/events
PressItem	Press quotes and reviews
Podcast	Podcast episodes (title, audio URL, duration)

Step 3 (Alternative): Run migrations
If you prefer migration files over db push:

bash

bun run db:migrate
Reset the database
This drops all data and re-creates the schema:

bash

bun run db:reset
Seeding Content
The seed script populates the database with canonical content:

3 books in the Duke Savage trilogy (Ghosts in the Ash, Residue, The Record)
4 journal posts (craft essays and dispatches)
Events and press items are left empty (managed as they're confirmed)
bash

bun run prisma:seed
The seed is idempotent — it clears all tables before re-inserting, so it's safe to run multiple times.

Running Locally
Development mode (hot reload)
bash

bun run dev
Opens on http://localhost:3000. Output is logged to both console and dev.log.

Production mode (standalone)
bash

# Build the standalone output
bun run build

# Start the production server
bun run start
The build script does three things:

Runs next build with output: "standalone" (configured in next.config.ts)
Copies .next/static into .next/standalone/.next/
Copies the public/ directory into .next/standalone/
The start script runs the standalone server at http://localhost:3000. Output is logged to both console and server.log.

Production Build & Deploy
Option A: Bare Metal / VPS with Caddy
This is the recommended deployment method and matches the included Caddyfile.

1. Prepare the server
bash

# SSH into your VPS
ssh user@your-server-ip

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Caddy
# Debian/Ubuntu:
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy

# Clone the repo
git clone https://github.com/C-Jay69/SIMONJCLEARY_AUTHOR_WEBSITE_230626.git /var/www/simonjcleary
cd /var/www/simonjcleary

# Install dependencies
bun install

# Set up environment
cp .env.example .env
nano .env  # Edit with your production values

# Database setup
bun run db:generate
bun run db:push
bun run prisma:seed
2. Build for production
bash

bun run build
3. Configure Caddy
The included Caddyfile is configured to proxy port 3000 and supports a dynamic port override via query parameter (?XTransformPort=XXXX). For a standard deployment, you only need the default block:

text

simonjcleary.com {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote_host}
    }
}
Replace simonjcleary.com with your actual domain. Caddy will automatically provision and renew TLS/SSL certificates via Let's Encrypt.

bash

# Copy or symlink the Caddyfile
sudo cp Caddyfile /etc/caddy/Caddyfile
# Or edit it directly:
sudo nano /etc/caddy/Caddyfile

# Reload Caddy
sudo systemctl reload caddy
4. Start the app with a process manager
Using systemd (recommended):

bash

# Create a systemd service file
sudo nano /etc/systemd/system/simonjcleary.service
ini

[Unit]
Description=Simon J Cleary Author Website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/simonjcleary
Environment=NODE_ENV=production
ExecStart=/home/your-user/.bun/bin/bun .next/standalone/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
bash

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable simonjcleary
sudo systemctl start simonjcleary

# Check status
sudo systemctl status simonjcleary

# View logs
journalctl -u simonjcleary -f
5. Firewall
bash

sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
Option B: Docker
Create a Dockerfile in the project root (not currently included):

dockerfile

FROM oven/bun:1 AS base

# ─── Dependencies ───
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile
RUN bun run db:generate

# ─── Builder ───
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="file:./db/custom.db"
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run db:push
RUN bun run prisma:seed
RUN bun run build

# ─── Runner ───
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/db ./db
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
Build and run:

bash

# Build the image
docker build -t simonjcleary .

# Run the container
docker run -d \
  --name simonjcleary \
  -p 3000:3000 \
  -e PODCAST_ADMIN_PASSWORD="your-secure-password" \
  -e DATABASE_URL="file:./db/custom.db" \
  -v simonjcleary-db:/app/db \
  --restart unless-stopped \
  simonjcleary
With Docker Compose:

yaml

# docker-compose.yml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./db/custom.db
      - PODCAST_ADMIN_PASSWORD=${PODCAST_ADMIN_PASSWORD}
      - SUPABASE_URL=${SUPABASE_URL:-}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-}
    volumes:
      - app-db:/app/db
    restart: unless-stopped

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data
      - caddy-config:/config
    depends_on:
      - web
    restart: unless-stopped

volumes:
  app-db:
  caddy-data:
  caddy-config:
bash

docker compose up -d
Option C: Vercel
Since the app uses SQLite (a file-based database), deploying to Vercel has limitations:

Vercel's serverless functions are ephemeral — the SQLite file is lost on each cold start.
This works for read-only content (if you pre-seed) but not for persistent writes (newsletter signups, contact messages).
If you want to deploy to Vercel, you should first migrate to a cloud database (PostgreSQL via Supabase or PlanetScale) by changing the Prisma datasource:

prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
Then:

bash

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Set environment variables in the Vercel dashboard under Settings > Environment Variables:

DATABASE_URL
PODCAST_ADMIN_PASSWORD
SUPABASE_URL (optional)
SUPABASE_ANON_KEY (optional)
Option D: PM2 on a VPS
An alternative to systemd for process management:

bash

# Install PM2 globally
bun add -g pm2

# Build
bun run build

# Start the app
pm2 start .next/standalone/server.js --name simonjcleary --interpreter bun

# Save the process list and set up auto-restart on reboot
pm2 save
pm2 startup
Useful PM2 commands:

bash

pm2 logs simonjcleary    # View logs
pm2 restart simonjcleary # Restart
pm2 stop simonjcleary    # Stop
pm2 monit                # Monitor CPU/memory
Reverse Proxy (Caddy)
The included Caddyfile provides:

Default proxy — Routes all traffic on port 80/443 to localhost:3000.
Dynamic port override — Accepts ?XTransformPort=XXXX query parameter for testing alternative ports.
Automatic HTTPS — Caddy provisions Let's Encrypt certificates automatically when it sees a domain name.
Key headers forwarded:
Host — Preserves the original domain.
X-Forwarded-For — Passes the client's real IP.
X-Forwarded-Proto — Indicates http or https.
X-Real-IP — The actual client IP address.
Customizing the Caddyfile
Edit the first line to match your domain:

text

simonjcleary.com {
    # ... proxy config
}
For multiple domains (e.g., with and without www):

text

simonjcleary.com, www.simonjcleary.com {
    reverse_proxy localhost:3000
}
Admin Panel
The site includes a built-in admin panel (accessed via the theme toggle or a hidden route) that requires password authentication.

Features
Podcast management: Upload, reorder, and delete podcast episodes.
Chapter/excerpt management: Edit book excerpts, taglines, and descriptions via a rich text editor (MDXEditor).
Drag-and-drop reordering: Powered by @dnd-kit.
Authentication
Admin routes are protected by a shared password sent via the x-admin-password HTTP header or posted to /api/admin/auth. Set this in your environment:

env

PODCAST_ADMIN_PASSWORD="a-very-strong-password"
Protected routes
Route
Method
Purpose
/api/admin/auth	POST	Verify admin password
/api/admin/podcasts/:id	DELETE	Delete a podcast episode
/api/admin/chapters	GET	List all books with excerpt fields
/api/admin/chapters/:id	PUT	Update a book's excerpt/tagline/description

Podcast System
The podcast section on the homepage displays episodes stored in the Podcast database table.

How it works
Public endpoint: GET /api/podcasts returns all episodes ordered by episode number (newest first). No authentication required.
Admin upload: The admin panel lets you upload audio files (stored in public/podcasts/) and enter episode metadata.
Audio files: Uploaded files are saved to public/podcasts/ and referenced via relative URLs. The audioUrl field in the database points to these files.
Deletion: When an episode is deleted via the admin panel, the corresponding audio file on disk is also removed (best-effort).
Newsletter & Supabase Sync
The newsletter subscription system has a two-tier architecture:

Local (always active)
All subscriber data is stored in the local Subscriber table (SQLite).
This is the source of truth.
Subscriptions are idempotent — duplicate emails return success.
Cloud sync (optional)
If SUPABASE_URL and SUPABASE_ANON_KEY are set, each new subscription is also upserted to a subscribers table in Supabase.
Sync failures are non-fatal — they are logged as warnings and don't block the local save.
Setting up Supabase
Create a Supabase project at supabase.com.
Run the following SQL in the Supabase SQL Editor (also documented in src/lib/supabase.ts):
sql

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  source text default 'website',
  created_at timestamptz default now()
);

alter table public.subscribers enable row level security;

create policy "Allow anon inserts" on public.subscribers
  for insert to anon with check (true);

create policy "Allow anon select" on public.subscribers
  for select to anon using (true);
Copy your project URL and anon key into .env.
Internationalization (i18n)
The site supports four languages using a custom Zustand-based i18n system (not next-intl middleware — all client-side):

Code
Language
en	English (default)
es	Spanish
fr	French
zh	Simplified Chinese

The language switcher component (src/components/site/lang-switcher.tsx) toggles between these. Translations are stored in src/lib/i18n.ts as a flat key-value dictionary with keys like nav.books, hero.eyebrow, etc.

To add a new language:

Add the language code to the Lang type and LANGUAGES array in src/lib/i18n.ts.
Add a new dictionary entry (e.g., const ja: Dict = { ... }) with all required keys.
Add the entry to the dictionaries map.
Project Structure
text

SIMONJCLEARY_AUTHOR_WEBSITE_230626/
├── Caddyfile                          # Caddy reverse proxy config
├── components.json                    # shadcn/ui component config
├── eslint.config.mjs                  # ESLint config (relaxed rules)
├── next.config.ts                     # Next.js config (standalone output)
├── package.json                       # Dependencies and scripts
├── postcss.config.mjs                 # PostCSS (Tailwind plugin)
├── tailwind.config.ts                 # Tailwind theme and shadcn tokens
├── tsconfig.json                      # TypeScript configuration
├── bun.lock                           # Bun lockfile
│
├── db/
│   └── custom.db                      # SQLite database (generated)
│
├── prisma/
│   ├── schema.prisma                  # Database schema (7 models)
│   └── seed.ts                        # Seed script (books, journal posts)
│
├── public/
│   ├── robots.txt                     # Search engine directives
│   ├── logo.svg                       # SVG logo
│   ├── logo-icon.png                  # PNG logo icon
│   └── images/
│       ├── author-simon-cleary.jpg    # Author photo
│       └── books/
│           ├── ghosts-in-the-ash.jpg  # Book 1 cover
│           ├── ash-and-iron.jpg       # Book 2 cover
│           ├── the-hollow-tide.jpg    # Book 3 cover
│           └── the-long-dark-pier.jpg # Book 4 cover
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (fonts, theme, metadata)
│   │   ├── page.tsx                   # Single-page homepage (all sections)
│   │   ├── globals.css                # Global styles + CSS variables
│   │   ├── favicon.ico                # Favicon
│   │   ├── icon.png                   # PWA icon
│   │   ├── apple-icon.png             # Apple touch icon
│   │   └── api/
│   │       ├── route.ts               # Root API
│   │       ├── contact/route.ts       # POST: contact form submissions
│   │       ├── podcasts/route.ts      # GET: public podcast list
│   │       ├── newsletter/
│   │       │   └── subscribe/route.ts # POST: newsletter signup
│   │       └── admin/
│   │           ├── auth/route.ts      # POST: admin password verification
│   │           ├── podcasts/
│   │           │   └── [id]/route.ts  # DELETE: remove podcast episode
│   │           └── chapters/
│   │               ├── route.ts       # GET: list books for admin
│   │               └── [id]/route.ts  # PUT: update book excerpt/content
│   │
│   ├── components/
│   │   ├── site/                      # App-specific components
│   │   │   ├── admin-panel.tsx        # Admin panel (podcasts, chapters)
│   │   │   ├── hero.tsx               # Hero section
│   │   │   ├── books-section.tsx      # Books carousel
│   │   │   ├── about-section.tsx      # About the author
│   │   │   ├── journal-section.tsx    # Journal/blog posts
│   │   │   ├── events-section.tsx     # Upcoming events
│   │   │   ├── podcast-section.tsx    # Podcast player
│   │   │   ├── press-strip.tsx        # Press quotes marquee
│   │   │   ├── excerpt-section.tsx    # Free chapter reader
│   │   │   ├── case-file-section.tsx  # Case file decorative section
│   │   │   ├── contact-form.tsx       # Contact form
│   │   │   ├── newsletter-form.tsx    # Email signup
│   │   │   ├── buy-sheet.tsx          # Buy links drawer
│   │   │   ├── buy-links.ts           # Retailer URLs
│   │   │   ├── site-header.tsx        # Sticky navigation
│   │   │   ├── site-footer.tsx        # Footer
│   │   │   ├── section.tsx            # Reusable section wrapper
│   │   │   ├── theme-provider.tsx     # Dark/light theme context
│   │   │   ├── theme-toggle.tsx       # Theme toggle button
│   │   │   ├── lang-switcher.tsx      # Language selector
│   │   │   ├── grain.tsx              # Film grain overlay effect
│   │   │   └── types.ts               # Shared TypeScript types
│   │   └── ui/                        # shadcn/ui primitives (40+ components)
│   │
│   ├── hooks/
│   │   ├── use-toast.ts               # Toast notification hook
│   │   └── use-mobile.ts              # Mobile breakpoint hook
│   │
│   └── lib/
│       ├── db.ts                      # Prisma client singleton
│       ├── supabase.ts                # Supabase client (optional)
│       ├── i18n.ts                    # i18n dictionary (EN/ES/FR/ZH)
│       ├── date-utils.ts              # Date formatting helpers
│       └── utils.ts                   # cn() utility, misc helpers
│
├── upload/                            # Reference assets (not used in build)
└── worklog.md                         # Agent development worklog
API Routes
Public Routes
Endpoint
Method
Auth
Description
/api/podcasts	GET	None	List all podcast episodes (newest first)
/api/contact	POST	None	Submit a contact form message (validated with Zod)
/api/newsletter/subscribe	POST	None	Subscribe to the newsletter (idempotent, syncs to Supabase if configured)

Admin Routes
All admin routes require the PODCAST_ADMIN_PASSWORD sent either as:

A JSON body field password (for /api/admin/auth)
An x-admin-password HTTP header (for all other admin routes)
Endpoint
Method
Description
/api/admin/auth	POST	Verify the admin password
/api/admin/chapters	GET	List all books with excerpt/tagline/description fields
/api/admin/chapters/:id	PUT	Update a book's excerpt, tagline, or description
/api/admin/podcasts/:id	DELETE	Delete a podcast episode and its audio file

Available Scripts
Script
Command
Description
dev	next dev -p 3000	Start development server with hot reload
build	next build + copy static/public	Create standalone production build
start	NODE_ENV=production bun .next/standalone/server.js	Start production server
lint	eslint .	Run ESLint
db:generate	prisma generate	Generate Prisma client from schema
db:push	prisma db push	Push schema to SQLite (no migration files)
db:migrate	prisma migrate dev	Run database migrations
db:reset	prisma migrate reset	Drop all data and re-apply migrations
prisma:seed	bun prisma/seed.ts	Seed the database with content

Troubleshooting
"prisma generate" fails or client not found
bash

# Ensure you're using Bun and the schema is valid
bunx prisma generate

# If path aliases are an issue, regenerate
rm -rf node_modules/.prisma
bun run db:generate
SQLite database locked errors
SQLite uses file-level locking. This typically happens when multiple processes access the database simultaneously. In production, ensure only one Node.js process is running against the database. If using PM2, set instances: 1 (do not cluster).

Build fails with "module not found"
bash

# Clear caches and reinstall
rm -rf node_modules .next
bun install
bun run db:generate
bun run build
Caddy fails to start
bash

# Check Caddy configuration syntax
caddy validate --config /etc/caddy/Caddyfile

# Check Caddy logs
sudo journalctl -u caddy -f

# Ensure port 80/443 are not in use
sudo lsof -i :80
sudo lsof -i :443
Podcast audio files not serving
Audio files are stored in public/podcasts/. After a build, the build script copies the public/ folder into .next/standalone/public/. If you upload new audio files after building, you need to either:

Rebuild the app, or
Manually copy the new files to .next/standalone/public/podcasts/
Admin panel returns 401 / 500
401: The x-admin-password header doesn't match PODCAST_ADMIN_PASSWORD in .env.
500: The PODCAST_ADMIN_PASSWORD environment variable is not set on the server. Check your .env file and that it's loaded in production.
Google Fonts not loading (offline deployment)
The site uses Google Fonts (Inter, Fraunces, JetBrains Mono) via next/font. If deploying to an environment without internet access, you'll need to self-host the fonts. Download the font files and update src/app/layout.tsx to use localFont instead of the Google import.

License
This project is private. All rights reserved
