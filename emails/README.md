# Email templates & workflow

Branded MJML templates for the two moments where I actually email subscribers:

| When | Template | Purpose |
|---|---|---|
| Published a new blog post | `templates/blog-post.mjml` | Clean, light, editorial. One CTA → read the post. |
| Shipped / launched a project | `templates/project-launch.mjml` | Dark, bold, hero-driven. Announces the release + 3 feature highlights. |

Both use `Inter`, portfolio colors (`#0f172a`, `#f4f4f5`, `#020617`), rounded pill buttons, and the same footer signature so the brand stays consistent across formats.

---

## Workflow (blog post OR project launch)

```
┌────────────────────┐    ┌──────────────────┐    ┌───────────────┐    ┌──────────────┐
│ 1. Write content   │ →  │ 2. Fill vars.json│ →  │ 3. Render MJML│ →  │ 4. Send from │
│    (blog / project)│    │   (title, url,   │    │    → HTML     │    │    Loops     │
│                    │    │    cover, etc.)  │    │               │    │              │
└────────────────────┘    └──────────────────┘    └───────────────┘    └──────────────┘
```

### 1. Setup (one time)

```bash
bun add -d mjml
```

### 2. Author

Copy the matching example vars file and edit it:

```bash
cp emails/vars/blog-post.example.json emails/vars/blog-post.json
# or
cp emails/vars/project-launch.example.json emails/vars/project-launch.json
```

Fill in the real title, cover URL, live URL, features, etc.

### 3. Render to HTML

```bash
node emails/render.mjs emails/templates/blog-post.mjml emails/vars/blog-post.json > emails/out/blog-post.html
# preview in a browser
open emails/out/blog-post.html
```

### 4. Send via Loops

Two options depending on the audience:

**A. Newsletter broadcast (everyone who subscribed)** — recommended for blog & launch announcements:
1. Loops dashboard → **Campaigns** → New Campaign
2. Paste the rendered HTML (or use Loops' visual editor with the same copy)
3. Audience: `Blogfolio` user group (that's the tag `createContact` sets)
4. Send / schedule

**B. Transactional (one specific person)** — for personal follow-ups:
1. Loops dashboard → **Transactional** → New Template → paste HTML
2. Copy the `transactionalId`
3. Trigger from code:

```ts
await fetch("https://app.loops.so/api/v1/transactional", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    transactionalId: "clxxx...",
    email: "friend@example.com",
    dataVariables: { title: "…", postUrl: "…" },
  }),
});
```

---

## Template variables

### `blog-post.mjml`
`previewText`, `coverUrl`, `title`, `readingTime`, `publishedDate`, `excerpt`, `postUrl`, `unsubscribeUrl`

### `project-launch.mjml`
`previewText`, `heroUrl`, `projectName`, `tagline`, `projectUrl`,
`feature1Title` / `feature1Body`, `feature2Title` / `feature2Body`, `feature3Title` / `feature3Body`,
`unsubscribeUrl`

`{{unsubscribe}}` in Loops is auto-replaced per recipient — leave the placeholder as-is when sending through Loops.

---

## Design rules baked in

- Max width 600px, mobile-first (breakpoint 599px)
- One primary CTA per email
- Cover image → headline → excerpt → button (F-pattern)
- Dark hero for launches (feels like a release), light card for blog (feels like reading)
- Footer always: unsubscribe + portfolio + one social link
