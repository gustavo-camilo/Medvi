/**
 * Single source of truth for all pt-BR copy on the landing page.
 * Edit this file to change the site's content — no need to touch components.
 *
 * Prices, doctor names, testimonials, etc. are placeholders. The user is
 * expected to replace them with verified content reviewed by a Brazilian
 * medical lawyer (ANVISA / CFM rules apply to medical advertising in Brazil).
 */

/**
 * DEV PLACEHOLDER IMAGES — remove before launch.
 * Neutral lifestyle/medical photos from Unsplash, licensed under the Unsplash
 * License (free for commercial and non-commercial use, no permission needed).
 * https://unsplash.com/license
 *
 * Replace with licensed photography of real patients (with written consent
 * per CFM rules) or stock that matches the brand before going public.
 */
const UNSPLASH = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const heroImages = [
  { src: UNSPLASH('photo-1494790108377-be9c29b29330', 800, 1000), alt: 'Mulher sorrindo ao ar livre' },
  { src: UNSPLASH('photo-1571019613454-1cb2f99b2d8b', 800, 1000), alt: 'Pessoa se exercitando em ambiente natural' },
  { src: UNSPLASH('photo-1559839734-2b71ea197ec2', 800, 1000), alt: 'Médica atendendo paciente' },
  { src: UNSPLASH('photo-1490645935967-10de6ba17061', 800, 1000), alt: 'Refeição saudável em mesa rústica' },
];

export const resultsImages = [
  { src: UNSPLASH('photo-1544005313-94ddf0286df2', 600, 800), alt: 'Paciente sorridente após tratamento' },
  { src: UNSPLASH('photo-1438761681033-6461ffad8d80', 600, 800), alt: 'Pessoa feliz ao ar livre' },
  { src: UNSPLASH('photo-1508214751196-bcfd4ca60f91', 600, 800), alt: 'Retrato de mulher sorridente' },
  { src: UNSPLASH('photo-1500648767791-00dcc994a43e', 600, 800), alt: 'Homem em caminhada no parque' },
  { src: UNSPLASH('photo-1506794778202-cad84cf45f1d', 600, 800), alt: 'Retrato de pessoa adulta em ambiente claro' },
  { src: UNSPLASH('photo-1489424731084-a5d8b219a5bb', 600, 800), alt: 'Mulher ao amanhecer' },
  { src: UNSPLASH('photo-1517841905240-472988babdf9', 600, 800), alt: 'Retrato casual em tom claro' },
  { src: UNSPLASH('photo-1544723795-3fb6469f5b39', 600, 800), alt: 'Pessoa se exercitando ao ar livre' },
];

export const doctorPhotos = [
  UNSPLASH('photo-1559839734-2b71ea197ec2', 400, 400), // doctor 1
  UNSPLASH('photo-1612349317150-e413f6a5b16d', 400, 400), // doctor 2
];

export const metabolismImage = {
  src: UNSPLASH('photo-1490645935967-10de6ba17061', 800, 1000),
  alt: 'Alimentos saudáveis em mesa de madeira',
};

export const explainerImage = {
  src: UNSPLASH('photo-1576091160399-112ba8d25d1d', 800, 800),
  alt: 'Profissional da saúde com caneta e estetoscópio',
};

export const brand = {
  name: 'MEDVi Brasil',
  shortName: 'MEDVi',
  tagline: 'Saúde de verdade. Para a vida real.',
  email: 'contato@medvi.com.br',
  phone: '(11) 4000-0000',
  whatsapp: '5511999999999',
  address: 'Av. Paulista, 1000 — Bela Vista, São Paulo/SP — 01310-100',
};

export const nav = {
  primary: [
    { label: 'Produtos', href: '#produtos' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Médicos', href: '#medicos' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Perguntas', href: '#faq' },
  ],
  cta: { label: 'Quero começar', href: '#qualificacao' },
};

export const hero = {
  eyebrow: 'Tratamento médico para emagrecimento',
  title: 'Você decidiu emagrecer de verdade. A gente também.',
  subtitle:
    'Avaliação por médicos brasileiros, medicamentos GLP-1 entregues na sua casa e acompanhamento contínuo — tudo 100% online.',
  bullets: [
    'Consulta com médico licenciado pelo CFM',
    'Acompanhamento humano 7 dias por semana',
    'Entrega discreta em todo o Brasil',
    'Cancele quando quiser, sem multa',
  ],
  cta: { label: 'Sou elegível?', href: '#qualificacao' },
  socialProof: '+10.000 brasileiros já começaram',
};

export const press = [
  'Veja',
  'Folha',
  'Estadão',
  'Exame',
  'Globo',
  'UOL',
  'GQ',
];

export interface Product {
  id: string;
  name: string;
  description: string;
  badge?: 'Mais popular' | 'Novo' | 'Recomendado';
  startingPriceBRL: number;
  bullets: string[];
  imageAlt: string;
}

export const products: Product[] = [
  {
    id: 'glp1-injetavel',
    name: 'GLP-1 Injetável',
    description: 'Aplicação semanal. O tratamento mais escolhido pelos pacientes.',
    badge: 'Mais popular',
    startingPriceBRL: 599,
    bullets: ['Aplicação 1x na semana', 'Resultados em 4 a 8 semanas', 'Caneta pronta para uso'],
    imageAlt: 'Caneta injetora de GLP-1',
  },
  {
    id: 'glp1-oral',
    name: 'GLP-1 Oral',
    description: 'Comprimido diário, sem agulhas. Para quem prefere a via oral.',
    startingPriceBRL: 499,
    bullets: ['1 comprimido por dia', 'Sem agulhas', 'Discreto e prático'],
    imageAlt: 'Frasco de comprimidos orais GLP-1',
  },
  {
    id: 'glp1-plus',
    name: 'GLP-1 Plus',
    description: 'Combinação avançada para quem busca resultados maiores.',
    badge: 'Recomendado',
    startingPriceBRL: 799,
    bullets: ['Fórmula combinada', 'Acompanhamento intensivo', 'Plano nutricional incluso'],
    imageAlt: 'Caixa do tratamento GLP-1 Plus',
  },
  {
    id: 'metabolico',
    name: 'Programa Metabólico',
    description: 'Tratamento completo: medicação, nutrição e coach 1:1.',
    startingPriceBRL: 999,
    bullets: ['Coach dedicado', 'Nutricionista incluso', 'Plano de manutenção'],
    imageAlt: 'Kit completo do Programa Metabólico',
  },
  {
    id: 'manutencao',
    name: 'Manutenção',
    description: 'Para pacientes que já atingiram a meta e querem manter o peso.',
    badge: 'Novo',
    startingPriceBRL: 349,
    bullets: ['Dose reduzida', 'Acompanhamento mensal', 'Foco em hábitos'],
    imageAlt: 'Kit de manutenção',
  },
];

export const reviews = [
  {
    name: 'Mariana S.',
    city: 'São Paulo, SP',
    rating: 5,
    text: 'Perdi 14 kg em 5 meses. O acompanhamento da equipe foi o diferencial — sempre tive resposta rápida no WhatsApp.',
  },
  {
    name: 'Rafael M.',
    city: 'Belo Horizonte, MG',
    rating: 5,
    text: 'Já tinha tentado de tudo. Aqui foi a primeira vez que me senti acolhido por médicos de verdade.',
  },
  {
    name: 'Camila T.',
    city: 'Curitiba, PR',
    rating: 5,
    text: 'O processo é simples, a entrega chegou em 3 dias, e minha médica é um amor. Recomendo demais.',
  },
  {
    name: 'João P.',
    city: 'Recife, PE',
    rating: 5,
    text: 'Estou no quarto mês e já são 11 kg a menos. Sem fome, sem ansiedade. Mudou minha vida.',
  },
];

export const explainer = {
  title: 'Como o GLP-1 funciona no seu corpo',
  paragraphs: [
    'O GLP-1 é um hormônio que o seu próprio corpo já produz. Ele regula a fome, a saciedade e o metabolismo da glicose.',
    'Os medicamentos da classe GLP-1 imitam esse hormônio em doses maiores. O resultado: você sente menos fome, come menos sem sofrer e seu metabolismo trabalha a seu favor.',
    'Estudos clínicos mostram perda média de até 21% do peso corporal em 12 meses, quando combinado com acompanhamento médico e mudanças no estilo de vida.',
  ],
};

export const stats = [
  { value: 21, suffix: '%', label: 'Perda média de peso em 12 meses' },
  { value: 6, suffix: 'x', label: 'Mais eficaz que dieta sozinha' },
  { value: 93, suffix: '%', label: 'Mantêm o peso após 1 ano' },
];

export const journey = [
  {
    n: 1,
    title: 'Faça a avaliação online',
    description: 'Responda um questionário rápido sobre seu histórico e seus objetivos. Leva menos de 5 minutos.',
  },
  {
    n: 2,
    title: 'Converse com um médico',
    description: 'Um médico brasileiro analisa seu caso e, se elegível, prescreve o tratamento ideal para você.',
  },
  {
    n: 3,
    title: 'Receba em casa',
    description: 'Entrega discreta em todo o Brasil. Acompanhamento contínuo da nossa equipe pelo WhatsApp.',
  },
];

export const support = {
  title: 'Atendimento humano, 7 dias por semana.',
  body: 'Nossa equipe de enfermeiros, nutricionistas e médicos está disponível pelo WhatsApp para tirar dúvidas, ajustar o tratamento e te apoiar em cada etapa. Sem robôs, sem espera.',
};

export const faq = [
  {
    q: 'O tratamento é seguro?',
    a: 'Sim. Todos os pacientes passam por avaliação médica prévia. Os medicamentos GLP-1 são amplamente estudados e usados há anos no mundo todo. Apenas pacientes elegíveis recebem prescrição.',
  },
  {
    q: 'Quanto custa?',
    a: 'Os planos começam a partir de R$ 349/mês, sem mensalidade extra ou taxas escondidas. Você só paga pelo medicamento e pelo acompanhamento. Aceitamos Pix, cartão e boleto.',
  },
  {
    q: 'Quanto tempo até ver resultados?',
    a: 'A maioria dos pacientes começa a notar diferenças entre 4 e 8 semanas. A perda de peso média é de 1 a 2 kg por semana após o primeiro mês.',
  },
  {
    q: 'Preciso de plano de saúde?',
    a: 'Não. Atendemos diretamente você, sem intermediários. Tudo é feito 100% online.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim. Sem fidelidade, sem multa. Você cancela direto pelo WhatsApp.',
  },
  {
    q: 'A entrega é discreta?',
    a: 'Totalmente. A embalagem é neutra, sem qualquer identificação do conteúdo ou da MEDVi.',
  },
];

export const guarantee = {
  title: 'Garantia MEDVi',
  body: 'Se você seguir o tratamento conforme orientação médica e não ver resultados nos primeiros 90 dias, devolvemos o seu dinheiro. Sem perguntas, sem burocracia.',
};

export const doctors = [
  {
    name: 'Dra. Ana Carolina Mendes',
    crm: 'CRM/SP 000.000',
    specialty: 'Endocrinologia',
    bio: 'Especialista em obesidade e metabolismo, com mais de 10 anos de experiência clínica.',
  },
  {
    name: 'Dr. Pedro Henrique Souza',
    crm: 'CRM/RJ 000.000',
    specialty: 'Clínica Médica',
    bio: 'Foco em emagrecimento sustentável e mudança de hábitos, com abordagem humanizada.',
  },
];

export const goalSelector = {
  title: 'Quanto você quer perder?',
  subtitle: 'Selecione sua meta para começar.',
  options: [
    { label: '1 a 10 kg', value: '1-10' },
    { label: '11 a 25 kg', value: '11-25' },
    { label: 'Mais de 25 kg', value: '25+' },
    { label: 'Ainda não sei', value: 'incerto' },
  ],
};

export const trustBadges = [
  { icon: 'shield', label: 'Garantia de 90 dias' },
  { icon: 'truck', label: 'Frete grátis para todo o Brasil' },
  { icon: 'stethoscope', label: 'Médicos brasileiros (CFM)' },
  { icon: 'lock', label: 'Sem mensalidade escondida' },
];

export const footer = {
  legal: [
    { label: 'Termos de uso', href: '/termos-de-uso' },
    { label: 'Política de privacidade (LGPD)', href: '/politica-de-privacidade' },
    { label: 'Política de reembolso', href: '/politica-de-reembolso' },
    { label: 'Consentimento médico', href: '/consentimento-medico' },
    { label: 'LGPD — Seus direitos', href: '/lgpd' },
  ],
  disclaimer:
    'A MEDVi é uma plataforma de telemedicina que conecta pacientes a médicos brasileiros licenciados pelo CFM. As prescrições são emitidas exclusivamente após consulta com um profissional de saúde habilitado. Os medicamentos são manipulados por farmácias regularmente licenciadas pela ANVISA. Resultados variam de acordo com o paciente, adesão ao tratamento e estilo de vida. As informações deste site não substituem uma consulta médica presencial. Em caso de emergência, ligue para o SAMU (192).',
  imageDisclaimer:
    'Algumas imagens deste site podem ser geradas ou aprimoradas por inteligência artificial e são meramente ilustrativas.',
};
