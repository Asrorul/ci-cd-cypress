import './commands';
import 'cypress-real-events';

chai.use(require('chai-json-schema'));

Cypress.on('uncaught:exception', err => {
  return false;
});

before(() => {});

afterEach(() => {});
