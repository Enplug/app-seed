# app-seed - the seed for DisplayOS apps
This project is an application skeleton for a typical DisplayOS web-based app. You can use it to quickly bootstrap your DisplayOS webapp projects and dev environment for these projects.

Learn more about building apps for DisplayOS using the web extension SDK: https://developers.enplug.com/guides/building-web-page-app-extension/

## Getting Started
To get you started you can simply clone the app-seed repository and install the dependencies with `npm install`.

### Prerequisites
You need git to clone the app-seed repository. You can get git from http://git-scm.com/.

We also use a number of node.js tools. To initialize your project you must have node.js and its package manager (npm) installed. You can get them from http://nodejs.org/. (NPM comes bundled with node.js)

### Clone app-seed
Clone the app-seed repository using [git](http://git-scm.com/).
Then remove the `.git` folder to clear out the link to this repository.
```
git clone https://github.com/enplug/app-seed.git <your-project-name>
cd <your-project-name>
rm -rf .git
rm README.md
git init
git remote add origin <your-remote-repository-url>
git add -A
git commit -m 'Initial commit'
git push -u origin master
```

### Set up Amazon S3 credentials
If you'll be deploying your app on S3, you need to add an aws.private.json file to the root directory of the project containing your credentials in this format:
```
{
    "accessKeyId": "<your-aws-access-key-id>",
    "secretAccessKey": "<your-aws-secret-access-key>"
}
```
If you won't be using S3, you can edit the node script `scripts/release.js` task to work with your deployment strategy.

### Install Dependencies
We have moved to an entirely NPM managed dependency system. The devDependencies are the tools used to build the app (like [webpack](https://webpack.github.io/)) and the regular dependencies are everything you need to run the app in your browser (like the [dashboard-sdk](https://github.com/Enplug/dashboard-sdk)).
- Everything is installed via `npm`, the [node package manager](https://www.npmjs.org/).
- The first time `npm install` is run the `scripts/init.js` script will run, this will ask you for the name of your application.

First install the tools:
```
npm install
```
which will then run the `postinstall` script that looks something like this:
```

> enplug-seed@2.0.0 postinstall /Users/rj/repos/enplug/app-seed
> node scripts/init.js


Removing post install init script
Resetting Version Numbers to 1.0.0

? Make sure to follow npm naming rules found here: https://docs.npmjs.com/files/package.json#name
What name do you want to use as a name for this app in package.json? <your-project-name>

Please commit the changes to package.json

```

You should find that a new folder has been created in your project and `package.json` has been edited.

- `node_modules` - contains the npm packages for the tools we need
- `package.json` - the version number is reset to 1.0.0, the postinstall script has been removed, and every instance of "enplug-seed" has been replaced with `<your-project-name>`

## Developing
This project now uses webpack as a build and development tool. There are two configuration files, one for the dashboard part of your project, and one for the player portion of the project.
[NPM Scripts](https://docs.npmjs.com/misc/scripts) are used to perform the build operations. You can take a look at them in the [package.json](https://github.com/Enplug/app-seed/blob/master/package.json) file.
When the application is built it will be in the `dist/` folder. You can point a local web server to the `dist/` folder if you want to preview the production build locally.

There are only a few commands that you will need to use:
- `npm run build`: builds a production version of the project placing it in the `dist/` folder.
- `npm run build:dashboard`: will run a production build of only the dashboard part of the application.
- `npm run build:app`: will run a production build of only the player part of the application.
- `npm run release`: this will build production versions of both the dashboard and player portions of the application then upload the `dist/` folder AWS S3.
- `npm run dev`: this is for development. It will spin up a [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) and enable hot module reloading for the dashboard and player applications.
- `npm run dev:app`: use this when you only want to develop the player portion of the application.
- `npm run dev:dashboard`: this is for when you only want to develop the dashboard portion of the application.
Note that you can also use `npm run dev:dash` and `npm run build:dash` if you don't want to write "dashboard" (that's one hands worths of keystrokes!)

## Notes on Configuration
Besides the `aws.private.json` file for your unique AWS credentials custom configuration of the bucket name and dev server port can be configured through the `package.json` [config](https://docs.npmjs.com/misc/config) property.
With a new project the config block will look like this:
```
{
  "ports": {
    "server": 50000
  },
  "build_env": "prod",
  "aws": {
    "buckets": [
      "TODO: insert.staging.bucket.name.here",
      "TODO: insert.production.bucket.name.here"
    ],
    "s3": {
      "region": "us-west-2",
      "sslEnabled": true,
      "apiVersion": "2016-05-01",
      "params": {
        "ACL": "public-read"
      }
    }
  }
}
```

The important bits are as follows:
- If you are developing more than one application you will need to make sure the `ports.server` values are different for each project if you plan to run the dev servers simultaneously.
- The `aws.buckets` array is used by the `scripts/release.js` file to upload to a specific AWS S3 Bucket. You will be prompted to select a bucket from this list everytime you execute `npm run release`
- The `aws.s3` property gets used as the `s3Options` object when constructing an S3 client via the [s3 npm package](https://www.npmjs.com/package/s3). `accessKeyId` and `secretAccessKey` are added from the `aws.private.json` file automatically.
- Make sure the `region` value matches the region for the bucket you are uploading to.
- As of now (Aug 2016) the `release` script will not create a new bucket, make sure it exits for your AWS account before you run your first `npm run release`
- Don't touch the `build_env` property unless you have read every file in the `scripts` directory, the two webpack config files (`webpack.config.app.js`, `webpack.config.dashboard.js`) and absolutely know what you are doing.


Happy Hacking! We can't wait to see what greatness you come up with for the Enplug community!
