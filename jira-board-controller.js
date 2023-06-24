/**
 * @typedef {Object} Component
 * @property {string} name - name of the component.
 * @property {Object} lead - lead component.
 *
 * @typedef {Object} IssueFields
 * @property {Component[]} components - components the issue is assigned to.
 *
 * @typedef {Object} Issue
 * @property {IssueFields} fields - fields of the issue.
 */

class JiraBoardController {
  #baseUrl = "https://herocoders.atlassian.net/rest/api/3";
  #project;

  /**
   * @param {string} project - Jira project key.
   */
  constructor(project) {
    this.#project = project;
  }

  /**
   * Fetches components from the Jira board.
   * @returns {Promise<Component[]>} - Components.
   */
  async fetchComponents() {
    const response = await fetch(
      `${this.#baseUrl}/project/${this.#project}/components`
    );
    const components = await response.json();
    return components;
  }

  /**
   * Fetches issues from the Jira board.
   * @param {Object} options - options to filter the issues.
   * @param {string[]} options.hasComponent - components that the issues must be assigned to.
   * @returns {Promise<Issue[]>} - Issues.
   */
  async fetchIssues(options) {
    const hasComponentQuery = options.hasComponent
      ? `component in (${options.hasComponent.join(", ")})`
      : "";
    const projectQuery = `project = ${this.#project}`;
    const jql = [projectQuery, hasComponentQuery]
      .filter((x) => !!x)
      .join(" AND ");
    const encodedJql = encodeURI(jql);
    const response = await fetch(`${this.#baseUrl}/search?jql=${encodedJql}`);
    const body = await response.json();
    return body.issues;
  }
}

module.exports = {
  JiraBoardController,
};
