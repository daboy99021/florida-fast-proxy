import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const quickLinks = [
  { label: "YouTube", url: "https://www.youtube.com" },
  { label: "Docs", url: "https://docs.github.com" },
  { label: "Design", url: "https://www.figma.com" },
  { label: "Code", url: "https://github.com" },
  { label: "News", url: "https://news.ycombinator.com" },
];

const cards = [
  { title: "Project repo", detail: "Ready for GitHub Pages export", tone: "bg-primary/10" },
  { title: "Fast shell", detail: "Static UI with responsive controls", tone: "bg-accent/20" },
  { title: "Clean tabs", detail: "Desktop-style browsing layout", tone: "bg-secondary" },
];

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const normalizeAddress = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed);
  const looksLikeDomain = /^[^\s]+\.[^\s]{2,}/.test(trimmed);

  return hasProtocol ? trimmed : looksLikeDomain ? `https://${trimmed}` : "";
};

const createStartPage = (term = "") => {
  const safeTerm = escapeHtml(term);
  const query = encodeURIComponent(term || "github pages");

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #e8eefc; background: radial-gradient(circle at top left, #244a7a, transparent 34%), linear-gradient(135deg, #111827, #172033 55%, #0f172a); }
      main { min-height: 100vh; display: grid; place-items: center; padding: 32px; }
      section { width: min(760px, 100%); }
      h1 { margin: 0; font-size: clamp(34px, 7vw, 72px); line-height: .95; letter-spacing: 0; }
      p { color: #aebbd3; font-size: 16px; line-height: 1.7; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 28px; }
      a { display: block; border: 1px solid rgba(255,255,255,.16); border-radius: 12px; padding: 16px; color: #f8fbff; text-decoration: none; background: rgba(255,255,255,.08); }
      a:hover { background: rgba(255,255,255,.14); }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>${term ? `Search: ${safeTerm}` : "New Tab"}</h1>
        <p>${term ? "Choose a destination below. If a site blocks embedded browsing, this window will keep showing the start page instead of opening a new tab." : "Type a URL or search above. Sites that allow embedded browsing will load in this window."}</p>
        <div class="grid">
          <a href="https://www.google.com/search?q=${query}">Google Search</a>
          <a href="https://duckduckgo.com/?q=${query}">DuckDuckGo</a>
          <a href="https://www.youtube.com">YouTube</a>
          <a href="https://github.com">GitHub</a>
          <a href="https://news.ycombinator.com">News</a>
        </div>
      </section>
    </main>
    <script>
      document.addEventListener('click', function(event) {
        const link = event.target.closest('a[href]');
        if (!link) return;
        event.preventDefault();
        window.parent.postMessage({ type: 'load-in-browser-window', url: link.href }, '*');
      });
    </script>
  </body>
</html>`;
};

function Index() {
  const [address, setAddress] = useState("github-pages://desktop-browser");
  const [frameUrl, setFrameUrl] = useState("");
  const [frameHtml, setFrameHtml] = useState(createStartPage());

  const openAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = address.trim();
    if (!value) return;

    const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(value);
    const looksLikeDomain = /^[^\s]+\.[^\s]{2,}/.test(value);
    const target = hasProtocol ? value : looksLikeDomain ? `https://${value}` : "";

    setFrameUrl(target);
    setFrameHtml(target ? "" : createStartPage(value));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ambient px-4 py-6 text-foreground sm:px-6 lg:px-10">
      <div className="ambient-shift pointer-events-none absolute inset-[-8%] bg-ambient opacity-80" />
      <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center justify-center">
        <div className="float-in w-full overflow-hidden rounded-2xl border border-border browser-glass">
          <header className="border-b border-border bg-browser-chrome/80">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-destructive" />
                <span className="h-3 w-3 rounded-full bg-chart-5" />
                <span className="h-3 w-3 rounded-full bg-success" />
              </div>
              <div className="hidden min-w-0 items-center gap-2 rounded-t-lg bg-browser-tab px-4 py-2 text-sm font-medium text-muted-foreground shadow-panel sm:flex">
                <span className="h-2 w-2 rounded-full bg-success" />
                New Tab
              </div>
              <div className="ml-auto flex items-center gap-2 text-browser-control-foreground">
                <button
                  className="grid h-8 w-8 place-items-center rounded-md bg-browser-control transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label="Back"
                >
                  ←
                </button>
                <button
                  className="grid h-8 w-8 place-items-center rounded-md bg-browser-control transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label="Refresh"
                >
                  ↻
                </button>
              </div>
            </div>
            <form className="flex flex-col gap-3 px-4 pb-4 sm:flex-row" onSubmit={openAddress}>
              <label className="sr-only" htmlFor="address">
                Address bar
              </label>
              <div className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-border bg-browser-display px-4 shadow-panel transition focus-within:ring-2 focus-within:ring-ring">
                <span className="text-success">●</span>
                <input
                  id="address"
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Search or type a web address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary-action px-5 py-3 text-sm font-bold text-primary-foreground shadow-panel transition hover:-translate-y-0.5 hover:shadow-browser focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
              >
                Open
              </button>
            </form>
          </header>

          <div className="grid min-h-[620px] bg-background/72 lg:grid-cols-[260px_1fr]">
            <aside className="border-b border-border bg-surface p-4 lg:border-b-0 lg:border-r">
              <p className="text-xs font-bold uppercase text-muted-foreground">Favorites</p>
              <nav className="mt-4 grid gap-2" aria-label="Favorite links">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-surface-foreground transition hover:bg-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {link.label}
                    <span className="text-muted-foreground">↗</span>
                  </a>
                ))}
              </nav>
            </aside>

            <section className="flex flex-col justify-between gap-8 p-5 sm:p-8 lg:p-10">
              <div>
                <p className="text-sm font-bold text-primary">Desktop workspace</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-foreground sm:text-6xl">
                  Browse-style start page for your GitHub site.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  A polished static interface that feels like opening a clean modern browser on your
                  computer.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-browser-display shadow-panel">
                <iframe
                  key={frameUrl || frameHtml}
                  title="Browser viewport"
                  src={frameUrl || undefined}
                  srcDoc={frameUrl ? undefined : frameHtml}
                  className="h-[360px] w-full bg-background"
                  sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {cards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-xl border border-border bg-card p-5 shadow-panel transition hover:-translate-y-1 hover:shadow-browser"
                  >
                    <div className={`mb-6 h-20 rounded-lg ${card.tone}`} />
                    <h2 className="text-lg font-black text-card-foreground">{card.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.detail}</p>
                  </article>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-surface-foreground">Static export friendly</p>
                    <p className="text-sm text-muted-foreground">
                      Split into normal React, CSS tokens, and reusable layout structure.
                    </p>
                  </div>
                  <span className="rounded-full bg-success px-3 py-1 text-xs font-black text-success-foreground">
                    Online
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
