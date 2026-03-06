/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import type { WorkflowData } from '../src/github-api.js'

// Mock workflow data for testing
const mockWorkflowData: WorkflowData = {
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

// Mock functions
const fetchWorkflowData = jest.fn(() => Promise.resolve(mockWorkflowData))
const parseRepository = jest.fn(() => ({ owner: 'owner', repo: 'repo' }))
const writeDashboardSummary = jest.fn(() => Promise.resolve())

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/github-api.js', () => ({
  fetchWorkflowData,
  parseRepository
}))
jest.unstable_mockModule('../src/dashboard.js', () => ({
  writeDashboardSummary
}))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name: string) => {
      switch (name) {
        case 'github-token':
          return 'test-token'
        case 'repository':
          return 'owner/repo'
        case 'workflow-count':
          return '10'
        case 'show-jobs':
          return 'true'
        default:
          return ''
      }
    })

    // Set up environment variables
    process.env.GITHUB_SERVER_URL = 'https://github.com'
    process.env.GITHUB_RUN_ID = '12345'

    // Mock the functions
    fetchWorkflowData.mockClear().mockResolvedValue(mockWorkflowData)
    parseRepository
      .mockClear()
      .mockReturnValue({ owner: 'owner', repo: 'repo' })
    writeDashboardSummary.mockClear().mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Generates dashboard successfully', async () => {
    await run()

    // Verify that parseRepository was called
    expect(parseRepository).toHaveBeenCalledWith('owner/repo')

    // Verify that fetchWorkflowData was called with correct parameters
    expect(fetchWorkflowData).toHaveBeenCalledWith(
      'test-token',
      'owner',
      'repo',
      10,
      true
    )

    // Verify that writeDashboardSummary was called
    expect(writeDashboardSummary).toHaveBeenCalledWith(
      mockWorkflowData,
      true,
      'owner',
      'repo'
    )

    // Verify that the dashboard-url output was set
    expect(core.setOutput).toHaveBeenCalledWith(
      'dashboard-url',
      'https://github.com/owner/repo/actions/runs/12345'
    )

    // Verify that info messages were logged
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining('Starting Agent Workflow Dashboard')
    )
  })

  it('Sets a failed status on error', async () => {
    // Mock parseRepository to throw an error
    parseRepository.mockClear().mockImplementation(() => {
      throw new Error('Invalid repository format')
    })

    await run()

    // Verify that the action was marked as failed
    expect(core.setFailed).toHaveBeenCalledWith('Invalid repository format')
  })

  it('Handles API errors gracefully', async () => {
    // Mock fetchWorkflowData to throw an error
    fetchWorkflowData
      .mockClear()
      .mockRejectedValue(new Error('API request failed'))

    await run()

    // Verify that the action was marked as failed
    expect(core.setFailed).toHaveBeenCalledWith('API request failed')
  })
})
