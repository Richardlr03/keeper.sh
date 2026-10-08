# Keeper on Azure for Students

This folder runs the Keeper standalone image on a small Ubuntu VM. The service
listens only on the VM's loopback interface. Tailscale Serve supplies the private
HTTPS address, so no domain purchase or public web port is required.

## VM requirements

- Ubuntu Server 24.04 LTS, x64
- `Standard_B2ats_v2` (the 12-month free AMD VM size)
- Standard SSD OS disk
- A 4 GB swap file because the free VM has only 1 GB RAM
- A public IP for outbound internet access, with no public Keeper ports opened

## Deploy

Copy this directory to `~/keeper` on the VM. Then:

```bash
cd ~/keeper
cp .env.example .env
nano .env
docker compose config --quiet
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=100 keeper
```

After the container is healthy, publish it privately through Tailscale:

```bash
sudo tailscale serve --bg 8080
tailscale serve status
```

Only devices logged into the same Tailscale account can open the generated
`https://keeper.<tailnet>.ts.net` address.

## OAuth callbacks

Replace `<keeper-url>` with the exact Tailscale HTTPS address:

- Google redirect URI: `<keeper-url>/api/sources/callback/google`
- Microsoft redirect URI: `<keeper-url>/api/sources/callback/outlook`
- Google authorized JavaScript origin: `<keeper-url>`

Keep `WEBHOOK_PUBLIC_URL` unset. Scheduled polling will still synchronize the
calendars without exposing the app publicly.
