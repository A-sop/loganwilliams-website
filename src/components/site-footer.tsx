import Link from 'next/link';
import {
  Briefcase,
  TrendingUp,
  BookOpen,
  Wrench,
  FileText,
  Shield,
  BadgeDollarSign,
  Cookie,
} from 'lucide-react';
import { FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { SOCIAL_LINKS } from '@/data/social-links';

const iconClass = 'size-4 shrink-0';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const linkClass =
    'inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors';
  const headingClass =
    'text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3';

  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-sm">
          <div className="text-center">
            <h3 className={headingClass}>Work</h3>
            <ul className="flex flex-col gap-1 items-center">
              <li>
                <a
                  href={SOCIAL_LINKS.allfinanz}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <Briefcase className={iconClass} />
                  Vermögensberatung
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.germanFinancialPlanning}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <TrendingUp className={iconClass} />
                  Financial planning
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <h3 className={headingClass}>Rest</h3>
            <ul className="flex flex-col gap-1 items-center">
              <li>
                <Link href="/insights" className={linkClass}>
                  <BookOpen className={iconClass} />
                  Insights
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <h3 className={headingClass}>Play</h3>
            <ul className="flex flex-col gap-1 items-center">
              <li>
                <a
                  href={SOCIAL_LINKS.logansTools}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <Wrench className={iconClass} />
                  logans.tools
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <h3 className={headingClass}>Logan</h3>
            <ul className="flex flex-col gap-1 items-center">
              <li>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <FaLinkedinIn className={iconClass} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <FaInstagram className={iconClass} />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <h3 className={headingClass}>Legal</h3>
            <ul className="flex flex-col gap-1 items-center">
              <li>
                <Link href="/legal" className={linkClass}>
                  <FileText className={iconClass} />
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/legal#datenschutz" className={linkClass}>
                  <Shield className={iconClass} />
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/disclaimers" className={linkClass}>
                  <BadgeDollarSign className={iconClass} />
                  Disclaimers
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={linkClass}>
                  <Cookie className={iconClass} />
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted-foreground text-center">
          © {currentYear} Logan Williams. All rights reserved.
        </p>
        <p className="mt-1 text-xs text-muted-foreground text-center">
          Made with 🤖 in Cologne.
        </p>
      </div>
    </footer>
  );
}
