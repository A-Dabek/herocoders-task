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

module.exports = {
  JiraBoardController,
};
