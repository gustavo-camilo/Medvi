import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Consentimento Médico',
};

export default function Page() {
  return (
    <LegalPage title="Termo de Consentimento Livre e Esclarecido">
      <p>
        Este termo é apresentado ao paciente antes da primeira consulta e deve ser aceito
        eletronicamente como condição para avaliação médica.
      </p>
      <h2>Natureza do tratamento</h2>
      <p>
        O tratamento com medicamentos da classe GLP-1 (como semaglutida e liraglutida) é
        indicado para pacientes adultos com obesidade ou sobrepeso associado a comorbidades,
        conforme avaliação médica individualizada.
      </p>
      <h2>Riscos e efeitos colaterais</h2>
      <p>
        Os efeitos colaterais mais comuns incluem náuseas, vômitos, diarreia, constipação e
        desconforto abdominal. Em casos raros podem ocorrer pancreatite, problemas de vesícula
        biliar e reações alérgicas.
      </p>
      <h2>Alternativas</h2>
      <p>
        Existem outras abordagens terapêuticas para emagrecimento, incluindo dieta, exercício
        físico, cirurgia bariátrica e outros medicamentos, que devem ser discutidas com o
        médico responsável.
      </p>
      <h2>Telemedicina</h2>
      <p>
        O atendimento é realizado à distância nos termos da Resolução CFM 2.314/2022, que
        regulamenta a telemedicina no Brasil.
      </p>
      <h2>Consentimento</h2>
      <p>
        Ao iniciar o tratamento, o paciente declara ter lido, compreendido e concordado com
        as informações acima, bem como tido a oportunidade de esclarecer dúvidas com o
        médico responsável.
      </p>
    </LegalPage>
  );
}
