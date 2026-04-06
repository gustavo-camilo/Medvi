import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { brand } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade e LGPD da MEDVi Brasil.',
};

export default function Page() {
  return (
    <LegalPage title="Política de Privacidade (LGPD)">
      <p>Última atualização: 2026. Documento em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>

      <h2>1. Dados coletados</h2>
      <p>
        A {brand.name} coleta dados cadastrais (nome, email, telefone, CPF), dados de saúde
        (peso, altura, histórico médico, objetivos de tratamento) e dados técnicos de navegação
        (cookies, endereço IP, dispositivo).
      </p>

      <h2>2. Finalidade</h2>
      <p>
        Os dados são utilizados exclusivamente para avaliação médica, prescrição de tratamento,
        entrega de medicamentos, acompanhamento clínico e cumprimento de obrigações legais.
      </p>

      <h2>3. Base legal</h2>
      <p>
        O tratamento de dados pessoais de saúde é realizado com base no consentimento do titular
        (Art. 11, I da LGPD), para a tutela da saúde (Art. 11, II, "f") e para cumprimento de
        obrigação legal (Art. 7, II).
      </p>

      <h2>4. Compartilhamento</h2>
      <p>
        Seus dados podem ser compartilhados com médicos parceiros, farmácias licenciadas pela
        ANVISA, transportadoras e provedores de infraestrutura em nuvem, sempre sob contrato
        de confidencialidade e nos limites da finalidade declarada.
      </p>

      <h2>5. Direitos do titular (Art. 18 LGPD)</h2>
      <ul>
        <li>Confirmação da existência de tratamento</li>
        <li>Acesso aos dados</li>
        <li>Correção de dados incompletos ou desatualizados</li>
        <li>Anonimização, bloqueio ou eliminação</li>
        <li>Portabilidade</li>
        <li>Eliminação dos dados tratados com base no consentimento</li>
        <li>Informação sobre compartilhamento</li>
        <li>Revogação do consentimento</li>
      </ul>

      <h2>6. Retenção</h2>
      <p>
        Dados de saúde são mantidos pelo prazo mínimo de 20 anos, conforme Resolução CFM
        1.821/2007. Demais dados pelo prazo necessário ao cumprimento das finalidades.
      </p>

      <h2>7. Segurança</h2>
      <p>
        Utilizamos criptografia em trânsito (TLS) e em repouso, controle de acesso baseado em
        funções, registros de auditoria e testes periódicos de segurança.
      </p>

      <h2>8. Encarregado de Dados (DPO)</h2>
      <p>
        Para exercer seus direitos ou esclarecer dúvidas, contate nosso DPO em {brand.email}.
      </p>

      <h2>9. ANPD</h2>
      <p>
        Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados
        (ANPD) em gov.br/anpd.
      </p>
    </LegalPage>
  );
}
