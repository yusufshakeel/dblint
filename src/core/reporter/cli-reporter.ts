import cliTable3 from 'cli-table3';
import { Lint } from '../../types/lint';

const printHeader = (content: string)  => console.log('==================== ' + content + ' ====================');
const printSubHeader = (content: string)  => console.log('>>> ' + content);
const printNEmptyLines = (numberOfEmptyLines: number) => console.log('\n'.repeat(numberOfEmptyLines));

const printTabularObjectData = (data: any) => {
  const table = new cliTable3({
    head: Object.keys(data),
    style: {
      head: [] //disable colors in header cells
    }
  });
  const values = Object.values(data) as any[];
  table.push(values);
  console.log(table.toString());
};

const printTabularArrayData = (data: any[]) => {
  const headers = Array.from(new Set(data.map(d => Object.keys(d)).flat()));
  const table = new cliTable3({
    head: headers,
    style: {
      head: [] //disable colors in header cells
    }
  });
  const values = data.map(d => {
    const values: any[] = [];
    headers.forEach(h => {
      if (d[h] !== undefined) {
        values.push(d[h]);
      } else {
        values.push('');
      }
    });
    return values;
  }) as any[][];
  table.push(...values);
  console.log(table.toString());
};

class CLIReporter {
  static report(lint: Lint) {
    printNEmptyLines(1);
    printHeader('🚀  DBLINT  🚀');

    lint.tables.forEach(table => {
      printNEmptyLines(1);
      printHeader(`TABLE: ${table.name}`);
      printSubHeader('Stats');
      printTabularObjectData(table.stats.validations);
      printSubHeader('Suggestion');
      printTabularObjectData({ name: table.name, ...table.suggestion });

      printSubHeader('Columns');
      if (table.columns.length === 0) {
        console.log('No data');
      } else {
        printTabularArrayData(
          table.columns.map(c => ({
            name: c.name,
            ...c.suggestion,
            dataType: c.dataType,
            partOf: c.partOf.join(', ')
          }))
        );
      }

      printSubHeader('Constraints');
      if (table.constraints.length === 0) {
        console.log('No data');
      } else {
        printTabularArrayData(
          table.constraints.map(c => ({
            name: c.name,
            ...c.suggestion,
            type: c.type
          }))
        );
      }

      printSubHeader('Foreign Keys');
      if (table.foreignKeys.length === 0) {
        console.log('No data');
      } else {
        printTabularArrayData(
          table.foreignKeys.map(f => ({
            name: f.name,
            ...f.suggestion,
            columns: f.columns.join(', '),
            refTable: f.referencedTable,
            refColumns: f.referencedColumns.join(', ')
          }))
        );
      }

      printSubHeader('Indexes');
      if (table.indexes.length === 0) {
        console.log('No data');
      } else {
        printTabularArrayData(
          table.indexes.map(i => ({
            name: i.name,
            ...i.suggestion,
            columns: i.columns.join(', '),
            type: i.type
          }))
        );
      }

      printSubHeader('Triggers');
      if (table.triggers.length === 0) {
        console.log('No data');
      } else {
        printTabularArrayData(
          table.triggers.map(t => ({
            name: t.name,
            ...t.suggestion,
            columns: t.columns.join(', '),
            timing: t.timing,
            events: t.events.join(', ')
          }))
        );
      }

      if (table.validations.length) {
        printSubHeader('❌ Validations');
        printTabularArrayData(table.validations);
      }
    });

    lint.views.forEach(view => {
      printNEmptyLines(1);
      printHeader(`VIEW: ${view.name}`);
      printSubHeader('Stats');
      printTabularObjectData(view.stats.validations);
      printSubHeader('Suggestion');
      printTabularObjectData({ name: view.name, ...view.suggestion });

      if (view.validations.length) {
        printSubHeader('❌ Validations');
        printTabularArrayData(view.validations);
      }
    });

    printNEmptyLines(1);
    printHeader('⚡ Summary ⚡');
    printTabularObjectData(lint.stats.validations);

    printNEmptyLines(1);
    if (lint.stats.validations.error === lint.stats.validations.ignoredError) {
      console.log('✅ All good!');
    } else {
      console.log('❌ You have some errors. Please fix them and try again.');
    }
  }
}

export default CLIReporter;
