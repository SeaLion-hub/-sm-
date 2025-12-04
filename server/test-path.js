
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname as .../server/dist
const mockDirname = '/Users/user/project/server/dist';

const path1 = path.join(mockDirname, '../dist');
const path2 = path.join(mockDirname, '../../dist');

console.log('Current:', mockDirname);
console.log('../dist:', path1);
console.log('../../dist:', path2);
