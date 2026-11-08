# AGENT.md — ALLIWA MOBILINDO

Dokumen ini merupakan catatan utama project sekaligus panduan bagi AI Agent yang melanjutkan pengembangan website ALLIWA MOBILINDO.

**Terakhir diperbarui:** 7 November 2026

---

## 1. Identitas Project

**Nama usaha:** ALLIWA MOBILINDO  
**Jenis usaha:** Showroom mobil bekas  
**Jenis website:** Digital showroom dan katalog penjualan mobil bekas.

**Tagline:**
"Temukan Mobil Impian Anda Bersama ALLIWA."

### Identitas visual

- Charcoal: `#111111`
- Dark: `#242424`
- Lime Green: `#80D927`
- Deep Green: `#5FA91C`
- White: `#FFFFFF`

Desain website menggunakan pendekatan modern, premium, minimalis, dan profesional.

---

## 2. Tujuan Website

Website dikembangkan sebagai sarana pemasaran digital sekaligus sistem pengelolaan inventaris kendaraan showroom.

Fitur utama yang ditargetkan:

1. Halaman utama dan katalog kendaraan.
2. Pencarian dan filter kendaraan.
3. Halaman detail setiap kendaraan.
4. Galeri foto kendaraan.
5. Tombol konsultasi melalui WhatsApp.
6. Profil dan informasi showroom.
7. Dashboard administrator.
8. Login administrator.
9. Tambah, edit, dan hapus kendaraan.
10. Pengelolaan status kendaraan.
11. Upload foto kendaraan.
12. Integrasi media sosial.
13. Fitur pembuatan caption untuk pemasaran Instagram.
14. Optimasi SEO dan performa website.

---

## 3. Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| React | Frontend |
| Vite | Development server dan build |
| Tailwind CSS | Styling |
| JavaScript | Bahasa pemrograman |
| React Router DOM | Routing |
| Lucide React | Ikon |
| Supabase | Backend dan database |
| Supabase Auth | Autentikasi administrator |
| Supabase Storage | Penyimpanan foto kendaraan |

### Lingkungan pengembangan

- Sistem operasi: Windows
- Editor: Visual Studio Code
- Node.js: v26.13.0
- npm: v11.20.0
- Vite: v8.3.6

### Menjalankan project

```powershell
cd "D:\001. ADAM PROJECT ANDROID\005. WEBSITE SHOWROOM\showroom-mobil"
npm run dev
```

Alamat lokal:

`http://localhost:5173/`

---

## 4. Struktur Project

```text
showroom-mobil/
│
├── AGENT.md
├── .env.local
├── .gitignore
├── package.json
│
└── src/
    ├── context/
    │   ├── VehicleContext.jsx
    │   └── AuthContext.jsx
    │
    ├── lib/
    │   └── supabase.js
    │
    ├── pages/
    │   ├── AdminDashboard.jsx
    │   ├── AdminLogin.jsx
    │   └── VehicleDetail.jsx
    │
    ├── data/
    │   └── vehicles.js
    │
    ├── App.jsx
    ├── HomePage.jsx
    ├── index.css
    └── main.jsx
```

Struktur dapat berkembang sesuai kebutuhan. Jangan menghapus file atau mengubah arsitektur tanpa alasan teknis yang jelas.

---

## 5. Integrasi Supabase

Project sudah terhubung dengan Supabase.

### Konfigurasi

Project URL:

`https://lzhriaodolgifdhniqlm.supabase.co`

File konfigurasi:

`src/lib/supabase.js`

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
```

Environment variables disimpan di `.env.local`:

```env
VITE_SUPABASE_URL=https://lzhriaodolgifdhniqlm.supabase.co
VITE_SUPABASE_ANON_KEY=KEY_PUBLISHABLE_ANDA
```

Jangan pernah menampilkan atau meminta `service_role` key untuk frontend.

Pastikan `.env.local` masuk dalam `.gitignore`.

### Database

Nama tabel:

`public.vehicles`

Kolom yang sudah dibuat:

- id
- name
- brand
- category
- year
- transmission
- mileage
- price
- image
- images
- featured
- status
- fuel
- description
- created_at
- updated_at

Status kendaraan:

- Available
- Reserved
- Sold

Row Level Security (RLS) sudah diaktifkan.

Kebijakan akses:

- Pengunjung publik dapat membaca kendaraan.
- Administrator dengan `app_metadata.role = admin` dapat menambah, mengubah, dan menghapus kendaraan.

### Data awal

Tiga kendaraan demo sudah berhasil dimasukkan ke database:

1. Mercedes-Benz C200 — 2022.
2. BMW 320i Sport — 2021.
3. Toyota Alphard — 2023.

Data tersebut sebelumnya berasal dari `src/data/vehicles.js`.

### Supabase Storage

Bucket yang sudah dibuat:

`vehicle-images`

Konfigurasi:

- Public bucket: aktif.
- Maksimal ukuran file: 5 MB.
- MIME type: JPEG, PNG, WebP.
- Upload, update, dan delete hanya untuk administrator.

Bucket sudah memiliki kebijakan akses administrator.

---

## 6. Autentikasi Administrator

File:

`src/context/AuthContext.jsx`

`src/pages/AdminLogin.jsx`

`src/App.jsx`

`src/main.jsx`

Autentikasi Supabase sudah berhasil diterapkan.

Administrator menggunakan email dan password Supabase Auth.

Role administrator diperiksa melalui:

```javascript
user?.app_metadata?.role === "admin"
```

Route `/admin` dilindungi menggunakan `ProtectedRoute`.

Jika pengunjung belum login atau bukan administrator, akses diarahkan ke:

`/admin/login`

Fitur login, logout, dan proteksi route sudah diuji dan berjalan normal.

---

## 7. Status Implementasi Saat Ini

### Berhasil diterapkan

| Fitur | Status |
|---|---|
| React + Vite | Selesai |
| Tailwind CSS | Selesai |
| Branding ALLIWA MOBILINDO | Selesai |
| Homepage katalog | Selesai |
| Pencarian kendaraan | Selesai |
| Filter kategori | Selesai |
| Halaman detail kendaraan | Selesai |
| Galeri foto yang sudah tersedia | Selesai |
| Navigasi React Router | Selesai |
| Dashboard administrator | Selesai |
| Statistik kendaraan | Selesai |
| Login Supabase Auth | Selesai |
| Logout administrator | Selesai |
| Proteksi route administrator | Selesai |
| Database Supabase | Selesai |
| RLS database | Selesai |
| Supabase Storage bucket | Selesai |
| Pembacaan data kendaraan dari Supabase | Selesai |
| Admin Dashboard terhubung dengan operasi CRUD Supabase | Kode sudah diterapkan, belum diuji |

### Kondisi integrasi terbaru

`src/context/VehicleContext.jsx` sudah membaca data langsung dari tabel Supabase menggunakan:

```javascript
supabase
  .from("vehicles")
  .select("*")
  .order("id", { ascending: true });
```

Context menyediakan:

- vehicles
- setVehicles
- loading
- error
- refreshVehicles

Catatan: `setVehicles` masih merupakan perubahan state lokal, bukan operasi database. Jangan menggunakannya untuk menyimpan perubahan inventaris.

`src/pages/AdminDashboard.jsx` sudah diperbarui agar menggunakan operasi database langsung:

- `.insert()` untuk menambah kendaraan.
- `.update()` untuk mengubah kendaraan.
- `.delete()` untuk menghapus kendaraan.
- `.update()` untuk mengubah status.
- `refreshVehicles()` untuk memuat ulang data.

**Semua operasi CRUD tersebut belum melewati pengujian langsung.**

---

## 8. PEKERJAAN BERIKUTNYA — LANJUTKAN DARI SINI

Jangan mengulang instalasi, konfigurasi Supabase, pembuatan tabel, atau setup autentikasi.

Lanjutkan dari pengujian CRUD Admin Dashboard.

### Tahap 1 — Uji tambah kendaraan

Tambahkan kendaraan percobaan:

- Nama: Honda Civic Test
- Merek: Honda
- Kategori: Sedan
- Tahun: 2022
- Transmisi: Automatic
- Kilometer: 15.000 km
- Harga: 350000000
- Status: Available
- URL foto: `https://placehold.co/800x500/png`

Periksa apakah data muncul di:

1. Admin Dashboard.
2. Supabase Table Editor, tabel `vehicles`.
3. Halaman utama website.

Jangan menghapus data percobaan sebelum pengujian edit dan hapus selesai.

### Tahap 2 — Uji edit kendaraan

- Edit Honda Civic Test.
- Ubah beberapa informasi.
- Simpan perubahan.
- Periksa apakah database ikut berubah.
- Periksa halaman utama dan detail kendaraan.

### Tahap 3 — Uji perubahan status

Uji perubahan:

- Available menjadi Reserved.
- Reserved menjadi Sold.
- Sold menjadi Available.

Pastikan perubahan tersimpan di Supabase dan tercermin pada website.

### Tahap 4 — Uji hapus kendaraan

- Hapus Honda Civic Test.
- Pastikan data terhapus dari database.
- Pastikan kendaraan tidak muncul lagi di katalog.

### Tahap 5 — Integrasi upload foto Supabase Storage

Setelah CRUD berhasil:

- Ganti input URL foto menjadi input file.
- Upload foto ke bucket `vehicle-images`.
- Tampilkan preview foto sebelum upload.
- Simpan public URL ke kolom `image`.
- Dukung beberapa foto kendaraan melalui kolom `images`.
- Pertahankan kompatibilitas dengan data kendaraan lama.

### Tahap 6 — Pengembangan fitur lanjutan

Setelah backend kendaraan stabil:

1. Galeri multi-foto kendaraan.
2. Informasi lengkap dan spesifikasi kendaraan.
3. Fitur unggulan / featured vehicles.
4. Profil showroom.
5. WhatsApp resmi showroom.
6. Integrasi Google Maps.
7. Informasi jam operasional.
8. Link Instagram.
9. Generator caption Instagram.
10. Fitur berbagi foto dan informasi kendaraan.
11. SEO dan optimasi performa.
12. Deployment website ke domain resmi.

---

## 9. Aturan Pengembangan untuk AI Agent

1. Selalu periksa kode aktual sebelum mengubah file.
2. Jangan menebak isi file yang belum diperiksa.
3. Pertahankan fitur yang sudah berjalan.
4. Jangan mengubah desain secara besar-besaran tanpa instruksi.
5. Jangan mengganti teknologi atau arsitektur tanpa alasan teknis.
6. Hindari duplikasi fungsi dan komponen.
7. Gunakan Supabase sebagai sumber utama data kendaraan.
8. Jangan menggunakan localStorage sebagai penyimpanan utama inventaris.
9. Jangan menggunakan ID buatan frontend ketika menambahkan kendaraan. Biarkan Supabase menghasilkan ID otomatis.
10. Tangani error dari setiap operasi database.
11. Jangan menghapus data asli tanpa persetujuan pengguna.
12. Jangan memasukkan secret key ke frontend.
13. Periksa console browser dan terminal setelah perubahan.
14. Utamakan kode yang aman, mudah dipelihara, dan konsisten.

### Cara memberikan instruksi kepada pengguna

Pengguna lebih nyaman dengan panduan bertahap.

- Berikan satu tahap pekerjaan dalam satu waktu.
- Sebutkan nama file dan lokasi secara jelas.
- Untuk penggantian file, berikan kode lengkap yang siap ditempel.
- Jangan memberikan terlalu banyak perubahan sekaligus.
- Tunggu konfirmasi pengguna sebelum melanjutkan ke tahap berikutnya.
- Jika ada error, minta pesan error aktual sebelum membuat perubahan lanjutan.

---

## 10. Catatan Penting

Beberapa informasi bisnis belum dikonfirmasi:

- Logo final ALLIWA MOBILINDO.
- Nomor WhatsApp resmi.
- Alamat showroom.
- Jam operasional.
- Akun Instagram resmi.
- Domain website.

Jangan membuat informasi tersebut secara fiktif.

Nomor WhatsApp yang pernah terdapat dalam kode lama harus diverifikasi sebelum website dipublikasikan.

---

## INSTRUKSI TERAKHIR

Saat melanjutkan project, baca dokumen ini terlebih dahulu.

**Titik terakhir pekerjaan: menunggu pengujian fitur tambah kendaraan Honda Civic Test melalui Admin Dashboard dan verifikasi penyimpanannya di Supabase.**

Jangan langsung mengerjakan upload foto atau fitur lain sebelum pengujian CRUD selesai.
