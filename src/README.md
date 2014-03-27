# The `src` Directory

## Overview

The `src/` directory contains all code used in the application.

```
src/
  |- app/
  |  |- about/
  |  |- home/
  |  |- app.js
  |- assets/
  |- common/
  |  |- plusOne/
  |- less/
  |  |- home/
  |  |- main.less
  |  |- variables.less
  |- index.html
```

- `src/app/` - application-specific code, i.e. code not likely to be reused in
  another application. [Read more &raquo;](app/README.md)
- `src/assets/` - static files like fonts and images. 
  [Read more &raquo;](assets/README.md)
- `src/common/` - third-party libraries or components likely to be reused in
  another application. [Read more &raquo;](common/README.md)
- `src/less/` - LESS CSS files. [Read more &raquo;](less/README.md)
- `src/index.html` - this is the HTML document of the single-page application.
  See below.

See each directory for a detailed explanation.

## `index.html`

The `index.html` file is the HTML document of the single-page application (SPA)
that should contain all markup that applies to everything in the app, such as
the header and footer. It declares with `ngApp` the main application, which has
deferred bootstrap that occurs at app/bootstrap.js,
also specifies the main `AppCtrl` controller, and contains the `ngView` directive
into which route templates are placed.

Being a RequireJS application, it is expected that the application only contains one script definition,
pointing to RequireJS library, and indicating to RequireJS where does the RequireJS config resides.

Unlike any other HTML document (e.g. the templates), `index.html` is compiled as
a Grunt template, so variables from `Gruntfile.js` and `package.json` can be
referenced from within it. Changing `name` in `package.json` from
"angular-enterprise-kickstart" will rename the resultant CSS and JavaScript placed in `build/`,
so this HTML references them by variable for convenience.
