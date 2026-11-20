AGENTS.md — ALLIWA MOBILINDO
Dokumen ini adalah catatan konteks proyek, status fitur, keputusan teknis, dan panduan untuk melanjutkan pengembangan ALLIWA MOBILINDO. Pengguna mengelola kode melalui Visual Studio Code dan PowerShell; dokumen ini diperbarui secara manual sebagai memori proyek. Baca dokumen ini sebelum mengusulkan atau melakukan perubahan.
1. Ringkasan proyek
- Nama proyek/showroom: ALLIWA MOBILINDO.
- Tujuan: website katalog dan pemasaran showroom mobil bekas.
- Tagline: “Temukan Mobil Impian Anda Bersama ALLIWA.”
- Arah desain: modern, premium, minimalis, profesional.
- Identitas warna: charcoal #111111, dark #242424, lime #80D927, deep green #5FA91C, dan putih #FFFFFF.
- Lingkungan pengembangan: Windows, Visual Studio Code, PowerShell.
- Framework: React + Vite.
- Styling: Tailwind CSS.
- Routing: React Router DOM.
- Ikon: Lucide React.
2. Aturan penting saat mengerjakan proyek
1. Baca dokumen ini dan periksa kode aktual sebelum mengubah apa pun.
2. Pertahankan struktur folder, identitas visual, dan pola kode yang sudah berjalan.
3. Jangan menulis ulang file atau mengganti arsitektur tanpa alasan teknis yang jelas.
4. Kerjakan satu tahap kecil pada satu waktu.
5. Sebelum mengubah kode, jelaskan file/bagian yang akan diubah dan alasannya.
6. Jangan menebak nama properti, fungsi, atau struktur data. Periksa file terkait terlebih dahulu.
7. Jika isi file tidak tersedia, minta file tersebut atau akses sumber GitHub yang tepat; jangan mengarang isi file.
8. Pengguna tidak nyaman mengedit potongan kode. Jika perubahan cukup besar, utamakan memberikan file lengkap yang siap menggantikan file lama.
9. Setelah perubahan, berikan cara build dan uji. Tunggu konfirmasi pengguna sebelum berpindah ke tahap berikutnya.
10. Jangan menghapus fitur yang sudah berjalan.
11. Jangan mencatat atau meminta secret, password, API key, token, atau kredensial ke dalam dokumen ini.
12. Gunakan bahasa Indonesia saat memberi panduan kepada pengguna.
13. Jangan mengaktifkan kembali penghapusan objek foto Storage secara otomatis tanpa permintaan dan pengujian khusus. Saat ini penghapusan fisik objek Storage sengaja dinonaktifkan untuk menghindari foto yang masih dipakai ikut terhapus.
3. Lokasi proyek dan deployment
- Folder lokal: D:\001. ADAM PROJECT ANDROID\005. WEBSITE SHOWROOM\showroom-mobil
- GitHub: https://github.com/pmsadmikk/alliwa-mobilindo
- Branch utama: main
- Cloudflare Pages project: alliwa-mobilindo
- Domain produksi: https://alliwamobilindo.com
- Domain www: https://www.alliwamobilindo.com
- Preview Pages: https://alliwa-mobilindo.pages.dev
- Build command: npm run build
- Output build Vite: dist
Alur deployment: perubahan di Visual Studio Code → npm run build → git add → git commit → git push origin main → Cloudflare Pages menjalankan deployment otomatis. Pastikan deployment terbaru berstatus Success sebelum menguji domain produksi.
4. Struktur proyek yang diketahui
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
│   │   ├── AdminDashboard.jsx
│   │   ├── VehicleDetail.jsx
│   │   └── ...
│   ├── App.jsx
│   ├── HomePage.jsx
│   ├── index.css
│   └── main.jsx
├── AGENTS.md
├── package.json
└── index.html
Ini adalah struktur yang diketahui, bukan jaminan daftar lengkap. Periksa struktur aktual sebelum menambah atau memindahkan file.
5. Teknologi, data, dan backend
- React + Vite 8.3.6.
- Tailwind CSS dan @tailwindcss/vite.
- react-router-dom untuk navigasi.
- lucide-react untuk ikon.
- Supabase untuk database, autentikasi Admin, dan Storage.
- Supabase client berada di src/lib/supabase.js; konfigurasi lokal menggunakan .env.local dengan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY. Jangan pernah memasukkan nilai secret ke AGENTS.md atau Git.
- VehicleContext mengambil dan mengelola data kendaraan dari Supabase; jangan menganggap proyek masih hanya memakai localStorage.
- AuthContext mengelola autentikasi Admin.
Tabel vehicles
Tabel yang digunakan memiliki kolom antara lain id, name, brand, category, year, transmission, mileage, price, image, images, featured, status, fuel, description, created_at, dan updated_at.
- price bertipe numerik/bigint. Simpan sebagai angka bulat, bukan string Rupiah berformat.
- image menyimpan URL foto utama untuk kompatibilitas.
- images menyimpan array URL seluruh foto.
- images[0] menjadi foto utama; urutan foto harus dipertahankan.
- Status yang digunakan: Available, Reserved, Sold.
Supabase Storage
- Bucket: vehicle-images (public).
- Path objek foto: di bawah folder vehicles/.
- Foto baru dikonversi menjadi WebP sebelum diunggah.
- Batas ukuran objek bucket: 5 MB.
- Storage dan tabel memiliki kebijakan akses/RLS. Jangan mengubah policy tanpa memeriksa policy aktif dan kebutuhan aksesnya.
- Penghapusan baris kendaraan atau penghapusan foto dari array kendaraan tidak berarti objek fisik di Storage ikut terhapus. Penghapusan fisik otomatis saat ini sengaja tidak dijalankan.
6. Fitur yang sudah dibuat dan diuji
Halaman katalog/beranda — src/HomePage.jsx
- Menampilkan katalog kendaraan dari useVehicles().
- Pencarian kendaraan berdasarkan merek/nama.
- Filter kategori.
- Kartu kendaraan menampilkan informasi ringkas, harga, dan status.
- Foto kendaraan pada kartu dapat diklik untuk menuju halaman detail kendaraan.
- Tombol DETAIL juga menuju halaman detail kendaraan yang sama.
- Navigasi gambar dan tombol detail menggunakan pola tujuan /mobil/${car.id}.
- Jangan menghapus fungsi klik gambar atau tombol DETAIL saat mengubah desain kartu.
Halaman detail kendaraan — src/pages/VehicleDetail.jsx
- Mengambil kendaraan dari VehicleContext dan mencocokkan ID dengan parameter rute.
- Menampilkan informasi, harga, spesifikasi, status, dan CTA WhatsApp.
- Mendukung foto tunggal image dan galeri images.
- Thumbnail dapat dipilih untuk mengganti foto utama.
- Foto utama dan thumbnail menggunakan tampilan yang tidak memotong keseluruhan foto (mode contain pada area galeri).
- Foto utama dapat diklik untuk membuka tampilan foto besar/zoom (lightbox); navigasi dan tombol tutup mengikuti implementasi file aktual.
- Pertahankan kompatibilitas data foto lama dan baru.
Pola data foto yang digunakan:
const vehicleImages = vehicle?.images?.length
  ? vehicle.images
  : vehicle?.image
  ? [vehicle.image]
  : [];
Dashboard Admin — src/pages/AdminDashboard.jsx
Fitur yang sudah dibuat dan diuji:
- Ringkasan dan daftar kendaraan.
- Pencarian kendaraan.
- Tambah, edit, dan hapus data kendaraan.
- Mengubah status kendaraan.
- Mengelola galeri foto kendaraan.
- Mengatur foto utama dan urutan foto melalui uploader.
- Input harga menampilkan pemisah ribuan format Indonesia, misalnya 540.000.000 (dengan konteks Rupiah), agar mudah dibaca saat mengetik.
- Saat disimpan, nilai harga dibersihkan dari pemisah ribuan dan dikirim ke Supabase sebagai angka, misalnya 540000000.
- Proses penyimpanan kendaraan tetap menyimpan image sebagai foto pertama dan images sebagai seluruh URL foto.
- Fitur penghapusan fisik file Storage tetap dinonaktifkan; jangan mengembalikannya secara tidak sengaja.
Uploader galeri — src/components/VehicleImageUploader.jsx
- Mendukung pemilihan beberapa foto sekaligus dari perangkat.
- Format input: JPEG, PNG, dan WebP.
- Maksimal 20 foto per kendaraan.
- Foto dikonversi menjadi WebP di browser sebelum upload.
- Batas resolusi foto baru dinaikkan menjadi maksimal 2.560 piksel pada sisi terpanjang (ikuti konstanta di file aktual jika kemudian diubah).
- Hasil konversi dibatasi maksimal 5 MB per foto agar sesuai batas bucket Supabase.
- Menyediakan preview foto, pilihan foto utama, pengurutan foto, dan penghapusan foto dari daftar kendaraan.
- Foto utama adalah item pertama pada array.
- Preview harus menampilkan foto utuh, bukan memotongnya; gunakan object-contain pada area preview.
- Jangan mengklaim foto lama otomatis memperoleh resolusi baru. Resolusi yang sudah tersimpan tidak berubah kecuali foto diunggah ulang.
7. Routing
Periksa src/App.jsx sebelum mengubah routing. Rute utama yang sudah digunakan:
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/mobil/:slug" element={<VehicleDetail />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<AdminDashboard />} />
</Routes>
Nama komponen atau konfigurasi aktual dapat berkembang. src/main.jsx membungkus aplikasi dengan BrowserRouter, VehicleProvider, dan provider terkait. Selalu cek implementasi aktual sebelum mengubahnya.
8. Riwayat perubahan — 20 November 2026
Pada sesi ini pengguna memperbarui dan melakukan deployment fitur berikut:
1. Format harga pada Admin
   - Input harga menggunakan pemisah ribuan format Indonesia agar nominal mudah dibaca.
   - Nilai yang disimpan tetap angka integer di Supabase, bukan teks yang mengandung Rp atau titik.
2. Tampilan galeri foto
   - Foto pada preview Admin dan halaman detail diubah agar tampil utuh dan tidak terpotong.
   - Halaman detail mendapat tampilan foto lebih besar/zoom saat foto utama diklik.
   - Foto baru diproses ke WebP dengan batas dimensi lebih tinggi, maksimal 2.560 px pada sisi terpanjang, dan tetap menjaga batas file 5 MB.
3. Navigasi dari kartu katalog
   - Foto mobil di HomePage.jsx dibungkus tautan React Router ke /mobil/${car.id}.
   - Tombol DETAIL tetap menggunakan tujuan yang sama.
   - Dengan demikian, pengguna dapat membuka halaman detail melalui klik foto atau tombol DETAIL.
4. Build dan deployment
   - npm run build berhasil setelah perubahan; Vite tetap menampilkan peringatan nonfatal bahwa bundle JavaScript hasil minifikasi lebih dari 500 kB.
   - Perubahan navigasi gambar pernah dideploy dengan commit b174ec2 (Make vehicle images clickable); setelah itu pengguna juga mengganti isi lengkap HomePage.jsx dan mengonfirmasi file sudah diperbarui. Jangan mengasumsikan hash commit terakhir setelah penggantian file tanpa memeriksa Git.
   - Pengguna mengonfirmasi pembaruan website selesai. Uji klik foto dan tombol DETAIL tetap perlu dikonfirmasi secara eksplisit jika sesi berikutnya memerlukan status pengujian final.
9. Status terkini dan hal yang perlu diperhatikan
- Website produksi berjalan pada domain alliwamobilindo.com dan Cloudflare Pages.
- Build lokal terakhir yang dilaporkan berhasil: 2.118 modul ditransformasikan; output JavaScript sekitar 533 kB sebelum gzip.
- Peringatan chunk di atas 500 kB adalah warning, bukan kegagalan build. Jangan mengubah konfigurasi bundling hanya untuk menghilangkan warning kecuali diminta atau ada alasan performa yang terukur.
- Harga, uploader foto, galeri detail, dan navigasi foto katalog telah diperbarui pada 20 November 2026.
- Jangan menganggap foto lama telah di-recompress atau di-resize ulang.
- Jangan menganggap file foto yang dihapus dari galeri juga telah dihapus dari Storage.
- Jangan menuliskan kredensial Supabase, token, atau isi .env.local ke dokumen ini.
10. Tugas berikutnya / ide pengembangan
Belum ada tugas lanjutan baru yang dipilih pengguna. Ide yang dapat dipertimbangkan jika diminta:
1. Verifikasi pengalaman katalog dan halaman detail pada desktop serta perangkat mobile.
2. Optimasi performa halaman dan ukuran bundle secara terukur.
3. Menambah fitur pemasaran seperti berbagi tautan kendaraan, caption media sosial, SEO, dan metadata.
4. Meninjau progres upload foto dan penanganan kegagalan jaringan jika pengguna memintanya.
5. Meninjau kebijakan retensi/penghapusan Storage secara aman tanpa menghapus objek yang masih direferensikan kendaraan lain.
Daftar di atas adalah ide, bukan fitur yang sudah selesai. Jangan mulai tanpa arahan pengguna.
11. Menjalankan dan memeriksa proyek
Dari PowerShell:
cd "D:\001. ADAM PROJECT ANDROID\005. WEBSITE SHOWROOM\showroom-mobil"
npm run dev
Buka alamat lokal yang ditampilkan Vite, biasanya http://localhost:5173/.

Sebelum deployment:
npm run build
Jika build berhasil, periksa file berubah dan lakukan push:
git status --short
git add <file-yang-diubah>
git commit -m "Deskripsi perubahan"
git push origin main
Jangan melakukan commit/push jika build gagal. Setelah push, periksa deployment Cloudflare Pages sampai status Success.
12. Prompt singkat untuk memulai sesi berikutnya
Baca AGENTS.md di root proyek ALLIWA MOBILINDO terlebih dahulu. Periksa kode aktual dan status Git sebelum memberi instruksi. Proyek menggunakan React + Vite, Supabase, GitHub branch main, dan Cloudflare Pages. Pertahankan fitur yang sudah berjalan, terutama input harga Rupiah yang disimpan sebagai angka, galeri foto WebP, foto utuh/zoom di halaman detail, dan navigasi ke detail melalui foto maupun tombol DETAIL. Saya tidak nyaman mengedit potongan kode; jika perlu perubahan kode, berikan file lengkap yang siap saya salin. Pandu saya bertahap melalui PowerShell dan tunggu hasil pengujian sebelum lanjut.