import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { brand, footer } from '@/lib/content';

export function Footer() {
  const whatsappHref = `https://wa.me/${brand.whatsapp}`;
  return (
    <footer className="bg-forest text-cream">
      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl">{brand.shortName}</p>
            <p className="mt-3 max-w-sm text-cream/80">{brand.tagline}</p>
            <ul className="mt-6 space-y-3 text-sm text-cream/90">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold-200" aria-hidden="true" />
                <a href={`mailto:${brand.email}`} className="hover:text-gold-200">
                  {brand.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold-200" aria-hidden="true" />
                <a href={`tel:${brand.phone.replace(/\D/g, '')}`} className="hover:text-gold-200">
                  {brand.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold-200" aria-hidden="true" />
                <span>{brand.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-gold-200" aria-hidden="true" />
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-200"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-200">
              Institucional
            </h3>
            <ul className="space-y-2 text-sm">
              {footer.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream/80 hover:text-gold-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-200">
              Atendimento
            </h3>
            <p className="text-sm text-cream/80">
              Seg a Dom — 7h às 23h
              <br />
              Resposta em até 15 minutos no WhatsApp
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/20 pt-8 text-xs text-cream/60">
          <p className="text-pretty">{footer.disclaimer}</p>
          <p className="mt-4 text-pretty">{footer.imageDisclaimer}</p>
          <p className="mt-6">&copy; 2026 {brand.name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
