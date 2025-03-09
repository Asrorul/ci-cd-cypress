# PowerShell script to initialize a new Cypress Cucumber TypeScript project

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

# Get template directory (where this script is located)
$templatePath = Get-Location

# If ProjectName contains a full path, use it; otherwise create in current directory
if ($ProjectName -match '^[A-Za-z]:\\') {
    $projectPath = $ProjectName
} else {
    $projectPath = Join-Path (Get-Location) $ProjectName
}

Write-Host "Creating new project at: $projectPath"

# Create project directory
New-Item -ItemType Directory -Path $projectPath -Force

# Create directory structure
$directories = @(
    "cypress/e2e/features",
    "cypress/support/stepDefinitions",
    "cypress/support/commands",
    "cypress/pages",
    "reports"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path (Join-Path $projectPath $dir) -Force
}

# Copy template files
$templateFiles = @(
    "package.json",
    "tsconfig.json",
    "cypress.config.ts",
    "cypress.env.json",
    "README.md",
    ".vscode/settings.json",
    ".vscode/extensions.json",
    "cypress/support/e2e.ts",
    "cypress/support/commands.ts",
    "cypress/e2e/features/example.feature",
    "cypress/support/stepDefinitions/example.ts"
)

foreach ($file in $templateFiles) {
    $sourcePath = Join-Path $templatePath $file
    $destPath = Join-Path $projectPath $file
    if (Test-Path $sourcePath) {
        # Create parent directory if it doesn't exist
        $parentDir = Split-Path -Parent $destPath
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force
        }
        Copy-Item -Path $sourcePath -Destination $destPath -Force
    } else {
        Write-Warning "Template file not found: $file"
    }
}

# Update package.json with new project name
$packageJsonPath = Join-Path $projectPath "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    $packageJson.name = (Split-Path $projectPath -Leaf)
    $packageJson | ConvertTo-Json -Depth 100 | Set-Content $packageJsonPath
}

# Initialize git repository
Set-Location $projectPath
if (Get-Command "git" -ErrorAction SilentlyContinue) {
    git init
} else {
    Write-Warning "Git is not installed. Skipping repository initialization."
}

# Create .gitignore
@"
node_modules/
cypress/videos/
cypress/screenshots/
cypress/downloads/
cypress/reports/
.DS_Store
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "`nProject created successfully at: $projectPath"
Write-Host "To get started:"
Write-Host "cd '$((Split-Path $projectPath -Leaf))'"
Write-Host "npm install"
Write-Host "code ."
