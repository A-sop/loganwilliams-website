import Link from 'next/link';
import { Mail } from 'lucide-react';
import legalData from '@/data/legal-data.json';

const impressum = legalData.impressum as { email: string };

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with Logan Williams. Email for financial planning for expats in Germany.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Contact
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Drop a line.
      </p>

      <div className="mt-10">
        <a
          href={`mailto:${impressum.email}`}
          className="flex items-start gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent/20"
        >
          <Mail className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">{impressum.email}</p>
          </div>
        </a>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block text-sm text-primary hover:underline"
      >
        ← Home
      </Link>
    </main>
  );
}
