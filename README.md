# App Seed

This is a seed project for Enplug Apps. It consists of two subprojects:

- `app` used for displaying content on the Enplug Player. Normally it communicates with the Player API to generate content to be displayed, based on asset data
- `dashboard` for configuring assets - the content that will be displayed on the screens.

Neither subproject is ejected, meaning all the config happens through `angular.json`.

## Migration Status

> **The two subprojects are currently on different stacks.** Only `dashboard` has been migrated; `app` is still the legacy seed and will be migrated later.

| Subproject | Status | Stack | Package manager | How it serves locally |
|------------|--------|-------|-----------------|-----------------------|
| `dashboard` | Migrated | Angular 21, standalone components, Biome | pnpm (11.9.0 pinned) | `pnpm start` — reads certs from `cert/` via `angular.json` |
| `app` | Pending migration | Legacy Angular, NgModules | npm/yarn + `@enplug/scripts` | `npm run start:ssl` — reads certs from `dev.private.json` |

Until `app` is migrated, keep in mind that commands, tooling, and Node versions differ between the two folders: everything documented below for the dashboard (pnpm, Biome, `cert/` folder) does **not** apply to `app` yet.

## Using the project

Just clone it, remove all the App Seed references:

- in `package.json`s of respective subrepos
- in main `src/app` files
- in `AWS` configs (if needed), residing in each `package.json`
- in each of `angular.json` (new project references and project names)

to your own project name and begin editing the files!

If you need to share some resources between `app` and `dashboard`, it's recommended to keep them in `shared` directory.

## SSL Certificates

The development servers run over HTTPS, so you need local SSL certificates before starting either subproject.

> **Important:** Certificates are personal development files and must **never be committed**. The `cert/` folder is listed in `.gitignore` — keep it that way.

### Generating the certificates

Prerequisites:
- `openssl` application

The repository already includes the required `openssl.conf` at the root (wildcards for `*.enplug.in` and `*.enplug.com`, which cover `localhost.enplug.in`).

From the repository root, run:

```bash
openssl req -x509 -sha256 -nodes -days 3650 -newkey rsa:2048 -keyout key.pem -out certificate.pem -config openssl.conf

# Optional: inspect the generated certificate
openssl x509 -text -noout -in certificate.pem

# Export it for the system trust store
openssl pkcs12 -inkey key.pem -in certificate.pem -export -out certificate.p12
```

### Naming and placement (required)

The generated files must keep **exactly these names** and live in the `cert/` folder at the repository root:

```
app-seed/
├── cert/
│   ├── certificate.pem
│   └── key.pem
```

```bash
mkdir -p cert
mv certificate.pem key.pem cert/
```

The dashboard's `angular.json` points to `../cert/certificate.pem` and `../cert/key.pem` — with any other name or location, `pnpm start` fails.

### Installing the certificate

Add `certificate.p12` to the system's trusted certificates so the browser accepts the local HTTPS server:

- **macOS:** Open Keychain Access → Import → mark the certificate as "Always Trust"
- **Windows:** [Microsoft guide](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754841(v=ws.11))

### Adding hosts

Edit `/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows) and add:

```
127.0.0.1 localhost.enplug.in
127.0.0.1 localhost.enplug.com
```

### Running with SSL

**Dashboard (migrated):** nothing else to configure — `angular.json` already reads the certificates from `cert/`:

```bash
cd dashboard && pnpm start
```

The dashboard runs on `https://localhost.enplug.in:50000/`.

**App (legacy, pending migration):** still uses the old `@enplug/scripts` flow. Create a `dev.private.json` in `app/` pointing to the same certificates:

```json
{
  "cert": "../cert/certificate.pem",
  "key": "../cert/key.pem"
}
```

Then run `npm run start:ssl` inside `app/`. It runs on `https://localhost.enplug.com:50001/`.
