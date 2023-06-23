class JiraBoardController {
  #baseUrl = "https://herocoders.atlassian.net/rest/api/3";

  async fetchComponents() {
    const response = await fetch(`${this.#baseUrl}/project/SP/components`);
    const components = await response.json();
    return components;
  }

  async fetchIssues(jql) {
    const encodedJql = encodeURI(jql);
    const response = await fetch(`${this.#baseUrl}/search?jql=${encodedJql}`);
    const body = await response.json();
    return body.issues;
  }
}

class IssuesService {
  taskBoardController;

  constructor(taskBoardController) {
    this.taskBoardController = taskBoardController;
  }

  async fetchIssuesSummaryOfComponentsWithoutLead() {
    const componentNames = await this.#fetchComponentNamesWithoutLead();
    const issues = await this.#fetchIssuesOfComponents(componentNames);
    const issuesPerComponent = this.#groupIssuesByComponent(
      issues,
      componentNames
    );
    return issuesPerComponent;
  }

  async #fetchComponentNamesWithoutLead() {
    const components = await this.taskBoardController.fetchComponents();
    const componentsWithoutLead = components.filter(
      (component) => !component.lead
    );
    const componentNames = componentsWithoutLead.map(
      (component) => component.name
    );
    return componentNames;
  }

  async #fetchIssuesOfComponents(componentNames) {
    const query = `project = SP AND component in (${componentNames.join(
      ", "
    )})`;
    return this.taskBoardController.fetchIssues(query);
  }

  #groupIssuesByComponent(issues, componentNames) {
    const issuesPerComponent = componentNames.reduce(
      (acc, name) => ({ ...acc, [name]: [] }),
      {}
    );
    issues.forEach((issue) => {
      const { summary, components } = issue.fields;
      components
        .filter((component) => issuesPerComponent[component.name])
        .forEach((component) =>
          issuesPerComponent[component.name].push(summary)
        );
    });
    return issuesPerComponent;
  }
}

class HumanFriendlyFormatter {
  #makeBulletPoints(items) {
    return items.map((item) => `- ${item}.`).join("\n");
  }

  formatRecordOfArrays(record) {
    return Object.entries(record)
      .map(([header, items]) => {
        return `${header}:\n${this.#makeBulletPoints(items)}`;
      })
      .join("\n");
  }
}

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
