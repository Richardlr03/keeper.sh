# Local Keeper.sh test

This runs the self-hosted standalone image, including the Pro feature set, at
<http://localhost:8787>. PostgreSQL, Redis, the API, worker, cron service, web
application, and MCP server are included in the container.

## Start

Start Docker Desktop, then run these commands from this directory:

```powershell
docker compose pull
docker compose up -d
docker compose ps
```

Follow startup logs with:

```powershell
docker compose logs -f keeper
```

## OAuth callbacks

Configure these exact Web application redirect URIs with the providers:

- Google: `http://localhost:8787/api/sources/callback/google`
- Microsoft: `http://localhost:8787/api/sources/callback/outlook`

Add the resulting client IDs and secrets to `.env`, then apply them with:

```powershell
docker compose up -d --force-recreate
```

Leave `WEBHOOK_PUBLIC_URL` unset locally. Scheduled polling works on localhost,
but Google and Microsoft cannot deliver push notifications to it.

## Stop

Stop the application without deleting its database:

```powershell
docker compose down
```

Do not add `--volumes` unless you intentionally want to delete all local Keeper
data and start over.
