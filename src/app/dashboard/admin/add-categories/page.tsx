"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../../lib/axios";
import { Pencil, Trash2, Check, X, ImagePlus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
};

function normalizeCategories(payload: unknown): Category[] {
  if (Array.isArray(payload)) return payload as Category[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) return record.items as Category[];
    if (Array.isArray(record.data)) return record.data as Category[];
    if (Array.isArray(record.categories)) return record.categories as Category[];
  }
  return [];
}

export default function AddCategoriesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ---------- Form States ----------
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------- Edit States ----------
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editExistingImageUrl, setEditExistingImageUrl] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // ---------- TanStack Query: Fetch Data ----------
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return normalizeCategories(data);
    },
  });

  // ---------- TanStack Mutations ----------
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; slug: string; imageUrl?: string }) => {
      return api.post("/categories", payload);
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      setName("");
      setSlug("");
      clearImageSelection();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { name: string; slug: string; imageUrl?: string } }) => {
      return api.patch(`/categories/${id}`, payload);
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      cancelEdit();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
      setDeleteTarget(null);
    },
  });

  // ---------- Object URL Cleanups ----------
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    };
  }, [editImagePreview]);

  // ---------- Image Helpers ----------
  const validateAndSetImage = (file: File | undefined, setFile: (f: File) => void, setPreview: (p: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetImage(e.target.files?.[0], setImageFile, setImagePreview);
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetImage(e.target.files?.[0], setEditImageFile, setEditImagePreview);
  };

  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---------- Form Handlers ----------
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: { name: string; slug: string; imageUrl?: string } = {
      name: name.trim(),
      slug: slug.trim(),
    };

    if (imageFile) {
      payload.imageUrl = await readFileAsDataURL(imageFile);
    }

    createMutation.mutate(payload);
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditExistingImageUrl(category.imageUrl ?? null);
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
    setEditExistingImageUrl(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim() || !editSlug.trim()) return;
    const payload: { name: string; slug: string; imageUrl?: string } = {
      name: editName.trim(),
      slug: editSlug.trim(),
    };

    if (editImageFile) {
      payload.imageUrl = await readFileAsDataURL(editImageFile);
    }

    updateMutation.mutate({ id, payload });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Admin Categories
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
          Manage Categories
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Create, edit, or remove categories that sellers can attach to products.
        </p>
      </div>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
            placeholder="Electronics"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
            placeholder="electronics"
          />
        </div>

        {/* Image File Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category Image <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageSelect}
            className="hidden"
            id="create-image-input"
          />

          {imagePreview ? (
            <div className="flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Selected preview"
                className="h-20 w-20 rounded-lg border border-gray-100 object-cover dark:border-gray-800"
              />
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">{imageFile?.name}</span>
                <div className="flex gap-2">
                  <label
                    htmlFor="create-image-input"
                    className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Change
                  </label>
                  <button
                    type="button"
                    onClick={clearImageSelection}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="create-image-input"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-center transition hover:border-cyan-400 hover:bg-cyan-50/40 dark:border-gray-700 dark:hover:bg-gray-800/50"
            >
              <ImagePlus size={22} className="text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image</span>
              <span className="text-xs text-gray-400">PNG, JPG or WEBP, up to 5MB</span>
            </label>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/admin/products")}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to Products
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-xl bg-[#0A1F44] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#12315f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            {createMutation.isPending ? "Creating..." : "Create category"}
          </button>
        </div>
      </form>

      {/* Existing Categories */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Existing Categories</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">No categories yet. Create one above.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between gap-3 px-6 py-4">
                {editingId === category.id ? (
                  <>
                    <div className="flex flex-1 items-start gap-3">
                      <div className="flex flex-shrink-0 flex-col items-center gap-1">
                        <img
                          src={editImagePreview || editExistingImageUrl || "/placeholder-category.jpg"}
                          alt=""
                          className="h-14 w-14 rounded-lg border border-gray-100 object-cover dark:border-gray-800"
                        />
                        <input
                          ref={editFileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleEditImageSelect}
                          className="hidden"
                          id={`edit-image-input-${category.id}`}
                        />
                        <label
                          htmlFor={`edit-image-input-${category.id}`}
                          className="cursor-pointer text-[11px] font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                        >
                          Change
                        </label>
                      </div>

                      <div className="flex flex-1 flex-col gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 rounded-lg border border-cyan-400 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-100"
                          placeholder="Name"
                          autoFocus
                        />
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="flex-1 rounded-lg border border-cyan-400 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-100"
                          placeholder="Slug"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate(category.id)}
                        disabled={updateMutation.isPending}
                        className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 disabled:opacity-50 dark:bg-green-900/30 dark:text-green-400"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-10 w-10 rounded-lg object-cover border border-gray-100 dark:border-gray-800"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</p>
                        <p className="text-xs text-gray-400">/{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#0A1F44] dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(category)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-gray-900">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">Delete category?</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <span className="font-medium text-gray-800 dark:text-gray-200">{deleteTarget.name}</span>? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}