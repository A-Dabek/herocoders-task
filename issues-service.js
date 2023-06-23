class IssuesService {
  taskBoardController;

  constructor(taskBoardController) {
    this.taskBoardController = taskBoardController;
  }

  async fetchComponentsWithoutLeadWithIssueCount() {
    const componentNames = await this.#fetchComponentNamesWithoutLead();
    const issues = await this.#fetchIssuesOfComponents(componentNames);
    const issuesPerComponent = this.#countIssuesByComponent(
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
    const query = `component in (${componentNames.join(", ")})`;
    return this.taskBoardController.fetchIssues(query);
  }

  #countIssuesByComponent(issues, componentNames) {
    const issuesPerComponent = componentNames.reduce(
      (acc, name) => ({ ...acc, [name]: 0 }),
      {}
    );
    issues.forEach((issue) => {
      const { components } = issue.fields;
      components
        .filter((component) => issuesPerComponent[component.name] != null)
        .forEach((component) => (issuesPerComponent[component.name] += 1));
    });
    return issuesPerComponent;
  }
}

module.exports = {
  IssuesService,
};
