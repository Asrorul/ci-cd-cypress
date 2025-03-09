import { defineConfig } from 'cypress';
import { Client } from 'pg';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import fs from 'fs';

require('dotenv').config();

const customComment: string = 'WebAutomation Cypress' + '12.7.0';

export default defineConfig({
  // Viewport configuration for test browser window
  viewportWidth: 1920,
  viewportHeight: 1080,

  // Timeout settings (in milliseconds)
  defaultCommandTimeout: 60000,    // Maximum time to wait for a command to complete
  requestTimeout: 30000,           // Maximum time to wait for an HTTP request
  responseTimeout: 50000,          // Maximum time to wait for an HTTP response
  pageLoadTimeout: 60000,          // Maximum time to wait for a page load
  
  // Browser security settings
  chromeWebSecurity: false,        // Disable web security to allow cross-origin requests
  
  // Test execution settings
  numTestsKeptInMemory: 0,        // Don't keep test results in memory (helps with memory usage)
  
  // Video recording configuration
  video: true,                     // Enable video recording for all test runs
  videoCompression: false,         // No compression for highest quality videos
  videoUploadOnPasses: false,      // Don't upload passing test videos to Cypress Cloud
  videosFolder: "cypress/videos",  // Where to save video recordings
  
  // Screenshot configuration
  screenshotsFolder: "cypress/screenshots",  // Where to save failure screenshots
  
  // Asset management
  trashAssetsBeforeRuns: true,    // Clean up old videos/screenshots before each run
  
  // Test reporting configuration
  reporter: '../node_modules/mochawesome',
  reporterOptions: {
    charts: true,                  // Include charts in the report
    overwrite: false,             // Don't overwrite old reports
    html: false,                  // Don't generate HTML report
    json: true,                   // Generate JSON report
    reportDir: 'reports',         // Where to save reports
  },

  // Environment variables
  env: {
    grepFilterSpecs: true,        // Enable filtering specs by grep pattern
    // Add other environment variables here
  },

  e2e: {
    baseUrl: process.env.BASE_URL || 'https://google.com',  // Default URL for tests
    supportFile: './cypress/support/e2e.ts',                // Support file location
    specPattern: 'cypress/e2e/features/*.feature',          // Where to find test files
    testIsolation: false,                                   // Don't isolate test runs
    watchForFileChanges: false,                             // Don't auto-run on file changes

    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run
      await addCucumberPreprocessorPlugin(on, config);

      // Configure file preprocessor with esbuild
      on('file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
          define: {
            'process.env.NODE_ENV': '"test"'
          },
          target: 'es2018'
        })
      );

      // Configure Cucumber preprocessor environment
      config.env = {
        ...config.env,
        // Step definitions path for Cucumber
        CYPRESS_CUCUMBER_PREPROCESSOR_STEP_DEFINITIONS: 'cypress/support/stepDefinitions/*.{js,ts}',
        // Filter and omit specs based on tags
        filterSpecs: true,
        omitFiltered: true
      };

      // Configure Chrome browser launch options
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          // Enable various Chrome permissions
          launchOptions.preferences.default['profile.default_content_setting_values.media_stream_camera'] = true;
          launchOptions.preferences.default['profile.default_content_setting_values.media_stream_mic'] = true;
          launchOptions.preferences.default['profile.default_content_setting_values.geolocation'] = true;
          launchOptions.preferences.default['profile.default_content_setting_values.notifications'] = true;
          
          // Add Chrome launch arguments
          launchOptions.args.push('--window-size=1920,1080');
          launchOptions.args.push('--use-fake-device-for-media-stream');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--js-flags=--expose-gc');
        }
      });

      // Configure custom tasks
      on('task', {
        // Task to connect to PostgreSQL database
        async connectDB(query) {
          const client = new Client({
            user: process.env.PG_USER,
            password: process.env.PG_PWD,
            host: process.env.PG_HOST,
            database: process.env.PG_DBNAME,
            ssl: false,
            port: parseInt(process.env.PG_PORT ?? '', 10),
          });
          await client.connect();
          const res = await client.query(query);
          await client.end();
          return res.rows;
        },
        // Task to check if a file exists
        fileExists(filePath) {
          return fs.existsSync(filePath);
        },
      });

      return config;
    },
  },
});
