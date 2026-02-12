import type { Metadata } from 'next';
import Link from 'next/link';
import { changelogEntries } from '@/data/changelog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Changelog – Consulting & More Workspace',
  description:
    'What\'s new in the Consulting & More workspace. Updates, features, and fixes.',
};

export default function ChangelogPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <section className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Changelog
        </h1>
        <p className="text-sm text-muted-foreground">
          Updates and improvements to the Consulting &amp; More workspace.
        </p>
      </section>

      <nav className="flex gap-4 text-sm">
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <Link
          href="/pricing"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Pricing
        </Link>
      </nav>

      <section className="space-y-6">
        {changelogEntries.map((entry) => (
          <Card key={entry.date} className="rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold leading-tight">
                {entry.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {entry.date}
                {entry.version && ` · ${entry.version}`}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
