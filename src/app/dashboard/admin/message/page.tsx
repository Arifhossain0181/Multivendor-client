"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/axios";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

const DEFAULT_MESSAGE = `"At Bazaari, we believe that commerce is more than transactions; it is about building trust, enabling dreams, and creating lasting relationships. Our platform is designed to give every seller a fair chance to grow and every buyer a delightful experience. We are committed to pushing boundaries, embracing innovation, and serving our community with integrity and passion."`;

export default function AdminMessagePage() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(DEFAULT_MESSAGE);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "page-content", "managing-director-message"],
    queryFn: async () => {
      const response = await api.get("/page-content/managing-director-message");
      return response.data;
    },
  });

  useEffect(() => {
    if (data?.data?.content) {
      setContent(data.data.content);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (newContent: string) => {
      const response = await api.put("/admin/page-content/managing-director-message", {
        content: newContent,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "page-content"] });
      alert("Message updated successfully");
    },
  });

  const handleSave = () => {
    mutation.mutate(content);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Managing Director Message</h1>
        <p className="mt-2 text-muted-foreground">
          Update the message displayed on the About page.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Message Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="resize-none"
              placeholder="Enter the managing director's message..."
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              This message will be displayed on the /about/message page.
            </p>
            <Button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="gap-2"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
