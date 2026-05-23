# DevPath 🗺️

**DevPath** is a modern SaaS learning platform where developers can explore curated roadmaps, track their progress, and master new skills. Built with Next.js 14 App Router, MongoDB, Prisma, and NextAuth.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB Atlas |
| ORM | Prisma |
| Auth | NextAuth.js v4 (JWT + OAuth) |
| UI | Tailwind CSS + shadcn/ui |
| Roadmap Visualization | ReactFlow |
| Animations | Framer Motion |
| Validation | Zod |
| Caching | In-memory (Redis optional) |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/dipanshurdev/devpath.git
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL=mongodb+srv://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

Optional (for OAuth):

```env
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### 3. Set up the database

```bash
# Push schema to MongoDB and generate Prisma client
npm run setup:prisma

# Seed with sample roadmaps and an admin user
npm run db:seed
```

Default admin credentials (override via env):
- Email: `admin@devpath.dev`
- Password: `Admin@123456`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix |
| `npm run type-check` | Run TypeScript type checking |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:push` | Push schema changes to DB |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run setup:prisma` | Generate + push schema |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset DB and re-seed |
| `npm run db:import` | Import roadmaps from JSON file |

---

## Project Structure

```
devpath/
├── app/                        # Next.js App Router pages and API routes
│   ├── api/                    # API route handlers
│   │   ├── admin/stats/        # Admin stats endpoint
│   │   ├── auth/               # NextAuth + registration
│   │   ├── dashboard/          # Dashboard data
│   │   ├── roadmaps/           # Roadmap CRUD, likes, bookmarks, progress
│   │   ├── subscriptions/me/   # Current user subscription
│   │   └── users/              # User profile endpoints
│   ├── admin/                  # Admin dashboard pages
│   ├── dashboard/              # User dashboard
│   ├── roadmaps/               # Roadmap list and detail pages
│   ├── login/ register/        # Auth pages
│   ├── pricing/                # Pricing page
│   ├── error.tsx               # Global error boundary
│   └── not-found.tsx           # 404 page
│
├── components/                 # Shared UI components
│   ├── roadmaps/               # Roadmap-specific components (RoadmapFlow, etc.)
│   ├── navbar/                 # Navigation components
│   ├── ui/                     # shadcn/ui primitives
│   └── ...
│
├── lib/                        # Shared utilities and configuration
│   ├── auth.ts                 # NextAuth configuration
│   ├── auth-utils.ts           # requireAuth / requireAdmin helpers
│   ├── api-handler.ts          # withErrorHandler wrapper + ApiError class
│   ├── cache.ts                # In-memory / Redis cache abstraction
│   ├── config.ts               # Central app config (pagination, TTLs, feature gates)
│   ├── env.ts                  # Zod-validated environment variables
│   ├── feature-gates.ts        # checkFeatureAccess + subscription tier logic
│   ├── logger.ts               # Structured JSON logger
│   └── prisma/
│       ├── client.ts           # Prisma client singleton
│       └── queries.ts          # All database query functions
│
├── features/                   # Feature barrel exports
│   ├── auth/                   # Auth feature re-exports
│   └── roadmaps/               # Roadmap feature re-exports
│
├── prisma/
│   └── schema.prisma           # Database schema (MongoDB + Prisma)
│
├── scripts/
│   └── seed-sample-data.ts     # Idempotent database seed script
│
├── tests/
│   └── data-isolation.test.ts  # Integration tests for multi-user data isolation
│
├── types/
│   └── index.ts                # Shared TypeScript types
│
├── middleware.ts               # NextAuth route protection middleware
├── .env.example                # Environment variable template
└── .eslintrc.json              # ESLint configuration
```

---

## Key Features

- **Authentication** — Email/password + Google/GitHub OAuth via NextAuth
- **Roadmaps** — Browse, filter, search, and track progress through learning roadmaps
- **Dashboard** — Personal learning stats, weekly activity, in-progress and saved roadmaps
- **Admin Panel** — Create and manage roadmaps, view real-time platform stats
- **Subscriptions** — FREE/PRO/TEAM tier architecture with feature gating
- **Caching** — In-memory cache (Redis-ready) for roadmap list and detail endpoints
- **Data Isolation** — All user data (progress, bookmarks, likes) is scoped per user

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## License

MIT — see [LICENSE](LICENSE) for details.



--------------------------


Here are some SaaS-style name suggestions for your developer learning platform:

Modern & Direct:

Roadify - Follows the Shopify/Spotify naming pattern, catchy and memorable
SkillFlow - Emphasizes smooth progression through skills
PathMaster - Clear value proposition, "master your path"
CareerForge - Strong, implies building/crafting careers
Growth-Focused:
5. Ascend - Simple, implies upward trajectory
6. Catalyst - Catalyst for developer growth
7. Nexus - Connection/hub for learning community
8. Waypoint - Checkpoints in your learning journey

Skill-Centric:
9. SkillVault - Your skill repository/database
10. MasterClass (if available) - Premium learning positioning
11. CodeMastery - Developer-focused, clear intent
12. DevTrajectory - Your development path

Tech-Forward:
13. Trajectory - Modern, professional, about direction
14. Compass - Navigate your learning journey
15. Velocity - Growth and momentum-focused
16. Constellation - Connected learning nodes/stars

My top picks:

Roadify - Best for brand recognition (follows successful SaaS naming)
Ascend - Short, powerful, easy to remember
Catalyst - Professional, implies transformation
Which direction appeals to you most? I can brainstorm more in a specific category!

Claude Haiku 4.5 • 1x

----------------------------------------