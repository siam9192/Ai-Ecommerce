"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiImage,
  FiLoader,
  FiPlus,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";
import {
  createProduct,
  type CreateProductPayload,
} from "@/api-services/products.api.services";
import { toggleStateUpdate } from "@/redux/features/appState-slice";
import { useAppDispatch } from "@/redux/hooks";
import { ProductStatus } from "@/types/product.type";

const maxImageSize = 10 * 1024 * 1024;
const maxImages = 8;

type ProductFormValues = Omit<CreateProductPayload, "images">;

const initialValues: ProductFormValues = {
  name: "",
  description: "",
  regular_price: 0,
  main_price: 0,
  category: "",
  available_stock: 0,
  status: ProductStatus.ACTIVE,
};

export default function NewProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState(initialValues);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const updateValue = <Key extends keyof ProductFormValues>(
    key: Key,
    value: ProductFormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length || isUploading) return;

    setUploadError("");
    const selectedFiles = Array.from(files);
    if (images.length + selectedFiles.length > maxImages) {
      setUploadError(`You can add up to ${maxImages} product images.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > maxImageSize,
    );
    if (invalidFile) {
      setUploadError(
        !invalidFile.type.startsWith("image/")
          ? `${invalidFile.name} is not an image file.`
          : `${invalidFile.name} is larger than 10 MB.`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    const failures: string[] = [];
    let completed = 0;

    for (const file of selectedFiles) {
      setUploadProgress(`Uploading ${completed + 1} of ${selectedFiles.length}`);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/api/uploads/imgbb", {
          method: "POST",
          body: formData,
        });
        const result: unknown = await response.json();
        const uploadedUrl =
          typeof result === "object" &&
          result !== null &&
          "url" in result &&
          typeof result.url === "string"
            ? result.url
            : null;
        if (!response.ok || uploadedUrl === null) {
          const message =
            typeof result === "object" &&
            result !== null &&
            "message" in result &&
            typeof result.message === "string"
              ? result.message
              : "Image upload failed.";
          throw new Error(message);
        }
        setImages((current) => [...current, uploadedUrl]);
      } catch (uploadRequestError) {
        console.error(
          `Failed to upload product image ${file.name}:`,
          uploadRequestError,
        );
        failures.push(
          `${file.name}: ${
            uploadRequestError instanceof Error
              ? uploadRequestError.message
              : "Upload failed."
          }`,
        );
      }
      completed += 1;
    }

    if (failures.length) {
      setUploadError(failures.join(" "));
    }
    setIsUploading(false);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || isUploading) return;

    setError("");
    if (
      !values.name.trim() ||
      !values.category.trim() ||
      !values.description.trim()
    ) {
      setError("Enter a product name, category, and description.");
      return;
    }
    if (values.regular_price <= values.main_price) {
      setError("Regular price must be greater than the current price.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await createProduct({
        ...values,
        name: values.name.trim(),
        category: values.category.trim(),
        images,
      });
      if (!response.success) {
        throw new Error(response.message || "Product could not be created.");
      }
      dispatch(toggleStateUpdate());
      router.replace("/admin/products");
    } catch (createError) {
      console.error("Failed to create product:", createError);
      setError(
        createError instanceof Error
          ? createError.message
          : "Product could not be created. Please try again.",
      );
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary"
        >
          <FiArrowLeft size={16} />
          Back to products
        </Link>

        <div className="mb-7 mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Product catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Add a product
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add product details and upload clear images for your storefront.
          </p>
        </div>

        {error && (
          <p
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Product details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                These details help customers find and understand your product.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Product name <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  maxLength={200}
                  value={values.name}
                  onChange={(event) => updateValue("name", event.target.value)}
                  placeholder="e.g. Wireless noise-cancelling headphones"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description <span className="text-red-500">*</span>
                </span>
                <textarea
                  required
                  maxLength={5000}
                  rows={5}
                  value={values.description}
                  onChange={(event) =>
                    updateValue("description", event.target.value)
                  }
                  placeholder="Describe the product, its features, and what makes it useful."
                  className="w-full resize-y rounded-xl border border-slate-300 px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <span className="mt-1 block text-right text-xs text-slate-400">
                  {values.description.length}/5000
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  minLength={1}
                  value={values.category}
                  onChange={(event) =>
                    updateValue("category", event.target.value)
                  }
                  placeholder="e.g. Electronics"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </span>
                <select
                  value={values.status}
                  onChange={(event) => {
                    const status = event.target.value;
                    if (
                      status === ProductStatus.ACTIVE ||
                      status === ProductStatus.INACTIVE
                    ) {
                      updateValue("status", status);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value={ProductStatus.ACTIVE}>Active</option>
                  <option value={ProductStatus.INACTIVE}>Inactive</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Pricing and inventory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Set the current selling price, original price, and stock level.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Current price ($) <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.main_price}
                  onChange={(event) =>
                    updateValue("main_price", Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Regular price ($) <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.regular_price}
                  onChange={(event) =>
                    updateValue("regular_price", Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Available stock <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={values.available_stock}
                  onChange={(event) =>
                    updateValue("available_stock", Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              {values.regular_price > values.main_price &&
                values.main_price >= 0 && (
                  <p className="text-sm font-medium text-emerald-700 sm:col-span-3">
                    Customers save $
                    {(values.regular_price - values.main_price).toFixed(2)} on
                    this product.
                  </p>
                )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Product images
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Images are uploaded securely to ImgBB. Up to {maxImages} images,
                  10 MB each.
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-slate-500">
                {images.length}/{maxImages}
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => void uploadImages(event.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || images.length >= maxImages}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-primary/60 hover:bg-indigo-50/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <FiLoader className="animate-spin text-primary" size={26} />
              ) : (
                <FiUploadCloud className="text-primary" size={28} />
              )}
              <span className="mt-3 text-sm font-semibold text-slate-800">
                {isUploading ? uploadProgress : "Choose images to upload"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                PNG, JPG, GIF or WebP
              </span>
            </button>

            {uploadError && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {uploadError}
              </p>
            )}

            {images.length > 0 ? (
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image, index) => (
                  <li
                    key={image}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                      {index === 0 ? "Cover image" : `Image ${index + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setImages((current) =>
                          current.filter((_, imageIndex) => imageIndex !== index),
                        )
                      }
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-600 opacity-100 shadow-sm transition hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <FiImage size={15} />
                At least one image is recommended, but optional.
              </div>
            )}
          </section>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <FiLoader className="animate-spin" size={16} />
              ) : (
                <FiPlus size={16} />
              )}
              {isSaving ? "Creating product..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
