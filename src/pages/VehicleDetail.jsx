
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  MessageCircle,
  CheckCircle,
  CarFront,
  ShieldCheck,
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

  const vehicle = vehicles.find(
    (item) => String(item.id) === slug
  );

  const vehicleImages = vehicle?.images?.length
    ? vehicle.images
    : vehicle?.image
    ? [vehicle.image]
    : [];

  const [activeImage, setActiveImage] = useState(0);

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#80D927] text-black">
          <CarFront size={34} />
        </div>

        <h1 className="text-3xl font-bold mb-3">
          Kendaraan Tidak Ditemukan
        </h1>

        <p className="text-gray-400 mb-6">
          Kendaraan yang Anda cari mungkin sudah tidak tersedia.
        </p>

        <Link
          to="/"
          className="bg-[#80D927] text-black px-6 py-3 font-bold transition hover:bg-white"
        >
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  const whatsappNumber = "6289623123123";

  const whatsappMessage = encodeURIComponent(
    `Halo Alliwa Mobilindo, saya tertarik dengan ${vehicle.brand} ${vehicle.name} tahun ${vehicle.year} dengan harga ${formatRupiah(vehicle.price)}. Apakah unit ini masih tersedia?`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const specifications = [
    { icon: Calendar, label: "Tahun", value: vehicle.year },
    { icon: Gauge, label: "Kilometer", value: vehicle.mileage },
    { icon: Settings, label: "Transmisi", value: vehicle.transmission },
    { icon: Fuel, label: "Bahan Bakar", value: vehicle.fuel || "Belum tersedia" },
  ];

  const status = vehicle.status || "Available";

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

            <div className="relative aspect-[4/3] overflow-hidden bg-[#1b1b1b]">

              {vehicleImages.length > 0 ? (
                <img
                  src={vehicleImages[activeImage] || vehicleImages[0]}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <CarFront size={60} />
                </div>
              )}

              <span
                className={`absolute left-5 top-5 px-4 py-2 text-[10px] font-bold tracking-widest ${
                  statusStyles[status] || statusStyles.Available
                }`}
              >
                {statusLabels[status] || status.toUpperCase()}
              </span>

              <span className="absolute bottom-5 right-5 bg-black/70 px-4 py-2 text-[10px] tracking-widest text-white">
                ALLIWA MOBILINDO
              </span>
            </div>

            {vehicleImages.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {vehicleImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-[4/3] overflow-hidden border-2 transition ${
                      activeImage === index
                        ? "border-[#80D927]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 border border-white/10 bg-[#171717] p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#80D927]" size={23} />

                <div>
                  <p className="text-sm font-semibold">
                    Informasi Kendaraan
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Silakan hubungi Alliwa Mobilindo untuk konfirmasi
                    kondisi, kelengkapan, dan ketersediaan unit.
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
              {vehicle.mileage && ` · ${vehicle.mileage}`}
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
            <h2 className="mb-5 text-lg font-bold">
              Spesifikasi Kendaraan
            </h2>

            <div className="mb-9 grid grid-cols-2 gap-5">
              {specifications.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-11 w-11 items-center justify-center bg-white/5 text-[#80D927]">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        {item.label}
                      </p>

                      <p className="text-sm font-semibold">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-9">
              <h2 className="mb-3 text-lg font-bold">
                Deskripsi Kendaraan
              </h2>

              <p className="whitespace-pre-line text-sm leading-7 text-gray-400">
                {vehicle.description || "Informasi deskripsi kendaraan belum tersedia. Silakan hubungi Alliwa Mobilindo untuk mendapatkan informasi lebih lanjut."}
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
