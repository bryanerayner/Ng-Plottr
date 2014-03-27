# The `src/app/about` Directory

## Overview

```
src/
  |- app/
  |  |- about/
  |  |  |- index.js
  |  |  |- module.js
  |  |  |- partials.js
  |  |  |- home-srv1.js
  |  |  |- about.tpl.html
```

About Module depicts a very simple, small module for the application where
mostly everything is attached to the main module (module.js / "app.about").

- `index.js` - defines the module loader. Is basically an empty script indicating the loading of all other module pieces.
- `module.js` - Main module (app.about) declaration.
- `home-srv1.js` - Controllers file definition into main module.
- `routes.js` - Define module routes.
- `partials.js` - Define a sub module to load the partials, and integrate them within AngularJS cache.
    To load partials the requireJS-text plugin is used.
- `about.tpl.html` - the route template.

