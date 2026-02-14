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
          I work with expats on financial planning and write about life in
          Germany. Based in Cologne.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Clarity on health insurance, pensions, and how the German system
          works. Insights on life in Germany live here. Work with me when
          you&apos;re ready.
        </p>
      </section>

      {latestPosts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-semibold">Latest insights</h2>
          <div className="mt-4 flex flex-col gap-6 sm:gap-8">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                className="group block overflow-hidden rounded-xl border border-border transition-colors hover:border-border/80 hover:bg-accent/30"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted/50">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      width={600}
                      height={338}
                      className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/80 to-muted/40">
                      <FileText className="size-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {post.date ? format(new Date(post.date), 'MMM d, yyyy') : ''}
                  </span>
                  <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
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
