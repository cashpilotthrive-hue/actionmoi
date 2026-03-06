import { Octokit } from '@octokit/rest'

export interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  updated_at: string
  html_url: string
  run_number: number
  head_branch: string
  head_sha: string
  event: string
  run_started_at: string | null
}

export interface WorkflowJob {
  id: number
  name: string
  status: string
  conclusion: string | null
  started_at: string
  completed_at: string | null
  html_url: string
  steps?: Array<{
    name: string
    status: string
    conclusion: string | null
    number: number
  }>
}

export interface WorkflowData {
  runs: WorkflowRun[]
  jobs: Map<number, WorkflowJob[]>
}

/**
 * Fetches workflow runs and their associated jobs from GitHub API
 *
 * @param token - GitHub API token
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param count - Number of workflow runs to fetch
 * @param includeJobs - Whether to fetch job details for each run
 * @returns WorkflowData containing runs and jobs
 */
export async function fetchWorkflowData(
  token: string,
  owner: string,
  repo: string,
  count: number,
  includeJobs: boolean
): Promise<WorkflowData> {
  const octokit = new Octokit({ auth: token })

  // Fetch workflow runs
  const { data: runsData } = await octokit.rest.actions.listWorkflowRunsForRepo(
    {
      owner,
      repo,
      per_page: count
    }
  )

  const runs = runsData.workflow_runs as WorkflowRun[]
  const jobs = new Map<number, WorkflowJob[]>()

  // Fetch jobs for each run if requested
  if (includeJobs) {
    for (const run of runs) {
      try {
        const { data: jobsData } =
          await octokit.rest.actions.listJobsForWorkflowRun({
            owner,
            repo,
            run_id: run.id
          })
        jobs.set(run.id, jobsData.jobs as WorkflowJob[])
      } catch (error) {
        // Continue if we can't fetch jobs for a specific run
        console.error(`Failed to fetch jobs for run ${run.id}:`, error)
      }
    }
  }

  return { runs, jobs }
}

/**
 * Parses repository string in format 'owner/repo'
 *
 * @param repository - Repository string or undefined
 * @returns Object with owner and repo
 */
export function parseRepository(repository?: string): {
  owner: string
  repo: string
} {
  // Default to GitHub Actions environment variables
  const defaultRepo = process.env.GITHUB_REPOSITORY || ''

  const repoString = repository || defaultRepo
  const [owner, repo] = repoString.split('/')

  if (!owner || !repo) {
    throw new Error(
      `Invalid repository format: "${repoString}". Expected format: "owner/repo"`
    )
  }

  return { owner, repo }
}
