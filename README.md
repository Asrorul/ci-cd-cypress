# Cypress Cucumber TypeScript Template

This is a template project for Cypress with Cucumber BDD and TypeScript support.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Visual Studio Code

## Creating a New Project

There are three ways to create a new project from this template:

### Method 1: Using GitHub Template (Easiest)

1. Click the green "Use this template" button at the top of this repository
2. Choose a name for your new repository
3. Select owner and visibility (public/private)
4. Click "Create repository from template"
5. Clone your new repository:
```bash
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo
npm install
```

### Method 2: Using init-project.ps1 (Local Script)

1. Open PowerShell and navigate to this template directory
2. Run the initialization script:
```powershell
.\init-project.ps1 -ProjectName "my-new-project"
```

You can also specify a full path:
```powershell
.\init-project.ps1 -ProjectName "D:\Projects\my-new-project"
```

The script will:
- Create a new project directory
- Copy all template files
- Initialize git repository
- Update package.json with your project name
- Create .gitignore

After creation:
```powershell
cd my-new-project
npm install
code .
```

### Method 3: Manual Copy

1. Copy this entire directory to your new project location
2. Delete the `.git` folder in the new copy
3. Initialize a new git repository
4. Update the project name in `package.json`
5. Run `npm install`

## VS Code Setup

1. Required Extensions:
   - [Cucumber (Gherkin) Full Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)
   - [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
   - [Cypress](https://marketplace.visualstudio.com/items?itemName=cypress-io.cypress)

2. Recommended Extensions:
   - ESLint
   - Prettier

The project includes `.vscode` folder with:
- `settings.json`: Project-specific VS Code settings
- `extensions.json`: Recommended extensions

Features enabled:
- Gherkin syntax highlighting
- Step definition navigation (Ctrl+click)
- Cucumber icons for .feature files
- Auto-formatting on save

## Project Structure
```
├── cypress/
│   ├── e2e/
│   │   └── features/           # Feature files
│   ├── support/
│   │   ├── stepDefinitions/    # Step definitions
│   │   ├── commands.ts         # Custom commands
│   │   └── e2e.ts             # Support file
│   └── pages/                  # Page objects
├── .vscode/                    # VS Code settings
├── reports/                    # Test reports
├── cypress.config.ts           # Cypress configuration
├── cypress.env.json           # Environment variables
├── package.json
└── tsconfig.json
```

## Quick Start

1. Clone this template:
```bash
git clone [your-template-repo] my-new-project
cd my-new-project
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
# Run all tests
npm run test:cy

# Run tests in debug mode
npm run test:debug
```

## Available Scripts

- `npm run test:cy` - Run tests in headless mode
- `npm run test:debug` - Run tests in headed mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run create:report` - Generate test report

## Writing Tests

1. Create a feature file in `cypress/e2e/features/`:
```gherkin
Feature: Example Feature
  As a user
  I want to test something
  So that I can verify it works

  @test
  Scenario: Basic test scenario
    Given I visit the homepage
```

2. Create step definitions in `cypress/support/stepDefinitions/`:
```typescript
import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit the homepage', () => {
    cy.visit('/');
});
```

## Configuration Files

### cypress.config.ts
- Main Cypress configuration
- Cucumber preprocessor setup
- Browser launch options
- Environment variables

### tsconfig.json
- TypeScript configuration
- Path aliases
- Compiler options

### package.json
- Dependencies
- Scripts
- Cucumber preprocessor configuration

## Dependencies

Key dependencies and their versions:
- cypress: 12.7.0
- @badeball/cypress-cucumber-preprocessor
- @bahmutov/cypress-esbuild-preprocessor
- typescript
- eslint
- prettier

## Best Practices

1. Use Page Object pattern for better maintainability
2. Keep feature files simple and readable
3. Organize step definitions by feature
4. Use custom commands for common actions
5. Maintain type definitions for better IDE support
