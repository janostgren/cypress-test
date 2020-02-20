// cypress/plugins/index.js

const { install, ensureBrowserFlags } = require('@neuralegion/cypress-har-generator');

module.exports = (on, config) => {
  install(on, config);

  on('before:browser:launch', (browser = {}, launchOptions) => {
    ensureBrowserFlags(browser, launchOptions);
    return launchOptions;
  });
};