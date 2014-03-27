# The `src/common/` Directory

The `src/common/` directory houses internal and third-party re-usable
components. Essentially, this folder is for everything that isn't completely
specific to this application.

Each component resides in its own directory that may then be structured any way
the developer desires.
The build system will copy all .js files to the build directory with the proper directory structure.
Each specific component should be integrated into RequireJS configuration and used through a RequireJS require.

```
src/
  |- common/
  |  |- plusOne/
  |  |- angular-templatecache/
```

- `plusOne` - a simple directive to load a Google +1 Button on an element.
- `angular-templatecache` - a simple utility that allows to register templates to angular $templateCache.
    Useful in particular when the application it optimized and templates are inline within javascript.
