/**
 * @typedef {import('./jira-board-controller').Component} Component
 * @typedef {import('./jira-board-controller').Issue} Issue
 */

class IssuesService {
  taskBoardController;

  constructor(taskBoardController) {
    this.taskBoardController = taskBoardController;
  }

  /**
   * Fetches components without a lead and the number of issues assigned to them.
   * @returns {Promise<{[componentName: string]: number}>}
   */
  async fetchComponentsWithoutLeadWithIssueCount() {
    const componentNames = await this.#fetchComponentNamesWithoutLead();
    const issues = await this.#fetchIssuesOfComponents(componentNames);
    const issuesPerComponent = this.#countIssuesByComponent(
      issues,
      componentNames
    );
    return issuesPerComponent;
  }

  /**
   * @returns {Promise<string[]>}
   */
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

  /**
   * @param {string[]} componentNames
   * @returns {Promise<Issue[]>}
   */
  async #fetchIssuesOfComponents(componentNames) {
    return this.taskBoardController.fetchIssues({
      hasComponent: componentNames,
    });
  }

  /**
   * @param {Issue[]} issues
   * @param {string[]} componentNames
   * @returns {{[componentName: string]: number}}
   */
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
