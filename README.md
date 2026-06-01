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


### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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


---

## License

MIT — see [LICENSE](LICENSE) for details.


