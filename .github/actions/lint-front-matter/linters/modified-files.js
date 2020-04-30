const core = require('@actions/core');
const getYamlFrontMatter = require('../utils/get-yaml-front-matter');
const hasProperty = require('../rules/has-property');
const sortResultsByStatus = require('../utils/sort-results-by-status');

/**
 * Run all modified files through a set of rules.
 * @param {Array<string>} files Files that should be linted.
 * @return {Array<Object>} Results objects from each check.
 */
module.exports = async (files) => {
  core.debug(`modified-files linting ${files.length}: ${files}`);
  const out = [];
  for (file of files) {
    core.debug(`modified-files file: ${file}`);
    const results = [];
    const frontMatter = await getYamlFrontMatter(file);

    // Tests ---------------------------------------------------
    results.push(hasProperty.test(frontMatter, 'updated'));
    // ---------------------------------------------------------

    const {passes, failures, warnings} = sortResultsByStatus(results);
    out.push({file, passes, failures, warnings});
  }
  return out;
};
