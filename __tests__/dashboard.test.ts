/**
 * Unit tests for src/dashboard.ts
 */
import { describe, expect, it } from '@jest/globals'
import { generateDashboard } from '../src/dashboard.js'
import type { WorkflowData } from '../src/github-api.js'

describe('dashboard.ts', () => {
  describe('generateDashboard', () => {
    it('Generates dashboard with workflow runs', () => {
      const workflowData: WorkflowData = {
        runs: [
          {
            id: 1,
            name: 'Test Workflow',
            status: 'completed',
            conclusion: 'success',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            html_url: 'https://github.com/owner/repo/actions/runs/1',
            run_number: 1,
            head_branch: 'main',
            head_sha: 'abc123',
            event: 'push',
            run_started_at: new Date().toISOString()
          }
        ],
        jobs: new Map()
      }

      const dashboard = generateDashboard(workflowData, false, 'owner', 'repo')

      expect(dashboard).toContain('Agent Workflow Dashboard')
      expect(dashboard).toContain('owner/repo')
      expect(dashboard).toContain('Test Workflow')
      expect(dashboard).toContain('**Total Runs:** 1')
      expect(dashboard).toContain('**✅ Successful:** 1')
    })

    it('Generates dashboard with no workflow runs', () => {
      const workflowData: WorkflowData = {
        runs: [],
        jobs: new Map()
      }

      const dashboard = generateDashboard(workflowData, false, 'owner', 'repo')

      expect(dashboard).toContain('Agent Workflow Dashboard')
      expect(dashboard).toContain('No workflow runs found')
      expect(dashboard).toContain('**Total Runs:** 0')
    })

    it('Includes job details when showJobs is true', () => {
      const workflowData: WorkflowData = {
        runs: [
          {
            id: 1,
            name: 'Test Workflow',
            status: 'completed',
            conclusion: 'success',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            html_url: 'https://github.com/owner/repo/actions/runs/1',
            run_number: 1,
            head_branch: 'main',
            head_sha: 'abc123',
            event: 'push',
            run_started_at: new Date().toISOString()
          }
        ],
        jobs: new Map([
          [
            1,
            [
              {
                id: 101,
                name: 'Test Job',
                status: 'completed',
                conclusion: 'success',
                started_at: new Date().toISOString(),
                completed_at: new Date().toISOString(),
                html_url:
                  'https://github.com/owner/repo/actions/runs/1/jobs/101'
              }
            ]
          ]
        ])
      }

      const dashboard = generateDashboard(workflowData, true, 'owner', 'repo')

      expect(dashboard).toContain('Jobs')
      expect(dashboard).toContain('Test Job')
    })

    it('Counts failed and in-progress runs correctly', () => {
      const workflowData: WorkflowData = {
        runs: [
          {
            id: 1,
            name: 'Success Workflow',
            status: 'completed',
            conclusion: 'success',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            html_url: 'https://github.com/owner/repo/actions/runs/1',
            run_number: 1,
            head_branch: 'main',
            head_sha: 'abc123',
            event: 'push',
            run_started_at: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Failed Workflow',
            status: 'completed',
            conclusion: 'failure',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            html_url: 'https://github.com/owner/repo/actions/runs/2',
            run_number: 2,
            head_branch: 'main',
            head_sha: 'def456',
            event: 'push',
            run_started_at: new Date().toISOString()
          },
          {
            id: 3,
            name: 'In Progress Workflow',
            status: 'in_progress',
            conclusion: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            html_url: 'https://github.com/owner/repo/actions/runs/3',
            run_number: 3,
            head_branch: 'main',
            head_sha: 'ghi789',
            event: 'push',
            run_started_at: new Date().toISOString()
          }
        ],
        jobs: new Map()
      }

      const dashboard = generateDashboard(workflowData, false, 'owner', 'repo')

      expect(dashboard).toContain('**Total Runs:** 3')
      expect(dashboard).toContain('**✅ Successful:** 1')
      expect(dashboard).toContain('**❌ Failed:** 1')
      expect(dashboard).toContain('**🔄 In Progress:** 1')
    })
  })
})
