import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { getLatestPosts } from '@/lib/insights';

export default async function Home() {
  const latestPosts = getLatestPosts(3);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hey, I&apos;m Logan
        </h1>
        <p className="text-lg text-muted-foreground">
          Australian-born Kiwi living in Germany, based in Cologne.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Perspectives on life in Germany. Clarity on health insurance,
          pensions, and how the German system works. Clarity on investment
          and financial planning.
        </p>
      </section>

      {latestPosts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-semibold">Latest insights</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                className="group block overflow-hidden rounded-lg border border-border transition-colors hover:border-border/80 hover:bg-accent/30"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted/50">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      width={320}
                      height={240}
                      className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/80 to-muted/40">
                      <FileText className="size-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {post.date ? format(new Date(post.date), 'MMM d, yyyy') : ''}
                  </span>
                  <h3 className="mt-0.5 text-sm font-semibold text-foreground group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/insights"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            All insights
            <ArrowRight className="size-4" />
          </Link>
        </section>
      )}

    </main>
  );
}
