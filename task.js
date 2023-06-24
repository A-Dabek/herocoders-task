const { JiraBoardController } = require("./jira-board-controller");
const { IssuesService } = require("./issues-service");

const controller = new JiraBoardController("SP");
const service = new IssuesService(controller);

/**
 * Outputs
 *
 * Components without a lead:
 * Backend [1 issue(s)].
 * Synchronization [2 issue(s)].
 * Templates [5 issue(s)].
 */
service
  .fetchComponentsWithoutLeadWithIssueCount()
  .then((issuesPerComponent) =>
    Object.entries(issuesPerComponent)
      .map(([component, count]) => `${component} [${count} issue(s)].\n`)
      .join("")
  )
  .then((componentsSummary) =>
    console.log(`Components without a lead:\n${componentsSummary}`)
  );
