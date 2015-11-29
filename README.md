# app-seed - the seed for DisplayOS apps
This project is an application skeleton for a typical DisplayOS web-based app. You can use it to quickly bootstrap your DisplayOS webapp projects and dev environment for these projects.

Learn more about building apps for DisplayOS using the web extension SDK: https://developers..com/guides/building-web-page-app-extension/

## Getting Started
To get you started you can simply clone the app-seed repository and install the dependencies:

### Prerequisites
You need git to clone the app-seed repository. You can get git from http://git-scm.com/.

We also use a number of node.js tools to initialize. You must have node.js and its package manager (npm) installed. You can get them from http://nodejs.org/.

### Clone app-seed
Clone the app-seed repository using [git](http://git-scm.com/):
```
git clone https://github.com/enplug/app-seed.git
cd app-seed
```
If you just want to start a new project without the app-seed commit history then you can do:
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
If you'll be deploying your app on S3, you need to add an aws.private.json file containing your credentials in this format:
```
{
    "accessKeyId": "<your-aws-access-key-id>",
    "secretAccessKey": "<your-aws-secret-access-key>"
}
```
If you won't be using S3, you can remove the Grunt task by removing the `aws.js` file in the `/grunt` directory.

### Install Dependencies
We have two kinds of dependencies in this project: tools and DisplayOS framework code. The tools help us manage and test the application.
- We get the tools we depend upon via `npm`, the [node package manager](https://www.npmjs.org/).
- We get the sdk code via `bower`, a [client-side code package manager](http://bower.io/).

First, install the tools from the main directory:
```
npm install
```
This will install bower. Then install the web dependencies for the dashboard component:
```
bower install
```

You should find that you have two new folders in your project.

- `/node_modules` - contains the npm packages for the tools we need
- `/bower_components` - contains the DisplayOS framework files

## Developing

There are two commands to use when developing:
- `grunt build`: builds the project, placing it in the `dist/` folder. Point your local web server to the `dist/` directory to run your app.
- `grunt develop` (optional): compiles your files (Javascript, HTML, images, CSS) as you change them.
