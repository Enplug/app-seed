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

## Local development
### Installing node
This project uses a node version 12 or higher, so we recommend you to use a node version manager such a [nvm](https://github.com/nvm-sh/nvm) so it's easier to install new node versions and switch between them. 

To run local app dashboard build it must be served via HTTPS. To do that developer must generate a certificate and add it to Trusted Root Certification Authorities.
### Generating the certificate
#### Prerequisites
* openssl application

Create a file openssl.conf with the content below:
```
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

Go to your openssl.conf file directory and run these commands:
```
openssl req -x509 -sha256 -nodes -days 3650 -newkey rsa:2048 -keyout key.pem -out certificate.pem -config openssl.conf
openssl x509 -text -noout -in certificate.pem
openssl pkcs12 -inkey key.pem -in certificate.pem -export -out certificate.p12
openssl pkcs12 -in certificate.p12 -noout -info
```

### Installing the certificate
Add a development certificate certificate.p12 to trusted certificates. This will allow the development server to run on HTTPS without errors. Here is [how you can add a certificate.](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754841(v=ws.11)?redirectedfrom=MSDN)

### Adding hosts
On Windows, in a text editor run with admin privileges, open C:\Windows\System32\drivers\etc\hosts file and add the following:
```
# for app dev
127.0.0.1 localhost.enplug.in
# for dashboard dev
127.0.0.1 local-dashboard.enplug.in
```

### Adding dev.private.json
HTTPS dev-server requires certificate and key files. 

In the project root directory create dev.private.json file and set proper files paths.
```
{
  "cert": "P:/enplug/_certs/certificate.pem",
  "key": "P:/enplug/_certs/key.pem"
}
```
### Installing npm packages
You must have access to the Enplug's packages in npm so you can download all of the required project dependencies. To login you must run `npm login` in a terminal and put your credentials. Then you can proceed to execute `yarn install`

### Running the seed with SSL

After following steps above (remember to put `*.private.json` files in respective folders!) just run `npm run start:ssl`. 

This will use `@enplug/scripts` script called `enplug-serve` that will interpret entries in `*.private.json` file and use them for securely serving the content.

## Crowdin: translation service config

- log into the [crowdin page](https://crowdin.com).
- In projects tab, select `Enplug>settings>files`. 
- Find your app inside the apps tree directory. 
- In your local `app-seed` code looking for the `app/package.json` file and replace this:

```
 "crowdin": {
      "crowdinPath": "TODO: UPDATE APP_ID: /apps/APP_ID/app/en.json",
      "localPath": "src/assets/i18n/en.json"
    }
```

to:
(YOUR_APP_NAME is the name of the app you found on the `crowdin page`)

```
 "crowdin": {
      "crowdinPath": "/apps/YOUR_APP_NAME/app/en.json",
      "localPath": "src/assets/i18n/en.json"
    }
```
- Repeat the previous step in the `dashboard/package.json` file.
- Inside of `dashboard` folder in your `terminal` type this:
```
yarn i18n:find
```

## Release to staging

- Inside of `dashboard` folder in your `terminal` type this:
```
yarn release:staging
```
- When prompt options, you must select `apps.enplug.in`.
- Answer `Y` when ask for `updating URLs to staging` and `Do you confirm the uploaded to S3`.

- Inside of `app` folder in your `terminal` type this:
```
yarn release:staging
```
- When prompt options, you must select `apps.enplug.in`.
- Answer `Y` when ask for `updating URLs to staging` and `Do you confirm the uploaded to S3`.
