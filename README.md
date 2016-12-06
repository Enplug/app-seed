# App Seed - Example App Branch

Learn more about building apps through our SDK: https://developers.enplug.com/

## Getting Started
To get you started, you can simply clone this repository and install the dependencies with `npm install`.

```
git clone https://github.com/enplug/app-seed.git
```

### Install Dependencies
We have moved to an entirely NPM managed dependency system. The devDependencies are the tools used to build the app (like [webpack](https://webpack.github.io/)) and the regular dependencies are everything you need to run the app in your browser (like the [dashboard-sdk](https://github.com/Enplug/dashboard-sdk)).
- Everything is installed via `npm`, the [node package manager](https://www.npmjs.org/). NPM scripts are used to perform the build operations listed below as well.

### Set up Amazon S3 credentials
If you'll be deploying your app on S3, you need to add an `aws.private.json` file containing your credentials in this format in the root of your project directory:
```
{
    "accessKeyId": "<your-aws-access-key-id>",
    "secretAccessKey": "<your-aws-secret-access-key>"
}
```
### Build Setup
As shown in this app, we are using `Webpack` as a build and development tool. There are two configuration files, one for the `dashboard` part of your project, and one for the `player` or app portion of the project. Both of these are contained in separate subdirectories under `src/`.

When the application is built it will be in the `dist/` directory. You can point a local web server to the dist/ directory if you want to preview the production build locally.

![Npm run dev](./img/webpack-server.png)

### Scripts
There are only a few commands that you will need to use:

`npm install`: installs application dependencies.  

`npm run build`: builds a production version of the project placing it in the dist/directory. It allows you to chose between the dashboard or app portion of the application to build.

`npm run dev`: this is for development. It will first build then spin up a webpack-dev-server and enable hot module reloading.  

`npm run release`: this is for deploying your project. If you choose to deploy to S3, you will need to do additional configuration to the package.json and script to match your credentials/bucket information.

## Dashboard App Configuration

### Create App

In order to render your application through the Enplug dashboard, you must create a new app under your account and configure the settings, including the app's name, urls, screen orientations, icon, etc: `dashboard.enplug.com/developers`.

![App Creation](./img/developers-template.png)

### App Urls

Under the settings tab, select web application and enter the two urls for both the dashboard and player/app portions.

If working locally, these should point to your computer's IP address, corresponding with the port numbers listed in the package.json. When your ready to deploy, you should enter your S3 buckets or urls of your hosted application instead.

![Url Configuration](./img/app-urls.png)

The Dashboard url for the local dev server is configured by default to use `https`, while the app/player portion of the application must use `http` to render in our player. If you would like to change the dashboard configuration to use http instead, remove the `--https` argument from the build script on line 87:

![Build Script](./img/build-script.png)

Finally, run `npm run dev` locally to spin up your server and select your newly created app from the `Apps` dropdown. Check to ensure that there are no SSL errors by going to the url directly in your browser. If a privacy error is shown, select proceed under the advanced tab.

## Dashboard SDK
![Player ScreenShot](./img/dashboard-graphic.png)
[Dashboard SDK - Github](https://github.com/Enplug/dashboard-sdk)

The Dashboard SDK is used to create the interface for saving, editing and deploying different content to your display. For the dashboard application of this app, we are passing in `$enplugDashboard` and `$enplugAccount` as dependencies, both of which are provided through the SDK.

We use `$enplugDashboard` to interact and modify the dashboard display. For example, adding a header button for saving.

Additionally, we use `$enplugAccount` to store various types of data and properties we might need when displaying content, such as a title or video url.

The data we store is encapsulated in an `asset` object using the `$enplugAccount.saveAsset()` endpoint. For example, an asset might look like the following:

```js
{
  Id: 123456789,
  Value: {
      title: "This is Enplug - YouTube Video",
      url: "https://www.youtube.com/watch?v=kk3aVzReXaE"
  },
  VenueIds: []
}
```

## Player SDK

![Player ScreenShot](./img/player-screenshot.png)
[Player SDK - Github](https://github.com/Enplug/js-player-sdk)

In the player portion of our applications, we are able to use the Player SDK methods to effectively grab our asset data stored in the Value object, load our content, then start the enplug player

We use several different methods in our player application including `enplug.appStatus.start()` which tells the player it's ready to be rendered, and `enplug.appStatus.hide()` to let the server know when our video is done playing.

For more information about these SDK methods, please feel free to take a look at our API documentation: https://developers.enplug.com/api-reference/.
