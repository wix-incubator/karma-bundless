// Karma configuration
// Generated on Sun May 29 2016 10:35:40 GMT+0300 (IDT)

var portRangeStart = process.env['CORE3_PORT_RANGE_START'];
var karmaPort = portRangeStart ? parseInt(portRangeStart) + 3: 9876;
var bundlessPort = portRangeStart ? parseInt(portRangeStart) + 5: 4000;

var bundless = require('./lib/plugin');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    plugins: [bundless, 'karma-mocha', 'karma-chrome-launcher', 'karma-env-reporter'],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'bundless'],

    bundless: {
      specs: [
        './test/e2e.spec.js'
      ],
      scripts: [
        'http://localhost:' + bundlessPort + '/modules/test/e2e.overrides.js'
      ],
      srcDir: '.',
      server: {
        port: bundlessPort
      }
    },



    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd'
      }
    },




    // list of files / patterns to load in the browser
    files: [],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['env'],


    // web server port
    port: karmaPort,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity

  });
}
