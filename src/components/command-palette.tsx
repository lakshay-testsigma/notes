"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { DOMAINS, type TopicMeta } from "@/lib/domains";
import { useUIStore } from "@/store/ui";

export function CommandPalette({ topics }: { topics: TopicMeta[] }) {
  const router = useRouter();
  const { commandOpen, setCommandOpen, toggleCommand } = useUIStore();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommand();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggleCommand]);

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search topics…" />
      <CommandList>
        <CommandEmpty>No topics found.</CommandEmpty>
        {DOMAINS.map((domain) => {
          const domainTopics = topics.filter((t) => t.domain === domain.slug);
          if (domainTopics.length === 0) return null;
          return (
            <CommandGroup key={domain.slug} heading={domain.label}>
              {domainTopics.map((topic) => (
                <CommandItem
                  key={`${topic.domain}/${topic.slug}`}
                  value={`${topic.title} ${topic.summary} ${domain.label} ${topic.tags.join(" ")}`}
                  onSelect={() => {
                    setCommandOpen(false);
                    router.push(`/${topic.domain}/${topic.slug}`);
                  }}
                >
                  <span aria-hidden>{topic.icon}</span>
                  <span className="truncate">{topic.title}</span>
                  <span className="ml-auto truncate text-xs text-muted-foreground">
                    {topic.summary}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}

const noopSubscribe = () => () => {};

// Hydration-safe platform check: server renders ⌘, client corrects on non-Apple.
function useIsMac() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );
}

export function SearchTrigger({ variant = "hero" }: { variant?: "hero" | "header" }) {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const shortcut = useIsMac() ? "⌘K" : "Ctrl K";

  if (variant === "header") {
    return (
      <Button
        variant="outline"
        size="sm"
        aria-label="Search topics"
        className="text-muted-foreground"
        onClick={() => setCommandOpen(true)}
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search</span>
        <Kbd className="hidden sm:inline-flex">{shortcut}</Kbd>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="text-muted-foreground"
      onClick={() => setCommandOpen(true)}
    >
      <Search className="size-4" />
      Search topics…
      <Kbd className="ml-2">{shortcut}</Kbd>
    </Button>
  );
}
