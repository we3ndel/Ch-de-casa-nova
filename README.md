# Chá de Casa Nova — lista de presentes

Site da lista (`index.html`) + API serverless na Vercel (`api/`).

## Publicar na Vercel

1. Em vercel.com → **Add New → Project** → importe este repositório (sem framework, sem build).
2. No projeto: **Storage → Create/Connect → Upstash for Redis** (plano grátis). Isso cria `KV_REST_API_URL` e `KV_REST_API_TOKEN` sozinho.
3. **Settings → Environment Variables**: adicione `ADMIN_PASSWORD` com uma senha sua.
4. **Redeploy**.

## Uso

- Convidados: abrem o link, tocam num item, escrevem o nome e confirmam. O item some da lista para todos.
- Anfitrião: abra `https://SEU-SITE.vercel.app/?admin` e digite a senha. Aparece o painel para definir data, horário, local e WhatsApp, ver quem escolheu cada item e liberar reservas. `?sair` desloga.
- Sem o banco configurado, o site funciona no modo WhatsApp (o convidado avisa por mensagem).
