const { JiraBoardController } = require("./jira-board-controller");
const { IssuesService } = require("./issues-service");

const controller = new JiraBoardController("SP");
const service = new IssuesService(controller);

/**
 * Outputs
 *
 * Components without a lead:
 * Backend (issues: 1).
 * Synchronization (issues: 2).
 * Templates (issues: 5).
 */
service
  .fetchComponentsWithoutLeadWithIssueCount()
  .then((issuesPerComponent) =>
    Object.entries(issuesPerComponent)
      .map(([component, count]) => `${component} (issues: ${count}).\n`)
      .join("")
  )
  .then((componentsSummary) =>
    console.log(`Components without a lead:\n${componentsSummary}`)
  );
