import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Notice',
  description:
    'Information about cookies and similar technologies used on loganwilliams.com.',
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Cookie Notice</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Last updated: 14 February 2026
      </p>

      <section className="mt-8 space-y-4 text-sm text-muted-foreground">
        <p>
          This site uses cookies and similar technologies for analytics and
          functionality. You can control cookies through your browser settings.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Services used on this site</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Purpose</th>
                <th className="px-4 py-3 text-left font-medium">Necessary</th>
              </tr>
            </thead>
            <tbody>
        <tr className="border-b border-border">
          <td className="py-3 font-medium">Google Tag Manager</td>
          <td className="py-3 text-muted-foreground">Manages analytics and marketing tags. No direct tracking; enables other services when configured.</td>
          <td className="py-3">No</td>
        </tr>
        <tr className="border-b border-border">
          <td className="py-3 font-medium">Essential / Session</td>
          <td className="py-3 text-muted-foreground">Required for site functionality (e.g. language preference, security).</td>
          <td className="py-3">Yes</td>
        </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/legal#datenschutz" className="text-primary hover:underline">
          Privacy policy
        </Link>
        {' · '}
        <Link href="/" className="text-primary hover:underline">
          Home
        </Link>
      </p>
    </main>
  );
}
