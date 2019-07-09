# AppSeed - App part

This is a sub-repository that consists of base code for building Enplug Player applications.

## Running, building and testing

Please refer to `package.json` `scripts` section for info on running the repository.

It consists of all the needed scripts, running in multiple configurations.

Depending on the environment one wants to release to, one of the versions may be used:

- `scriptname:prod`
- `scriptname:staging`
- `scriptname` without suffix for `development` environment

## Project structure

This project aims at providing basic info and codebase to get started with writing own Enplug Apps. Most of the code resides in `src/app`:

- `app.component.*` files contain basic component code. It triggers `start()` command of the Player
- `app.module.ts` is the main module entry
- `enplug.service.ts` consists of simple service that proxies Enplug Player methods. It's recommended to separate Player calls and component code that way.
- `translation.initializer.ts` consists of code used to bootstrap translation engine for the App

As with any other standard `Angular` app, `environments` directory may be used to provide environment-specific variables to the code.

## Further help - Angular CLI

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
