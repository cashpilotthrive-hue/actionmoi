# Agent Workflow Dashboard

![Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)
![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)
![Coverage](./badges/coverage.svg)

A GitHub Action that displays a comprehensive dashboard of your GitHub Actions
workflow runs directly in the workflow summary. Perfect for monitoring agent
workflows, CI/CD pipelines, and getting a quick overview of your automation
status.

## Features

- 📊 **Summary Statistics**: Quick overview of successful, failed, and
  in-progress workflows
- 📋 **Workflow Run Details**: Detailed table with run status, branch, event
  type, duration, and timestamps
- 🔄 **Real-time Updates**: Shows current status of running workflows
- 💼 **Job-level Details**: Optional display of individual jobs within each
  workflow run
- 🎨 **Rich Formatting**: Clean, readable Markdown with emoji indicators

## Usage

Add this action to your workflow to generate a dashboard showing your workflow
runs:

```yaml
name: Workflow Dashboard

on:
  workflow_dispatch: # Manual trigger
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours

jobs:
  dashboard:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Workflow Dashboard
        uses: cashpilotthrive-hue/actionmoi@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          workflow-count: 10
          show-jobs: true
```

## Inputs

| Input            | Description                                                      | Required | Default |
| ---------------- | ---------------------------------------------------------------- | -------- | ------- |
| `github-token`   | GitHub token for API access (typically `secrets.GITHUB_TOKEN`)   | Yes      | N/A     |
| `repository`     | Repository in the format `owner/repo` (defaults to current repo) | No       | Current |
| `workflow-count` | Number of recent workflow runs to display                        | No       | `10`    |
| `show-jobs`      | Show individual jobs within workflows (`true` or `false`)        | No       | `true`  |

## Outputs

| Output          | Description                            |
| --------------- | -------------------------------------- |
| `dashboard-url` | URL to the generated dashboard summary |

## Examples

### Basic Dashboard

Display the last 10 workflow runs:

```yaml
- name: Generate Dashboard
  uses: cashpilotthrive-hue/actionmoi@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Detailed Dashboard with More Runs

Show 25 workflow runs with job details:

```yaml
- name: Generate Detailed Dashboard
  uses: cashpilotthrive-hue/actionmoi@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    workflow-count: 25
    show-jobs: true
```

### Dashboard for Different Repository

Monitor workflows from another repository:

```yaml
- name: Generate Cross-Repo Dashboard
  uses: cashpilotthrive-hue/actionmoi@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    repository: owner/other-repo
    workflow-count: 15
```

### Dashboard Without Job Details

Quick overview without individual job information:

```yaml
- name: Generate Quick Dashboard
  uses: cashpilotthrive-hue/actionmoi@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    workflow-count: 20
    show-jobs: false
```

## Dashboard Output

The dashboard is displayed in the workflow run summary and includes:

### Summary Section

- Total number of workflow runs
- Count of successful runs (✅)
- Count of failed runs (❌)
- Count of in-progress runs (🔄)

### Workflow Runs Table

- **Status**: Visual indicator (✅ ❌ 🔄 ⏳)
- **Workflow**: Name and run number with link to the run
- **Branch**: The branch that triggered the workflow
- **Event**: Trigger event (push, pull_request, etc.)
- **Duration**: How long the workflow took to complete
- **Created**: When the workflow was created (relative time)

### Job Details (Optional)

When `show-jobs: true`, each workflow run expands to show:

- Individual job names with links
- Job status and duration
- Visual indicators for job completion

## Permissions

The action requires the following permissions:

```yaml
permissions:
  actions: read # Required to fetch workflow data
  contents: read # Required for repository access
```

## Development

### Initial Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the action:

   ```bash
   npm run bundle
   ```

3. Run tests:

   ```bash
   npm test
   ```

### Project Structure

| Path                | Description                   |
| ------------------- | ----------------------------- |
| `src/main.ts`       | Main action entry point       |
| `src/github-api.ts` | GitHub API wrapper            |
| `src/dashboard.ts`  | Dashboard generation logic    |
| `__tests__/`        | Unit tests                    |
| `dist/`             | Compiled JavaScript (bundled) |

### Testing Locally

Use the `@github/local-action` utility to test locally:

```bash
npm run local-action
```

Or use the Visual Studio Code debugger with the included launch configuration.

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass: `npm test`
2. Code is formatted: `npm run format:write`
3. Linting passes: `npm run lint`
4. The action is bundled: `npm run bundle`

## License

MIT
