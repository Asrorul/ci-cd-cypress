import 'cypress-file-upload';
import 'cypress-iframe';
import { getFileNameWithOutExtension } from './helper/common';

Cypress.Commands.add('selectValue', (element, value) => {
  cy.get(`[data-testid="${element}"]`).click();
  cy.contains(value).click();
});

Cypress.Commands.add('typeInput', (element, value, settings = {}) => {
  const { delay = 100, delayBefore = 100, isCurrency = false, isTextEditor = false, isAutoSave = false, index = 0, retries = 3 } = settings;

  // Function to type the value with retry mechanism
  const typeValue = (attempt = 1) => {
    // Get the element and check its current value
    cy.get(element).then($input => {
      let currentValue;
      if (isTextEditor) {
        currentValue = $input.eq(index).find('p').text();
      } else {
        currentValue = $input.val();
      }
      const formattedValue = isCurrency ? parseInt(value).toLocaleString('id-ID') : value;
      const alias = value.split(' ')[0];

      // If the current value is not equal to the formatted value, proceed with the typing process
      if (currentValue !== formattedValue) {
        cy.get(`${element}`).eq(index).as(`type_${alias}`);
        cy.get(`@type_${alias}`).should('be.visible');

        // Function to clear the input field with retry mechanism
        const clearField = (clearAttempt = 1) => {
          const clearRetries = 10;
          cy.get(`@type_${alias}`)
            .focus()
            .clear()
            .then($fieldValue => {
              const finalValue = $fieldValue.val();
              const finalText = $fieldValue.text();
              if (finalValue !== '' || finalText !== '') {
                if (clearAttempt < clearRetries) {
                  clearField(clearAttempt + 1);
                } else {
                  cy.get(`@type_${alias}`).should('have.value', '').and('have.text', '');
                }
              }
            });
        };

        clearField();

        cy.wait(delay);
        cy.get(`@type_${alias}`).focus().type(value);
        cy.get(`@type_${alias}`)
          .focus()
          .blur()
          .wait(delayBefore)
          .then($finalInput => {
            let finalValue;
            if (isTextEditor) {
              finalValue = $finalInput.eq(index).find('p').text();
            } else {
              finalValue = $finalInput.val();
            }

            // If the final value or text is not as expected, retry typing up to the specified number of retries
            if (finalValue !== formattedValue && attempt < retries) {
              typeValue(attempt + 1);
            }

            if (isAutoSave && (finalValue === formattedValue || attempt >= retries)) {
              cy.waitAutoSaved();
            }
          });
      }
    });
  };

  typeValue();
});

Cypress.Commands.add('selectDropDown', (element, value, settings = {}) => {
  const { apiToWait = null, delayBefore = 100, retries = 3, index = 0 } = settings;

  const attemptClickAndWait = (attempt: number) => {
    if (attempt > retries) {
      throw new Error(`Failed to select ${value} from ${element} after ${retries} retries`);
    }

    cy.get(element).eq(index).click();
    const clickAndWait = () => {
      cy.get('body').then(body => {
        if (body.find(`.mantine-Select-item:contains("${value}")`).length > 0) {
          cy.get('.mantine-Select-dropdown').within(() => {
            cy.get('.mantine-Select-item')
              .filter((index, item) => {
                return Cypress.$(item).text().trim() === value;
              })
              .click();
          });
          if (apiToWait) {
            cy.wait(`@api_result_${value}`).its('response.statusCode').should('eql', 200);
          }
        } else {
          cy.wait(delayBefore);
          attemptClickAndWait(attempt + 1);
        }
      });
    };

    if (apiToWait) {
      cy.intercept('GET', apiToWait).as(`api_result_${value}`);
    }
    clickAndWait();
  };

  cy.get(element)
    .eq(index)
    .then($inputValue => {
      const selectedData = $inputValue.val();
      if (selectedData !== value) {
        cy.wait(delayBefore);
        cy.get(element).eq(index).as(value);
        attemptClickAndWait(1);
      }
    });
});

Cypress.Commands.add('forceWaitingLoadElement', (wait = Cypress.env('waitTimeDefault')) => {
  cy.wait(wait);
});

/**
 * Custom command to paste an image.
 *
 * @param {string} selector - The CSS selector for the element where the image will be pasted.
 * @param {string} imagePath - The path to the image file.
 *
 * @example
 * cy.pasteImage('#root_shariaAspect_shariaAnalysis .ql-editor', './attachment/1. KTP.jpg');
 */

Cypress.Commands.add('pasteImage', (selector, imagePath) => {
  cy.get(selector).then($editor => {
    // Read the image file as base64
    cy.fixture(imagePath, 'base64').then(base64String => {
      // Create a Blob from the base64 string
      const blob = Cypress.Blob.base64StringToBlob(base64String, 'image/jpeg'); // Adjust type if needed

      // Create a File object from the Blob
      const file = new File([blob], 'image.png', { type: 'image/jpeg' }); // Adjust type and filename if needed

      // Create a DataTransfer object and add the File item
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Trigger the paste event
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dataTransfer,
        bubbles: true,
        cancelable: true, // Ensure event is cancelable
      });

      // Dispatch the paste event to the editor element
      $editor[0].dispatchEvent(pasteEvent);
    });
  });
});

Cypress.Commands.add('uploadFile', (elementName, documentPath) => {
  cy.get(`input[type="file"][name="${elementName}"]`).attachFile(documentPath);
});

Cypress.Commands.add('checkIfFileExists', filePath => {
  cy.task('fileExists', filePath).then(exists => {
    return exists;
  });
});
