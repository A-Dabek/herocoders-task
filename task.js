class JiraBoardController {
  #baseUrl = "https://herocoders.atlassian.net/rest/api/3";

  async fetchComponents() {
    const response = await fetch(`${this.#baseUrl}/project/SP/components`);
    const components = await response.json();
    return components;
  }

  async fetchIssues(jql) {
    const encodedJql = encodeURI(jql);
    const response = await fetch(`${this.#baseUrl}/search?jql=${jql}`);
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

    const issuesPerComponent = {};
    componentNames.forEach((name) => (issuesPerComponent[name] = []));
    issues.forEach((issue) => {
      const issueName = issue.fields.summary;
      issue.fields.components.forEach((component) => {
        if (!issuesPerComponent[component.name]) return;
        issuesPerComponent[component.name].push(issueName);
      });
    });
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
}

const controller = new JiraBoardController();
const service = new IssuesService(controller);

service.fetchIssuesSummaryOfComponentsWithoutLead().then(console.log);
