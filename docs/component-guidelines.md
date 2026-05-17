# Component Guidelines

Every component must have one clear purpose and remain visually lightweight.

## Principles

Components should be:
- composable
- reusable
- readable
- mobile-first
- easy to maintain

Avoid:
- giant multipurpose components
- hard-coded layout assumptions
- hidden side effects
- visual styles that only work on desktop

## Folder Intent

`components/ui`:
- low-level UI primitives
- shadcn/ui components
- buttons, inputs, dialogs, tabs, tooltips

`components/layout`:
- app shell
- page containers
- navigation
- sticky bottom actions

`components/study`:
- study flows
- lesson views
- focus mode
- quiz and practice interactions

`components/cards`:
- reusable study cards
- progress cards
- recommendation cards

`components/animations`:
- shared motion wrappers
- transition helpers
- reduced-motion utilities

## Component Checklist

Before finishing a component, check:
- Does it have one job?
- Is it usable on mobile?
- Are tap targets large enough?
- Is the text readable?
- Can it be reused without copying layout code?

