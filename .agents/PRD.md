# PRD — Laravel CBT (Computer-Based Testing)

**Type**: Web-based online exam application · **Target**: Sekolah, lembaga pelatihan, organisasi

## Goals

1. Platform ujian online dengan akses berbasis role (admin, participant).
2. Bank soal reusable untuk pembuatan ujian cepat.
3. Auto-grading pilihan ganda + dashboard peserta dengan timer real-time.

## Core Features

**Auth** — Login (email/username), logout, forgot password, remember me.

**Master Data (Admin)** — CRUD Group, Subject, Question (multiple choice + opsi jawaban, atau essay), reusable across exams, search + pagination di semua list.

**Exam Management (Admin)**

- CRUD exam: subject, duration, pass threshold, shuffle questions/answers
- Assign soal ke exam (dengan points & order per soal, dari `exam_question`)

**Exam Scheduling (Admin)**

- Assign satu atau lebih group ke exam, masing-masing dengan `start_time`/`end_time` sendiri (satu exam bisa dijadwalkan berbeda per group)
- Lihat daftar jadwal per exam

**Exam Taking (Participant)**

- Dashboard: exam tersedia/mendatang/selesai (berdasarkan jadwal group-nya)
- Mulai ujian (buat session) → hanya aktif dalam window jadwal group
- Timer real-time, navigasi soal (grid bernomor), shuffle soal/jawaban sesuai setting exam
- Auto-submit saat waktu habis, submit manual sebelum itu
- Satu kali attempt, tidak ada retake

**Results & Grading**

- Auto-grading pilihan ganda, manual grading essay (admin)
- Peserta lihat hasil sendiri, admin lihat semua hasil + detail

## Access Control

Spatie `laravel-permission`, dua role:

| Role          | Akses                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `admin`       | Semua permission (groups, subjects, exams, questions, results, settings, users, roles)                                       |
| `participant` | Dashboard sendiri, ambil ujian yang dijadwalkan, lihat hasil sendiri (tanpa permission individual, gated by role middleware) |

Permission mengikuti daftar yang sudah di-seed di schema (`groups.*`, `subjects.*`, `exams.*`, `questions.*`, `results.*`, `settings.*`, `users.*`, `roles.*`, `permissions.*` — 24 total).

## Non-Functional Requirements

- Inertia.js untuk navigasi tanpa full reload
- Timer ujian divalidasi di server saat submit, bukan hanya client
- Pola CRUD konsisten di semua modul untuk maintainability

## Future (Post-MVP)

Upload gambar soal · random question selection dari bank · analitik ujian · bulk import soal (CSV/Excel) · anti-cheat (fullscreen, disable copy-paste) · multi-bahasa · export hasil PDF/Excel

## Out of Scope

Live proctoring/webcam · real-time multiplayer exam · aplikasi mobile native
