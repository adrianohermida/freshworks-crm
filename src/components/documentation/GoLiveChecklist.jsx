export const GO_LIVE_CHECKLIST = {
  title: "✅ Production Go-Live Checklist",
  date: "2026-03-04",
  
  preGoLive: {
    title: "24 Hours Before Launch",
    tasks: [
      {
        item: "Backup all data",
        status: "pending",
        owner: "DevOps"
      },
      {
        item: "Final security audit",
        status: "pending",
        owner: "Security"
      },
      {
        item: "Database optimization",
        status: "pending",
        owner: "DBA"
      },
      {
        item: "Cache warming",
        status: "pending",
        owner: "DevOps"
      },
      {
        item: "Monitoring setup",
        status: "pending",
        owner: "DevOps"
      },
      {
        item: "Rollback plan review",
        status: "pending",
        owner: "Ops"
      },
      {
        item: "Communication plan",
        status: "pending",
        owner: "Product"
      }
    ]
  },

  launchDay: {
    title: "Launch Day - H (Hour)",
    timeline: [
      {
        time: "H-4:00",
        task: "Team standup and final checks",
        owner: "All"
      },
      {
        time: "H-2:00",
        task: "Announce maintenance window (if needed)",
        owner: "Communication"
      },
      {
        time: "H-1:00",
        task: "Final smoke tests",
        owner: "QA"
      },
      {
        time: "H-0:30",
        task: "Production database backup",
        owner: "DBA"
      },
      {
        time: "H-0:15",
        task: "Disable external webhooks (if needed)",
        owner: "DevOps"
      },
      {
        time: "H+0:00",
        task: "Deploy to production",
        owner: "DevOps"
      },
      {
        time: "H+0:05",
        task: "Verify deployment",
        owner: "QA"
      },
      {
        time: "H+0:15",
        task: "Run health checks",
        owner: "Monitoring"
      },
      {
        time: "H+0:30",
        task: "Announce to users",
        owner: "Communication"
      },
      {
        time: "H+1:00",
        task: "First metrics review",
        owner: "Product"
      }
    ]
  },

  postGoLive: {
    title: "7-Day Post-Launch Monitoring",
    dailyChecks: [
      "System uptime > 99.9%",
      "Error rate < 0.1%",
      "API response time < 500ms",
      "User feedback review",
      "Analytics trending check",
      "Performance metrics stable"
    ],
    
    day1: [
      "Immediate issue response",
      "User feedback collection",
      "Performance baseline",
      "Team debriefing"
    ],
    
    day3: [
      "Scaling assessment",
      "Performance tuning",
      "Documentation update",
      "Known issues log"
    ],
    
    day7: [
      "Post-launch report",
      "Retrospective meeting",
      "Performance analysis",
      "Release success metrics"
    ]
  },

  metrics: {
    success_criteria: {
      uptime: "> 99.9%",
      errorRate: "< 0.1%",
      responseTime: "< 500ms",
      userSatisfaction: "> 4.5/5",
      pageLoadTime: "< 3s"
    },
    
    alertThresholds: {
      critical: {
        uptime: "< 99%",
        errorRate: "> 1%",
        responseTime: "> 2000ms"
      },
      warning: {
        uptime: "< 99.5%",
        errorRate: "> 0.5%",
        responseTime: "> 1000ms"
      }
    }
  },

  rollbackTriggers: [
    "System downtime > 30 minutes",
    "Error rate > 5%",
    "Data corruption detected",
    "Security breach detected",
    "User data loss"
  ],

  communication: {
    prelaunch: "Notify users 48h before",
    during: "Real-time status updates",
    postlaunch: "Weekly updates for 1 month"
  },

  team: {
    lead: "Product Manager",
    devOps: "DevOps Engineer",
    dba: "Database Administrator",
    qa: "QA Lead",
    support: "Support Team Lead",
    communication: "Communications Manager"
  }
};