
import { useState } from "react";
import {
  CarFront,
  LayoutDashboard,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  CircleDollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useVehicles } from "../context/VehicleContext";
import { supabase } from "../lib/supabase";
import { formatRupiah } from "../data/vehicles";
import VehicleImageUploader from "../components/VehicleImageUploader";

const emptyForm = {
  name: "",
  brand: "",
  category: "SUV",
  year: "",
  transmission: "Automatic",
  mileage: "",
  price: "",
  image: "",
  status: "Available",
};

const inputClass =
  "w-full border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#80D927]";

export default function AdminDashboard() {
  const { vehicles, loading, error, refreshVehicles } = useVehicles();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formImages, setFormImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    const { error } = await logout();

    if (error) {
      alert("Gagal logout: " + error.message);
      return;
    }

    navigate("/admin/login", { replace: true });
  };

  const available = vehicles.filter(
    (car) => (car.status || "Available") === "Available"
  ).length;

  const reserved = vehicles.filter(
    (car) => car.status === "Reserved"
  ).length;

  const sold = vehicles.filter(
    (car) => car.status === "Sold"
  ).length;

  const filteredVehicles = vehicles.filter((car) => {
    const keyword = search.toLowerCase();

    return (
      car.name?.toLowerCase().includes(keyword) ||
      car.brand?.toLowerCase().includes(keyword)
    );
  });

  // BUKA FORM TAMBAH KENDARAAN
  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormImages([]);
    setShowForm(true);
  };

  // BUKA FORM EDIT KENDARAAN
  const openEditForm = (car) => {
    setEditingId(car.id);

    setForm({
      ...emptyForm,
      name: car.name || "",
      brand: car.brand || "",
      category: car.category || "SUV",
      year: car.year || "",
      transmission: car.transmission || "Automatic",
      mileage: car.mileage || "",
      price: String(car.price ?? ""),
      image: car.image || car.images?.[0] || "",
      status: car.status || "Available",
    });

    const currentImages =
      Array.isArray(car.images) && car.images.length > 0
        ? car.images
        : car.image
          ? [car.image]
          : [];

    setFormImages(
      currentImages.map((url) => ({
        id: crypto.randomUUID(),
        file: null,
        previewUrl: url,
        existingUrl: url,
      }))
    );

    setShowForm(true);
  };

  // PERUBAHAN INPUT FORM
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // TAMBAH DAN EDIT KENDARAAN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    if (formImages.length === 0) {
      alert("Silakan pilih minimal satu foto kendaraan.");
      return;
    }

    setIsSaving(true);

    try {
      const imageUrls = [];

      // UPLOAD FOTO BARU KE SUPABASE STORAGE
      for (const image of formImages) {
        if (image.file) {
          const filePath = `vehicles/${crypto.randomUUID()}.webp`;

          const { error: uploadError } = await supabase.storage
            .from("vehicle-images")
            .upload(filePath, image.file, {
              contentType: "image/webp",
              upsert: false,
            });

          if (uploadError) {
            throw uploadError;
          }

          const { data } = supabase.storage
            .from("vehicle-images")
            .getPublicUrl(filePath);

          imageUrls.push(data.publicUrl);
        } else {
          // PERTAHANKAN FOTO LAMA SAAT EDIT
          const existingUrl =
            image.existingUrl || image.previewUrl;

          if (existingUrl) {
            imageUrls.push(existingUrl);
          }
        }
      }

      if (imageUrls.length === 0) {
        throw new Error(
          "Tidak ada foto kendaraan yang berhasil disiapkan."
        );
      }

      // DATA KENDARAAN UNTUK DATABASE
      const vehicleData = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        year: Number(form.year),
        transmission: form.transmission,
        mileage: form.mileage.trim(),
        price: Number(form.price),
        image: imageUrls[0],
        images: imageUrls,
        status: form.status,
      };

      let result;

      // UPDATE KENDARAAN
      if (editingId !== null) {
        result = await supabase
          .from("vehicles")
          .update(vehicleData)
          .eq("id", editingId);
      } else {
        // TAMBAH KENDARAAN BARU
        result = await supabase
          .from("vehicles")
          .insert({
            ...vehicleData,
            featured: false,
          });
      }

      if (result.error) {
        throw result.error;
      }

      // PENGHAPUSAN FILE STORAGE DINONAKTIFKAN SEMENTARA.
      // Jika foto dikeluarkan dari form edit, URL-nya tidak lagi disimpan
      // di kolom image/images, tetapi file fisiknya tetap ada di Storage.

      // PERBARUI DATA DASHBOARD
      await refreshVehicles();

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setFormImages([]);

      if (editingId !== null) {
        alert(
          "Data kendaraan berhasil diperbarui. Foto yang dikeluarkan dari galeri tetap tersimpan sementara di Supabase Storage."
        );
      } else {
        alert("Kendaraan baru berhasil ditambahkan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan kendaraan:", error);

      alert(
        "Gagal menyimpan kendaraan: " +
          error.message +
          "\n\nCatatan: foto yang sempat berhasil diunggah mungkin masih tersimpan di Supabase Storage."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // HAPUS DATA KENDARAAN. FILE STORAGE TIDAK DIHAPUS SEMENTARA.
  const deleteVehicle = async (id) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus data kendaraan ini?\n\nUntuk sementara, foto fisik di Supabase Storage tidak ikut terhapus."
    );

    if (!confirmed || isProcessing) return;

    setIsProcessing(true);

    try {
      // Hapus data kendaraan dari database terlebih dahulu.
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      await refreshVehicles();

      alert(
        "Data kendaraan berhasil dihapus dari website. File foto tetap tersimpan di Supabase Storage untuk sementara dan dapat dibersihkan manual nanti."
      );
    } catch (error) {
      console.error("Gagal menghapus kendaraan:", error);
      alert("Gagal menghapus kendaraan: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // UBAH STATUS KENDARAAN
  const updateStatus = async (id, status) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ status })
        .eq("id", id);

      if (error) {
        throw error;
      }

      await refreshVehicles();
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Gagal mengubah status kendaraan: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white md:flex">

      {/* SIDEBAR */}
      <aside className="w-full border-b border-[#292929] bg-[#171717] md:min-h-screen md:w-64 md:border-b-0 md:border-r">

        <div className="border-b border-[#292929] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#80D927] text-black">
              <CarFront size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wider">
                ALLIWA
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-[#80D927]">
                MOBILINDO
              </p>
            </div>
          </div>

          <p className="mt-5 text-[10px] tracking-[0.25em] text-gray-500">
            ADMINISTRATION PANEL
          </p>
        </div>

        <nav className="p-4">
          <div className="flex items-center gap-3 bg-[#80D927]/10 px-4 py-3 text-sm text-[#80D927]">
            <LayoutDashboard size={18} />
            Dashboard
          </div>

          <div className="mt-3 flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
            <CarFront size={18} />
            Manajemen Kendaraan
          </div>
        </nav>

        <div className="hidden border-t border-[#292929] p-6 md:block">
          <p className="text-xs text-gray-500">
            WEBSITE MANAGEMENT
          </p>

          <p className="mt-2 text-xs text-[#80D927]">
            Supabase Database
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-5 md:p-10">

        {/* HEADER */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-[#80D927]">
              ALLIWA MOBILINDO / MANAGEMENT
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Kelola inventaris dan informasi kendaraan showroom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">
                Administrator
              </p>
              <p className="text-xs text-[#80D927]">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="border border-[#444] px-4 py-3 text-xs text-gray-300 transition hover:border-red-500 hover:text-red-400"
            >
              LOGOUT
            </button>

            <button
              onClick={openAddForm}
              className="flex items-center gap-2 bg-[#80D927] px-5 py-3 text-xs font-bold tracking-wider text-black transition hover:bg-[#9BEA4F]"
            >
              <Plus size={16} />
              TAMBAH MOBIL
            </button>
          </div>
        </header>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
            Gagal memuat data kendaraan: {error}
          </div>
        )}

        {/* STATISTICS */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="TOTAL KENDARAAN"
            value={vehicles.length}
            icon={<CarFront />}
          />

          <StatCard
            title="TERSEDIA"
            value={available}
            icon={<CheckCircle2 />}
          />

          <StatCard
            title="DIPESAN"
            value={reserved}
            icon={<Clock />}
          />

          <StatCard
            title="TERJUAL"
            value={sold}
            icon={<CircleDollarSign />}
          />

        </section>

        {/* VEHICLE TABLE */}
        <section className="border border-[#292929] bg-[#171717]">

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] p-5">

            <div>
              <h3 className="font-semibold">
                Daftar Kendaraan
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Semua unit kendaraan ALLIWA MOBILINDO
              </p>
            </div>

            <div className="flex items-center gap-2 border border-[#333] px-3 py-2">
              <Search size={15} className="text-gray-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kendaraan..."
                className="w-36 bg-transparent text-xs outline-none sm:w-48"
              />
            </div>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">

              <thead className="bg-[#202020] text-[10px] tracking-wider text-gray-500">
                <tr>
                  <th className="p-4">KENDARAAN</th>
                  <th className="p-4">TAHUN</th>
                  <th className="p-4">HARGA</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">AKSI</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500">
                      Memuat data kendaraan...
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredVehicles.map((car) => {
                      const carImage = car.images?.[0] || car.image;

                      return (
                        <tr
                          key={car.id}
                          className="border-t border-[#292929] transition hover:bg-[#202020]"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">

                              {carImage ? (
                                <img
                                  src={carImage}
                                  alt={car.name}
                                  className="h-12 w-16 object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-16 items-center justify-center bg-[#252525] text-gray-500">
                                  <CarFront size={22} />
                                </div>
                              )}

                              <div>
                                <p className="font-medium">
                                  {car.name}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {car.category}
                                </p>
                              </div>

                            </div>
                          </td>

                          <td className="p-4 text-gray-400">
                            {car.year}
                          </td>

                          <td className="p-4 font-medium text-[#80D927]">
                            {formatRupiah(car.price)}
                          </td>

                          <td className="p-4">
                            <select
                              value={car.status || "Available"}
                              disabled={isProcessing}
                              onChange={(e) =>
                                updateStatus(car.id, e.target.value)
                              }
                              className="border border-[#333] bg-[#111] px-2 py-2 text-xs outline-none focus:border-[#80D927] disabled:opacity-50"
                            >
                              <option value="Available">Tersedia</option>
                              <option value="Reserved">Dipesan</option>
                              <option value="Sold">Terjual</option>
                            </select>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">

                              <button
                                onClick={() => openEditForm(car)}
                                title="Edit kendaraan"
                                className="p-2 text-[#80D927] transition hover:bg-[#333]"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                onClick={() => deleteVehicle(car.id)}
                                disabled={isProcessing}
                                title="Hapus kendaraan"
                                className="p-2 text-red-400 transition hover:bg-[#333] disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredVehicles.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-10 text-center text-gray-500"
                        >
                          Kendaraan tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-5 text-xs text-gray-600">
          ALLIWA MOBILINDO · Database terhubung dengan Supabase.
        </p>
        <p className="mt-2 text-xs text-amber-500/80">
          Catatan sementara: file foto yang dilepas dari galeri atau kendaraan yang dihapus belum dibersihkan otomatis dari Supabase Storage.
        </p>

      </main>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">

          <div className="my-auto w-full max-w-2xl border border-[#333] bg-[#171717]">

            <div className="flex items-center justify-between border-b border-[#333] p-5">

              <div>
                <h3 className="font-semibold">
                  {editingId !== null
                    ? "Edit Kendaraan"
                    : "Tambah Kendaraan"}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Lengkapi informasi unit kendaraan.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                disabled={isSaving}
                className="text-gray-400 transition hover:text-[#80D927] disabled:opacity-50"
              >
                <X />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <FormField label="Nama Kendaraan">
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: BMW 320i Sport"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Merek">
                  <input
                    required
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Contoh: BMW"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Kategori">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Sedan</option>
                    <option>MPV</option>
                    <option>SUV</option>
                    <option>Hatchback</option>
                    <option>Coupe</option>
                    <option>Pickup</option>
                  </select>
                </FormField>

                <FormField label="Tahun">
                  <input
                    required
                    type="number"
                    min="1900"
                    max="2100"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="2023"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Transmisi">
                  <select
                    name="transmission"
                    value={form.transmission}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                    <option>CVT</option>
                  </select>
                </FormField>

                <FormField label="Kilometer">
                  <input
                    required
                    name="mileage"
                    value={form.mileage}
                    onChange={handleChange}
                    placeholder="18.000 km"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Harga (Rupiah)">
                  <input
                    required
                    type="number"
                    min="1"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="685000000"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Available">Tersedia</option>
                    <option value="Reserved">Dipesan</option>
                    <option value="Sold">Terjual</option>
                  </select>
                </FormField>

              </div>

              {/* MULTIPLE VEHICLE IMAGE UPLOADER */}
              <VehicleImageUploader
                images={formImages}
                onChange={setFormImages}
                disabled={isSaving}
              />

              {/* FORM BUTTONS */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-[#333] pt-5">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSaving}
                  className="border border-[#444] px-5 py-3 text-xs text-gray-300 transition hover:border-white disabled:opacity-50"
                >
                  BATAL
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#80D927] px-6 py-3 text-xs font-bold tracking-wider text-black transition hover:bg-[#9BEA4F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "MENYIMPAN..." : "SIMPAN KENDARAAN"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// STATISTIC CARD
function StatCard({ title, value, icon }) {
  return (
    <div className="border border-[#292929] bg-[#171717] p-5 transition hover:border-[#80D927]/40">

      <div className="flex items-center justify-between">

        <p className="text-[10px] tracking-wider text-gray-500">
          {title}
        </p>

        <span className="text-[#80D927]">
          {icon}
        </span>

      </div>

      <p className="mt-5 text-3xl font-semibold">
        {value}
      </p>

    </div>
  );
}

// FORM FIELD
function FormField({ label, children }) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs text-gray-400">
        {label}
      </span>

      {children}

    </label>
  );
}
