import { Lint } from '../../types/lint';

export interface Linter {
    lint: () => Promise<Lint>;
}
