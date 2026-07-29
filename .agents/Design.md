# Design Guide

## Design System Overview

This project uses **TailwindCSS v4** with **Shadcn UI** primitives and a custom design token system defined in `resources/css/app.css`.

---

## Typography

| Usage     | Font                                 |
| --------- | ------------------------------------ |
| UI / Body | Instrument Sans                      |
| Fallback  | ui-sans-serif, system-ui, sans-serif |

Configured via `@theme` in `app.css`:

```css
@theme {
    --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
}
```

---

## Color System

Colors use **oklch** color space for better perceptual uniformity. Tokens are defined in `resources/css/app.css` and support **light/dark mode** via `.dark` class.

Key tokens include:

- `--background` / `--foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive` / `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--sidebar-*` tokens for sidebar-specific theming

---

## Theme (Dark Mode)

- Dark mode toggle implemented via `ThemeProvider` and `ThemeToggle` components.
- Theme persists using `localStorage`.
- Dark mode applied via `.dark` class on `<html>` element.
- Custom variant: `@custom-variant dark (&:is(.dark *))`.

Components:

- `resources/js/Components/theme/ThemeProvider.jsx`
- `resources/js/Components/theme/ThemeToggle.jsx`

---

## Layout System

### Authenticated Layout (`LayoutApp`)

- Fixed sidebar on the left (collapsible).
- Header bar at the top with user menu and theme toggle.
- Main content area scrollable on the right.

### Auth Layout (`LayoutAuth`)

- Centered card layout for login/register pages.
- Clean, minimal design.

---

## Component Library

### UI Primitives (`Components/ui/`)

Shadcn UI components — do not modify directly. Include:

- `Button`, `Input`, `Label`, `Textarea`
- `Select`, `Checkbox`, `Switch`
- `Dialog`, `Sheet`, `Dropdown`
- `Avatar`, `Badge`, `Separator`
- `Card`, `Table`
- `Tooltip`, `Popover`

### Common Page Components (`Components/common/`)

Shared components used across pages:

| Component         | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `PageHeader`      | Page title + action button (e.g., "Create") |
| `Search`          | Debounced search input                      |
| `Delete`          | SweetAlert2 confirmation + delete form      |
| `TablePagination` | Inertia-aware pagination links              |
| `TableEmpty`      | Empty state row for tables                  |

### Form Components (`Components/form/`)

| Component      | Purpose                         |
| -------------- | ------------------------------- |
| `StatusSelect` | Reusable active/inactive select |

### Table Components (`Components/table/`)

| Component    | Purpose                             |
| ------------ | ----------------------------------- |
| `BasicTable` | Standard table with head/body slots |

### Sidebar (`Components/Sidebar/`)

- `menuConfig.js` — defines navigation items with label, icon, route, and required permission.
- Permission-aware: menu items hidden if user lacks the permission.

---

## Page Structure Convention

Every CRUD module follows this page structure:

```
Pages/ResourceName/
├── Index.jsx   → List view with table + search + pagination
├── Create.jsx  → Create form
└── Edit.jsx    → Edit form (pre-filled)
```

### Index Page Pattern

```jsx
// Props from controller
const { data, filters, can } = usePage().props;

// Components used
<PageHeader title="Users" />
<Search />
<BasicTable>
  <TableEmpty />
  <TablePagination />
</BasicTable>
```

### Create/Edit Page Pattern

```jsx
const { data, setData, post/put, errors } = useForm({ ... });

// Components used
<PageHeader title="Create User" />
<form onSubmit={...}>
  <Input />, <Select />, <Button />
</form>
```

---

## Alert / Notification System

- **Success/Error Toasts**: Flash messages from `flash.success` and `flash.error` via `usePage().props`.
- **Confirmation Dialogs**: `Delete` component uses SweetAlert2 for destructive action confirmation.
- **Form Errors**: Displayed inline via `errors` from `useForm()`.

---

## Responsive Design

- Sidebar collapses on mobile.
- Tables scroll horizontally on small screens.
- Forms stack vertically on small screens.

---

## Icons

Use `lucide-react` for all icons. Don't use symbol (e.g. `+`, `-`, etc.) as icon name, but use the icon name from `lucide-react` (e.g. `Plus`, `Minus`, etc.). Example:

```jsx
import { Users, Settings, Shield } from "lucide-react";
```
