# Architecture

Keep the project modular and easy to maintain.

## Recommended Structure

```text
/project-root
|-- /app
|-- /components
|   |-- /ui
|   |-- /layout
|   |-- /study
|   |-- /cards
|   `-- /animations
|-- /lib
|-- /hooks
|-- /styles
|-- /public
|-- /docs
|-- tailwind.config.ts
|-- components.json
`-- next.config.js
```

## Rules

Prefer:
- reusable components
- small focused files
- shared design tokens
- consistent naming
- simple data flow

Avoid:
- huge page files
- duplicated card/button styles
- one-off CSS scattered across many files
- mixing business logic deeply into UI components

## Next.js

Use the App Router for new pages.

Prefer:
- server components by default
- client components only when interactivity is needed
- colocated loading and error states when helpful

## Styling

Prefer project-level conventions from:
- `docs/color-system.md`
- `docs/typography.md`
- `docs/ui-rules.md`

Keep style decisions consistent across the whole project.

