import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Termos de Uso',
};

export default function Page() {
  return (
    <LegalPage title="Termos de Uso">
      <h2>1. Objeto</h2>
      <p>
        Este documento regula o uso da plataforma MEDVi Brasil, que conecta pacientes a
        médicos brasileiros licenciados para consultas de telemedicina e prescrição de
        tratamentos para emagrecimento.
      </p>
      <h2>2. Elegibilidade</h2>
      <p>
        O serviço é destinado a maiores de 18 anos, residentes no Brasil, com indicação médica
        para tratamento de obesidade ou sobrepeso.
      </p>
      <h2>3. Natureza do serviço</h2>
      <p>
        A MEDVi não substitui atendimento presencial de urgência. Em caso de emergência,
        procure imediatamente um pronto-socorro ou ligue para o SAMU (192).
      </p>
      <h2>4. Pagamentos</h2>
      <p>
        Os tratamentos são cobrados conforme plano contratado. Não há fidelidade ou multa
        por cancelamento.
      </p>
      <h2>5. Propriedade intelectual</h2>
      <p>Todo conteúdo do site é de propriedade da MEDVi Brasil.</p>
      <h2>6. Foro</h2>
      <p>
        Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.
      </p>
    </LegalPage>
  );
}
