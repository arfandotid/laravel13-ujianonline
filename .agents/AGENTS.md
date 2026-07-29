# AI Agent Routing & Navigation Guidelines (`AGENTS.md`)

Selamat datang, Agent! Dokumen ini adalah panduan utama (_entry point_) untuk mengarahkan Anda ke dokumentasi spesifik yang berada di dalam folder `.agents/`.

Sebelum memproses, membuat, atau mengubah kode dalam repositori ini, **wajib** untuk me-referensi file yang sesuai dengan tugas (_task_) yang sedang dikerjakan.

---

## 🗂️ Map & Routing Dokumentasi (`.agents/`)

| File / Context Path                                      | Fungsi & Focus Area                                                                                                                                       | Kapan Harus Membaca File Ini?                                                                                                        |
| :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **[`.agents/PRD.md`](.agents/PRD.md)**                   | **Product Requirements Document**<br>Persyaratan produk, _user stories_, alur pengguna (_user flows_), serta cakupan fitur (_scope_).                     | • Sebelum mengimplementasikan fitur baru.<br>• Memahami tujuan bisnis dan spesifikasi fungsi aplikasi.                               |
| **[`.agents/Architecture.md`](.agents/Architecture.md)** | **System Architecture & Tech Stack**<br>Struktur sistem, hierarki folder, integrasi layanan, serta _design pattern_ proyek.                               | • Saat membuat modul/fitur baru yang membutuhkan struktur file.<br>• Saat melakukan integrasi antar komponen/API backend & frontend. |
| **[`.agents/Schema.md`](.agents/Schema.md)**             | **Database Schema & Data Models**<br>Struktur database, migrasi, relasi tabel (_ERD_), serta validasi tipe data.                                          | • Saat membuat/mengubah skema database atau migrasi.<br>• Saat membuat _Model_, _ORM_, _DTO_, atau _Query logic_.                    |
| **[`.agents/Design.md`](.agents/Design.md)**             | **UI/UX & Design System**<br>Komponen visual, tata letak (_layout_), panduan styling, dan skema warna.                                                    | • Saat membangun atau memodifikasi tampilan antarmuka (UI).<br>• Saat membuat komponen frontend.                                     |
| **[`.agents/Rules.md`](.agents/Rules.md)**               | **Coding Standards & Best Practices**<br>Aturan penulisan kode (_clean code_), _linting_, pola penanganan error (_error handling_), dan standar keamanan. | • **Wajib dibaca oleh semua Agent** sebelum menulis kode.<br>• Saat melakukan review kode atau konfirmasi konvensi penamaan.         |

---

## 🚀 Alur Kerja Agent (Standard Operating Procedure)

1. **Pahami Tugas (Requirement):** Baca `.agents/PRD.md` untuk memahami fitur yang diminta.
2. **Cek Arsitektur & Data:**
    - Konsultasikan `.agents/Architecture.md` untuk lokasi penempatan file/komponen.
    - Konsultasikan `.agents/Schema.md` jika tugas melibatkan pembuatan/perubahan data.
3. **Penerapan Tampilan (Jika Ada UI):** Ikuti spesifikasi di `.agents/Design.md`.
4. **Validasi Kualitas Kode:** Pastikan seluruh hasil sintaks dan struktur mematuhi aturan di `.agents/Rules.md`.
