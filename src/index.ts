#!/usr/bin/env node
import fs from 'fs';
import linterFactory from './core/lint/linter-factory';
import CLIReporter from './core/reporter/cli-reporter';

async function main() {
  const reportDir = process.cwd() + '/report';
  const outputFileName = 'dblint-report.json';

  if (!fs.existsSync(reportDir)) {
    console.log('Report directory does not exist. Creating...');
    console.log('Directory path:', reportDir);
    fs.mkdirSync(reportDir, { recursive: true });
    console.log('Directory created successfully.');
  }

  const linter = linterFactory();
  const report = await linter.lint();

  const outputFilePath = `${reportDir}/${outputFileName}`;

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
