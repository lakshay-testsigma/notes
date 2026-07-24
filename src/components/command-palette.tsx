"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, SearchX } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { humanize, type DomainInfo, type NoteItem } from "@/lib/domains";
import { useUIStore } from "@/store/ui";

export function CommandPalette({
  topics,
  domains,
}: {
  topics: NoteItem[];
  domains: DomainInfo[];
}) {
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
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} className="sm:max-w-2xl">
      <Command>
        <div className="relative">
          <CommandInput placeholder="Search topics…" className="pr-12" />
          <Kbd className="absolute top-1/2 right-3.5 z-10 -translate-y-[calc(50%-2px)]">esc</Kbd>
        </div>
        <CommandList className="max-h-[26rem] px-2 pb-2">
          <CommandEmpty className="flex flex-col items-center gap-2 py-10 text-center">
            <SearchX className="size-5 text-muted-foreground/60" aria-hidden />
            <span className="text-sm text-muted-foreground">
              No topics match. Try a tag like “react” or “performance”.
            </span>
          </CommandEmpty>
          {domains.map((domain) => {
            const domainTopics = topics.filter((t) => t.domain === domain.slug);
            if (domainTopics.length === 0) return null;
            return (
              <CommandGroup
                key={domain.slug}
                heading={domain.label}
                className="mt-3 first:mt-1 [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-foreground"
              >
                {domainTopics.map((topic) => {
                  // Ancestor folders between domain and note: "ML › Regression"
                  const pathContext = topic.slugPath
                    .slice(1, -1)
                    .map(humanize)
                    .join(" › ");
                  return (
                    <CommandItem
                      key={topic.href}
                      value={`${topic.title} ${topic.summary} ${domain.label} ${topic.slugPath.join(" ")} ${topic.tags.join(" ")}`}
                      style={{ "--domain": `var(${domain.accentVar})` } as React.CSSProperties}
                      onSelect={() => {
                        setCommandOpen(false);
                        router.push(topic.href);
                      }}
                      className="mb-1.5 rounded-lg border bg-muted/40 px-3 py-3 data-selected:border-transparent data-selected:bg-(--domain) data-selected:text-background [&>svg:last-child]:hidden"
                    >
                      <span
                        aria-hidden
                        className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-base"
                      >
                        {topic.icon}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">{topic.title}</span>
                        <span className="truncate text-xs text-muted-foreground group-data-selected/command-item:text-background/80">
                          {pathContext && <span>{pathContext} › </span>}
                          {topic.summary}
                        </span>
                      </span>
                      <ChevronRight className="ml-auto size-4 shrink-0 opacity-40 group-data-selected/command-item:opacity-90" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
        <div className="flex items-center gap-4 border-t px-4 py-2.5 text-xs text-muted-foreground">
          <KbdGroup>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>navigate</span>
          </KbdGroup>
          <KbdGroup>
            <Kbd>↵</Kbd>
            <span>open</span>
          </KbdGroup>
          <KbdGroup>
            <Kbd>esc</Kbd>
            <span>close</span>
          </KbdGroup>
        </div>
      </Command>
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
