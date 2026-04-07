# MEDVi Brasil

Plataforma de telemedicina para emagrecimento com GLP-1, em pt-BR. Inclui landing page institucional, formulário de avaliação (intake), agendamento de consultas, portal administrativo e portal do paciente.

## Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Estilo**: Tailwind CSS, paleta customizada (cream / forest / gold), fontes Inter + Fraunces
- **UI**: componentes shadcn-style sobre Radix primitives
- **Animações**: Framer Motion
- **Formulários**: react-hook-form + Zod
- **Backend**: Supabase (Postgres + RLS + Auth) para leads, usuários, agendamentos, pedidos, mensagens; Resend para emails transacionais
- **Agendamento**: nativo (tabelas `doctors`, `availability_rules`, `appointments` com constraint de exclusão `gist` para evitar double booking)
- **Autenticação**: `@supabase/ssr` (email + senha) com dois papéis: `admin` e `patient`
- **Gráficos**: `recharts` (portal de saúde / IMC)
- **Deploy**: DigitalOcean App Platform (buildpacks Node.js)

## Estrutura de rotas

- `/` — landing page (marketing, seções longas)
- `/agendar` — seleção de médico + horário após intake
- `/obrigado` — confirmação de lead/agendamento
- `/entrar`, `/cadastrar`, `/esqueci-senha`, `/redefinir-senha`, `/confirmar-email` — fluxo de autenticação
- `/admin/**` — portal administrativo (protegido por middleware, exige `profiles.role = 'admin'`)
  - `/admin` dashboard, `/admin/leads`, `/admin/agenda`, `/admin/doctors`, `/admin/orders`, `/admin/messages`, `/admin/settings`
- `/portal/**` — portal do paciente (protegido por middleware, exige autenticação)
  - `/portal` dashboard, `/portal/agendamentos`, `/portal/pedidos`, `/portal/pagamentos`, `/portal/mensagens`, `/portal/saude`, `/portal/perfil`
- Páginas legais: `/termos-de-uso`, `/politica-de-privacidade`, `/politica-de-reembolso`, `/consentimento-medico`, `/lgpd`

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

## Supabase — setup obrigatório

1. Crie um projeto em https://supabase.com
2. Copie as chaves para o `.env.local` (ou para as encrypted env vars no DO App Platform):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (legado: `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `SUPABASE_SECRET_KEY` (legado: `SUPABASE_SERVICE_ROLE_KEY`) — opcional nesta fase, usada apenas por código server-only que precise bypassar RLS
3. **Rode as migrations NA ORDEM** no SQL editor do painel Supabase:
   1. `supabase/migrations/0001_init.sql` — tabela `leads` + RLS
   2. `supabase/migrations/0002_scheduling.sql` — `doctors`, `availability_rules`, `availability_overrides`, `appointments` + exclusion constraint anti-double-booking + seed de 2 médicos com horários Seg-Sex 09:00-18:00
   3. `supabase/migrations/0003_profiles_auth.sql` — enum `user_role`, tabela `profiles`, trigger `handle_new_user`, função `is_admin()`, policies de admin em `leads`/`appointments`/`doctors`
   4. `supabase/migrations/0004_portal.sql` — `orders`, `payments`, `message_threads`, `messages`, `health_log` + RLS por paciente
4. Verifique que a extensão `btree_gist` está habilitada (é automática via `create extension if not exists` no 0002).
5. No painel Authentication → Providers → Email, ative Email + Password. Para evitar o passo de confirmação por email enquanto desenvolve, desligue "Confirm email". A app lida com ambos os casos.

### Como promover um usuário a admin

Depois de criar uma conta pelo `/cadastrar`, rode no SQL editor:

```sql
update profiles
   set role = 'admin'
 where id = (select id from auth.users where email = 'voce@exemplo.com');
```

Faça logout + login de novo e você será redirecionado para `/admin`.

## Políticas de RLS (resumo)

- **leads**: `anon` INSERT só com `consentimento_lgpd = true`; SELECT/UPDATE apenas por admins (`is_admin()`).
- **doctors / availability_rules / availability_overrides**: leitura pública quando `active = true`; gravação apenas por admins.
- **appointments**: `anon` INSERT apenas como guest (sem `patient_id`); autenticados SELECT apenas próprios; admins SELECT/UPDATE tudo. A constraint `exclude using gist` impede double-booking a nível de banco.
- **profiles**: usuários leem/atualizam só o próprio; admins leem todos.
- **orders / payments / message_threads / messages / health_log**: pacientes leem/escrevem só os seus; admins leem tudo.

## DigitalOcean App Platform deploy

A app é detectada automaticamente como Node.js pelo buildpack do App Platform:

1. Conecte o repositório GitHub no painel do DO App Platform
2. Selecione esta branch (ou `main` após o merge)
3. O buildpack detecta `package.json` e usa:
   - **Build command**: `npm run build`
   - **Run command**: `npm start`
   - **Node version**: 22.x (definido em `engines.node`)
4. Adicione todas as variáveis de ambiente da seção abaixo como **Encrypted env vars** no painel
5. Aponte seu domínio (DNS → CNAME para o host fornecido pelo DO)
6. Cada push na branch dispara um novo deploy automaticamente

> O `.npmrc` do projeto define `legacy-peer-deps=true` para evitar conflitos de peer-dep durante a transição do ecossistema React 19.

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

## Edição de conteúdo

Todos os textos em pt-BR e as URLs de imagens placeholder estão centralizados em [`lib/content.ts`](./lib/content.ts). Edite esse arquivo para alterar headlines, preços, depoimentos, médicos, FAQ, imagens etc. — os componentes não possuem strings nem URLs de imagens hardcoded.

> **DEV PLACEHOLDER — remover antes do launch**: as fotos nos arrays `heroImages`, `resultsImages`, `doctorPhotos`, `metabolismImage` e `explainerImage` são do Unsplash (licença gratuita). Substitua por fotografia licenciada ou por fotos de pacientes com consentimento escrito antes de publicar. A `ResultsGallery` mantém um disclaimer visível dizendo que as imagens são ilustrativas.

## Escopos deferidos (ainda não implementados)

- **Gateway de pagamento real** (Mercado Pago / Stripe BR / Pagar.me). O schema em `0004_portal.sql` está pronto; `orders.payment_status` exibe dados placeholder no portal.
- **Geração automática de link de vídeo-consulta** (Daily / Jitsi / Zoom). O campo `appointments.video_link` é um texto livre — o admin cola o link ao confirmar.
- **Notificações por SMS / WhatsApp**. Só email via Resend nesta fase.
- **Chat em tempo real** — a página de mensagens lê mensagens existentes mas não usa Realtime. Atualização acontece no reload.
- **2FA para admin**. Apenas email + senha nesta fase.

## Aviso legal

**IMPORTANTE**: todos os textos legais (Política de Privacidade, Termos de Uso, Política de
Reembolso, Consentimento Médico, LGPD) são **modelos placeholder** e devem ser revisados por
advogado brasileiro especializado em saúde e direito digital antes de publicação comercial.
A publicidade e a prática de telemedicina no Brasil estão sujeitas às normas da ANVISA, do
CFM (Res. 2.314/2022), do Código de Defesa do Consumidor e da LGPD. Claims médicos,
depoimentos de pacientes e imagens "antes/depois" exigem cuidado adicional — valide com o
compliance médico antes de publicar.
