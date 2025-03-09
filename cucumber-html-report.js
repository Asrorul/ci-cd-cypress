const report = require('multiple-cucumber-html-reporter');

report.generate({
  jsonDir: 'cypress/reports/cucumber-json',
  reportPath: 'cypress/reports/html',
  metadata: {
    browser: {
      name: 'chrome',
      version: '12.7.0',
    },
    device: 'Local test machine',
    platform: {
      name: 'windows',
      version: '10',
    },
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: 'Hello World Test Project' },
      { label: 'Release', value: '1.0.0' },
    ],
  },
});
