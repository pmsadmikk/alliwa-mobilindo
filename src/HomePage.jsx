
import { useState } from "react";
import { Link } from "react-router-dom";
import { useVehicles } from "./context/VehicleContext";
import { CarFront, Search, Menu, X, ArrowRight, CheckCircle2 } from "lucide-react";

const formatPrice = (price) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(price);

const statusStyles = {
  Available: "bg-[#80D927] text-black",
  Reserved: "bg-amber-400 text-black",
  Sold: "bg-red-500 text-white",
};

const statusLabels = {
  Available: "TERSEDIA",
  Reserved: "DIPESAN",
  Sold: "TERJUAL",
};

export default function HomePage() {
  const { vehicles } = useVehicles();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const filteredVehicles = vehicles.filter((car) => {
    const matchesSearch =
      (car.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (car.brand || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Semua" || car.category === category;

    return matchesSearch && matchesCategory;
  });

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="min-h-screen bg-[#111111] text-white">

      {/* ANNOUNCEMENT */}
      <div className="bg-[#80D927] px-4 py-2 text-center text-[10px] font-bold tracking-[0.15em] text-black sm:text-xs">
        ALLIWA MOBILINDO · TEMUKAN MOBIL IMPIAN ANDA
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#80D927] text-black">
              <CarFront size={25} strokeWidth={2.5} />
            </div>

            <div>
              <span className="block text-lg font-extrabold tracking-[0.08em] text-white">
                ALLIWA <span className="text-[#80D927]">MOBILINDO</span>
              </span>
              <span className="block text-[8px] font-medium tracking-[0.35em] text-gray-400">
                YOUR TRUSTED CAR PARTNER
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-9 text-xs font-medium tracking-widest text-gray-300 md:flex">
            <a href="#" className="text-[#80D927]">BERANDA</a>
            <a href="#katalog" className="transition hover:text-[#80D927]">KATALOG MOBIL</a>
            <a href="#tentang" className="transition hover:text-[#80D927]">TENTANG KAMI</a>
            <a href="#kontak" className="transition hover:text-[#80D927]">KONTAK</a>
          </div>

          <a
            href="#katalog"
            className="hidden bg-[#80D927] px-5 py-3 text-[10px] font-bold tracking-widest text-black transition hover:bg-white md:block"
          >
            LIHAT KATALOG
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#80D927] md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#171717] px-6 py-5 md:hidden">
            {[
              ["Beranda", "#"],
              ["Katalog Mobil", "#katalog"],
              ["Tentang Kami", "#tentang"],
              ["Kontak", "#kontak"],
            ].map(([label, link]) => (
              <a
                key={label}
                href={link}
                onClick={closeMenu}
                className="block border-b border-white/10 py-4 text-xs tracking-widest text-gray-300 transition hover:text-[#80D927]"
              >
                {label.toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden lg:min-h-[700px]">

        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2000"
          alt="Pilihan mobil Alliwa Mobilindo"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-12">

          <p className="mb-7 text-[10px] font-semibold tracking-[0.35em] text-[#80D927] sm:text-xs">
            SELAMAT DATANG DI ALLIWA MOBILINDO
          </p>

          <h1 className="max-w-3xl text-5xl font-light leading-[1.15] tracking-wide sm:text-6xl lg:text-8xl">
            TEMUKAN
            <br />
            <span className="font-extrabold text-[#80D927]">MOBIL IMPIAN.</span>
          </h1>

          <p className="mt-8 max-w-lg text-sm leading-7 text-gray-300 sm:text-base">
            Temukan mobil bekas berkualitas dengan pilihan unit
            yang sesuai kebutuhan dan anggaran Anda. Dapatkan
            informasi kendaraan secara jelas bersama Alliwa Mobilindo.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#katalog"
              className="flex items-center gap-3 bg-[#80D927] px-7 py-4 text-[10px] font-bold tracking-[0.15em] text-black transition hover:bg-white"
            >
              JELAJAHI KATALOG <ArrowRight size={15} />
            </a>

            <a
              href="#tentang"
              className="border border-white/50 px-7 py-4 text-[10px] tracking-[0.15em] text-white transition hover:border-[#80D927] hover:text-[#80D927]"
            >
              TENTANG KAMI
            </a>
          </div>

          <p className="mt-12 text-xs font-medium tracking-widest text-gray-400">
            TEMUKAN MOBIL IMPIAN ANDA BERSAMA <span className="text-[#80D927]">ALLIWA.</span>
          </p>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="border-y border-white/10 bg-[#171717]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-6 py-9 md:grid-cols-4 lg:px-12">
          {[
            ["PILIHAN MOBIL", "Beragam pilihan kendaraan"],
            ["INFORMASI JELAS", "Detail kendaraan transparan"],
            ["PELAYANAN", "Konsultasi pembelian"],
            ["KEMUDAHAN", "Proses pembelian lebih mudah"],
          ].map(([title, description]) => (
            <div key={title} className="px-4 py-3 text-center">
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#80D927]">
                {title}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="katalog" className="bg-[#F5F5F2] px-6 py-20 text-[#171717] lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-[10px] font-bold tracking-[0.35em] text-[#5FA91C]">
                KOLEKSI ALLIWA MOBILINDO
              </p>

              <h2 className="text-4xl font-light sm:text-5xl">
                Temukan <span className="font-extrabold">Mobil Pilihan Anda.</span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500">
                Lihat pilihan kendaraan yang tersedia dan temukan
                mobil yang sesuai dengan kebutuhan Anda.
              </p>
            </div>

            <div className="flex items-center gap-3 border-b border-gray-300 pb-3 md:w-80">
              <Search size={18} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari merek atau model mobil..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* FILTER */}
          <div className="mb-10 flex flex-wrap gap-3">
            {["Semua", "Sedan", "MPV", "SUV"].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-6 py-3 text-xs font-medium transition ${
                  category === item
                    ? "bg-[#80D927] text-black"
                    : "border border-gray-300 text-gray-600 hover:border-[#5FA91C] hover:text-[#5FA91C]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* VEHICLE CARDS */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((car) => {
                const status = car.status || "Available";

                return (
                  <article
                    key={car.id}
                    className="group overflow-hidden bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={car.images?.[0] || car.image}
                        alt={car.name}
                        className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <span className="absolute left-5 top-5 bg-[#80D927] px-4 py-2 text-[9px] font-bold tracking-widest text-black">
                        ALLIWA CHOICE
                      </span>

                      <span
                        className={`absolute right-5 top-5 px-4 py-2 text-[9px] font-bold tracking-widest ${
                          statusStyles[status] || statusStyles.Available
                        }`}
                      >
                        {statusLabels[status] || status.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="text-[10px] font-semibold tracking-widest text-[#5FA91C]">
                        {car.year} · {car.category}
                      </p>

                      <h3 className="mt-3 text-xl font-bold text-[#171717]">
                        {car.name}
                      </h3>

                      <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-gray-500">
                        <span>{car.transmission}</span>
                        <span>{car.mileage}</span>
                      </div>

                      <div className="mt-7 flex items-end justify-between border-t border-gray-200 pt-5">
                        <div>
                          <p className="text-[10px] font-medium text-gray-400">
                            HARGA MOBIL
                          </p>
                          <p className="mt-2 text-lg font-extrabold text-[#171717]">
                            {formatPrice(car.price)}
                          </p>
                        </div>

                        <Link
                          to={`/mobil/${car.id}`}
                          className="flex items-center gap-2 bg-[#171717] px-5 py-3 text-[10px] font-bold tracking-widest text-white transition hover:bg-[#80D927] hover:text-black"
                        >
                          DETAIL <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                Kendaraan tidak ditemukan.
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("Semua");
                  }}
                  className="ml-2 font-semibold text-[#5FA91C] underline"
                >
                  Reset pencarian
                </button>
              </div>
            )}
          </div>

          <div className="mt-14 text-center">
            <p className="text-xs text-gray-500">
              Ingin mengetahui lebih lanjut mengenai unit kendaraan kami?
            </p>
            <a
              href="#kontak"
              className="mt-5 inline-flex items-center gap-3 bg-[#171717] px-9 py-4 text-[10px] font-bold tracking-[0.15em] text-white transition hover:bg-[#80D927] hover:text-black"
            >
              HUBUNGI ALLIWA <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="bg-[#111111] px-6 py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200"
              alt="Kendaraan pilihan Alliwa Mobilindo"
              className="h-[400px] w-full object-cover md:h-[520px]"
            />

            <div className="absolute -bottom-5 -right-4 border border-[#80D927] bg-[#171717] p-6 md:-right-5">
              <p className="text-xs font-bold tracking-widest text-[#80D927]">
                ALLIWA
              </p>
              <p className="mt-1 text-xs text-gray-400">
                YOUR TRUSTED CAR PARTNER
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.35em] text-[#80D927]">
              MENGAPA MEMILIH ALLIWA
            </p>

            <h2 className="mt-6 text-4xl font-light leading-tight md:text-5xl">
              Lebih Dari
              <br />
              Sekadar <span className="font-extrabold text-[#80D927]">Mobil.</span>
            </h2>

            <p className="mt-7 text-sm leading-8 text-gray-400">
              Alliwa Mobilindo hadir untuk membantu Anda menemukan
              mobil bekas yang tepat. Kami mengutamakan kualitas
              kendaraan, informasi yang transparan, serta pelayanan
              yang memudahkan proses pembelian.
            </p>

            <div className="mt-9 space-y-5">
              {[
                "Pilihan kendaraan sesuai kebutuhan",
                "Informasi kendaraan yang jelas",
                "Pelayanan dan konsultasi pembelian",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <CheckCircle2 size={19} className="text-[#80D927]" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>

            <a
              href="#kontak"
              className="mt-10 inline-flex items-center gap-3 border-b border-[#80D927] pb-3 text-xs font-bold tracking-widest text-[#80D927] transition hover:text-white"
            >
              HUBUNGI KAMI <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-[#80D927] px-6 py-20 text-center text-black">
        <p className="text-[10px] font-extrabold tracking-[0.35em]">
          ALLIWA MOBILINDO
        </p>

        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-light leading-tight md:text-5xl">
          Siap Menemukan
          <span className="font-extrabold"> Mobil Impian Anda?</span>
        </h2>

        <p className="mt-5 text-sm text-black/70">
          Hubungi tim Alliwa Mobilindo untuk mendapatkan informasi
          mengenai pilihan kendaraan kami.
        </p>

        <a
          href="#kontak"
          className="mt-9 inline-block bg-[#111111] px-9 py-4 text-[10px] font-bold tracking-widest text-white transition hover:bg-white hover:text-black"
        >
          HUBUNGI ALLIWA →
        </a>
      </section>

      {/* FOOTER */}
      <footer id="kontak" className="bg-[#111111] px-6 py-14 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[#80D927] text-black">
                <CarFront size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-extrabold tracking-wider text-white">
                ALLIWA <span className="text-[#80D927]">MOBILINDO</span>
              </h2>
            </div>

            <p className="mt-5 max-w-xs text-xs leading-7 text-gray-500">
              Temukan mobil impian Anda bersama Alliwa Mobilindo.
              Pilihan kendaraan dan informasi yang membantu Anda
              mengambil keputusan pembelian.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-[#80D927]">
              MENU
            </h3>

            <div className="mt-6 space-y-4 text-xs text-gray-400">
              <a href="#" className="block transition hover:text-[#80D927]">Beranda</a>
              <a href="#katalog" className="block transition hover:text-[#80D927]">Katalog Kendaraan</a>
              <a href="#tentang" className="block transition hover:text-[#80D927]">Tentang Kami</a>
              <a href="#kontak" className="block transition hover:text-[#80D927]">Kontak</a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-[#80D927]">
              INFORMASI KONTAK
            </h3>

            <div className="mt-6 space-y-4 text-xs leading-6 text-gray-400">
              <p>WhatsApp: Nomor showroom belum diatur</p>
              <p>Instagram: Akun showroom belum diatur</p>
              <p>Alamat: Alamat showroom belum diatur</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-7 text-center text-[10px] text-gray-600">
          © 2026 ALLIWA MOBILINDO. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </main>
  );
}
