# MEDVi Brasil — Landing Page

Landing page de telemedicina para emagrecimento com GLP-1, em pt-BR. Stack Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/Radix + Framer Motion, integrada a Supabase (leads) e Resend (notificações). Deploy em DigitalOcean via Docker + Caddy.

## Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Estilo**: Tailwind CSS, paleta customizada (cream / forest / gold), fontes Inter + Fraunces
- **UI**: componentes shadcn-style sobre Radix primitives
- **Animações**: Framer Motion
- **Formulários**: react-hook-form + Zod
- **Backend**: Supabase (Postgres + RLS) para leads, Resend para emails transacionais
- **Deploy**: Docker multi-stage, Caddy 2 (TLS automático)

## Getting started

```bash
# 1. instale as dependências
pnpm install

# 2. configure o ambiente
cp .env.example .env.local
# edite .env.local com suas chaves

# 3. rode o servidor de desenvolvimento
pnpm dev
```

Abra http://localhost:3000.

## Supabase

1. Crie um projeto em https://supabase.com
2. Copie `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` e `SUPABASE_SECRET_KEY` para o `.env.local` (os nomes legados `*_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` continuam funcionando)
3. Rode a migração em `supabase/migrations/0001_init.sql` (SQL Editor do painel ou `supabase db push`)

A política de RLS permite que usuários anônimos façam INSERT na tabela `leads` somente quando `consentimento_lgpd = true`. Não há política de SELECT, então leads só são lidos via service role.

## DigitalOcean deploy

```bash
# 1. crie um droplet Ubuntu 22.04 (ou superior)
# 2. aponte seu domínio para o IP do droplet (A record)
# 3. instale Docker + Docker Compose plugin
curl -fsSL https://get.docker.com | sh

# 4. clone o repo no droplet
git clone <repo-url> /opt/medvi && cd /opt/medvi

# 5. configure o ambiente
cp .env.example .env.local
nano .env.local   # preencha tudo
export DOMAIN=medvi.com.br

# 6. suba
docker compose up -d --build
```

Caddy gera e renova TLS automaticamente via Let's Encrypt.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | sim | URL pública canônica (ex.: `https://medvi.com.br`) |
| `NEXT_PUBLIC_SUPABASE_URL` | sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | sim | Chave publicável/browser (legado: `NEXT_PUBLIC_SUPABASE_ANON_KEY`) |
| `SUPABASE_SECRET_KEY` | sim | Chave secreta de servidor (legado: `SUPABASE_SERVICE_ROLE_KEY`) |
| `RESEND_API_KEY` | não | Chave do Resend para envio de emails |
| `LEAD_NOTIFICATION_EMAIL` | não | Email que recebe notificações de novo lead |
| `LEAD_FROM_EMAIL` | não | Remetente dos emails (ex.: `MEDVi <no-reply@medvi.com.br>`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | não | Número do WhatsApp com DDI (ex.: `5511999999999`) |
| `DOMAIN` | no deploy | Domínio usado pelo Caddy |

## Edição de conteúdo

Todos os textos em pt-BR estão centralizados em [`lib/content.ts`](./lib/content.ts). Edite esse
arquivo para alterar headlines, preços, depoimentos, médicos, FAQ, etc. — os componentes
não possuem strings hardcoded.

## Aviso legal

**IMPORTANTE**: todos os textos legais (Política de Privacidade, Termos de Uso, Política de
Reembolso, Consentimento Médico, LGPD) são **modelos placeholder** e devem ser revisados por
advogado brasileiro especializado em saúde e direito digital antes de publicação comercial.
A publicidade e a prática de telemedicina no Brasil estão sujeitas às normas da ANVISA, do
CFM (Res. 2.314/2022), do Código de Defesa do Consumidor e da LGPD. Claims médicos,
depoimentos de pacientes e imagens "antes/depois" exigem cuidado adicional — valide com o
compliance médico antes de publicar.
