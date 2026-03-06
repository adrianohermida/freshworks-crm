export const QA_TEST_PLAN = {
  version: "1.0.0",
  date: "2026-03-04",
  
  scope: "Complete functional testing of Freshdesk Manager v1.0.0",
  
  testCases: {
    dashboard: [
      {
        id: "TC-001",
        name: "Dashboard loads with KPIs",
        steps: [
          "1. Navigate to Dashboard",
          "2. Wait for data load",
          "3. Verify 5 KPI cards displayed"
        ],
        expected: "All KPIs visible with correct data",
        priority: "Critical"
      },
      {
        id: "TC-002",
        name: "Charts render correctly",
        steps: [
          "1. Scroll to charts section",
          "2. Verify status chart",
          "3. Verify priority chart",
          "4. Verify timeline chart"
        ],
        expected: "All 3 charts visible and interactive",
        priority: "Critical"
      }
    ],

    tickets: [
      {
        id: "TC-003",
        name: "List tickets with filters",
        steps: [
          "1. Navigate to Tickets",
          "2. Wait for tickets to load",
          "3. Apply status filter",
          "4. Apply priority filter"
        ],
        expected: "Tickets filtered correctly",
        priority: "Critical"
      },
      {
        id: "TC-004",
        name: "Create new ticket",
        steps: [
          "1. Click 'New Ticket'",
          "2. Fill required fields",
          "3. Submit form"
        ],
        expected: "Ticket created successfully",
        priority: "Critical"
      },
      {
        id: "TC-005",
        name: "Edit ticket",
        steps: [
          "1. Select a ticket",
          "2. Click edit",
          "3. Change fields",
          "4. Save changes"
        ],
        expected: "Ticket updated successfully",
        priority: "High"
      },
      {
        id: "TC-006",
        name: "Analyze ticket with AI",
        steps: [
          "1. Open a ticket",
          "2. Click 'Analyze with AI'",
          "3. Wait for analysis"
        ],
        expected: "Analysis shown with summary + suggestion",
        priority: "High"
      }
    ],

    contacts: [
      {
        id: "TC-007",
        name: "List contacts",
        steps: [
          "1. Navigate to Contacts",
          "2. Wait for data load"
        ],
        expected: "All contacts displayed",
        priority: "High"
      },
      {
        id: "TC-008",
        name: "Search contact",
        steps: [
          "1. Use search box",
          "2. Enter contact name"
        ],
        expected: "Results filtered correctly",
        priority: "Medium"
      }
    ],

    agents: [
      {
        id: "TC-009",
        name: "List agents",
        steps: [
          "1. Navigate to Agents",
          "2. View agent list with status"
        ],
        expected: "Agents displayed with correct status",
        priority: "Medium"
      }
    ],

    settings: [
      {
        id: "TC-010",
        name: "Access all settings tabs",
        steps: [
          "1. Navigate to Settings",
          "2. Check each tab is accessible"
        ],
        expected: "All 15+ tabs accessible",
        priority: "High"
      }
    ],

    performance: [
      {
        id: "TC-011",
        name: "Dashboard loads < 3 seconds",
        steps: [
          "1. Refresh Dashboard page",
          "2. Measure load time"
        ],
        expected: "Load time < 3 seconds",
        priority: "Critical"
      },
      {
        id: "TC-012",
        name: "Ticket list < 2 seconds",
        steps: [
          "1. Navigate to Tickets",
          "2. Measure load time"
        ],
        expected: "Load time < 2 seconds",
        priority: "Critical"
      }
    ],

    offline: [
      {
        id: "TC-013",
        name: "App works offline",
        steps: [
          "1. Enable offline mode (DevTools)",
          "2. Navigate through app"
        ],
        expected: "All pages accessible offline",
        priority: "Critical"
      },
      {
        id: "TC-014",
        name: "Sync when back online",
        steps: [
          "1. Go offline",
          "2. Make changes",
          "3. Go back online"
        ],
        expected: "Changes synced automatically",
        priority: "High"
      }
    ],

    mobile: [
      {
        id: "TC-015",
        name: "Dashboard on mobile 375px",
        steps: [
          "1. Open DevTools",
          "2. Set viewport to 375px",
          "3. Navigate Dashboard"
        ],
        expected: "Layout adapts correctly",
        priority: "Critical"
      },
      {
        id: "TC-016",
        name: "Buttons touch-friendly",
        steps: [
          "1. Check button sizes",
          "2. Test on mobile device"
        ],
        expected: "All buttons 48x48px minimum",
        priority: "High"
      }
    ]
  },

  regressionTests: [
    "Dashboard KPIs accuracy",
    "Ticket sync from Freshdesk",
    "Analytics tracking",
    "Error logging",
    "Authentication",
    "Offline queue",
    "Export functionality"
  ],

  environmentsToTest: [
    "Chrome latest",
    "Firefox latest",
    "Safari latest",
    "Edge latest",
    "iPhone 14",
    "Pixel 7",
    "iPad"
  ],

  passCriteria: {
    functional: "All critical tests passing",
    performance: "Lighthouse > 90",
    accessibility: "WCAG 2.1 AA compliant",
    coverage: "> 80% of features tested"
  }
};