#!/usr/bin/env node
import fs from 'fs';
import linterFactory from './core/lint/linter-factory';
import CLIReporter from './core/reporter/cli-reporter';

async function main() {
  const linter = linterFactory();
  const report = await linter.lint();

  fs.writeFileSync('./report/dblint-report.json', JSON.stringify(report, null, 2));

  CLIReporter.report(report);

  if (report.stats.validations.error !== report.stats.validations.ignoredError) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
