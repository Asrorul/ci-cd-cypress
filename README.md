# Cypress E2E Testing with GitHub Actions

This project implements end-to-end testing using Cypress with Cucumber BDD, TypeScript, and GitHub Actions CI/CD pipeline.

## Features

- Cypress 12.7.0 with TypeScript support
- Cucumber BDD for behavior-driven testing
- GitHub Actions workflow with:
  - Optional video recording
  - Optional Mochawesome report generation
  - Artifact uploads for videos and reports
- PostgreSQL database integration
- Custom commands and utilities
- ESLint and Prettier for code quality

## Prerequisites

- Node.js (v20.x)
- npm
- Git

## Project Structure
```
├── cypress/
│   ├── e2e/
│   │   └── features/           # Cucumber feature files
│   ├── support/
│   │   ├── stepDefinitions/    # Step definitions
│   │   ├── commands.ts         # Custom commands
│   │   └── e2e.ts             # Support file
│   ├── videos/                 # Test execution videos
│   └── screenshots/            # Failure screenshots
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
├── reports/                    # Mochawesome reports
└── cypress.config.ts          # Cypress configuration
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd ci-cd-cypress
```

2. Install dependencies:
```bash
npm install
```

3. Run tests locally:
```bash
# Run all tests
npm run test:cy

# Run tests in debug mode (headed)
npm run test:debug
```

## GitHub Actions Workflow

The CI/CD pipeline includes:

### Automated Tests
- Runs on push to main branch
- Runs on pull requests
- Uses Node.js 20.x

### Manual Workflow Options
You can manually trigger the workflow with these options:

1. **Video Recording**
   - Enable/disable test execution videos
   - Videos are saved as artifacts when enabled
   - High-quality recording (no compression)

2. **Report Generation**
   - Enable/disable Mochawesome report
   - Reports are saved as artifacts when enabled
   - Includes test results and screenshots

### Artifacts
When enabled, the workflow saves:
- Test execution videos in `cypress/videos/`
- Failure screenshots in `cypress/screenshots/`
- Mochawesome reports in `reports/`

## Configuration

### cypress.config.ts
Key settings:
```typescript
{
  video: true,                    // Configurable via GitHub Actions
  videoCompression: false,        // Highest quality
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  trashAssetsBeforeRuns: true,    // Clean old assets
}
```

### Available Scripts

- `npm run test:cy` - Run tests headlessly
- `npm run test:debug` - Run tests in browser
- `npm run create:report` - Generate Mochawesome report

## Best Practices

1. Write descriptive feature files in `cypress/e2e/features/`
2. Organize step definitions by feature
3. Use custom commands for common actions
4. Add screenshots for visual verification
5. Enable video recording for important test runs
