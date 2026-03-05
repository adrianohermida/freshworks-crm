export const SUPPORT_GUIDE = {
  title: "🤝 Support & Documentation Guide",
  
  supportChannels: {
    email: {
      address: "support@example.com",
      responseTime: {
        critical: "1 hour",
        high: "4 hours",
        medium: "24 hours",
        low: "48 hours"
      }
    },
    
    discord: {
      link: "https://discord.gg/example",
      channels: {
        announcements: "Updates & announcements",
        support: "General support questions",
        bugs: "Bug reports",
        features: "Feature requests",
        general: "Community discussion"
      }
    },
    
    documentation: {
      readme: "Setup & installation guide",
      releaseNotes: "What's new in v1.0.0",
      faq: "Frequently asked questions",
      troubleshooting: "Common issues & solutions",
      api: "API documentation",
      deployment: "Deployment guide"
    }
  },

  documentation: [
    {
      title: "Getting Started",
      docs: [
        "📖 Quick Start Guide",
        "🔐 API Authentication",
        "⚙️ Configuration",
        "🚀 Deployment Options"
      ]
    },
    {
      title: "Features",
      docs: [
        "📊 Dashboard",
        "🎫 Ticket Management",
        "👥 Contacts",
        "🤖 AI Analysis",
        "📊 Analytics",
        "⚙️ Automations"
      ]
    },
    {
      title: "Technical",
      docs: [
        "🏗️ Architecture",
        "📦 API Reference",
        "🔌 Integrations",
        "🧪 Testing",
        "📈 Performance"
      ]
    },
    {
      title: "Troubleshooting",
      docs: [
        "❌ Common Issues",
        "🐛 Debugging",
        "⚡ Performance",
        "🌐 Offline Mode",
        "📱 Mobile Issues"
      ]
    }
  ],

  bugReportingProcess: {
    title: "🐛 Reporting Bugs",
    steps: [
      "1. Check FAQ first",
      "2. Search existing issues",
      "3. Provide reproduction steps",
      "4. Include browser/OS info",
      "5. Attach screenshots if relevant"
    ],
    template: {
      title: "Clear bug title",
      reproduction: "Step-by-step reproduction",
      expected: "Expected behavior",
      actual: "Actual behavior",
      environment: "Browser, OS, version"
    }
  },

  featureRequestProcess: {
    title: "💡 Requesting Features",
    steps: [
      "1. Check if already requested",
      "2. Describe use case",
      "3. Suggest implementation",
      "4. Vote on existing requests"
    ]
  },

  businessHours: {
    timezone: "America/Manaus (BRT)",
    weekdays: "Monday-Friday, 9:00-18:00",
    weekend: "Saturday-Sunday - Limited support",
    holidays: "Closed on Brazilian holidays"
  },

  sla: {
    critical: {
      severity: "System down, data loss",
      responseTime: "1 hour",
      resolution: "4 hours"
    },
    high: {
      severity: "Major feature broken",
      responseTime: "4 hours",
      resolution: "24 hours"
    },
    medium: {
      severity: "Feature partially broken",
      responseTime: "24 hours",
      resolution: "72 hours"
    },
    low: {
      severity: "Minor issues",
      responseTime: "48 hours",
      resolution: "1 week"
    }
  },

  resources: {
    community: "Join our Discord community",
    blog: "Read tutorials and updates",
    status: "Check system status",
    changelog: "View changelog",
    roadmap: "See planned features"
  }
};