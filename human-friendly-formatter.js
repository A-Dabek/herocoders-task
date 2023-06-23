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

module.exports = {
  HumanFriendlyFormatter,
};
