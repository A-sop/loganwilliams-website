import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Disclaimers',
  description:
    'Affiliate links, commissions, and how recommendations work. Transparency on how this site earns money.',
};

export default function DisclaimersPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Disclaimers
        </h1>
        <p className="mt-2 text-muted-foreground">
          Transparency matters. Here&apos;s what you need to know about links,
          commissions, and how recommendations work.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Affiliate links</CardTitle>
          <CardDescription>When you click through and buy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Some links on this site are affiliate links. When you click through
            and buy something (e.g. a book or product), a small commission may be
            earned—at no extra cost to you.
          </p>
          <p>
            Amazon.de (Associates) is used for book recommendations, including
            in the Book Club section. Purchases via those links generate a
            referral fee.
          </p>
          <p>
            Links here go only to products and books that have been vetted and
            used. The affiliate relationship doesn&apos;t influence which
            products are recommended.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Financial planning and commissions
          </CardTitle>
          <CardDescription>
            Fees and commissions when you book a conversation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Financial planning conversations are provided through Allfinanz /
            Deutsche Vermögensberatung (DVAG). Advice is commission-based: when
            you take out products like insurance or investments, a commission is
            built into the product. You don&apos;t pay a separate fee for the
            exploratory conversation.
          </p>
          <p>
            Advice is provided by a gebundener Vermittler (tied agent) for
            Generali and other partners. Full details—including which providers
            and what types of benefits may apply—are in the{' '}
            <Link href="/legal#impressum" className="text-primary hover:underline">
              Impressum
            </Link>
            .
          </p>
          <p>
            Recommendations are based on your situation, goals, and fit—not on
            commission structure.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How recommendations work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Books and products:</strong>{' '}
              Only items that have been vetted and used—so you can trust what
              you see.
            </li>
            <li>
              <strong className="text-foreground">Financial products:</strong>{' '}
              Chosen for your situation, goals, and constraints—not for
              commission.
            </li>
            <li>
              <strong className="text-foreground">Honesty:</strong> If something
              isn&apos;t a fit for you, you&apos;ll be told.
            </li>
          </ul>
          <p>
            Questions?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Get in touch
            </Link>
          </p>
        </CardContent>
      </Card>

      <div className="pt-4 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back to home
        </Link>
        {' · '}
        <Link href="/legal" className="text-primary hover:underline">
          Legal
        </Link>
      </div>
    </main>
  );
}
