# The `src/app` Directory

## Overview

```
src/
  |- app/
  |  |- home/
  |  |- about/
  |  |- app.js
  |  |- bootstrap.js
  |  |- requirejs_config.js
```

The `src/app` directory contains all code specific to this application. Apart
from `app.js`, this directory is
filled with subdirectories corresponding to high-level sections of the
application, often corresponding to top-level routes. Each directory can have as
many subdirectories as it needs, and the build system will understand what to
do. For example, a top-level route might be "products", which would be a folder
within the `src/app` directory that conceptually corresponds to the top-level
route `/products`, though this is in no way enforced. Products may then have
subdirectories for "create", "view", "search", etc. The "view" submodule may
then define a route of `/products/:id`, ad infinitum.

As the project is quite minimal, take a look at the two provided submodules
to gain a better understanding of how these are used as well as to get a
glimpse of how powerful this simple construct can be.


## `requirejs_config.js`

This is the RequireJS main configuration file.
The RequireJS configuration file is structure the following way
 - paths: Section that declares all external libraries used among the project and their paths.
 - shim: Section that declares the relationship between the external libraries, indicating what library depends on anoter.
        For example, if angularMocks depends on angular, what will occur at runtime is that when requiring angularMocks,
        RequireJS will ensure angular is either already loaded or loaded first.
 - deps: Indicates that after the RequireJS config has been processed, it will execute the script bootstrap.js
        which bootstraps the application.

As a side comment, the paths declared at the paths section does not mean that those libraries will strictly be loaded in the app.
There can be libraries declared in the config files, that if none of the application source files requires them,
they won't be loaded at runtime.

At the end fo the file, can also be found a defer_bootstrap mechanism.

window.name = "NG_DEFER_BOOTSTRAP!";

For reference see: //http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
Basically this sentence tells AngularJS to not bootstrap the application until indicated, which occurs at bootstrap.js.

## `bootstrap.js`

The bootstrap file bootstrap the AngularJS application after the RequireJS config has been processed.
The script as many of the other scripts within the app start with the define declaration.
Define declaration is the approach used by RequireJS to define modules.
Modules can also have dependencies, as in this case the module depends on require, angular and app.
The require dependency is RequireJS, the angular dependency can be found within requirejs_config and
the app dependency is found relatively based on requirejs_config location.
By default when specifying a dependency either RequireJS will look it up at the require_config.
If not found there, it will look it up relatively to the path of the script being executed.
As a final note, all the modules indicated as dependencies will be loaded first, prior to executing the current module code.

There is also another alternative to load dependencies asynchronously, but for more information review the RequireJS documentation.

As implementation, bootstrap uses a RequireJS plugin called domReady, which fires an event once the dom is ready.
At that point we indicate that we wanted to bootstrap the application previously loaded by RequireJS, as the dependency `app`


## `app.js`

This is our main app configuration file. It kickstarts the whole process by
requiring all the application modules that we need. We must load these now to
ensure the routes are loaded. If as in our "products" example there are
subroutes, we only require the top-level module, and allow the submodules to
require their own submodules.
It has the same RequireJS structure starting by a Define.
It contains as dependency all the app wide libraries used, and also each of the modules index script,
which should be in charge of loading all the module specific files.

As comment, the modules from `src/common` should be required by the app
submodules that need them to ensure proper dependency handling. These are
app-wide dependencies that are required to assemble your app.

```js
angular.module( 'app', [
    'app.home',
    'app.about',
    'ui.router'
])
```

With app modules broken down in this way, all routing is performed by the
submodules we include, as that is where our app's functionality is really
defined.  So all we need to do in `app.js` is specify a default route to follow,
which route of course is defined in a submodule. In this case, our `home` module
is where we want to start, which has a defined route for `/home` in
`src/app/home/home.js`.

```js
.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})
```

Use the main applications run method to execute any code after services
have been instantiated.

```js
.run( function run () {
})
```

And then we define our main application controller. This is a good place for logic
not specific to the template or route, such as menu logic or page title wiring.

```js
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Angular-Enterprise-Kickstart' ;
    }
  });
})
```

