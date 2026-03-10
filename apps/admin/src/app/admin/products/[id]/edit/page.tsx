"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import type { UpdateProductPayload } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", params.id],
    queryFn: () => adminApi.getProduct(params.id),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: adminApi.getCategories,
  });

  const [form, setForm] = useState<UpdateProductPayload>({});
  const [imageUrl, setImageUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: "",
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        sku: product.sku,
        brand: product.brand,
        categoryId: product.category?.id ?? "",
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        images: product.images ?? [],
        tags: [],
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (payload: UpdateProductPayload) =>
      adminApi.updateProduct(params.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/products");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update product";
      setError(msg);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setForm((prev) => {
      const imgs = prev.images ?? [];
      return {
        ...prev,
        images: [
          ...imgs,
          { url: imageUrl.trim(), isPrimary: imgs.length === 0 },
        ],
      };
    });
    setImageUrl("");
  };

  const removeImage = (idx: number) => {
    setForm((prev) => {
      const imgs = (prev.images ?? []).filter((_, i) => i !== idx);
      if (imgs.length && !imgs.some((i) => i.isPrimary)) {
        imgs[0].isPrimary = true;
      }
      return { ...prev, images: imgs };
    });
  };

  const setPrimary = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images ?? []).map((img, i) => ({
        ...img,
        isPrimary: i === idx,
      })),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || (form.tags ?? []).includes(tag)) return;
    setForm((prev) => ({ ...prev, tags: [...(prev.tags ?? []), tag] }));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: (prev.tags ?? []).filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
          <p className="text-slate-500 text-sm">{product?.name}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Product Name *
              </label>
              <input
                name="name"
                value={(form.name as string) ?? ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                SKU *
              </label>
              <input
                name="sku"
                value={(form.sku as string) ?? ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={(form.description as string) ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Brand *
              </label>
              <input
                name="brand"
                value={(form.brand as string) ?? ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Category *
              </label>
              <select
                name="categoryId"
                value={(form.categoryId as string) ?? ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
              >
                <option value="">Select category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={(form.price as number) ?? 0}
                onChange={handleChange}
                required
                min={0}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Discount Price (₹)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={(form.discountPrice as number | undefined) ?? ""}
                onChange={handleChange}
                min={0}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={(form.stock as number) ?? 0}
                onChange={handleChange}
                required
                min={0}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Images</h2>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addImage())
              }
            />
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {(form.images ?? []).length > 0 && (
            <ul className="space-y-2">
              {(form.images ?? []).map((img, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2"
                >
                  <input
                    type="radio"
                    name="primaryImage"
                    checked={img.isPrimary}
                    onChange={() => setPrimary(idx)}
                    title="Set as primary"
                  />
                  <span className="flex-1 truncate">{img.url}</span>
                  {img.isPrimary && (
                    <span className="text-xs text-green-600 font-medium">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Tags</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
            />
            <button
              type="button"
              onClick={addTag}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {(form.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(form.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-semibold text-slate-700">Settings</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={(form.isActive as boolean) ?? true}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              Active (visible to customers)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={(form.isFeatured as boolean) ?? false}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">Featured product</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link
            href="/admin/products"
            className="px-5 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-5 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
