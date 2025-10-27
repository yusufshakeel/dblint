import { Lint } from '../../types/lint';

const printHeader = (content: string)  => console.log('==================== ' + content + ' ====================');
const printSubHeader = (content: string)  => console.log('>>> ' + content);
const printNEmptyLines = (numberOfEmptyLines: number) => console.log('\n'.repeat(numberOfEmptyLines));
const printTabularData = (data: any) => console.table(data);

class CLIReporter {
  static report(lint: Lint) {
    printHeader('🚀  DBLINT  🚀');
    printNEmptyLines(1);

    printHeader('TABLES');
    lint.tables.forEach(table => {
      printNEmptyLines(1);
      printSubHeader(`TABLE: ${table.name}`);
      printTabularData({ name: table.name, ...table.suggestion });
    });
  }
}

export default CLIReporter;
