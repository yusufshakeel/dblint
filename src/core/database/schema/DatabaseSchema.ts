import { Schema } from '../../../types/database';

interface DatabaseSchema {
    getSchema: () => Promise<Schema>;
}

export default DatabaseSchema;
