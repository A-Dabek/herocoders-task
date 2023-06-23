async function task() {
  const response = await fetch(
    "https://herocoders.atlassian.net/rest/api/3/project/SP/components"
  );
  const body = await response.json();
  const componentsWithoutLead = body.filter((component) => !component.lead);
  const componentNames = componentsWithoutLead.map(
    (component) => component.name
  );

  const jql = `project = SP AND component in (${componentNames.join(", ")})`;
  const encodedJql = encodeURI(jql);

  const issuesResponse = await fetch(
    `https://herocoders.atlassian.net/rest/api/3/search?jql=${jql}`
  );
  const issuesBody = await issuesResponse.json();
  const issues = issuesBody.issues;
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

task().then(console.log);
