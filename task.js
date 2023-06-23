const { JiraBoardController } = require("./jira-board-controller");
const { IssuesService } = require("./issues-service");
const { HumanFriendlyFormatter } = require("./human-friendly-formatter");

const controller = new JiraBoardController();
const service = new IssuesService(controller);
const formatter = new HumanFriendlyFormatter();

/**
 * Outputs
 *
 * Backend:
 * -  Disable self-mentioning notifications.
 * Synchronization:
 * -  Sync the status of new issue created from a checklist item with that item's status.
 * -  Create CFJS-to-IC funtionalities comparison table in user documentation.
 * Templates:
 * -  Global templates context - ON for all project and issue types by default.
 * -  Templates do not load under Project Pages.
 * -  Apply template according to label added to the issue.
 * -  Edit template UI improvements.
 * -  Add support for renaming statuses to Templates with non-default statuses.
 */
service
  .fetchIssuesSummaryOfComponentsWithoutLead()
  .then((issuesPerComponent) =>
    formatter.formatRecordOfArrays(issuesPerComponent)
  )
  .then(console.log);
