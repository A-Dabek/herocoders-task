class JiraBoardController {
  #baseUrl = "https://herocoders.atlassian.net/rest/api/3";
  #project;

  constructor(project) {
    this.#project = project;
  }

  async fetchComponents() {
    const response = await fetch(
      `${this.#baseUrl}/project/${this.#project}/components`
    );
    const components = await response.json();
    return components;
  }

  async fetchIssues(jql) {
    const encodedJql = encodeURI(`project = ${this.#project} AND ${jql}`);
    const response = await fetch(`${this.#baseUrl}/search?jql=${encodedJql}`);
    const body = await response.json();
    return body.issues;
  }
}

module.exports = {
  JiraBoardController,
};
