"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Quote, Loader2, Pencil, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/axios";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { Button } from "@/src/components/ui/button";

const DEFAULT_MESSAGE = `"At Bazaari, we believe that commerce is more than transactions; it is about building trust, enabling dreams, and creating lasting relationships. Our platform is designed to give every seller a fair chance to grow and every buyer a delightful experience. We are committed to pushing boundaries, embracing innovation, and serving our community with integrity and passion."`;

export default function MessagePage() {
  const { data: user } = useMe();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(DEFAULT_MESSAGE);

  const { data, isLoading } = useQuery({
    queryKey: ["page-content", "managing-director-message"],
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
      queryClient.invalidateQueries({ queryKey: ["page-content"] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    mutation.mutate(content);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  const canEdit = !!user;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            Leadership
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Message from Managing Director
          </h1>
          {canEdit && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-4 gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Message
            </Button>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                alt="Managing Director"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ahmed Rahman</h2>
              <p className="text-sm text-primary font-medium">Managing Director, Bazaari</p>
            </div>
          </div>

          <div className="mt-8">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-border bg-background p-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      if (data?.data?.content) {
                        setContent(data.data.content);
                      }
                    }}
                    disabled={mutation.isPending}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {content}
                </p>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="mt-8 rounded-xl bg-muted/50 p-6">
              <h3 className="font-semibold mb-2">Key Focus Areas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Expanding seller enablement programs nationwide</li>
                <li>Investing in logistics and delivery infrastructure</li>
                <li>Launching trusted buyer protection policies</li>
                <li>Driving financial inclusion for micro-entrepreneurs</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
