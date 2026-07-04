"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../../lib/axios";
import { Pencil, Trash2, Check, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

function normalizeCategories(payload: unknown): Category[] {
  if (Array.isArray(payload)) {
    return payload as Category[];
  }

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
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(normalizeCategories(data));
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const { data } = await api.get("/categories");

        if (isMounted) {
          setCategories(normalizeCategories(data));
        }
      } catch {
        if (isMounted) {
          toast.error("Failed to load categories");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/categories", {
        name: name.trim(),
        slug: slug.trim(),
      });

      toast.success("Category created successfully");
      setName("");
      setSlug("");
      void fetchCategories();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create category";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim() || !editSlug.trim()) return;
    setIsUpdating(true);

    try {
      await api.patch(`/categories/${id}`, {
        name: editName.trim(),
        slug: editSlug.trim(),
      });
      toast.success("Category updated successfully");
      cancelEdit();
      void fetchCategories();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update category";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      toast.success("Category deleted successfully");
      setDeleteTarget(null);
      void fetchCategories();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(message);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
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

      {/* Create form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
            placeholder="Electronics"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Slug
          </label>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
            placeholder="electronics"
          />
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
            disabled={isSubmitting}
            className="rounded-xl bg-[#0A1F44] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#12315f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            {isSubmitting ? "Creating..." : "Create category"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Existing Categories
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">
            No categories yet. Create one above.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between gap-3 px-6 py-4">
                {editingId === category.id ? (
                  <>
                    <div className="flex flex-1 gap-2">
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        className="flex-1 rounded-lg border border-cyan-400 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-100"
                        placeholder="Name"
                        autoFocus
                      />
                      <input
                        value={editSlug}
                        onChange={(event) => setEditSlug(event.target.value)}
                        className="flex-1 rounded-lg border border-cyan-400 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-100"
                        placeholder="Slug"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate(category.id)}
                        disabled={isUpdating}
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
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-400">/{category.slug}</p>
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

      {/* ✅ NEW — Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-gray-900">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
              Delete category?
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {deleteTarget.name}
              </span>
              ? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
