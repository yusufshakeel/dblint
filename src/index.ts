#!/usr/bin/env node
import linterFactory from './core/lint/linter-factory';
import { Lint } from './types/lint';

export async function dblint(): Promise<Lint> {
  const linter = linterFactory();
  return await linter.lint();
}
