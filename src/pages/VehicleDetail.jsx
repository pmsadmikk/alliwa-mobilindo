limport { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  MessageCircle,
  CheckCircle,
  CarFront,
  ShieldCheck,
  X,
  ZoomIn,
} from "lucide-react";

import { formatRupiah } from "../data/vehicles";
import { useVehicles } from "../context/VehicleContext";

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

/* Accordion ringan berbasis state (tanpa library) */
function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-base font-bold"
      >
        {title}
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

export default function VehicleDetail() {
  const { vehicles } = useVehicles();
  const { slug } = useParams();

  const vehicle = vehicles.find((item) => String(item.id) === slug);
  const vehicleImages = vehicle?.images?.length
    ? vehicle.images
    : vehicle?.image
      ? [vehicle.image]
      : [];

  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(null);

  const goNext = () =>
    setActiveImage((current) => (current + 1) % vehicleImages.length);
  const goPrev = () =>
    setActiveImage(
      (current) => (current - 1 + vehicleImages.length) % vehicleImages.length
    );

  /* Selalu mulai dari paling atas saat membuka kendaraan */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setActiveImage(0);
    setIsLightboxOpen(false);
  }, [slug]);

  /* Keyboard untuk lightbox */
  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (vehicleImages.length > 1 && event.key === "ArrowRight") {
        setActiveImage((current) => (current + 1) % vehicleImages.length);
      }

      if (vehicleImages.length > 1 && event.key === "ArrowLeft") {
        setActiveImage(
          (current) =>
            (current - 1 + vehicleImages.length) % vehicleImages.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, vehicleImages.length]);

  /* Kunci scroll halaman saat lightbox terbuka */
  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isLightboxOpen]);

  /* Muat foto berikutnya di belakang layar agar geser terasa instan */
  useEffect(() => {
    if (vehicleImages.length < 2) return;
    const preload = new Image();
    preload.src = vehicleImages[(activeImage + 1) % vehicleImages.length];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImage, slug, vehicleImages.length]);

  if (!vehicle) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#111111] px-6 text-center text-white">
        <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#80D927] text-black">
          <CarFront size={34} />
        </div>
        <h1 className="mb-3 text-3xl font-bold">Kendaraan Tidak Ditemukan</h1>
        <p className="mb-6 text-gray-400">
          Kendaraan yang Anda cari mungkin sudah tidak tersedia.
        </p>
        <Link
          to="/"
          className="bg-[#80D927] px-6 py-3 font-bold text-black transition hover:bg-white"
        >
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  const hasMileage =
    vehicle.mileage !== null &&
    vehicle.mileage !== undefined &&
    vehicle.mileage !== "";

  const formattedMileage = hasMileage
    ? `${Number(vehicle.mileage).toLocaleString("id-ID")} km`
    : "Belum tersedia";

  const whatsappNumber = "6281210481879";
  const whatsappMessage = encodeURIComponent(
    `Halo Alliwa Mobilindo, saya tertarik dengan ${vehicle.brand} ${vehicle.name} tahun ${vehicle.year} dengan harga ${formatRupiah(vehicle.price)}. Apakah unit ini masih tersedia?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const specifications = [
    { icon: Calendar, label: "Tahun", value: vehicle.year },
    { icon: Gauge, label: "Kilometer", value: formattedMileage },
    { icon: Settings, label: "Transmisi", value: vehicle.transmission },
    {
      icon: Fuel,
      label: "Bahan Bakar",
      value: vehicle.fuel || "Belum tersedia",
    },
  ];

  const status = vehicle.status || "Available";
  const isSold = status === "Sold";
  const hasMultipleImages = vehicleImages.length > 1;

  const handleCtaClick = (event) => {
    if (isSold) {
      event.preventDefault();
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || !hasMultipleImages) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return;
    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  const showPreviousImage = (event) => {
    event.stopPropagation();
    goPrev();
  };

  const showNextImage = (event) => {
    event.stopPropagation();
    goNext();
  };

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 px-6 py-3 backdrop-blur-md md:px-12 md:py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#80D927] text-black md:h-10 md:w-10">
              <CarFront size={23} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-base font-extrabold tracking-wider md:text-lg">
                ALLIWA <span className="text-[#80D927]">MOBILINDO</span>
              </span>
              <span className="hidden text-[8px] tracking-[0.3em] text-gray-400 md:block">
                YOUR TRUSTED CAR PARTNER
              </span>
            </div>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-gray-300 transition hover:text-[#80D927] md:text-sm"
          >
            <ArrowLeft size={16} />
            Katalog
          </Link>
        </div>
      </nav>

      {/* BREADCRUMB (disembunyikan di mobile agar foto langsung terlihat) */}
      <div className="mx-auto hidden max-w-7xl px-6 py-6 md:block md:px-12">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="transition hover:text-[#80D927]">
            Beranda
          </Link>
          <ChevronRight size={13} />
          <Link to="/#katalog" className="transition hover:text-[#80D927]">
            Katalog Kendaraan
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#80D927]">{vehicle.name}</span>
        </div>
      </div>

      {/* VEHICLE CONTENT */}
      <section className="mx-auto max-w-7xl px-6 pb-28 md:px-12 lg:pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* IMAGE GALLERY: penuh lebar di mobile */}
          <div className="-mx-6 md:mx-0">
            <div
              className="relative aspect-[4/3] overflow-hidden bg-[#1b1b1b]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {vehicleImages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute inset-0 h-full w-full cursor-zoom-in overflow-hidden"
                  aria-label="Perbesar foto kendaraan"
                >
                  {/* Latar: foto yang sama diburamkan, mengisi ruang kosong */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 scale-110 bg-cover bg-center opacity-50 blur-xl"
                    style={{
                      backgroundImage: `url("${vehicleImages[activeImage] || vehicleImages[0]}")`,
                    }}
                  />
                  {/* Foto utama: tampil utuh tanpa terpotong */}
                  <img
                    src={vehicleImages[activeImage] || vehicleImages[0]}
                    alt={`${vehicle.brand} ${vehicle.name}`}
                    fetchpriority="high"
                    decoding="async"
                    className="relative h-full w-full object-contain"
                  />
                </button>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <CarFront size={60} />
                </div>
              )}

              <span
                className={`pointer-events-none absolute left-4 top-4 px-3 py-1.5 text-[10px] font-bold tracking-widest ${
                  statusStyles[status] || statusStyles.Available
                }`}
              >
                {statusLabels[status] || status.toUpperCase()}
              </span>

              {vehicleImages.length > 0 && (
                <span className="pointer-events-none absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-black/60 text-white">
                  <ZoomIn size={16} />
                </span>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label="Foto sebelumnya"
                    className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/60 text-white transition hover:bg-[#80D927] hover:text-black sm:flex"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Foto berikutnya"
                    className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/60 text-white transition hover:bg-[#80D927] hover:text-black sm:flex"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <span className="pointer-events-none absolute bottom-4 right-4 bg-black/70 px-3 py-1.5 text-[11px] tracking-wider text-white">
                    {activeImage + 1} / {vehicleImages.length}
                  </span>
                </>
              )}

              <span className="pointer-events-none absolute bottom-4 left-4 hidden bg-black/60 px-3 py-1.5 text-[10px] tracking-widest text-white sm:block">
                ALLIWA MOBILINDO
              </span>
            </div>

            {hasMultipleImages && (
              <div className="mt-2 flex snap-x gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:px-0">
                {vehicleImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Tampilkan foto ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={`h-16 w-24 shrink-0 snap-start overflow-hidden border-2 bg-[#1b1b1b] transition sm:h-20 sm:w-28 ${
                      activeImage === index
                        ? "border-[#80D927]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Foto ${index + 1} ${vehicle.name}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VEHICLE INFORMATION */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#80D927] md:text-sm">
              {vehicle.brand}
            </p>
            <h1 className="mb-2 text-2xl font-bold leading-tight md:text-4xl">
              {vehicle.name}
            </h1>
            {vehicle.color && (
              <p className="mb-4 text-sm text-gray-400">
                Warna {vehicle.color}
              </p>
            )}

            {/* PRICE */}
            <div className="mb-5 mt-4 border-y border-white/10 py-5">
              <p className="mb-1 text-xs uppercase tracking-widest text-gray-500">
                Harga kendaraan
              </p>
              <p className="text-3xl font-extrabold text-[#80D927] md:text-4xl">
                {formatRupiah(vehicle.price)}
              </p>
            </div>

            {/* KEY SPECIFICATIONS */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              {specifications.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-white/5 px-3 py-3"
                  >
                    <Icon size={18} className="shrink-0 text-[#80D927]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500">{item.label}</p>
                      <p className="truncate text-sm font-semibold">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WHATSAPP CTA (desktop; di mobile memakai bar bawah) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick}
              className={`mb-6 hidden w-full items-center justify-center gap-3 py-4 font-bold transition lg:flex ${
                isSold
                  ? "cursor-not-allowed bg-gray-600 text-gray-300"
                  : "bg-[#80D927] text-black hover:bg-white"
              }`}
            >
              <MessageCircle size={20} />
              {isSold ? "UNIT SUDAH TERJUAL" : "TANYAKAN MELALUI WHATSAPP"}
            </a>

            {/* DETAILS (accordion) */}
            <div className="border-b border-white/10">
              <Accordion title="Deskripsi kendaraan" defaultOpen>
                <p className="whitespace-pre-line text-sm leading-7 text-gray-400">
                  {vehicle.description ||
                    "Informasi deskripsi kendaraan belum tersedia. Silakan hubungi Alliwa Mobilindo untuk mendapatkan informasi lebih lanjut."}
                </p>
              </Accordion>
              <Accordion title="Informasi penting">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-[#80D927]"
                    size={20}
                  />
                  <p className="text-xs leading-6 text-gray-400">
                    Silakan hubungi Alliwa Mobilindo untuk konfirmasi kondisi,
                    kelengkapan, dan ketersediaan unit.
                  </p>
                </div>
              </Accordion>
            </div>

            <p className="mt-5 hidden text-center text-xs leading-6 text-gray-500 lg:block">
              <CheckCircle size={14} className="mr-1 inline text-[#80D927]" />
              Konsultasikan kendaraan ini langsung dengan tim Alliwa Mobilindo.
            </p>
          </div>
        </div>
      </section>

      {/* STICKY BAR (mobile): harga + tombol WhatsApp selalu terlihat */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-white/10 bg-[#111111]/95 px-4 pt-3 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            Harga
          </p>
          <p className="truncate text-lg font-extrabold text-[#80D927]">
            {formatRupiah(vehicle.price)}
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCtaClick}
          className={`flex shrink-0 items-center gap-2 px-5 py-3 text-sm font-bold ${
            isSold
              ? "cursor-not-allowed bg-gray-600 text-gray-300"
              : "bg-[#80D927] text-black"
          }`}
        >
          <MessageCircle size={18} />
          {isSold ? "Terjual" : "WhatsApp"}
        </a>
      </div>

      {/* FULL-SIZE IMAGE VIEWER / LIGHTBOX */}
      {isLightboxOpen && vehicleImages.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto kendaraan ukuran penuh"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            aria-label="Tutup foto"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-[#80D927] hover:text-black"
          >
            <X size={23} />
          </button>

          {hasMultipleImages && (
            <button
              type="button"
              aria-label="Foto sebelumnya"
              onClick={showPreviousImage}
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-[#80D927] hover:text-black sm:left-5"
            >
              <ChevronLeft size={25} />
            </button>
          )}

          <img
            src={vehicleImages[activeImage] || vehicleImages[0]}
            alt={`${vehicle.brand} ${vehicle.name} - foto ${activeImage + 1}`}
            onClick={(event) => event.stopPropagation()}
            decoding="async"
            className="max-h-[88vh] max-w-[88vw] select-none object-contain"
          />

          {hasMultipleImages && (
            <button
              type="button"
              aria-label="Foto berikutnya"
              onClick={showNextImage}
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-[#80D927] hover:text-black sm:right-5"
            >
              <ChevronRight size={25} />
            </button>
          )}

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 text-center text-xs text-gray-300">
            {vehicle.name} · Foto {activeImage + 1} dari {vehicleImages.length}
          </p>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#171717] px-6 py-8 pb-24 md:px-12 lg:pb-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-bold tracking-wider">
            ALLIWA <span className="text-[#80D927]">MOBILINDO</span>
          </p>
          <p className="text-[10px] text-gray-500">
            © 2026 ALLIWA MOBILINDO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </main>
  );
}
