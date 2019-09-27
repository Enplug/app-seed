# App Seed - Internal Enplug branch

This is a special version of App Seed targeted for Enplug's apps. It includes a preconfigured translation initialization and extraction setup.

This is a seed project for Enplug Apps. It consists of two subprojects:

- `app` used for displaying content on the Enplug Player. Normally it communicates with the Player API to generate content to be displayed, based on asset data
- `dashboard` for configuring assets - the content that will be displayed on the screens.

Both subprojects are built using Angular (8.x) and are not ejected, meaning all the config happens through `angular.json`.

## Using the project

Just clone it, remove all the App Seed references:

- in `package.json`s of respective subrepos
- in main `src/app` files
- in `AWS` configs (if needed), residing in each `package.json`
- in each of `angular.json` (new project references and project names)

to your own project name and begin editing the files!

If you need to share some resources between `app` and `dashboard`, it's recommended to keep them in `shared` directory.

## Running app with SSL enabled

If App needs to be run in an SSL mode, one needs to create proper certificates for using it with Enplug Dashboard.

Instructions below provide basic steps to create one and use locally with `enplug.in` domain (staging).

### Creating the certificate

Prerequisites:
- `openssl` application

Create a file openssl.conf with the content below:

```editorconfig
[req]
default_bits = 2048
default_keyfile = oats.key
encrypt_key = no
utf8 = yes
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = LA
L = LA
O  = Enplug
CN = *.enplug.in

[v3_req]
keyUsage = critical, digitalSignature, keyAgreement, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.enplug.in
DNS.2 = *.enplug.in
```

Go to your `openssl.conf` file directory and run these commands:

```bash
openssl req -x509 -sha256 -nodes -days 3650 -newkey rsa:2048 -keyout key.pem -out certificate.pem -config openssl.conf

openssl x509 -text -noout -in certificate.pem

openssl pkcs12 -inkey key.pem -in certificate.pem -export -out certificate.p12

openssl pkcs12 -in certificate.p12 -noout -info
```

### Installing the certificate
Add a development certificate certificate.p12 to trusted certificates. 

This will allow the development server to run on HTTPS without errors. 
Here is [how you can add a certificate on Windows](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754841(v=ws.11)).
Here is [how you can add a certificate on Mac](https://reactpaths.com/how-to-get-https-working-in-localhost-development-environment-f17de34af046)

### Adding dev.private.json
HTTPS dev-server requires certificate and key files. 
In the project root directory (separately for each `App Seed` and `Dashboard Seed`) create `dev.private.json` file and set proper files paths:

```json
{
  "cert": "PATH_TO_certificate.pem",
  "key": "PATH_TO_key.pem"
}
```

### Running the seed with SSL

After following steps above (remember to put `*.private.json` files in respective folders!) just run `npm run start:ssl`. 

This will use `@enplug/scripts` script called `enplug-serve` that will interpret entries in `*.private.json` file and use them for securely serving the content.
