# Database Schema

## Overview

This project uses MySQL (or compatible). Migrations are located in `database/migrations/`.  
Spatie permission tables are managed automatically by the `laravel-permission` package migration.

---

## Tables

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | bigint unsigned | PK, auto-increment | Primary key |
| `name` | varchar | NOT NULL | Full name |
| `email` | varchar | UNIQUE, NOT NULL | Email address |
| `email_verified_at` | timestamp | nullable | Email verification timestamp |
| `username` | varchar | UNIQUE, NOT NULL | Unique username |
| `password` | varchar | NOT NULL | Hashed password |
| `avatar` | varchar | nullable | Avatar file path |
| `is_active` | boolean | default: `true` | Account active status |
| `remember_token` | varchar | nullable | Auth remember token |
| `created_at` | timestamp | nullable | Created at |
| `updated_at` | timestamp | nullable | Updated at |

---

### `settings`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | bigint unsigned | PK, auto-increment | Primary key |
| `app_name` | varchar | NOT NULL | Application display name |
| `app_logo` | varchar | nullable | Logo file path |
| `created_at` | timestamp | nullable | Created at |
| `updated_at` | timestamp | nullable | Updated at |

---

### `password_reset_tokens`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `email` | varchar | PK | User email |
| `token` | varchar | NOT NULL | Reset token |
| `created_at` | timestamp | nullable | Token creation time |

---

### `sessions`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | varchar | PK | Session ID |
| `user_id` | bigint unsigned | nullable, index | FK to users (nullable for guests) |
| `ip_address` | varchar(45) | nullable | Client IP |
| `user_agent` | text | nullable | Browser user agent |
| `payload` | longtext | NOT NULL | Session payload |
| `last_activity` | integer | index | Last activity timestamp |

---

## Spatie Permission Tables

Managed by the `laravel-permission` package migration (`create_permission_tables`):

### `permissions`
Stores all application permissions.
| Column | Type | Description |
|---|---|---|
| `id` | bigint | PK |
| `name` | varchar | Permission name (e.g., `users.index`) |
| `guard_name` | varchar | Guard (e.g., `web`) |

### `roles`
Stores user roles.
| Column | Type | Description |
|---|---|---|
| `id` | bigint | PK |
| `name` | varchar | Role name (e.g., `admin`) |
| `guard_name` | varchar | Guard (e.g., `web`) |

### `model_has_roles`
Pivot: assigns roles to users.
| Column | Description |
|---|---|
| `role_id` | FK to roles |
| `model_type` | Model class (e.g., `App\Models\User`) |
| `model_id` | User ID |

### `model_has_permissions`
Pivot: assigns permissions directly to users.
| Column | Description |
|---|---|
| `permission_id` | FK to permissions |
| `model_type` | Model class |
| `model_id` | User ID |

### `role_has_permissions`
Pivot: assigns permissions to roles.
| Column | Description |
|---|---|
| `permission_id` | FK to permissions |
| `role_id` | FK to roles |

---

## Relationships

```
User ──< model_has_roles >── Role ──< role_has_permissions >── Permission
User ──< model_has_permissions >──────────────────────────── Permission
```

- A **User** can have many **Roles**.
- A **Role** can have many **Permissions**.
- A **User** can also have **direct Permissions** (bypassing roles).

---

## Seeded Permissions

By default, the following permissions are seeded:

```
users.index      users.create      users.edit      users.delete
roles.index      roles.create      roles.edit      roles.delete
permissions.index  permissions.create  permissions.edit  permissions.delete
settings.index   settings.edit
```

---

## Adding New Module Schema

When adding a new module (e.g., `products`):

1. Create migration:
```bash
php artisan make:migration create_products_table
```

2. Add to the migration:
```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

3. Add permissions to the seeder:
```php
'products.index', 'products.create', 'products.edit', 'products.delete'
```
