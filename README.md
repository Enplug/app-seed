# sdk-seed - the seed for Enplug apps
This project is an application skeleton for a typical Enplug web-based app. You can use it to quickly bootstrap your Enplug webapp projects and dev environment for these projects.

Learn more about building apps for DisplayOS using the web extension SDK: https://developers.enplug.com/guides/building-web-page-app-extension/

## Getting Started
To get you started you can simply clone the sdk-seed repository and install the dependencies:

### Prerequisites
You need git to clone the sdk-seed repository. You can get git from http://git-scm.com/.

We also use a number of node.js tools to initialize. You must have node.js and its package manager (npm) installed. You can get them from http://nodejs.org/.

### Clone sdk-seed
Clone the sdk-seed repository using [git](http://git-scm.com/):
```
git clone https://github.com/enplug/sdk-seed.git
cd sdk-seed
```
If you just want to start a new project without the sdk-seed commit history then you can do:
```
git clone https://github.com/enplug/sdk-seed.git <your-project-name>
cd <your-project-name>
rm -rf .git
git init
git remote add origin <your-remote-repository-url>
git add -A
git commit -m 'Initial commit'
git push -u origin master
```

### Install Dependencies
We have two kinds of dependencies in this project: tools and enplug framework code. The tools help us manage and test the application.
- We get the tools we depend upon via `npm`, the [node package manager](https://www.npmjs.org/).
- We get the sdk code via `bower`, a [client-side code package manager](http://bower.io/).

First install the tools:
```
npm install
```
which will install bower. Then install the web dependencies for the dashboard component:
```
cd src/dashboard
bower install
```

You should find that you have two new folders in your project.

- `node_modules` - contains the npm packages for the tools we need
- `src/[app/dashboard]/bower_components` - contains the enplug framework files

## Developing
Point your local web server to the `dist/` folder of your project. This is where the built files will be put.

There are two commands to use when developing:
- `grunt build`: builds the project, placing it in the `dist/` folder.
- `grunt develop` (optional): compiles your files (Javascript, HTML, images, CSS) as you change them.
