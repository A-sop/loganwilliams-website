/**
 * Updates the cookies notice page from src/data/legal-data.json.
 * Run: npx tsx scripts/update-cookies-notice.ts
 *
 * Extend legal-data.json when adding new cookie services, then re-run.
 */
import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.join(process.cwd(), 'src/data/legal-data.json');
const OUTPUT_PATH = path.join(process.cwd(), 'src/app/cookies/page.tsx');

interface CookieService {
  id: string;
  name: string;
  purpose: string;
  provider?: string;
  privacyUrl?: string;
  necessary: boolean;
}

interface LegalData {
  impressum?: Record<string, string>;
  cookies?: {
    lastUpdated: string;
    services: CookieService[];
  };
}

function loadData(): LegalData {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as LegalData;
}

function generateCookiesPage(data: LegalData): string {
  const cookies = data.cookies;
  if (!cookies) throw new Error('No cookies data in legal-data.json');

  const formattedDate = new Date(cookies.lastUpdated).toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  const serviceRows = cookies.services
    .map(
      (s) => `        <tr className="border-b border-border">
          <td className="py-3 font-medium">${s.name}</td>
          <td className="py-3 text-muted-foreground">${s.purpose}</td>
          <td className="py-3">${s.necessary ? 'Yes' : 'No'}</td>
        </tr>`
    )
    .join('\n');

  return `import type { Metadata } from 'next';
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
        Last updated: ${formattedDate}
      </p>

      <section className="mt-8 space-y-4 text-sm text-muted-foreground">
        <p>
          This site uses cookies and similar technologies for analytics and
          functionality. You can control cookies through your browser settings.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Services we use</h2>
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
${serviceRows}
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
`;
}

function main() {
  const data = loadData();
  const pageContent = generateCookiesPage(data);
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, pageContent, 'utf-8');
  console.log(`Updated ${OUTPUT_PATH} from ${DATA_PATH}`);
}

main();