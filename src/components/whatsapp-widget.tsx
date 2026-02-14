'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '4922195491545';
const WHATSAPP_TEXT =
  'Hi+there+Logan!+I+saw+your+website+and+thought+I%27d+introduce+myself+and+see+if+you+can+help';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

const PAGES_WITH_WIDGET = ['/contact', '/legal'];

export function WhatsAppWidget() {
  const pathname = usePathname();
  const showWidget = PAGES_WITH_WIDGET.includes(pathname ?? '');

  if (!showWidget) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-7" strokeWidth={2} />
    </a>
  );
}
