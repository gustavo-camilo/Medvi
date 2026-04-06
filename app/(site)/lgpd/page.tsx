import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { brand } from '@/lib/content';

export const metadata: Metadata = {
  title: 'LGPD — Seus direitos',
};

export default function Page() {
  return (
    <LegalPage title="LGPD — Exercício de direitos">
      <p>
        A Lei Geral de Proteção de Dados (Lei 13.709/2018), em seu Art. 18, garante a você
        diversos direitos sobre seus dados pessoais. Você pode exercê-los gratuitamente a
        qualquer momento.
      </p>
      <h2>Seus direitos</h2>
      <ul>
        <li>Confirmar a existência de tratamento</li>
        <li>Acessar seus dados</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
        <li>Solicitar anonimização, bloqueio ou eliminação</li>
        <li>Pedir portabilidade a outro fornecedor</li>
        <li>Eliminar dados tratados com base no consentimento</li>
        <li>Obter informação sobre com quem compartilhamos seus dados</li>
        <li>Revogar o consentimento</li>
      </ul>
      <h2>Como exercer</h2>
      <p>
        Envie sua solicitação por email para nosso Encarregado de Dados (DPO):{' '}
        <a href={`mailto:dpo@medvi.com.br`} className="text-forest underline">
          dpo@medvi.com.br
        </a>
        . Responderemos em até 15 dias.
      </p>
      <p>
        Para dúvidas gerais, contate {brand.email}. Você também pode reclamar diretamente
        à ANPD em gov.br/anpd.
      </p>
    </LegalPage>
  );
}
