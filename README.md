# NirogiTanman — Healthcare Ecosystem

> India's most comprehensive healthcare platform — connecting patients with doctors, clinics, labs, pharmacies, and wellness providers.

---

## 🏗️ Architecture Overview

NirogiTanman is a **monorepo** with 4 Next.js applications sharing common packages.

```
nirogitanman/
├── apps/
│   ├── web/          → nirogitanman.com         (Public website, marketing)
│   ├── app/          → app.nirogitanman.com      (Client / Patient portal)
│   ├── partner/      → partner.nirogitanman.com  (Healthcare provider portal)
│   └── admin/        → admin.nirogitanman.com    (Platform administration)
├── packages/
│   ├── types/        → Shared TypeScript interfaces & enums
│   ├── supabase/     → Supabase client (browser, server, middleware, admin)
│   └── ui/           → Shared UI components (shadcn-compatible)
└── supabase/
    ├── migrations/   → SQL schema & RLS policies
    └── config.toml   → Local dev config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Supabase project (free tier works)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy and fill in your Supabase credentials:

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/app/.env.local
cp .env.example apps/partner/.env.local
cp .env.example apps/admin/.env.local
```

### 3. Apply Database Migrations

```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db push

# Or run migrations directly on your remote project:
# supabase db push --db-url postgresql://...
```

### 4. Run Applications

```bash
npm run dev:web      # http://localhost:3000 — Public website
npm run dev:app      # http://localhost:3001 — Client portal
npm run dev:partner  # http://localhost:3002 — Partner portal
npm run dev:admin    # http://localhost:3003 — Admin panel
```

---

## 🔐 Authentication Flow

```
User visits any app
        ↓
Supabase Auth (email/password / OAuth)
        ↓
Trigger: handle_new_user() auto-creates profile
        ↓
Middleware reads profile.role
        ↓
client      → app.nirogitanman.com/dashboard
partner     → partner.nirogitanman.com/dashboard
admin       → admin.nirogitanman.com/dashboard
super_admin → admin.nirogitanman.com/dashboard
```

**Key principle:** Authentication roles are fixed (client, partner, admin, super_admin).  
Partner **types** (Doctor, Lab, Pharmacy, etc.) are stored as **data** in the `partner_types` table — never as auth roles.

---

## 👥 User Roles

| Role | Description | Portal |
|------|-------------|--------|
| `client` | Patients / healthcare consumers | app.nirogitanman.com |
| `partner` | Any healthcare service provider | partner.nirogitanman.com |
| `admin` | Platform administrators | admin.nirogitanman.com |
| `super_admin` | Full unrestricted access | admin.nirogitanman.com |

---

## 🏥 Partner Types (Data-Driven)

Partners are categorized by type stored in the `partner_types` table. Adding a new healthcare service type requires **zero code changes** — just insert a row:

```sql
INSERT INTO partner_types (name, slug, icon) VALUES ('Ayurvedic Doctor', 'ayurvedic', '🌿');
```

Current types: Doctor, Hospital, Clinic, Laboratory, Pharmacy, Dietitian, Nutritionist, Psychologist, Yoga Trainer, Fitness Coach, Home Care Provider, Ambulance Service, Insurance Partner, NGO, Blood Bank.

---

## 🗄️ Database Schema

### Core Tables
- **profiles** — All users (linked to Supabase Auth)
- **partner_types** — Healthcare provider categories (data-driven)
- **partners** — Provider business profiles
- **service_categories** — Service groupings
- **services** — Individual services
- **partner_services** — Services offered by each partner with pricing

### Transactional Tables
- **appointments** — All bookings
- **medical_records** — Patient health documents
- **prescriptions** + **prescription_medicines** — Digital prescriptions
- **orders** + **order_items** — Medicine/lab orders
- **payments** — Payment records with gateway integration

### Platform Tables
- **reviews** — Ratings and feedback
- **notifications** — In-app notifications
- **blog_posts** — CMS content
- **audit_logs** — Complete platform audit trail

### Key Database Features
- UUID primary keys throughout
- PostGIS for geo-location (`GEOGRAPHY(POINT)` + GIST index)
- `pg_trgm` for fuzzy partner name search
- Auto-triggers for `updated_at`, partner rating calculation, and geolocation sync
- `handle_new_user()` trigger auto-creates profiles on signup

---

## 🔒 Row Level Security

Every table has RLS enabled. Summary:

| Table | client | partner | admin |
|-------|--------|---------|-------|
| profiles | own only | own only | all |
| partners | verified (read) | own only | all |
| appointments | own only | own patients | all |
| medical_records | own only | their patients | all |
| payments | own only | own earnings | all |
| notifications | own only | own only | all |
| audit_logs | ❌ | ❌ | all |

---

## 🗂️ App Router Structure

```
apps/app/src/app/
├── (dashboard)/
│   ├── layout.tsx          ← Auth check + sidebar
│   ├── dashboard/page.tsx
│   ├── appointments/page.tsx
│   ├── records/page.tsx
│   ├── orders/page.tsx
│   ├── notifications/page.tsx
│   └── profile/page.tsx
├── login/page.tsx
├── signup/page.tsx
├── layout.tsx
└── globals.css
```

---

## 🔌 Adding New Healthcare Modules

The architecture is designed for zero-friction module addition:

1. **New Partner Type** → INSERT into `partner_types`. Done.
2. **New Service** → INSERT into `services`. Done.
3. **New Feature Module** (e.g., Telemedicine) → Add pages to `apps/app`, `apps/partner`. Auth unchanged.
4. **New API** → Add Server Actions or Route Handlers. RLS protects data automatically.

### Planned Future Modules
- [ ] AI Health Assistant
- [ ] Wearable Device Integration
- [ ] Corporate Healthcare Plans
- [ ] Organ / Blood Donation Registry
- [ ] Mental Wellness Programs
- [ ] Online Pharmacy with Prescription Validation
- [ ] Insurance Claim Management

---

## 🚢 Deployment

### Vercel (Recommended)

Each app deploys independently to Vercel:

```bash
# Deploy web
vercel --cwd apps/web

# Deploy client app
vercel --cwd apps/app

# Deploy partner portal
vercel --cwd apps/partner

# Deploy admin panel
vercel --cwd apps/admin
```

**Vercel Project Settings:**
- Framework: Next.js
- Root Directory: `apps/web` (or respective app)
- Build Command: `cd ../.. && npm run build --workspace=apps/web`

### Environment Variables (Production)
Set in each Vercel project dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never expose)

### Custom Domains
- `nirogitanman.com` → apps/web
- `app.nirogitanman.com` → apps/app
- `partner.nirogitanman.com` → apps/partner
- `admin.nirogitanman.com` → apps/admin

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| ORM/Query | Supabase JS Client + Server Actions |
| Forms | React Hook Form + Zod |
| Client State | TanStack Query |
| Monorepo | npm workspaces |
| Deployment | Vercel |

---

## 🔧 Development Tips

- Run `supabase db diff` to generate migrations from schema changes
- Use `supabase gen types typescript` to regenerate TypeScript types from DB
- Add `SUPABASE_SERVICE_ROLE_KEY` only to server-side env — never `NEXT_PUBLIC_`
- All Server Actions validate input with Zod before touching the database
- Middleware runs on every request and handles auth routing automatically
