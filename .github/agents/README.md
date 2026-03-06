# Claude Agents for TypeScript Action Development

This directory contains Claude agent profiles for assisting with development of this TypeScript GitHub Action.

## Available Agents

### 1. Main Development Agent (`main-agent.md`)
**Primary development assistant** for general TypeScript and GitHub Actions work.
- Implements new features
- Fixes bugs
- Maintains code quality
- Updates documentation

**Use when:** Working on general development tasks, feature implementation, or bug fixes.

### 2. Test Specialist (`test-specialist.md`)
**Testing expert** focused on unit tests and code coverage.
- Writes comprehensive tests
- Debugs test failures
- Improves test coverage
- Creates test fixtures

**Use when:** Adding new tests, debugging test failures, or improving coverage.

### 3. CI/CD Workflow Specialist (`ci-workflow-specialist.md`)
**GitHub Actions workflow expert** for automation and CI/CD.
- Designs workflows
- Debugs CI issues
- Optimizes pipeline performance
- Manages security scanning

**Use when:** Working on GitHub Actions workflows, CI/CD pipelines, or automation.

### 4. Documentation Specialist (`documentation-specialist.md`)
**Technical writer** for clear and comprehensive documentation.
- Updates README files
- Documents APIs and features
- Creates examples and guides
- Maintains inline documentation

**Use when:** Writing or updating documentation, creating examples, or improving clarity.

### 5. Code Reviewer (`code-reviewer.md`)
**Quality and security reviewer** for thorough code analysis.
- Reviews pull requests
- Identifies security issues
- Suggests optimizations
- Ensures best practices

**Use when:** Reviewing code changes, checking for issues, or before merging PRs.

## How to Use These Agents

### In GitHub Actions
Reference agents in your workflow files:
```yaml
- name: Run Claude Agent
  uses: anthropics/claude-code-action@v1
  with:
    agent: .github/agents/main-agent.md
    task: "Implement new feature X"
```

### In Claude Code CLI
When using Claude Code locally, you can reference these agent profiles:
```bash
claude code --agent=.github/agents/test-specialist.md
```

### In PR Comments
Mention agents in pull request comments:
```
@claude-agent main-agent please review this implementation
```

## Agent Configuration

Each agent profile includes:
- **Role**: The agent's primary function
- **Skills**: Specific capabilities and expertise
- **Model**: Which Claude model to use (Sonnet 4.5, Opus 4.5)
- **Responsibilities**: Detailed list of tasks
- **Context**: Technologies, tools, and project structure
- **Guidelines**: Best practices and rules to follow
- **Output Format**: How to structure responses

## Customization

Feel free to modify these agent profiles to better suit your project needs:
1. Add new skills or technologies
2. Update guidelines based on your team's practices
3. Create new specialized agents for specific tasks
4. Adjust model selection based on complexity

## Best Practices

1. **Choose the right agent** for the task at hand
2. **Provide clear context** when invoking an agent
3. **Review agent outputs** before applying changes
4. **Update agent profiles** as the project evolves
5. **Create new agents** for recurring specialized tasks

## Contributing

When updating agent profiles:
- Keep descriptions clear and specific
- Maintain consistent formatting
- Update this README when adding new agents
- Test agent configurations before committing
