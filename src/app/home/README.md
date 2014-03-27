# The `src/app/home` Directory

## Overview

```
src/
  |- app/
  |  |- home/
  |  |  |- index.js
  |  |  |- module.js
  |  |  |- routes.js
  |  |  |- controllers/
  |  |  |- services/
  |  |  |- routes/
```

- `index.js` - defines the module loader. Is basically an empty script indicating the loading of all other module pieces.
- `module.js` - Main module (app.home) declaration.
- `routes.js` - Define module routes.
- `controllers/` - Controllers sub module folder
- `services/` - Services sub module folder
- `partials/` - Partials sub module folder

Home Module depicts a complex module for the application where each of the different
pieces of the app are contained within a sub-module, for example controllers or services.

This module follows the recommended AngularJS code structure where each different section is controlled by a different sub module
so for example, one sub module for controllers and another one for services.
There are other alternatives like structuring the code per functionality, for example, having a products module, or clients module,
and integrating all controllers, services and others inside of those.

## `index.js`

Defines the module loader. Is basically an empty script indicating the loading of all other module pieces.

## `module.js`

Main module (app.home) declaration.
Defined in its own file to be able to import/require it on other files.

## `routes.js`

Define the module routes.

## `controllers/`

Contains the controllers sub module.
Each sub module is composed by an index (loader), module definition, and N files for each of the module entities,
in this specific case, controllers.
This arrangements allows to have each of the entities in one file, that when you have mid-size controllers is highly valuable.

## `services/`

Contains the services sub module.
Same as controllers sub-module but with services.

## `partials/`

Contains the partials that should be loaded and cached.

## `partials/partial.js`

Loads the partial via RequireJS text plugin, and should be declared
as part of the module dependencies. Example:

`'text!./partials/home.tpl.html'`

All partials should be listed as module dependencies, and assigned as arguments, as seen with argument `homeTpl`.
RequireJS will ensure that when the module executes all the templates have been already loaded.
Later an object relating the template url, and template text should be created.
This object is the one used by the utility AngularTemplateCache to register the templates to the proper urls.