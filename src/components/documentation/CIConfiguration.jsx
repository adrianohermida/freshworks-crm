export const CI_CONFIGURATION = {
  platform: "GitHub Actions",
  
  workflows: {
    "push": {
      name: "CI - Build & Test",
      trigger: "On every push to any branch",
      jobs: [
        {
          name: "Lint & Build",
          steps: [
            "Checkout code",
            "Setup Node.js",
            "Install dependencies",
            "Run linter (ESLint)",
            "Build with Vite",
            "Upload build artifact"
          ],
          time: "~3 minutes"
        },
        {
          name: "Run Tests",
          steps: [
            "Checkout code",
            "Setup Node.js",
            "Install dependencies",
            "Run QA test suite",
            "Generate test report",
            "Upload coverage"
          ],
          time: "~2 minutes"
        }
      ]
    },

    "pullRequest": {
      name: "PR - Validation",
      trigger: "On pull request to main",
      jobs: [
        {
          name: "Code Quality",
          steps: [
            "Lint check",
            "Build check",
            "Type check",
            "Test coverage > 80%"
          ]
        },
        {
          name: "Performance",
          steps: [
            "Lighthouse audit",
            "Bundle size check",
            "Performance regression test"
          ]
        },
        {
          name: "Security",
          steps: [
            "Dependency scan",
            "SAST analysis",
            "License compliance"
          ]
        }
      ]
    },

    "deploy": {
      name: "CD - Deploy to Production",
      trigger: "On merge to main",
      jobs: [
        {
          name: "Pre-deployment",
          steps: [
            "Run full test suite",
            "Lighthouse audit",
            "Security check"
          ]
        },
        {
          name: "Deployment",
          steps: [
            "Build production bundle",
            "Deploy to production",
            "Run smoke tests",
            "Notify team"
          ],
          time: "~5 minutes"
        },
        {
          name: "Post-deployment",
          steps: [
            "Monitor error rate",
            "Check performance metrics",
            "Verify all features working"
          ]
        }
      ]
    }
  },

  rollbackProcedure: {
    trigger: "Error rate > 5% for 5 minutes",
    steps: [
      "1. GitHub Actions detects issue",
      "2. Automatic rollback to previous stable commit",
      "3. Notify team in Slack",
      "4. Post-mortem analysis",
      "5. Fix and redeploy"
    ],
    time: "< 5 minutes"
  },

  checks: {
    eslint: "Lint check - must pass",
    build: "Build must complete without errors",
    tests: "All tests must pass",
    lighthouse: "Score must be > 90",
    coverage: "Code coverage > 80%",
    security: "No critical vulnerabilities"
  }
};