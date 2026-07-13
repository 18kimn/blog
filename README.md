# personal website for nathan kim

Has some of my current work, some fun with web
design/development, and an opportunity for myself to learn
basics in a lot of JS tools.

Hosted at [nathan-kim.org](https://nathan-kim.org). You can
tinker with this by:

```
git clone https://git.nathan-kim.org/18kimn/blog
cd blog
npm install
npm run dev
```

(Ignore that and do it your own way if you're familiar with
Node projects)

This site is built with Svelte!

## Repo map

SvelteKit, `adapter-node` in prod. Package manager is pnpm.

- **Content** — markdown `index.md` files under
  `src/routes/[postType]/{writing,projects}/<slug>/`,
  rendered via mdsvex. Custom remark/rehype passes live in
  `src/hooks/` (`resolveLinks`, `addFootnotes`, `makeTOC`),
  wired up in `svelte.config.js`. The `notebook/` section is
  a git submodule.
- **CV** — page in `src/routes/cv/`; regenerate from
  `src/hooks/CV/` with `pnpm cv`. Citation styles in
  `cv/csl/`. Zotero auto-exports a CV to
  src/hooks/CV/personal.json.
- **Media**: Renders a media CV that Zotero auto-exports to
  src/routes/press/media.json
- **Guestbook** — `src/routes/guestbook/`, using
  `@auth/sveltekit` + Prisma/SQLite (`prisma/schema.prisma`,
  `board.db`).
- **Uptime fallback** — a Cloudflare Worker
  (`worker/index.js` + `wrangler.toml`) probes
  `src/routes/health/+server.ts` and serves
  `src/routes/cloudflare-error/` when the origin is down.
  Deploy with `pnpm deploy:worker` (builds the inlined error
  page first).
