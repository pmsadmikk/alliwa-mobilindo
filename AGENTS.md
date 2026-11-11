AGENTS.md — ALLIWA MOBILINDO
Dokumen ini adalah catatan perkembangan dan panduan kerja untuk melanjutkan proyek website ALLIWA MOBILINDO. Pengguna menggunakan Visual Studio Code sebagai editor dan tidak menggunakan AI coding agent di dalam VS Code. Gunakan dokumen ini sebagai konteks saat sesi bantuan berikutnya.
1. Ringkasan proyek
- Nama proyek: ALLIWA MOBILINDO.
- Tujuan: website katalog, informasi, dan pemasaran kendaraan showroom.
- Arah desain: hitam/charcoal dengan aksen hijau #80D927, teks putih/abu-abu, foto kendaraan besar, layout minimalis dan responsif.
- OS pengembangan: Windows.
- Editor: Visual Studio Code.
- Direktori lokal:
  D:\001. ADAM PROJECT ANDROID\005. WEBSITE SHOWROOM\showroom-mobil
- Repository GitHub: https://github.com/pmsadmikk/alliwa-mobilindo (branch main).
- Website Cloudflare Pages: https://alliwa-mobilindo.pages.dev.
2. Aturan kerja ketika melanjutkan proyek
1. Baca AGENTS.md dan periksa kode aktual sebelum mengubah apa pun.
2. Pertahankan struktur folder, desain, dan pola kode yang sudah ada.
3. Jangan menulis ulang file atau mengganti arsitektur tanpa alasan teknis yang jelas.
4. Kerjakan satu tahap kecil pada satu waktu.
5. Sebutkan file yang akan diubah dan alasannya sebelum memberikan perubahan.
6. Jangan menebak nama properti, fungsi, atau struktur data; periksa file terkait terlebih dahulu.
7. Pengguna bukan programmer dan meminta file lengkap yang sudah diperbaiki, bukan instruksi mengedit potongan kode. Berikan file siap-ganti beserta nama dan lokasi penempatannya.
8. Berikan panduan bertahap, satu tindakan pada satu waktu. Setelah pengujian, minta hasilnya sebelum lanjut.
9. Jangan menghapus fitur yang sudah berjalan atau mengubah desain UI tanpa kebutuhan teknis.
10. Gunakan bahasa Indonesia.
11. Jangan meminta password, access token, service role key, atau isi file .env.
12. Jangan menganggap perubahan lokal sudah ter-deploy ke Cloudflare Pages sebelum ada proses deployment dan verifikasi.
3. Teknologi dan deployment
- React 19.
- Vite 8.3.6.
- Supabase JavaScript client @supabase/supabase-js 2.119.0.
- React Router 7.
- Tailwind CSS 4.
- lucide-react.
- Linter: Oxlint.
- Perintah proyek: npm run dev, npm run build, npm run lint, npm run preview.
- Cloudflare Pages project: alliwa-mobilindo.
- Variabel environment di Cloudflare Pages sudah dikonfigurasi: VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.
- Supabase project ref: lzhriaodolgifdhniqlm.
- Supabase Dashboard: https://supabase.com/dashboard/project/lzhriaodolgifdhniqlm.
Jangan mencantumkan nilai rahasia environment variable dalam dokumentasi, chat, atau source control.
4. Struktur kode yang diketahui
Struktur berikut berdasarkan file yang sudah diperiksa; selalu pastikan kembali dengan project lokal bila ada perubahan:
showroom-mobil/
├── src/
│   ├── components/
│   │   └── VehicleImageUploader.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── VehicleContext.jsx
│   ├── data/
│   │   └── vehicles.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   └── AdminDashboard.jsx
│   ├── HomePage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── AGENTS.md
├── package.json
└── index.html
5. Backend dan database Supabase
Tabel vehicles
Kolom yang sudah diperiksa:
- id — bigint/int8, primary key.
- name — text, wajib.
- brand — text, wajib.
- category — text.
- year — integer.
- transmission — text.
- mileage — text.
- price — bigint, wajib, default 0.
- image — text, URL foto utama.
- images — jsonb, array URL galeri, default [].
- featured — boolean, default false.
- status — text, wajib, default Available.
- fuel — text.
- description — text.
- created_at dan updated_at — timestamptz.
Storage bucket vehicle-images
- Bucket sudah dibuat dan bersifat public.
- Batas file: 5 MB per file.
- MIME type yang diizinkan: image/jpeg, image/png, image/webp.
- File foto disimpan di folder vehicles/.
- URL foto publik disimpan ke kolom image dan images pada tabel vehicles.
RLS / policies yang telah diperiksa
Policies pada storage.objects yang sudah ada:
- Admin can delete vehicle images — DELETE.
- Admin can update vehicle images — UPDATE.
- Admin can upload vehicle images — INSERT.
- Admin can view vehicle images — SELECT.
Policy memakai pemeriksaan role dari auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'. Hasil query pg_policies menunjukkan keempat policy sudah ada dengan kondisi bucket vehicle-images dan role authenticated.

Policies tabel vehicles yang telah dilaporkan:
- Admin can delete vehicles.
- Admin can insert vehicles.
- Admin can update vehicles.
- Public can view vehicles.
Jangan mengubah policies atau schema tanpa bukti baru yang menunjukkan bahwa perubahan diperlukan.
6. Fitur yang sudah tersedia
Website publik
- Halaman katalog kendaraan.
- Pencarian dan filter kategori.
- Halaman detail kendaraan.
- Galeri foto di halaman detail dengan pemilihan thumbnail.
- Informasi harga dan spesifikasi.
- Status kendaraan: Available, Reserved, Sold.
- Tombol WhatsApp pada halaman detail.
- Data kendaraan dibaca melalui VehicleContext dari Supabase.
Dashboard Admin
Fitur yang telah dibuat dan diuji sebelumnya:
- Login admin.
- Menampilkan ringkasan total kendaraan dan jumlah berdasarkan status.
- Pencarian kendaraan.
- Tambah kendaraan.
- Edit kendaraan.
- Hapus data kendaraan.
- Mengubah status kendaraan.
- Upload foto kendaraan tunggal maupun banyak.
Upload foto massal — src/components/VehicleImageUploader.jsx
Komponen uploader yang dibuat memiliki ketentuan implementasi berikut:
- Memilih beberapa foto dari galeri/perangkat.
- Format sumber JPEG, PNG, dan WebP.
- Konversi ke WebP melalui browser canvas.
- Maksimum sisi gambar 1920 px.
- Kualitas WebP sekitar 82%.
- Batas ukuran hasil 5 MB per foto agar sesuai bucket.
- Maksimum 20 foto.
- Preview, hapus dari daftar pilihan, ubah urutan, dan pilih foto utama dengan menempatkan foto di urutan pertama.
- Komponen dipanggil dari AdminDashboard melalui props images, onChange, dan disabled.
7. Status pekerjaan — 11 November 2026
Yang telah dikonfirmasi berhasil
1. Website publik, halaman admin, login, dan fungsi CRUD utama sudah berjalan.
2. Upload foto kendaraan telah berhasil.
3. Penambahan beberapa foto dan pemanggilan uploader di form Admin sudah diterapkan.
4. Build Vite sebelumnya berhasil:
vite v8.3.6 building client environment for production...
✓ 2118 modules transformed.
✓ built in 211ms
Build tersebut menampilkan peringatan ukuran chunk JavaScript lebih dari 500 kB, tetapi bukan error build.
Masalah penghapusan file Storage yang belum selesai
Gejala yang diamati:
- Update baris tabel vehicles berhasil (request PATCH 204 No Content).
- Request Storage DELETE ke /storage/v1/object/vehicle-images terlihat mendapat status 200 OK dan payload berisi prefixes path file.
- Namun objek masih tampil di Storage dan URL publiknya masih bisa dibuka.
- Menghapus objek yang sama secara manual dari Supabase Dashboard berhasil.
Pemeriksaan yang sudah dilakukan:
- Request DELETE memiliki header Authorization, apikey, dan Content-Type.
- Token sesi yang diperiksa memiliki klaim app_metadata.role = admin.
- Keempat policy Storage di atas sudah ada dan kondisinya terlihat sesuai saat diperiksa melalui pg_policies.
- Penghapusan manual dari dashboard Supabase berhasil.
Kesimpulan: akar masalah penghapusan melalui aplikasi belum ditemukan. Jangan menyatakan sudah diperbaiki. Jangan mengubah policy/schema hanya berdasarkan dugaan. Jangan pernah meminta pengguna menyalin token atau key ke chat. Token yang pernah tidak sengaja dibagikan sebaiknya direvoke/akhiri sesinya dan pengguna login kembali.
8. Mode sementara: upload boleh, penghapusan Storage dinonaktifkan
Untuk melanjutkan pekerjaan website tanpa menunggu penyelesaian masalah DELETE, AdminDashboard.jsx disiapkan dalam mode sementara.

Perilaku yang dimaksud:
- Upload foto baru ke bucket vehicle-images tetap berjalan.
- Data image dan images tetap disimpan ke tabel vehicles.
- Ketika foto dikeluarkan dari galeri saat edit, URL foto itu dikeluarkan dari data kendaraan, tetapi objek fisiknya tetap ada di Storage.
- Ketika data kendaraan dihapus, hanya baris vehicles yang dihapus. File fisik foto tetap ada di Storage.
- Jika upload sebagian berhasil tetapi proses upload berikutnya atau penyimpanan database gagal, file yang sudah sempat diunggah mungkin tertinggal di Storage. Ini konsekuensi sementara karena semua pemanggilan .remove() sengaja dinonaktifkan.
- Jangan menjalankan pembersihan massal Storage secara manual sebelum daftar file dan referensi database diperiksa.
Mode ini hanya solusi sementara, bukan perbaikan masalah DELETE.
9. Langkah pengujian setelah mengganti AdminDashboard.jsx
Jalankan dari PowerShell:
cd "D:\001. ADAM PROJECT ANDROID\005. WEBSITE SHOWROOM\showroom-mobil"
npm run build
npm run dev
Uji di website lokal:
1. Tambahkan satu kendaraan uji dengan minimal dua foto.
2. Pastikan upload selesai, data kendaraan tersimpan, dan dua foto terlihat di katalog/halaman detail.
3. Edit kendaraan uji, keluarkan satu foto dari galeri, lalu simpan. Pastikan foto itu tidak lagi tampil pada kendaraan tetapi objeknya masih ada di Storage.
4. Hapus kendaraan uji. Pastikan baris kendaraan hilang dari website/database dan file foto masih tersimpan di Storage.
5. Periksa tambah, edit, hapus data, dan ubah status tetap berjalan.
Jangan deploy ke produksi sebelum build dan pengujian lokal dikonfirmasi berhasil.
10. Pekerjaan berikutnya
Prioritas saat melanjutkan:
1. Pastikan file AdminDashboard.jsx mode sementara sudah diganti di project lokal.
2. Jalankan npm run build dan uji upload massal serta CRUD di lokal.
3. Jika lolos, commit/push ke GitHub dan verifikasi deployment Cloudflare Pages sesuai kebutuhan.
4. Pada sesi terpisah, lanjutkan diagnosis penghapusan Storage .remove() berdasarkan kode aktual, response body/headers, dan hasil pengujian yang dapat direproduksi.
5. Setelah masalah DELETE diperbaiki, rancang prosedur pembersihan file Storage yang tertinggal dengan aman. Periksa referensi URL pada semua kendaraan sebelum menghapus objek.
6. Lanjutkan fitur website lain hanya setelah tahap aktif dikonfirmasi pengguna.
11. Menjalankan proyek
Dari terminal PowerShell:
cd "D:\001. ADAM PROJECT ANDROID\005. WEBSITE SHOWROOM\showroom-mobil"
npm run dev
Buka URL lokal yang ditampilkan Vite, biasanya http://localhost:5173/.

Perintah pemeriksaan lain:
npm run build
npm run lint
Hentikan server dengan Ctrl + C.
12. Prompt untuk sesi bantuan berikutnya
Baca AGENTS.md di root project terlebih dahulu. Saya tidak mengedit potongan kode sendiri; berikan file lengkap siap-ganti. Proyek ALLIWA MOBILINDO saat ini memakai Supabase dan fitur upload foto massal WebP. Periksa kode aktual sebelum mengubah apa pun. Mode sementara upload aktif tetapi penghapusan objek Storage dinonaktifkan karena masalah .remove() belum ditemukan penyebabnya. Mulai dari verifikasi hasil pengujian lokal yang terakhir dan lanjutkan satu tahap kecil pada satu waktu. Jangan meminta token, password, service role key, atau isi .env.

13. Update 11 November 2026 — build terbaru dan rencana deploy
Pengguna telah mengganti src/pages/AdminDashboard.jsx dengan versi mode sementara (upload foto tetap aktif, penghapusan objek Storage dinonaktifkan), lalu menjalankan npm run build dari PowerShell pada project lokal.

Hasil build terbaru:
vite v8.3.6 building client environment for production...
✓ 2118 modules transformed.
dist/index.html                   0.46 kB │ gzip:   0.30 kB
dist/assets/index-B6CzsCEO.css   32.56 kB │ gzip:   6.67 kB
dist/assets/index-DWYzrHL7.js   528.68 kB │ gzip: 151.62 kB
(!) Some chunks are larger than 500 kB after minification.
✓ built in 6.48s
Status: BUILD BERHASIL. Peringatan bundle JavaScript di atas 500 kB bersifat non-fatal dan tidak menggagalkan build.

Pengguna ingin langsung deploy agar alliwamobilindo.com dapat menggunakan upload foto massal. Belum ada bukti bahwa runtime upload massal sudah diuji lagi setelah penggantian file, jadi jangan menyatakan fitur produksi telah terverifikasi sebelum pengujian pascadeploy.

Informasi deployment yang sudah diketahui:
- GitHub repository: https://github.com/pmsadmikk/alliwa-mobilindo
- Branch: main
- Cloudflare Pages project: alliwa-mobilindo
- URL Pages: https://alliwa-mobilindo.pages.dev
- Domain tujuan pengguna: alliwamobilindo.com
- Environment variables Cloudflare Pages yang sudah pernah dikonfigurasi: VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.
Langkah deployment yang perlu dipandu:
1. Di PowerShell, pastikan berada di root project.
2. Periksa perubahan dengan git status.
3. Stage dan commit perubahan yang relevan, misalnya git add AGENTS.md src/pages/AdminDashboard.jsx (sesuaikan bila AGENTS.md tidak dilacak atau nama/lokasi berbeda).
4. Commit dengan pesan yang jelas, misalnya git commit -m "Temporarily disable storage image deletion".
5. Push branch main dengan git push origin main.
6. Tunggu deployment otomatis Cloudflare Pages selesai dan pastikan status deployment sukses.
7. Buka https://alliwamobilindo.com, login admin, lalu uji upload lebih dari satu foto pada kendaraan uji.
8. Pastikan foto baru tersimpan di Storage dan tampil di website. Ingat bahwa penghapusan foto dari Storage memang sengaja nonaktif untuk sementara.
Jika git status menunjukkan file lain yang tidak dikenal atau perubahan sensitif, jangan stage semuanya dengan git add .; periksa satu per satu. Jangan pernah meminta atau mengirim .env, password, access token, atau service role key.

Deployment langsung dilakukan atas pilihan pengguna meskipun pengujian runtime lokal pascapenggantian file belum dilaporkan. Sampaikan risiko ini secara ringkas dan lakukan verifikasi setelah deployment.