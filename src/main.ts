import * as core from '@actions/core'
import { fetchWorkflowData, parseRepository } from './github-api.js'
import { writeDashboardSummary } from './dashboard.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get inputs
    const token = core.getInput('github-token', { required: true })
    const repository = core.getInput('repository')
    const workflowCount = parseInt(core.getInput('workflow-count'), 10)
    const showJobs = core.getInput('show-jobs') === 'true'

    core.info('🚀 Starting Agent Workflow Dashboard generation...')

    // Parse repository
    const { owner, repo } = parseRepository(repository)
    core.info(`📦 Repository: ${owner}/${repo}`)

    // Fetch workflow data
    core.info(`🔍 Fetching ${workflowCount} workflow runs...`)
    const workflowData = await fetchWorkflowData(
      token,
      owner,
      repo,
      workflowCount,
      showJobs
    )

    core.info(`✅ Fetched ${workflowData.runs.length} workflow runs`)

    if (showJobs) {
      const totalJobs = Array.from(workflowData.jobs.values()).reduce(
        (sum, jobs) => sum + jobs.length,
        0
      )
      core.info(`✅ Fetched ${totalJobs} jobs across all runs`)
    }

    // Generate and write dashboard
    core.info('📝 Generating dashboard...')
    await writeDashboardSummary(workflowData, showJobs, owner, repo)

    // Set output with the GitHub Actions run URL
    const runUrl = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${owner}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`
    core.setOutput('dashboard-url', runUrl)

    core.info('✨ Dashboard generated successfully!')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
