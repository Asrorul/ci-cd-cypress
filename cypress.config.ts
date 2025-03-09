import { defineConfig } from 'cypress';
import { Client } from 'pg';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import fs from 'fs';

require('dotenv').config();

const customComment: string = 'WebAutomation Cypress' + '12.7.0';
export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 60000,
  requestTimeout: 30000,
  numTestsKeptInMemory: 0,
  responseTimeout: 50000,
  pageLoadTimeout: 60000,
  chromeWebSecurity: false,
  reporter: '../node_modules/mochawesome',
  reporterOptions: {
    charts: true,
    overwrite: false,
    html: false,
    json: true,
    reportDir: 'reports',
  },
  env: {
    grepFilterSpecs: true,
    // another url can be added here
  },

  e2e: {
    baseUrl: process.env.BASE_URL || 'https://google.com',
    supportFile: './cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/features/*.feature',
    testIsolation: false,
    watchForFileChanges: false,
    video: true,
    videoCompression: 32,
    videoUploadOnPasses: false,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",

    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run
      await addCucumberPreprocessorPlugin(on, config);

      on('file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
          define: {
            'process.env.NODE_ENV': '"test"'
          },
          target: 'es2018'
        })
      );

      // Configure cucumber preprocessor
      config.env = {
        ...config.env,
        // Step definitions path
        CYPRESS_CUCUMBER_PREPROCESSOR_STEP_DEFINITIONS: 'cypress/support/stepDefinitions/*.{js,ts}',
        // Filter and omit specs based on tags
        filterSpecs: true,
        omitFiltered: true
      };

      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.preferences.default['profile.default_content_setting_values.media_stream_camera'] = true;
          launchOptions.preferences.default['profile.default_content_setting_values.media_stream_mic'] = true;
          launchOptions.preferences.default['profile.default_content_setting_values.geolocation'] = true;
          launchOptions.preferences.default['profile.default_content_setting_values.notifications'] = true;
          launchOptions.args.push('--window-size=1920,1080');
          launchOptions.args.push('--use-fake-device-for-media-stream');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--js-flags=--expose-gc');
        }
      });

      on('task', {
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
        fileExists(filePath) {
          return fs.existsSync(filePath);
        },
      });

      return config;
    },
  },
});
