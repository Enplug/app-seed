# AppSeed - App part

This is a sub-repository that consists of base code for building Enplug Player applications.

## Running, building and testing

Please refer to `package.json` `scripts` section for info on running the repository.

It consists of all the needed scripts, running in multiple configurations.

## Project structure

This project aims at providing basic info and codebase to get started with writing own Enplug Apps. Most of the code resides in `src/app`:

- `index.html` content
- `app.component.*` files contain basic component code. It triggers `start()` command of the Player
- `app.module.ts` is the main module entry
- `enplug.service.ts` consists of simple service that proxies Enplug Player methods. It's recommended to separate Player calls and component code that way.
- `translation.initializer.ts` consists of code used to bootstrap translation engine for the App

As with any other standard `Angular` app, `environments` directory may be used to provide environment-specific variables to the code.

## Linting

This repository uses extended set of lint rules, including ordering imports, standard SCSS linter and more. 

If one decides to follow practices included in the repository, we recommend installing proper extensions to IDE of choice (`stylelint` + `tslint`). 

Another way of running checks is to run either `npm run lint` or `npm run lint:fix` (linting with safe auto-fixers).

## Running the app

In order to run app normally, just run proper `start` script. If you want to run the app in SSL mode, follow guidelines from main README.md first and then use `start:ssl` script.

## Further help - Angular CLI

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
