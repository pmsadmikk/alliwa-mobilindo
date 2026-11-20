import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
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

  useEffect(() => {
    setActiveImage(0);
    setIsLightboxOpen(false);
  }, [slug]);

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

  if (!vehicle) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#111111] px-6 text-center text-white">
        <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#80D927] text-black">
          <CarFront size={34} />
        </div>
        <h1 className="mb-3 text-3xl font-bold">
          Kendaraan Tidak Ditemukan
        </h1>
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

  const formattedMileage =
    vehicle.mileage !== null &&
    vehicle.mileage !== undefined &&
    vehicle.mileage !== ""
      ? `${Number(vehicle.mileage).toLocaleString("id-ID")} km`
      : "Belum tersedia";

  const whatsappNumber = "6289623123123";
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

  const showPreviousImage = (event) => {
    event.stopPropagation();
    setActiveImage(
      (current) =>
        (current - 1 + vehicleImages.length) % vehicleImages.length
    );
  };

  const showNextImage = (event) => {
    event.stopPropagation();
    setActiveImage((current) => (current + 1) % vehicleImages.length);
  };

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 px-6 py-5 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#80D927] text-black">
              <CarFront size={25} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-wider">
                ALLIWA <span className="text-[#80D927]">MOBILINDO</span>
              </span>
              <span className="block text-[8px] tracking-[0.3em] text-gray-400">
                YOUR TRUSTED CAR PARTNER
              </span>
            </div>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-gray-300 transition hover:text-[#80D927] md:text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke katalog
          </Link>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-12">
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
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* IMAGE GALLERY */}
          <div>
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#1b1b1b]">
              {vehicleImages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="group absolute inset-0 flex h-full w-full cursor-zoom-in items-center justify-center"
                  aria-label="Perbesar foto kendaraan"
                >
                  <img
                    src={vehicleImages[activeImage] || vehicleImages[0]}
                    alt={`${vehicle.brand} ${vehicle.name}`}
                    className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.015]"
                  />
                  <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-black/75 px-3 py-2 text-[10px] tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                    <ZoomIn size={14} />
                    KLIK UNTUK MEMPERBESAR
                  </span>
                </button>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <CarFront size={60} />
                </div>
              )}

              <span
                className={`pointer-events-none absolute left-5 top-5 px-4 py-2 text-[10px] font-bold tracking-widest ${
                  statusStyles[status] || statusStyles.Available
                }`}
              >
                {statusLabels[status] || status.toUpperCase()}
              </span>
              <span className="pointer-events-none absolute bottom-5 right-5 bg-black/70 px-4 py-2 text-[10px] tracking-widest text-white">
                ALLIWA MOBILINDO
              </span>
            </div>

            {vehicleImages.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {vehicleImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Tampilkan foto ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={`flex aspect-[4/3] items-center justify-center overflow-hidden border-2 bg-[#1b1b1b] p-1 transition ${
                      activeImage === index
                        ? "border-[#80D927]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Foto ${index + 1} ${vehicle.name}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 border border-white/10 bg-[#171717] p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#80D927]" size={23} />
                <div>
                  <p className="text-sm font-semibold">Informasi Kendaraan</p>
                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Silakan hubungi Alliwa Mobilindo untuk konfirmasi kondisi,
                    kelengkapan, dan ketersediaan unit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* VEHICLE INFORMATION */}
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#80D927]">
              {vehicle.brand}
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              {vehicle.name}
            </h1>
            <p className="mb-8 text-sm text-gray-400">
              Tahun {vehicle.year}
              {vehicle.mileage !== null &&
                vehicle.mileage !== undefined &&
                vehicle.mileage !== "" && ` · ${formattedMileage}`}
              {vehicle.color && ` · ${vehicle.color}`}
            </p>

            {/* PRICE */}
            <div className="mb-8 border-y border-white/10 py-7">
              <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
                Harga kendaraan
              </p>
              <p className="text-3xl font-extrabold text-[#80D927]">
                {formatRupiah(vehicle.price)}
              </p>
            </div>

            {/* SPECIFICATIONS */}
            <h2 className="mb-5 text-lg font-bold">Spesifikasi Kendaraan</h2>
            <div className="mb-9 grid grid-cols-2 gap-5">
              {specifications.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center bg-white/5 text-[#80D927]">
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-9">
              <h2 className="mb-3 text-lg font-bold">Deskripsi Kendaraan</h2>
              <p className="whitespace-pre-line text-sm leading-7 text-gray-400">
                {vehicle.description ||
                  "Informasi deskripsi kendaraan belum tersedia. Silakan hubungi Alliwa Mobilindo untuk mendapatkan informasi lebih lanjut."}
              </p>
            </div>

            {/* WHATSAPP CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-center gap-3 py-4 font-bold transition ${
                status === "Sold"
                  ? "cursor-not-allowed bg-gray-600 text-gray-300"
                  : "bg-[#80D927] text-black hover:bg-white"
              }`}
              onClick={(event) => {
                if (status === "Sold") {
                  event.preventDefault();
                }
              }}
            >
              <MessageCircle size={20} />
              {status === "Sold"
                ? "UNIT SUDAH TERJUAL"
                : "TANYAKAN MELALUI WHATSAPP"}
            </a>
            <p className="mt-4 text-center text-xs leading-6 text-gray-500">
              <CheckCircle size={14} className="mr-1 inline text-[#80D927]" />
              Konsultasikan kendaraan ini langsung dengan tim Alliwa Mobilindo.
            </p>
          </div>
        </div>
      </section>

      {/* FULL-SIZE IMAGE VIEWER / LIGHTBOX */}
      {isLightboxOpen && vehicleImages.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto kendaraan ukuran penuh"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Tutup foto"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-[#80D927] hover:text-black"
          >
            <X size={23} />
          </button>

          {vehicleImages.length > 1 && (
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
            className="max-h-[88vh] max-w-[88vw] select-none object-contain"
          />

          {vehicleImages.length > 1 && (
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
      <footer className="border-t border-white/10 bg-[#171717] px-6 py-8 md:px-12">
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
