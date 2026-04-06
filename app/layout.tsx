import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { LgpdBanner } from '@/components/LgpdBanner';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://medvi.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MEDVi Brasil — Tratamento de emagrecimento com GLP-1',
    template: '%s | MEDVi Brasil',
  },
  description:
    'Atendimento médico 100% online para emagrecimento com medicamentos GLP-1. Avaliação por médicos brasileiros, acompanhamento contínuo e entrega discreta em todo o Brasil.',
  keywords: [
    'emagrecimento',
    'GLP-1',
    'perda de peso',
    'telemedicina',
    'Ozempic',
    'semaglutida',
    'tratamento online',
  ],
  authors: [{ name: 'MEDVi Brasil' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'MEDVi Brasil',
    title: 'MEDVi Brasil — Emagrecimento com acompanhamento médico',
    description:
      'Tratamento de emagrecimento com GLP-1, 100% online, com médicos brasileiros e entrega discreta.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEDVi Brasil',
    description: 'Emagrecimento com GLP-1 e acompanhamento médico online.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1F4D3A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo principal
        </a>
        {children}
        <WhatsAppFab />
        <LgpdBanner />
      </body>
    </html>
  );
}
