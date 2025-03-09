import { DropDownSettings, SettingsParam } from './typeData/common';

/* eslint-disable no-unused-vars */
export {};
declare global {
  namespace Cypress {
    interface Chainable {
      selectValue(element: string, value: string): Chainable<void>;
      typeInput(element: string, value: string, settingsParam?: SettingsParam): Chainable<void>;
      selectDropDown(element: string, value: string, settingsParam?: DropDownSettings): Chainable<void>;
      forceWaitingLoadElement(wait?: number): Chainable<void>;
      pasteImage(element: string, imagePath: string): Chainable<void>;
      pasteImageToTextEditor(element: string, imagePath: string): Chainable<void>;
      uploadFile(element: string, path: string): Chainable<void>;
      checkIfFileExists(path: string): Chainable<boolean>;
      waitAutoSaved(): Chainable<void>;
    }
  }
}

// @ts-ignore
declare module 'cypress-testrail';
