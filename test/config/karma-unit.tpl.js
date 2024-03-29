module.exports = function(config) {
  config.set({
    /** 
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      'test/test_requirejs_config.js',
      <% scripts.forEach( function ( file ) { %>{pattern: '<%= file %>', included: false},
      <% }); %>
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'src/**/*.coffee', included: false},
      {pattern: 'src/**/*.html', included: false},
      {pattern: 'test/unit/**/*.js', included: false},
      {pattern: 'test/unit/**/*.coffee', included: false}
    ],
    exclude: [
      'src/assets/**/*.js'
    ],
    frameworks: [ 'jasmine', 'requirejs'],
    plugins: [ 'karma-jasmine', 'karma-requirejs', 'karma-firefox-launcher', 'karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-coffee-preprocessor' ],
    preprocessors: {
      '**/*.coffee': 'coffee',
    },

    /**
     * How to report, by default.
     */
    reporters: 'dots',

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    urlRoot: '/',

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /** 
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'Chrome'
    ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  });
};

