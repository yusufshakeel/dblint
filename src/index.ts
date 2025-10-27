#!/usr/bin/env node
import fs from 'fs';
import linterFactory from './core/lint/linter-factory';
import CLIReporter from './core/reporter/cli-reporter';

async function main() {
  const linter = linterFactory();
  const report = await linter.lint();

  const outputFilePath = process.cwd() + '/report/dblint-report.json';

  fs.writeFileSync(outputFilePath, JSON.stringify(report, null, 2));

  CLIReporter.report(report);

  console.log(`\n📁 Report generated at: ${outputFilePath}\n`);

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
