# The `src` Directory

## Overview

The `test/` directory contains all application test code.

```
test/
  |- config/
  |- e2e/
  |- unit/
  |  |- home/
  |     |- home.spec.js
  |  |- app.spec.js/
  |- test_requirejs_config.js/
```

- `config` - Test configuration files.
- `e2e` - E2E Tests run by Protractor.
- `unit` - Unit Test base directory.
- `unit/home/` - Home module specific tests.
- `unit/app.spec.js` - General application test spec.
- `test_require_js_config.js` - RequireJS configuration for unit testing.
