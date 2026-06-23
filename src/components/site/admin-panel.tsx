"use client";

import * as React from "react";
import { BookText, Loader2, Lock, Mic, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Podcast } from "@/components/site/types";

type AdminPanelProps = {
  children: React.ReactNode;
  episodes: Podcast[];
};

type Mode = "locked" | "unlocked";
type Tab = "podcast" | "chapters";

type BookChapter = {
  id: string;
  title: string;
  seriesIndex: number;
  status: string;
  excerpt: string | null;
  tagline: string | null;
  description: string | null;
};

export function AdminPanel({ children, episodes: initialEpisodes }: AdminPanelProps) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<Mode>("locked");
  const [tab, setTab] = React.useState<Tab>("podcast");
  const [password, setPassword] = React.useState("");
  const [authing, setAuthing] = React.useState(false);
  const [episodes, setEpisodes] = React.useState<Podcast[]>(initialEpisodes);

  // Chapter management state
  const [books, setBooks] = React.useState<BookChapter[]>([]);
  const [selectedBookId, setSelectedBookId] = React.useState<string>("");
  const [chapterText, setChapterText] = React.useState("");
  const [chapterTagline, setChapterTagline] = React.useState("");
  const [chapterDesc, setChapterDesc] = React.useState("");
  const [savingChapter, setSavingChapter] = React.useState(false);
  const [loadingBooks, setLoadingBooks] = React.useState(false);

  // Upload form state
  const [epNum, setEpNum] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    if (open) setEpisodes(initialEpisodes);
  }, [open, initialEpisodes]);

  // Fetch books when switching to chapters tab (after unlock).
  async function loadBooks() {
    if (books.length > 0) return;
    setLoadingBooks(true);
    try {
      const res = await fetch("/api/admin/chapters", {
        headers: { "x-admin-password": password },
      });
      const data = (await res.json()) as { ok?: boolean; books?: BookChapter[] };
      if (data.ok && data.books) {
        setBooks(data.books);
        if (data.books.length > 0) {
          const first = data.books[0];
          setSelectedBookId(first.id);
          setChapterText(first.excerpt ?? "");
          setChapterTagline(first.tagline ?? "");
          setChapterDesc(first.description ?? "");
        }
      }
    } catch (err) {
      toast.error("Could not load chapters.");
    } finally {
      setLoadingBooks(false);
    }
  }

  function selectBook(id: string) {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    setSelectedBookId(id);
    setChapterText(book.excerpt ?? "");
    setChapterTagline(book.tagline ?? "");
    setChapterDesc(book.description ?? "");
  }

  async function saveChapter(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBookId) return;
    setSavingChapter(true);
    try {
      const res = await fetch(`/api/admin/chapters/${selectedBookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          excerpt: chapterText.trim() || null,
          tagline: chapterTagline.trim() || null,
          description: chapterDesc.trim() || null,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      // Update local state
      setBooks((prev) =>
        prev.map((b) =>
          b.id === selectedBookId
            ? {
                ...b,
                excerpt: chapterText.trim() || null,
                tagline: chapterTagline.trim() || null,
                description: chapterDesc.trim() || null,
              }
            : b
        )
      );
      toast.success("Chapter saved.", {
        description: "The excerpt is now live on the site.",
      });
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Try again.",
      });
    } finally {
      setSavingChapter(false);
    }
  }

  function resetOnClose() {
    setOpen(false);
    setEpNum("");
    setTitle("");
    setDescription("");
    setDuration("");
    setFile(null);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Enter the admin password.");
      return;
    }
    setAuthing(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Wrong password.");
      }
      setMode("unlocked");
      toast.success("Admin access granted.");
    } catch (err) {
      toast.error("Access denied", {
        description: err instanceof Error ? err.message : "Try again.",
      });
    } finally {
      setAuthing(false);
    }
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(epNum, 10);
    if (!title.trim()) return toast.error("Episode title is required.");
    if (isNaN(num) || num < 1) return toast.error("Episode number must be a positive integer.");
    if (!file) return toast.error("Select an audio file to upload.");
    if (!file.type.startsWith("audio/"))
      return toast.error("That file doesn't look like audio.");

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("episodeNumber", String(num));
      fd.append("description", description.trim());
      fd.append("duration", duration.trim());
      fd.append("audio", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: fd,
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        podcast?: Podcast;
      };
      if (!res.ok || !data.ok || !data.podcast) {
        throw new Error(data.error || "Upload failed.");
      }
      setEpisodes((prev) =>
        [...prev, data.podcast as Podcast].sort(
          (a, b) => b.episodeNumber - a.episodeNumber
        )
      );
      toast.success("Episode published.", {
        description: `${data.podcast.title} is now live on the site.`,
      });
      setEpNum("");
      setTitle("");
      setDescription("");
      setDuration("");
      setFile(null);
      const input = document.getElementById(
        "admin-audio-input"
      ) as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string, epTitle: string) {
    if (!confirm(`Delete "${epTitle}"? This removes the episode and its audio file.`)) return;
    try {
      const res = await fetch(`/api/admin/podcasts/${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed.");
      setEpisodes((prev) => prev.filter((p) => p.id !== id));
      toast.success("Episode deleted.");
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Try again.",
      });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground/40 transition-colors hover:text-accent"
        aria-label="Admin panel"
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Admin panel"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetOnClose();
          }}
        >
          <div className="relative my-auto w-full max-w-2xl rounded-lg border border-border/60 bg-card shadow-2xl">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-accent" aria-hidden="true" />
                <h2 className="font-serif text-lg font-semibold tracking-tight">
                  Admin Panel
                </h2>
              </div>
              <button
                type="button"
                onClick={resetOnClose}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                aria-label="Close admin panel"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              {mode === "locked" ? (
                <form onSubmit={unlock} className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Enter the admin password to manage podcast episodes and
                    free chapter content.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="admin-pw" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                      Admin password
                    </Label>
                    <Input
                      id="admin-pw"
                      type="password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={authing}
                    className="h-11 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {authing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Unlocking…</>
                    ) : (
                      <><Lock className="h-4 w-4" /> Unlock</>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Tabs */}
                  <div className="flex gap-1 rounded-md border border-border/50 p-1">
                    <button
                      type="button"
                      onClick={() => setTab("podcast")}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors",
                        tab === "podcast"
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Mic className="h-4 w-4" /> Podcast
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTab("chapters");
                        loadBooks();
                      }}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors",
                        tab === "chapters"
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <BookText className="h-4 w-4" /> Chapters
                    </button>
                  </div>

                  {tab === "podcast" && (
                    <>
                      {/* Upload form */}
                      <form onSubmit={upload} className="flex flex-col gap-4">
                        <h3 className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-accent">
                          <Upload className="h-3.5 w-3.5" /> Publish a new episode
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="ep-num" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                              Episode #
                            </Label>
                            <Input
                              id="ep-num"
                              type="number"
                              min={1}
                              value={epNum}
                              onChange={(e) => setEpNum(e.target.value)}
                              className="h-11"
                              placeholder="1"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="ep-title" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                              Title *
                            </Label>
                            <Input
                              id="ep-title"
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="h-11"
                              placeholder="On Hearing the Dead"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="ep-desc" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                            Description
                          </Label>
                          <Textarea
                            id="ep-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="A short description of the episode."
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="ep-dur" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                              Duration (optional)
                            </Label>
                            <Input
                              id="ep-dur"
                              type="text"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="h-11"
                              placeholder="42:18"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="admin-audio-input" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                              Audio file *
                            </Label>
                            <Input
                              id="admin-audio-input"
                              type="file"
                              accept="audio/*"
                              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                              className="h-11 cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-accent/15 file:px-3 file:py-1.5 file:text-accent file:hover:bg-accent/25"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={uploading}
                          className="h-11 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          {uploading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                          ) : (
                            <><Mic className="h-4 w-4" /> Publish episode</>
                          )}
                        </Button>
                      </form>

                      {/* Episode management */}
                      <div className="flex flex-col gap-3 border-t border-border/40 pt-6">
                        <h3 className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                          Published episodes ({episodes.length})
                        </h3>
                        {episodes.length === 0 ? (
                          <p className="text-sm italic text-muted-foreground">
                            No episodes yet. Upload your first one above.
                          </p>
                        ) : (
                          <ul className="flex flex-col gap-2">
                            {episodes.map((ep) => (
                              <li
                                key={ep.id}
                                className="flex items-center gap-3 rounded-md border border-border/50 bg-background/40 px-3 py-2.5"
                              >
                                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                                  EP {String(ep.episodeNumber).padStart(2, "0")}
                                </span>
                                <span className="flex-1 truncate text-sm text-foreground/90">
                                  {ep.title}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => remove(ep.id, ep.title)}
                                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                                  aria-label={`Delete episode ${ep.episodeNumber}: ${ep.title}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}

                  {tab === "chapters" && (
                    <>
                      {loadingBooks ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-6 w-6 animate-spin text-accent" />
                        </div>
                      ) : (
                        <form onSubmit={saveChapter} className="flex flex-col gap-4">
                          <h3 className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-accent">
                            <BookText className="h-3.5 w-3.5" /> Edit free chapter content
                          </h3>

                          {/* Book selector */}
                          <div className="flex flex-col gap-2">
                            <Label className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                              Select book
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {books.map((b) => (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => selectBook(b.id)}
                                  className={cn(
                                    "rounded-md border px-3 py-2 text-sm transition-colors",
                                    selectedBookId === b.id
                                      ? "border-accent bg-accent/10 text-accent"
                                      : "border-border/50 text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <span className="font-mono text-[0.6rem] uppercase tracking-widest">
                                    Book {String(b.seriesIndex).padStart(2, "0")}
                                  </span>
                                  <span className="ml-2">{b.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {selectedBookId && (
                            <>
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="ch-tagline" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                                  Tagline (shown on book card)
                                </Label>
                                <Input
                                  id="ch-tagline"
                                  type="text"
                                  value={chapterTagline}
                                  onChange={(e) => setChapterTagline(e.target.value)}
                                  className="h-11"
                                  placeholder="A short one-line hook."
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="ch-desc" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                                  Description (shown on book card)
                                </Label>
                                <Textarea
                                  id="ch-desc"
                                  value={chapterDesc}
                                  onChange={(e) => setChapterDesc(e.target.value)}
                                  rows={4}
                                  placeholder="The book description."
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="ch-excerpt" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                                  Free excerpt / teaser (shown in the Excerpt section)
                                </Label>
                                <Textarea
                                  id="ch-excerpt"
                                  value={chapterText}
                                  onChange={(e) => setChapterText(e.target.value)}
                                  rows={10}
                                  placeholder="Paste the prologue or opening chapter here. Use blank lines to separate paragraphs."
                                  className="font-serif text-base leading-relaxed"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Separate paragraphs with blank lines. This text
                                  appears in the &ldquo;Prologue&rdquo; section on the
                                  homepage.
                                </p>
                              </div>

                              <Button
                                type="submit"
                                disabled={savingChapter}
                                className="h-11 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                              >
                                {savingChapter ? (
                                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                                ) : (
                                  <><Save className="h-4 w-4" /> Save chapter</>
                                )}
                              </Button>
                            </>
                          )}
                        </form>
                      )}
                    </>
                  )}

                  <p className="border-t border-border/40 pt-4 text-center font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground/70">
                    Changes are saved to the database and appear instantly on the live site
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
