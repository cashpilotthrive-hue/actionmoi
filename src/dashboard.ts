import * as core from '@actions/core'
import type { WorkflowData, WorkflowRun, WorkflowJob } from './github-api.js'

/**
 * Gets the status emoji for a workflow run or job
 */
function getStatusEmoji(status: string, conclusion: string | null): string {
  if (status === 'completed') {
    switch (conclusion) {
      case 'success':
        return '✅'
      case 'failure':
        return '❌'
      case 'cancelled':
        return '🚫'
      case 'skipped':
        return '⏭️'
      default:
        return '❓'
    }
  } else if (status === 'in_progress') {
    return '🔄'
  } else if (status === 'queued') {
    return '⏳'
  }
  return '⚪'
}

/**
 * Formats a duration in seconds to a human-readable string
 */
function formatDuration(startTime: string, endTime: string | null): string {
  const start = new Date(startTime).getTime()
  const end = endTime ? new Date(endTime).getTime() : Date.now()
  const durationMs = end - start
  const seconds = Math.floor(durationMs / 1000)

  if (seconds < 60) {
    return `${seconds}s`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }
}

/**
 * Formats a date to a relative time string
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffMinutes / 1440)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

/**
 * Generates a workflow run table row
 */
function generateRunRow(run: WorkflowRun): string {
  const emoji = getStatusEmoji(run.status, run.conclusion)
  const duration =
    run.run_started_at && run.updated_at
      ? formatDuration(run.run_started_at, run.updated_at)
      : 'N/A'
  const timeAgo = formatRelativeTime(run.created_at)

  return `| ${emoji} | [#${run.run_number} ${run.name}](${run.html_url}) | \`${run.head_branch}\` | ${run.event} | ${duration} | ${timeAgo} |`
}

/**
 * Generates job details for a workflow run
 */
function generateJobDetails(jobs: WorkflowJob[]): string {
  if (jobs.length === 0) {
    return '_No jobs found_'
  }

  let jobsMarkdown = '<details>\n<summary>📋 Jobs</summary>\n\n'
  jobsMarkdown += '| Status | Job Name | Duration |\n'
  jobsMarkdown += '|--------|----------|----------|\n'

  for (const job of jobs) {
    const emoji = getStatusEmoji(job.status, job.conclusion)
    const duration =
      job.started_at && job.completed_at
        ? formatDuration(job.started_at, job.completed_at)
        : job.started_at
          ? formatDuration(job.started_at, null)
          : 'N/A'

    jobsMarkdown += `| ${emoji} | [${job.name}](${job.html_url}) | ${duration} |\n`
  }

  jobsMarkdown += '\n</details>\n'
  return jobsMarkdown
}

/**
 * Generates a dashboard summary from workflow data
 */
export function generateDashboard(
  workflowData: WorkflowData,
  showJobs: boolean,
  owner: string,
  repo: string
): string {
  let markdown = '# 🚀 Agent Workflow Dashboard\n\n'
  markdown += `**Repository:** [\`${owner}/${repo}\`](https://github.com/${owner}/${repo})\n\n`

  // Summary statistics
  const totalRuns = workflowData.runs.length
  const successRuns = workflowData.runs.filter(
    (r) => r.conclusion === 'success'
  ).length
  const failedRuns = workflowData.runs.filter(
    (r) => r.conclusion === 'failure'
  ).length
  const inProgressRuns = workflowData.runs.filter(
    (r) => r.status === 'in_progress'
  ).length

  markdown += '## 📊 Summary\n\n'
  markdown += `- **Total Runs:** ${totalRuns}\n`
  markdown += `- **✅ Successful:** ${successRuns}\n`
  markdown += `- **❌ Failed:** ${failedRuns}\n`
  markdown += `- **🔄 In Progress:** ${inProgressRuns}\n\n`

  // Workflow runs table
  markdown += '## 📋 Recent Workflow Runs\n\n'

  if (workflowData.runs.length === 0) {
    markdown += '_No workflow runs found_\n'
  } else {
    markdown += '| Status | Workflow | Branch | Event | Duration | Created |\n'
    markdown += '|--------|----------|--------|-------|----------|----------|\n'

    for (const run of workflowData.runs) {
      markdown += generateRunRow(run) + '\n'

      // Add job details if enabled
      if (showJobs && workflowData.jobs.has(run.id)) {
        const jobs = workflowData.jobs.get(run.id)!
        markdown += '\n' + generateJobDetails(jobs) + '\n'
      }
    }
  }

  markdown += '\n---\n'
  markdown += `_Generated on ${new Date().toISOString()}_\n`

  return markdown
}

/**
 * Writes the dashboard to the GitHub Actions step summary
 */
export async function writeDashboardSummary(
  workflowData: WorkflowData,
  showJobs: boolean,
  owner: string,
  repo: string
): Promise<void> {
  const dashboard = generateDashboard(workflowData, showJobs, owner, repo)

  // Write to the step summary
  await core.summary.addRaw(dashboard).write()

  core.info('Dashboard written to step summary')
}
