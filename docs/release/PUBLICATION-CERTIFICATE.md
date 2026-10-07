# PUBLICATION CERTIFICATE — Niki (61 Gate 9 + 62)

Auditoría: 2026-09-28 · re-auditado 2026-10-06 (producción = `461f48e` en `/api/version`)

| Punto | Estado | Evidencia |
|---|---|---|
| GitHub `raulvalerion-bit/Niki` = `origin` = Vercel Connected Git Repository | ✅ | ESTADO.md (2026-09-22) + `git remote` + despliegues con `githubRepo: Niki` |
| Production Branch `main`, auto-deploy sin `vercel --prod` | ✅ | 3 pushes hoy se publicaron solos: `5477556` y `de50a9e` visibles en `/api/version` |
| Producción = commit auditado | ✅ | `/api/version` → `de50a9ee…` = `RELEASE-MANIFEST.json` |
| Dominio `holaniki.com` + SSL + `www` → 308 | ✅ | verificado 2026-09-25; HSTS activo |
| Callbacks / webhooks en el dominio final | ✅ | webhook Hotmart en `https://holaniki.com/api/hotmart/webhook`; login con código por correo en el dominio |
| Cabeceras de seguridad en la URL real | ✅ | CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (curl 2026-09-28) |
| robots.txt / sitemap.xml / Open Graph | ✅ | 200 en local y producción tras `de50a9e` |
| CI (lint + tipos + 21 pruebas + build + npm audit) | ✅ | GitHub Actions `success` en `5477556` |
| Supabase project-ref | ✅ | `yniyllfhoydkdqowiunr` (único proyecto de la cuenta) |
| Historial de migraciones remoto = local | ⚠️ | desfase documentado en `RELEASE-MANIFEST.json` |
| Clean-room (clon limpio + proyecto vacío) | ⛔ NO VERIFICADO | requiere un proyecto de Supabase nuevo |
| Ambientes separados (Preview/Development con otra base) | ⚠️ | Preview y local usan la base de producción |
| Respaldos y restauración cronometrada | ⚠️ | Supabase Pro desde 2026-09-28 → respaldos diarios automáticos; restauración cronometrada NO probada |
| Plan de hosting comercial | ✅ | Vercel Pro desde 2026-09-28 |
| Dependencias sin vulnerabilidades | ✅ | Next.js 16.3.5 tenía una falla CRÍTICA (RCE en next/og) → 16.4.0; `npm audit --omit=dev` = 0 (2026-10-06) |
| Secretos fuera del repo | ✅ | `.env.local` en `.gitignore`; claves marcadas Sensitive en Vercel |
