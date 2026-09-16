import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

for (const workflowName of ['ci', 'deploy']) {
  test(`Pages ${workflowName} verifies consent and attribution tests before building public output`, async () => {
    const workflow = await readFile(new URL(`../.github/workflows/${workflowName}.yml`, import.meta.url), 'utf8');
    const install = workflow.indexOf('- run: npm ci');
    const tests = workflow.indexOf('- run: npm test');
    const build = workflow.indexOf('- run: npm run build');
    assert.ok(install >= 0 && tests > install && build > tests, 'locked install, full tests, then production build');
    assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
  });
}
