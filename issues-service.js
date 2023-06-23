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

module.exports = {
  IssuesService,
};
