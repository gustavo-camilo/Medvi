import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Política de Reembolso',
};

export default function Page() {
  return (
    <LegalPage title="Política de Reembolso">
      <h2>Garantia de 90 dias</h2>
      <p>
        Caso você siga o tratamento conforme orientação médica e não observe resultados nos
        primeiros 90 dias, reembolsamos integralmente o valor pago pelo tratamento, excluídas
        taxas de envio.
      </p>
      <h2>Direito de arrependimento (CDC Art. 49)</h2>
      <p>
        Nos termos do Código de Defesa do Consumidor, você tem 7 dias a partir do recebimento
        do produto para desistir da compra, desde que o medicamento não tenha sido utilizado
        e esteja na embalagem original e lacrada.
      </p>
      <h2>Como solicitar</h2>
      <p>Envie um email para reembolso@medvi.com.br com seu pedido e dados do tratamento.</p>
      <h2>Prazo de processamento</h2>
      <p>Reembolsos são processados em até 10 dias úteis após a aprovação.</p>
    </LegalPage>
  );
}
