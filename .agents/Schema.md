# Database Schema

## Overview

Database: SQLite (default) / MySQL / PostgreSQL. Migrations are in `database/migrations/`.
Spatie permission tables managed automatically by `laravel-permission`.

---

## Application Tables

### `users`

| Column              | Type            | Constraints        | Description                  |
| ------------------- | --------------- | ------------------ | ---------------------------- |
| `id`                | bigint unsigned | PK, auto-increment | Primary key                  |
| `name`              | varchar         | NOT NULL           | Full name                    |
| `email`             | varchar         | UNIQUE, NOT NULL   | Email address                |
| `email_verified_at` | timestamp       | nullable           | Email verification timestamp |
| `username`          | varchar         | UNIQUE, NOT NULL   | Unique username              |
| `password`          | varchar         | NOT NULL           | Hashed password              |
| `avatar`            | varchar         | nullable           | Avatar file path             |
| `is_active`         | boolean         | default: `true`    | Account active status        |
| `remember_token`    | varchar         | nullable           | Auth remember token          |
| `created_at`        | timestamp       | nullable           | Created at                   |
| `updated_at`        | timestamp       | nullable           | Updated at                   |

---

### `settings`

| Column       | Type            | Constraints        | Description              |
| ------------ | --------------- | ------------------ | ------------------------ |
| `id`         | bigint unsigned | PK, auto-increment | Primary key              |
| `app_name`   | varchar         | NOT NULL           | Application display name |
| `app_logo`   | varchar         | nullable           | Logo file path           |
| `created_at` | timestamp       | nullable           | Created at               |
| `updated_at` | timestamp       | nullable           | Updated at               |

---

### `subjects`

| Column        | Type            | Constraints        | Description                     |
| ------------- | --------------- | ------------------ | ------------------------------- |
| `id`          | bigint unsigned | PK, auto-increment | Primary key                     |
| `name`        | varchar         | NOT NULL           | Subject name (e.g., Matematika) |
| `slug`        | varchar         | UNIQUE, NOT NULL   | URL-friendly slug               |
| `description` | text            | nullable           | Subject description             |
| `is_active`   | boolean         | default: `true`    | Active status                   |
| `created_at`  | timestamp       | nullable           | Created at                      |
| `updated_at`  | timestamp       | nullable           | Updated at                      |

---

### `exams`

| Column              | Type            | Constraints          | Description                   |
| ------------------- | --------------- | -------------------- | ----------------------------- |
| `id`                | bigint unsigned | PK, auto-increment   | Primary key                   |
| `subject_id`        | bigint unsigned | FK → `subjects.id`   | Subject category              |
| `title`             | varchar         | NOT NULL             | Exam title                    |
| `description`       | text            | nullable             | Exam description/instructions |
| `duration_minutes`  | integer         | NOT NULL             | Duration in minutes           |
| `pass_threshold`    | integer         | NOT NULL, default: 0 | Minimum score to pass (%)     |
| `shuffle_questions` | boolean         | default: `false`     | Randomize question order      |
| `shuffle_answers`   | boolean         | default: `false`     | Randomize option order        |
| `is_active`         | boolean         | default: `true`      | Active status                 |
| `created_at`        | timestamp       | nullable             | Created at                    |
| `updated_at`        | timestamp       | nullable             | Updated at                    |

---

### `questions` (Reusable Question Bank)

| Column          | Type            | Constraints                | Description          |
| --------------- | --------------- | -------------------------- | -------------------- |
| `id`            | bigint unsigned | PK, auto-increment         | Primary key          |
| `subject_id`    | bigint unsigned | FK → `subjects.id`         | Subject category     |
| `type`          | enum            | `multiple_choice`, `essay` | Question type        |
| `question_text` | text            | NOT NULL                   | The question content |
| `is_active`     | boolean         | default: `true`            | Active status        |
| `created_at`    | timestamp       | nullable                   | Created at           |
| `updated_at`    | timestamp       | nullable                   | Updated at           |

---

### `question_options`

| Column        | Type            | Constraints                            | Description         |
| ------------- | --------------- | -------------------------------------- | ------------------- |
| `id`          | bigint unsigned | PK, auto-increment                     | Primary key         |
| `question_id` | bigint unsigned | FK → `questions.id`, ON DELETE CASCADE | Parent question     |
| `option_text` | text            | NOT NULL                               | Option content      |
| `is_correct`  | boolean         | default: `false`                       | Correct answer flag |
| `order`       | integer         | default: `0`                           | Display order       |
| `created_at`  | timestamp       | nullable                               | Created at          |
| `updated_at`  | timestamp       | nullable                               | Updated at          |

---

### `exam_question` (Pivot — assigns questions to exams)

| Column        | Type            | Constraints                            | Description                           |
| ------------- | --------------- | -------------------------------------- | ------------------------------------- |
| `id`          | bigint unsigned | PK, auto-increment                     | Primary key                           |
| `exam_id`     | bigint unsigned | FK → `exams.id`, ON DELETE CASCADE     | Exam                                  |
| `question_id` | bigint unsigned | FK → `questions.id`, ON DELETE CASCADE | Question                              |
| `points`      | integer         | NOT NULL, default: `0`                 | Points for this question in this exam |
| `order`       | integer         | default: `0`                           | Display order                         |
| `created_at`  | timestamp       | nullable                               | Created at                            |

**Unique constraint:** `(exam_id, question_id)` — satu soal tidak bisa ke-assign dua kali ke ujian yang sama. _(baru ditambahkan)_

---

### `groups`

| Column        | Type            | Constraints        | Description                                  |
| ------------- | --------------- | ------------------ | -------------------------------------------- |
| `id`          | bigint unsigned | PK, auto-increment | Primary key                                  |
| `name`        | varchar         | NOT NULL           | Group name (e.g., Kelas A - Batch Juli 2026) |
| `description` | text            | nullable           | Group description                            |
| `is_active`   | boolean         | default: `true`    | Active status                                |
| `created_at`  | timestamp       | nullable           | Created at                                   |
| `updated_at`  | timestamp       | nullable           | Updated at                                   |

---

### `group_user` (Pivot — assigns participants to groups)

| Column       | Type            | Constraints                         | Description |
| ------------ | --------------- | ----------------------------------- | ----------- |
| `id`         | bigint unsigned | PK, auto-increment                  | Primary key |
| `group_id`   | bigint unsigned | FK → `groups.id`, ON DELETE CASCADE | Group       |
| `user_id`    | bigint unsigned | FK → `users.id`, ON DELETE CASCADE  | Participant |
| `created_at` | timestamp       | nullable                            | Created at  |

**Unique constraint:** `(group_id, user_id)` — satu peserta bisa masuk ke lebih dari satu group, tapi tidak duplikat di group yang sama.

---

### `exam_schedules` (Group Exam Scheduling)

| Column       | Type            | Constraints                         | Description                    |
| ------------ | --------------- | ----------------------------------- | ------------------------------ |
| `id`         | bigint unsigned | PK, auto-increment                  | Primary key                    |
| `exam_id`    | bigint unsigned | FK → `exams.id`, ON DELETE CASCADE  | Exam                           |
| `group_id`   | bigint unsigned | FK → `groups.id`, ON DELETE CASCADE | Group yang mendapat jadwal ini |
| `start_time` | datetime        | NOT NULL                            | Waktu mulai untuk group ini    |
| `end_time`   | datetime        | NOT NULL                            | Waktu selesai untuk group ini  |
| `is_active`  | boolean         | default: `true`                     | Active status                  |
| `created_at` | timestamp       | nullable                            | Created at                     |
| `updated_at` | timestamp       | nullable                            | Updated at                     |

**Unique constraint:** `(exam_id, group_id)` — satu exam hanya punya satu jadwal per group.

---

### `exam_sessions` (Exam Attempt Tracking)

| Column             | Type            | Constraints                             | Description                               |
| ------------------ | --------------- | --------------------------------------- | ----------------------------------------- |
| `id`               | bigint unsigned | PK, auto-increment                      | Primary key                               |
| `exam_id`          | bigint unsigned | FK → `exams.id`                         | Exam                                      |
| `user_id`          | bigint unsigned | FK → `users.id`                         | Participant                               |
| `exam_schedule_id` | bigint unsigned | FK → `exam_schedules.id`, **NOT NULL**  | Jadwal group yang menaungi attempt ini    |
| `started_at`       | datetime        | NOT NULL                                | When exam was started                     |
| `submitted_at`     | datetime        | nullable                                | When exam was submitted/timed out         |
| `status`           | enum            | `in_progress`, `submitted`, `timed_out` | Session status                            |
| `score`            | decimal(5,2)    | nullable                                | Final score (percentage)                  |
| `question_order`   | json            | nullable                                | Array urutan `question_id` untuk sesi ini |
| `option_orders`    | json            | nullable                                | Object urutan opsi per soal               |
| `created_at`       | timestamp       | nullable                                | Created at                                |
| `updated_at`       | timestamp       | nullable                                | Updated at                                |

**Unique constraint:** `(exam_id, user_id)` — satu peserta hanya boleh satu kali attempt per ujian.

---

### `participant_answers`

| Column            | Type            | Constraints                                | Description                                 |
| ----------------- | --------------- | ------------------------------------------ | ------------------------------------------- |
| `id`              | bigint unsigned | PK, auto-increment                         | Primary key                                 |
| `exam_session_id` | bigint unsigned | FK → `exam_sessions.id`, ON DELETE CASCADE | Session                                     |
| `question_id`     | bigint unsigned | FK → `questions.id`                        | Question                                    |
| `answer_text`     | text            | nullable                                   | Answer: `option_id` for MCQ, text for essay |
| `is_correct`      | boolean         | nullable                                   | Auto-graded for MCQ, null for essay         |
| `points_earned`   | decimal(8,2)    | nullable                                   | Points awarded                              |
| `created_at`      | timestamp       | nullable                                   | Created at                                  |
| `updated_at`      | timestamp       | nullable                                   | Updated at                                  |

**Unique constraint:** `(exam_session_id, question_id)` — satu soal cuma boleh punya satu baris jawaban per sesi. _(baru ditambahkan, mencegah double-submit jawaban)_

---

## Indexes tambahan

Selain unique constraint di atas, pastikan kolom FK berikut punya index (otomatis kalau pakai `foreignId()->constrained()` di Laravel migration):

```
exam_sessions:        exam_id, user_id, exam_schedule_id
participant_answers:  exam_session_id, question_id
exam_schedules:       exam_id, group_id
group_user:           group_id, user_id
```

---

## Relationships

```
Subject ──< Exam                          # Subject has many Exams
Subject ──< Question                      # Subject has many Questions
Exam ──< ExamQuestion >── Question        # Many-to-many (reusable questions)
Exam ──< ExamSchedule >── Group           # Many-to-many (group-based assignment)
Group ──< GroupUser >── User              # Many-to-many (group members)
ExamSchedule ──< ExamSession >── User     # Attempt always tied to a schedule (NOT NULL)
ExamSession ──< ParticipantAnswer >── Question
Question ──< QuestionOption               # MCQ options
```

---

## Spatie Permission Tables

Standard Spatie tables: `permissions`, `roles`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`.

---

## Seeded Permissions (24)

```
subjects.index    subjects.create    subjects.edit    subjects.delete
exams.index       exams.create       exams.edit       exams.delete
questions.index   questions.create   questions.edit   questions.delete
groups.index      groups.create      groups.edit      groups.delete
results.index     results.show
settings.index    settings.edit
users.index       users.create       users.edit       users.delete
roles.index       roles.create       roles.edit       roles.delete
permissions.index permissions.create permissions.edit permissions.delete
```

---

## Seeded Roles

| Role          | Permissions                                                        |
| ------------- | ------------------------------------------------------------------ |
| `admin`       | All 24 permissions above                                           |
| `participant` | None (access gated by role middleware, not individual permissions) |

---
