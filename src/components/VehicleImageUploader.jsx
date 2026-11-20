import { useRef, useState } from "react";
import {
  ImagePlus,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  LoaderCircle,
} from "lucide-react";

const MAX_IMAGES = 20;
const MAX_DIMENSION = 2560;
const MAX_OUTPUT_SIZE = 5 * 1024 * 1024;
const QUALITY_LEVELS = [0.88, 0.82, 0.76];
const DIMENSION_LEVELS = [2560, 2304, 2048, 1920, 1792, 1600];

const createId = () => crypto.randomUUID();

function canvasToWebP(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Browser gagal mengonversi gambar ke WebP."));
        }
      },
      "image/webp",
      quality
    );
  });
}

async function convertToWebP(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${file.name}: format file tidak didukung.`);
  }

  let bitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`${file.name}: gambar tidak dapat dibuka oleh browser.`);
  }

  try {
    if (!bitmap.width || !bitmap.height) {
      throw new Error(`${file.name}: dimensi gambar tidak valid.`);
    }

    let lastBlob = null;

    // Coba mempertahankan resolusi setinggi mungkin, lalu turunkan kualitas
    // dan dimensi secara bertahap apabila hasil WebP masih di atas 5 MB.
    const dimensions = [
      ...new Set([MAX_DIMENSION, ...DIMENSION_LEVELS]),
    ];

    for (const maxDimension of dimensions) {
      const scale = Math.min(
        1,
        maxDimension / Math.max(bitmap.width, bitmap.height)
      );

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Browser tidak dapat memproses gambar.");
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of QUALITY_LEVELS) {
        const blob = await canvasToWebP(canvas, quality);
        lastBlob = blob;

        if (blob.size <= MAX_OUTPUT_SIZE) {
          return new File(
            [blob],
            `${file.name.replace(/\.[^.]+$/, "")}.webp`,
            {
              type: "image/webp",
              lastModified: Date.now(),
            }
          );
        }
      }

      canvas.width = 0;
      canvas.height = 0;
    }

    const finalSize = lastBlob
      ? `${(lastBlob.size / (1024 * 1024)).toFixed(2)} MB`
      : "tidak diketahui";

    throw new Error(
      `${file.name}: ukuran hasil masih ${finalSize} setelah kompresi. Coba gunakan foto dengan ukuran file awal yang lebih kecil.`
    );
  } finally {
    bitmap.close();
  }
}

export default function VehicleImageUploader({
  images = [],
  onChange,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      setError(`Maksimal ${MAX_IMAGES} foto.`);
      return;
    }

    setProcessing(true);
    setError("");

    const selectedFiles = files.slice(0, remaining);
    const newImages = [];
    const errors = [];

    try {
      for (const file of selectedFiles) {
        try {
          const convertedFile = await convertToWebP(file);

          newImages.push({
            id: createId(),
            file: convertedFile,
            previewUrl: URL.createObjectURL(convertedFile),
            existingUrl: null,
          });
        } catch (conversionError) {
          errors.push(conversionError.message);
        }
      }

      if (newImages.length) {
        onChange([...images, ...newImages]);
      }

      if (errors.length) {
        setError(errors.join(" "));
      } else if (files.length > remaining) {
        setError(
          `Hanya ${remaining} foto yang ditambahkan karena batas maksimal ${MAX_IMAGES} foto.`
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const removeImage = (index) => {
    const target = images[index];

    if (target?.previewUrl && target.file) {
      URL.revokeObjectURL(target.previewUrl);
    }

    onChange(images.filter((_, i) => i !== index));
  };

  const setMainImage = (index) => {
    if (index === 0) return;

    const updated = [...images];
    const [selected] = updated.splice(index, 1);

    updated.unshift(selected);
    onChange(updated);
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const updated = [...images];
    [updated[index], updated[targetIndex]] = [
      updated[targetIndex],
      updated[index],
    ];

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            Galeri Foto Kendaraan
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Maksimal {MAX_IMAGES} foto. Disimpan dalam WebP, sisi terpanjang
            hingga {MAX_DIMENSION}px, maksimal 5 MB per foto.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Foto ditampilkan utuh dan tidak dipotong.
          </p>
        </div>

        <span className="text-xs text-gray-400">
          {images.length}/{MAX_IMAGES} foto
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled || processing || images.length >= MAX_IMAGES}
        onChange={handleFiles}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || processing || images.length >= MAX_IMAGES}
        className="flex w-full items-center justify-center gap-3 border border-dashed border-[#555] bg-[#111] px-5 py-8 text-sm text-gray-300 transition hover:border-[#80D927] hover:text-[#80D927] disabled:opacity-50"
      >
        {processing ? (
          <>
            <LoaderCircle size={20} className="animate-spin" />
            Mengoptimalkan foto...
          </>
        ) : (
          <>
            <ImagePlus size={22} />
            PILIH FOTO DARI PERANGKAT
          </>
        )}
      </button>

      {error && (
        <p className="border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative overflow-hidden border border-[#333] bg-[#111]"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-[#0b0b0b] p-1">
                <img
                  src={image.previewUrl || image.existingUrl}
                  alt={`Foto kendaraan ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {index === 0 && (
                <span className="absolute left-2 top-2 flex items-center gap-1 bg-[#80D927] px-2 py-1 text-[9px] font-bold text-black">
                  <Star size={11} fill="currentColor" />
                  FOTO UTAMA
                </span>
              )}

              <div className="flex items-center justify-between gap-1 p-2">
                <span className="text-[10px] text-gray-400">
                  Foto {index + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Jadikan foto utama"
                    onClick={() => setMainImage(index)}
                    disabled={disabled || index === 0}
                    className="p-1 text-[#80D927] disabled:opacity-30"
                  >
                    <Star size={14} />
                  </button>

                  <button
                    type="button"
                    title="Geser ke atas"
                    onClick={() => moveImage(index, -1)}
                    disabled={disabled || index === 0}
                    className="p-1 text-gray-300 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>

                  <button
                    type="button"
                    title="Geser ke bawah"
                    onClick={() => moveImage(index, 1)}
                    disabled={disabled || index === images.length - 1}
                    className="p-1 text-gray-300 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>

                  <button
                    type="button"
                    title="Hapus foto"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                    className="p-1 text-red-400"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="py-3 text-center text-xs text-gray-500">
          Belum ada foto kendaraan yang dipilih.
        </p>
      )}
    </div>
  );
}
