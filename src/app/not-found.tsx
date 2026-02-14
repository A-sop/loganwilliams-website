import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { getLatestPosts } from '@/lib/insights';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFound() {
  const latestPosts = getLatestPosts(1);
  const latestPost = latestPosts[0];

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          404
        </h1>
        <p className="text-xl font-semibold text-foreground">
          Looks like this page has gone walkabout.
        </p>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for has drifted away or never existed.
          While you&apos;re here, try one of these:
        </p>
      </div>

      <div className="mt-10 w-full max-w-3xl flex flex-col gap-4">
        {latestPost && (
          <Link href={`/insights/${latestPost.slug}`} className="block">
            <Card className="transition-colors hover:border-primary/50 hover:bg-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold leading-tight">
                  {latestPost.title}
                </CardTitle>
                <CardDescription>
                  {latestPost.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {latestPost.date
                    ? format(new Date(latestPost.date), 'MMM d, yyyy')
                    : ''}
                </span>
                <span className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read article
                  <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        )}
        <Link href="/contact" className="block">
          <Card className="transition-colors hover:border-primary/50 hover:bg-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold leading-tight">
                Get in touch
              </CardTitle>
              <CardDescription>
                Questions about financial planning or working together? Drop a
                line.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Contact page
                <ArrowRight className="size-4" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-10 flex justify-center">
        <Button asChild size="lg" className="uppercase tracking-wider">
          <Link href="/">Return to home</Link>
        </Button>
      </div>
    </main>
  );
}
