# Coding Rules & Standards

These rules apply to all code written in this project. Follow them without exception.

---

## PHP / Laravel

### Controllers

- Every controller must declare a `public static function middleware()` method for Spatie permission gates.
- Use `$id` parameter for `show`, `edit`, `update`, and `destroy` methods. Never use implicit route model binding.
- Use `Model::findOrFail($id)` inside the method body.
- Always redirect with named routes: `redirect()->route('resource.index')`.
- Controllers must stay lean — no business logic or validation inline.

```php
// CORRECT
public function edit($id)
{
    $user = User::findOrFail($id);
    ...
}

// WRONG — do not use route model binding
public function edit(User $user)
{
    ...
}
```

### Form Requests

- All validation belongs in Form Requests under `app/Http/Requests/{Domain}/`.
- File naming: `StoreResourceRequest.php`, `UpdateResourceRequest.php`.
- Always return proper `authorize()` (typically `return true;` — auth handled by middleware).

### Models

- Place all Eloquent models in `app/Models/`.
- Add `HasRoles` and `HasPermissions` traits from Spatie to the User model only.
- Use `$fillable` — never use `$guarded = []`.

### Routes

- All web routes are in `routes/web.php`.
- Always name routes using the Laravel resource naming convention (`users.index`, `users.create`, etc.).
- Do NOT inline middleware on routes — use the controller's `middleware()` method instead.

### Seeders & Permissions

- Permissions follow the pattern: `resource.action` (e.g., `users.index`, `users.create`).
- Always seed the four standard permissions per resource: `index`, `create`, `edit`, `delete`.

---

## React / Frontend

### Component Naming

- Component files: **PascalCase** with `.jsx` extension (e.g., `PageHeader.jsx`).
- Utility files: **camelCase** with `.js` extension (e.g., `permissions.js`).
- One component per file.

### Component Location

| Type                 | Location              |
| -------------------- | --------------------- |
| Page-level shared UI | `Components/common/`  |
| Form controls        | `Components/form/`    |
| Table components     | `Components/table/`   |
| Theme components     | `Components/theme/`   |
| Sidebar components   | `Components/Sidebar/` |
| Shadcn primitives    | `Components/ui/`      |
| Page views           | `Pages/{Module}/`     |

### Inertia Forms

- Always use `useForm()` from `@inertiajs/react` for form state and submission.
- Never use raw `fetch` or `axios` for form submissions.
- Use `post()`, `put()`, `patch()`, `delete()` from the `useForm` hook.

```jsx
// CORRECT
const { data, setData, post, errors } = useForm({ name: "" });
const submit = (e) => {
    e.preventDefault();
    post(route("users.store"));
};

// WRONG
const submit = async () => {
    await axios.post("/users", data);
};
```

### Permissions (Frontend)

- Import `hasPermission` from `utils/permissions.js`.
- Never hard-code permission checks inline.
- Permissions are for UI visibility only — always enforce on the backend too.

```jsx
import { hasPermission } from "@/utils/permissions";
const { auth } = usePage().props;

// Show button only if user has permission
{
    hasPermission(auth.permissions, "users.create") && <Button>Create</Button>;
}
```

### Pages

- Every page must be placed in `resources/js/Pages/{ModuleName}/`.
- Index pages: `Index.jsx`.
- Create pages: `Create.jsx`.
- Edit pages: `Edit.jsx`.
- Each page component receives props directly from the Inertia controller response.

### Imports

- Use the `@/` alias for imports (maps to `resources/js/`).
- Import paths are **case-sensitive** — must match the actual file/folder name exactly.

```jsx
// CORRECT
import PageHeader from "@/Components/common/PageHeader";
import { hasPermission } from "@/utils/permissions";

// WRONG (wrong casing)
import PageHeader from "@/components/Common/PageHeader";
```

---

## Naming Conventions Summary

| Item              | Convention                                  | Example                 |
| ----------------- | ------------------------------------------- | ----------------------- |
| PHP Controller    | PascalCase + `Controller`                   | `UserController.php`    |
| PHP Form Request  | Action + Resource + `Request`               | `StoreUserRequest.php`  |
| PHP Model         | PascalCase singular                         | `User.php`              |
| PHP Trait         | PascalCase + `Trait`                        | `FileUploadTrait.php`   |
| Spatie Permission | `resource.action`                           | `users.index`           |
| React Component   | PascalCase `.jsx`                           | `PageHeader.jsx`        |
| React Utility     | camelCase `.js`                             | `permissions.js`        |
| React Page        | PascalCase folder + `Index/Create/Edit.jsx` | `Pages/Users/Index.jsx` |
| CSS Token         | `--kebab-case`                              | `--primary-foreground`  |
| Route Name        | `resource.action`                           | `users.store`           |

---

## Git & Code Quality

- Write meaningful commit messages.
- Do not commit `.env` files.
- Run `npm run build` to verify no Vite/TypeScript errors before committing.
- Do not use `console.log` in production code.
- Keep components focused and single-responsibility.

## Uploads, Updates, and Deletes File

- Only use `FileUploadTraits.php` to upload, update, and delete files.
