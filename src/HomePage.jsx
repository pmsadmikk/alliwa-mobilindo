import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useVehicles } from "./context/VehicleContext";
import {
  CarFront,
  Search,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Gauge,
  Calendar,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
} from "lucide-react";

const CATALOG_RETURN_KEY = "alliwa_catalog_return_position";

const formatPrice = (price) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Number(price) || 0);

const formatMileage = (mileage) => {
  if (mileage === null || mileage === undefined || mileage === "") {
    return "Belum tersedia";
  }

  const numericMileage = Number(mileage);
  return Number.isFinite(numericMileage)
    ? `${new Intl.NumberFormat("id-ID").format(numericMileage)} km`
    : `${mileage} km`;
};

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

const PRICE_RANGES = [
  { value: "Semua", label: "Range Harga" },
  { value: "under-150", label: "< Rp 150 Juta" },
  { value: "150-300", label: "Rp 150 - 300 Juta" },
  { value: "300-500", label: "Rp 300 - 500 Juta" },
  { value: "above-500", label: "> Rp 500 Juta" },
];

function CatalogVehicleImage({ src, alt }) {
  const [isPortrait, setIsPortrait] = useState(false);

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setIsPortrait(naturalHeight > naturalWidth);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={handleLoad}
      className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
        isPortrait ? "object-[50%_75%]" : "object-center"
      }`}
    />
  );
}

export default function HomePage() {
  const { vehicles } = useVehicles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selectedBrand, setSelectedBrand] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [priceRange, setPriceRange] = useState("Semua");
  const hasRestoredPosition = useRef(false);

  const availableBrands = useMemo(() => {
    const brands = vehicles
      .map((car) => (car.brand || "").trim())
      .filter(Boolean);
    return ["Semua", ...Array.from(new Set(brands)).sort()];
  }, [vehicles]);

  const availableYears = useMemo(() => {
    const years = vehicles
      .map((car) => String(car.year || "").trim())
      .filter(Boolean);
    return [
      "Semua",
      ...Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a)),
    ];
  }, [vehicles]);

  useEffect(() => {
    if (hasRestoredPosition.current || vehicles.length === 0) return;

    const savedState = sessionStorage.getItem(CATALOG_RETURN_KEY);
    if (!savedState) return;

    hasRestoredPosition.current = true;

    try {
      const saved = JSON.parse(savedState);
      setSearch(saved.search || "");
      setCategory(saved.category || "Semua");
      setSelectedBrand(saved.selectedBrand || "Semua");
      setSelectedYear(saved.selectedYear || "Semua");
      setPriceRange(saved.priceRange || "Semua");

      const savedScrollY = Number(saved.scrollY) || 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedScrollY);
          sessionStorage.removeItem(CATALOG_RETURN_KEY);
        });
      });
    } catch {
      sessionStorage.removeItem(CATALOG_RETURN_KEY);
    }
  }, [vehicles.length]);

  const saveCatalogPosition = () => {
    sessionStorage.setItem(
      CATALOG_RETURN_KEY,
      JSON.stringify({
        scrollY: window.scrollY,
        search,
        category,
        selectedBrand,
        selectedYear,
        priceRange,
      })
    );
  };

  const resetAllFilters = () => {
    setSearch("");
    setCategory("Semua");
    setSelectedBrand("Semua");
    setSelectedYear("Semua");
    setPriceRange("Semua");
  };

  const hasActiveFilter =
    search !== "" ||
    category !== "Semua" ||
    selectedBrand !== "Semua" ||
    selectedYear !== "Semua" ||
    priceRange !== "Semua";

  const filteredVehicles = vehicles.filter((car) => {
    const matchesSearch =
      (car.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (car.brand || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "Semua" || car.category === category;

    const matchesBrand =
      selectedBrand === "Semua" ||
      (car.brand || "").trim().toLowerCase() === selectedBrand.toLowerCase();

    const matchesYear =
      selectedYear === "Semua" || String(car.year || "").trim() === selectedYear;

    const numericPrice = Number(car.price) || 0;
    let matchesPrice = true;
    if (priceRange === "under-150") {
      matchesPrice = numericPrice > 0 && numericPrice < 150000000;
    } else if (priceRange === "150-300") {
      matchesPrice = numericPrice >= 150000000 && numericPrice <= 300000000;
    } else if (priceRange === "300-500") {
      matchesPrice = numericPrice > 300000000 && numericPrice <= 500000000;
    } else if (priceRange === "above-500") {
      matchesPrice = numericPrice > 500000000;
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesYear &&
      matchesPrice
    );
  });

  const scrollToCatalog = () => {
    const el = document.getElementById("katalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    scrollToCatalog();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-12">
          <Link to="/" className="flex items-center">
            <img
              src="/Images/alliwa-logo-header.png"
              alt="Alliwa Mobilindo"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </Link>

          <div className="hidden items-center gap-9 text-xs font-medium tracking-widest text-gray-300 md:flex">
            <a href="#" className="text-[#80D927]">
              BERANDA
            </a>
            <a href="#katalog" className="transition hover:text-[#80D927]">
              KATALOG MOBIL
            </a>
            <a href="#tentang" className="transition hover:text-[#80D927]">
              TENTANG KAMI
            </a>
            <a href="#kontak" className="transition hover:text-[#80D927]">
              KONTAK
            </a>
          </div>

          <a
            href="#katalog"
            className="hidden rounded-full bg-[#80D927] px-6 py-3 text-[10px] font-bold tracking-widest text-black transition hover:bg-white md:block"
          >
            LIHAT STOK MOBIL
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1.5 text-[#80D927] transition hover:bg-white/5 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
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

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#111111]">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=2000&q=85"
            alt="Koleksi mobil premium Alliwa Mobilindo"
            className="h-[520px] w-full object-cover object-center opacity-55 sm:h-[620px] lg:h-[720px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-[#111111]/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-14 sm:pt-20 lg:px-12 lg:pb-16 lg:pt-24">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.35em] text-gray-400 sm:text-xs">
            ALLIWA MOBILINDO
          </p>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            TEMUKAN
            <br />
            <span className="text-white">MOBIL IMPIAN.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Koleksi Mobil Bekas Berkualitas Premium. Cek Unit, Harga Transparan,
            dan Proses Mudah di Alliwa.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <a
              href="#katalog"
              className="flex items-center justify-center rounded-full bg-[#80D927] px-6 py-4 text-center text-[11px] font-extrabold tracking-[0.12em] text-black shadow-[0_0_28px_rgba(128,217,39,0.38)] transition hover:bg-white sm:px-8 sm:text-xs"
            >
              LIHAT STOK MOBIL
            </a>
            <a
              href="#tentang"
              className="flex items-center justify-center rounded-full border border-white/35 bg-black/30 px-6 py-4 text-center text-[11px] font-bold tracking-[0.12em] text-white backdrop-blur-sm transition hover:border-[#80D927] hover:text-[#80D927] sm:px-8 sm:text-xs"
            >
              TENTANG KAMI
            </a>
          </div>

          <form
            onSubmit={handleHeroSearchSubmit}
            className="mt-10 rounded-2xl border border-white/10 bg-[#181818]/90 p-3.5 shadow-2xl backdrop-blur-md sm:p-5"
          >
            <div className="flex items-center gap-3 rounded-xl border border-[#80D927]/70 bg-[#111111] px-4 py-3.5 focus-within:border-[#80D927] focus-within:ring-2 focus-within:ring-[#80D927]/20">
              <Search size={19} className="shrink-0 text-[#80D927]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Merek atau Model..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="hidden rounded-lg bg-[#80D927] px-4 py-2 text-xs font-bold text-black transition hover:bg-white sm:block"
              >
                Cari
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="relative flex items-center rounded-xl border border-white/15 bg-[#242424] px-2.5 py-2.5 sm:px-3.5">
                <CarFront
                  size={15}
                  className="mr-1.5 hidden shrink-0 text-gray-300 sm:block"
                />
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  aria-label="Pilih Merek"
                  className="w-full cursor-pointer bg-transparent text-[11px] font-medium text-gray-200 outline-none sm:text-xs"
                >
                  <option value="Semua" className="bg-[#111111] text-white">
                    Pilih Merek
                  </option>
                  {availableBrands
                    .filter((b) => b !== "Semua")
                    .map((brand) => (
                      <option
                        key={brand}
                        value={brand}
                        className="bg-[#111111] text-white"
                      >
                        {brand}
                      </option>
                    ))}
                </select>
              </div>

              <div className="relative flex items-center rounded-xl border border-white/15 bg-[#242424] px-2.5 py-2.5 sm:px-3.5">
                <Calendar
                  size={15}
                  className="mr-1.5 hidden shrink-0 text-gray-300 sm:block"
                />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Pilih Tahun"
                  className="w-full cursor-pointer bg-transparent text-[11px] font-medium text-gray-200 outline-none sm:text-xs"
                >
                  <option value="Semua" className="bg-[#111111] text-white">
                    Pilih Tahun
                  </option>
                  {availableYears
                    .filter((y) => y !== "Semua")
                    .map((year) => (
                      <option
                        key={year}
                        value={year}
                        className="bg-[#111111] text-white"
                      >
                        {year}
                      </option>
                    ))}
                </select>
              </div>

              <div className="relative flex items-center rounded-xl border border-white/15 bg-[#242424] px-2.5 py-2.5 sm:px-3.5">
                <SlidersHorizontal
                  size={15}
                  className="mr-1.5 hidden shrink-0 text-gray-300 sm:block"
                />
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  aria-label="Range Harga"
                  className="w-full cursor-pointer bg-transparent text-[11px] font-medium text-gray-200 outline-none sm:text-xs"
                >
                  {PRICE_RANGES.map((range) => (
                    <option
                      key={range.value}
                      value={range.value}
                      className="bg-[#111111] text-white"
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-5">
            <div className="flex flex-col items-center rounded-2xl bg-[#80D927] px-2.5 py-5 text-center text-[#111111] shadow-lg sm:px-6 sm:py-7">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#111111]/80 bg-black/5 sm:h-14 sm:w-14">
                <CarFront
                  size={26}
                  strokeWidth={2.2}
                  className="text-[#111111]"
                />
              </div>
              <h2 className="text-xs font-extrabold leading-tight sm:text-base">
                Premium Car
              </h2>
              <p className="mt-1 text-[10px] font-medium text-[#111111]/85 sm:text-xs">
                Kualitas Terjamin
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-[#80D927] px-2.5 py-5 text-center text-[#111111] shadow-lg sm:px-6 sm:py-7">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#111111]/80 bg-black/5 sm:h-14 sm:w-14">
                <FileCheck2
                  size={26}
                  strokeWidth={2.2}
                  className="text-[#111111]"
                />
              </div>
              <h2 className="text-xs font-extrabold leading-tight sm:text-base">
                Dokumen
              </h2>
              <p className="mt-1 text-[10px] font-medium text-[#111111]/85 sm:text-xs">
                Transparan & Aman
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-[#80D927] px-2.5 py-5 text-center text-[#111111] shadow-lg sm:px-6 sm:py-7">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#111111]/80 bg-black/5 sm:h-14 sm:w-14">
                <Gauge
                  size={26}
                  strokeWidth={2.2}
                  className="text-[#111111]"
                />
              </div>
              <h2 className="text-xs font-extrabold leading-tight sm:text-base">
                Layanan Cepat
              </h2>
              <p className="mt-1 text-[10px] font-medium text-[#111111]/85 sm:text-xs">
                Proses Mudah
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <CarFront size={16} className="mt-0.5 shrink-0 text-[#80D927]" />
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#80D927]">
                  PILIHAN MOBIL
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Beragam pilihan kendaraan
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-[#80D927]"
              />
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#80D927]">
                  INFORMASI JELAS
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Detail kendaraan transparan
                </p>
              </div>
            </div>

            <div className="col-span-2 flex items-start gap-2.5 sm:col-span-1">
              <Zap size={16} className="mt-0.5 shrink-0 text-[#80D927]" />
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#80D927]">
                  PROSES CEPAT
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Konsultasi & transaksi praktis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section
        id="katalog"
        className="bg-[#F5F5F2] px-5 py-20 text-[#171717] lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-[0.35em] text-[#5FA91C]">
                KOLEKSI ALLIWA MOBILINDO
              </p>
              <h2 className="text-3xl font-light sm:text-5xl">
                Temukan <span className="font-extrabold">Mobil Pilihan Anda.</span>
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
                Lihat pilihan kendaraan yang tersedia dan temukan mobil yang sesuai
                dengan kebutuhan Anda.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 md:w-80">
              <Search size={18} className="text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari merek atau model mobil..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2.5">
              {["Semua", "Sedan", "MPV", "SUV"].map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-6 py-2.5 text-xs font-bold transition ${
                    category === item
                      ? "bg-[#80D927] text-black shadow-sm"
                      : "border border-gray-300 bg-white text-gray-600 hover:border-[#5FA91C] hover:text-[#5FA91C]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {hasActiveFilter && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#5FA91C] underline transition hover:text-black"
              >
                Reset Semua Filter ({filteredVehicles.length} unit ditemukan)
              </button>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((car) => {
                const status = car.status || "Available";
                return (
                  <article
                    key={car.id}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden bg-[#EAEAE6]">
                      <Link
                        to={`/mobil/${car.id}`}
                        onClick={saveCatalogPosition}
                        aria-label={`Lihat detail ${car.name}`}
                        className="relative block aspect-[4/3] w-full"
                      >
                        <CatalogVehicleImage
                          src={car.images?.[0] || car.image}
                          alt={car.name}
                        />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />
                        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-[#80D927] px-3.5 py-1.5 text-[9px] font-bold tracking-widest text-black shadow-sm">
                          ALLIWA CHOICE
                        </span>
                        <span
                          className={`pointer-events-none absolute right-4 top-4 rounded-full px-3.5 py-1.5 text-[9px] font-bold tracking-widest shadow-sm ${
                            statusStyles[status] || statusStyles.Available
                          }`}
                        >
                          {statusLabels[status] || status.toUpperCase()}
                        </span>
                      </Link>
                    </div>

                    <div className="p-6">
                      <p className="text-[10px] font-semibold tracking-widest text-[#5FA91C]">
                        {car.year} · {car.category}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-[#171717]">
                        {car.name}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-gray-500">
                        <span>{car.transmission}</span>
                        <span>{formatMileage(car.mileage)}</span>
                      </div>
                      <div className="mt-6 flex items-end justify-between border-t border-gray-200 pt-5">
                        <div>
                          <p className="text-[10px] font-medium text-gray-400">
                            HARGA MOBIL
                          </p>
                          <p className="mt-1.5 text-lg font-extrabold text-[#171717]">
                            {formatPrice(car.price)}
                          </p>
                        </div>
                        <Link
                          to={`/mobil/${car.id}`}
                          onClick={saveCatalogPosition}
                          className="flex items-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-[10px] font-bold tracking-widest text-white transition hover:bg-[#80D927] hover:text-black"
                        >
                          DETAIL <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl bg-white py-16 text-center text-gray-500 shadow-sm">
                Kendaraan sesuai kriteria tidak ditemukan.
                <button
                  onClick={resetAllFilters}
                  className="ml-2 font-bold text-[#5FA91C] underline"
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
              className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#171717] px-9 py-4 text-[10px] font-bold tracking-[0.15em] text-white transition hover:bg-[#80D927] hover:text-black"
            >
              HUBUNGI ALLIWA <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="bg-[#111111] px-5 py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200"
              alt="Kendaraan pilihan Alliwa Mobilindo"
              className="h-[400px] w-full rounded-2xl object-cover md:h-[520px]"
            />
            <div className="absolute -bottom-5 -right-2 rounded-2xl border border-[#80D927] bg-[#171717] p-6 md:-right-5">
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
              Alliwa Mobilindo hadir untuk membantu Anda menemukan mobil bekas yang
              tepat. Kami mengutamakan kualitas kendaraan, informasi yang
              transparan, serta pelayanan yang memudahkan proses pembelian.
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
      <section className="bg-[#80D927] px-5 py-20 text-center text-black">
        <p className="text-[10px] font-extrabold tracking-[0.35em]">
          ALLIWA MOBILINDO
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-light leading-tight md:text-5xl">
          Siap Menemukan{" "}
          <span className="font-extrabold">Mobil Impian Anda?</span>
        </h2>
        <p className="mt-5 text-sm text-black/75">
          Hubungi tim Alliwa Mobilindo untuk mendapatkan informasi mengenai
          pilihan kendaraan kami.
        </p>
        <a
          href="#kontak"
          className="mt-9 inline-block rounded-full bg-[#111111] px-9 py-4 text-[10px] font-bold tracking-widest text-white transition hover:bg-white hover:text-black"
        >
          HUBUNGI ALLIWA →
        </a>
      </section>

      {/* FOOTER */}
      <footer id="kontak" className="bg-[#111111] px-5 py-14 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#80D927] text-black">
                <CarFront size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-extrabold tracking-wider text-white">
                ALLIWA <span className="text-[#80D927]">MOBILINDO</span>
              </h2>
            </div>
            <p className="mt-5 max-w-xs text-xs leading-7 text-gray-500">
              Temukan mobil impian Anda bersama Alliwa Mobilindo. Pilihan kendaraan
              dan informasi yang membantu Anda mengambil keputusan pembelian.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest text-[#80D927]">
              MENU
            </h3>
            <div className="mt-6 space-y-4 text-xs text-gray-400">
              <a href="#" className="block transition hover:text-[#80D927]">
                Beranda
              </a>
              <a
                href="#katalog"
                className="block transition hover:text-[#80D927]"
              >
                Katalog Kendaraan
              </a>
              <a
                href="#tentang"
                className="block transition hover:text-[#80D927]"
              >
                Tentang Kami
              </a>
              <a
                href="#kontak"
                className="block transition hover:text-[#80D927]"
              >
                Kontak
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest text-[#80D927]">
              INFORMASI KONTAK
            </h3>
            <div className="mt-6 space-y-4 text-xs leading-6 text-gray-400">
              <p>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/6281210481879"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#80D927]"
                >
                  +62 812-1048-1879
                </a>
              </p>
              <p>
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/alliwamobilindo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#80D927]"
                >
                  @alliwamobilindo
                </a>
              </p>
              <p>
                Alamat:{" "}
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Dekat%20WS%20JAYA%20MOTOR%202%2C%20Jl.%20Gatot%20Soebroto%20No.90%2C%20RT.002%2FRW.008%2C%20Karangasih%2C%20Kec.%20Cikarang%20Utara%2C%20Kabupaten%20Bekasi%2C%20Jawa%20Barat%2017530"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#80D927]"
                >
                  Dekat WS JAYA MOTOR 2, Jl. Gatot Soebroto No.90,
                  RT.002/RW.008, Karangasih, Kec. Cikarang Utara, Kabupaten
                  Bekasi, Jawa Barat 17530
                </a>
              </p>
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
