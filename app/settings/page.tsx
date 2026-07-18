"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/Loader";

type CurrentUser = {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  isPublic: boolean;
};

type SettingsForm = {
  name: string;
  username: string;
  bio: string;
  isPublic: boolean;
};

export default function SettingsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SettingsForm>({
    name: "",
    username: "",
    bio: "",
    isPublic: true,
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [router, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function loadProfile() {
      try {
        setLoading(true);
        const response = await fetch("/api/users/me");
        const data = await response.json();

        if (!response.ok || !data.success) {
          toast.error(data.error ?? "Failed to load profile");
          return;
        }

        const user = data.data as CurrentUser;
        setForm({
          name: user.name ?? "",
          username: user.username ?? "",
          bio: user.bio ?? "",
          isPublic: user.isPublic,
        });
        setAvatar(user.avatar);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Display name is required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        bio: form.bio.trim() || null,
        isPublic: form.isPublic,
      };

      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Failed to update profile");
        return;
      }

      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return <Loader loading={true} />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="glass-card p-8 md:p-10 border-border/40">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Profile settings
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-2">
            Update how your DevPath profile appears to others.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-5 rounded-xl border border-border/50 bg-card/40 p-5">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={form.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-black">
                {(form.name || form.username || "DP").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-black text-foreground">Avatar</h2>
              <p className="text-sm font-medium text-muted-foreground">
                Avatar upload coming soon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={form.username}
                disabled
                aria-describedby="username-help"
              />
              <p
                id="username-help"
                className="text-xs font-medium text-muted-foreground"
              >
                Username changes are not available yet.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(event) =>
                setForm((current) => ({ ...current, bio: event.target.value }))
              }
              rows={5}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-5">
            <div>
              <Label htmlFor="isPublic">Public profile</Label>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Let other users view your profile.
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={form.isPublic}
              onCheckedChange={(checked) =>
                setForm((current) => ({ ...current, isPublic: checked }))
              }
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="premium-button rounded-xl font-bold"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
