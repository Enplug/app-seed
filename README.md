# App Seed

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

## Node Modules fix

As there are some inconsistencies in libraries used by subproject libraries, running each normally may cause errors to show up in the console. 

In order to suppress them, patching script (`fix-node-modules.js`) was added to the repository. It's run after installing node_modules in both of the subprojects.
