
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
const MAX_DIMENSION = 1920;
const MAX_OUTPUT_SIZE = 5 * 1024 * 1024;
const WEBP_QUALITY = 0.82;

const createId = () => crypto.randomUUID();

async function convertToWebP(file) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${file.name}: format file tidak didukung.`);
  }

  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Browser tidak dapat memproses gambar.");
    }

    context.drawImage(
      bitmap,
      0,
      0,
      canvas.width,
      canvas.height
    );

    let blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
    });

    if (!blob) {
      throw new Error(`Gagal mengonversi ${file.name}.`);
    }

    if (blob.size > MAX_OUTPUT_SIZE) {
      blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/webp", 0.65);
      });
    }

    if (!blob || blob.size > MAX_OUTPUT_SIZE) {
      throw new Error(
        `${file.name}: ukuran hasil masih melebihi 5 MB.`
      );
    }

    return new File(
      [blob],
      `${file.name.replace(/\.[^.]+$/, "")}.webp`,
      {
        type: "image/webp",
        lastModified: Date.now(),
      }
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

    for (const file of selectedFiles) {
      try {
        const convertedFile = await convertToWebP(file);

        newImages.push({
          id: createId(),
          file: convertedFile,
          previewUrl: URL.createObjectURL(convertedFile),
          existingUrl: null,
        });
      } catch (err) {
        errors.push(err.message);
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

    setProcessing(false);
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
            Maksimal {MAX_IMAGES} foto. Format penyimpanan WebP.
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
            Memproses foto...
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
              <div className="aspect-[4/3]">
                <img
                  src={image.previewUrl || image.existingUrl}
                  alt={`Foto kendaraan ${index + 1}`}
                  className="h-full w-full object-cover"
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