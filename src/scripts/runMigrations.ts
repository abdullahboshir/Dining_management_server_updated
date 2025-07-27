
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { Migration } from './models/migrationLog.model';
// import { main } from '../server';

// // Handle __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// async function runMigrations() {
//   await main();

//   const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

//   for (const file of files) {
//     const filePath = path.join(MIGRATIONS_DIR, file);

//     // ✅ Use dynamic import instead of require
//     const migrationModule = await import(filePath);
//     const migration = migrationModule.default || migrationModule; // Support both default/exported

//     if (!migration?.name || typeof migration?.up !== 'function') {
//       console.warn(`⚠️ Skipping ${file} - invalid migration format`);
//       continue;
//     }

//     const alreadyRun = await Migration.findOne({ name: migration.name });
//     if (alreadyRun) {
//       console.log(`⚠️ Skipping ${migration.name} (already run)`);
//       continue;
//     }

//     try {
//       await migration.up();
//       await Migration.create({ name: migration.name });
//       console.log(`✅ Successfully ran: ${migration.name}`);
//     } catch (err) {
//       console.error(`❌ Failed on migration ${migration.name}:`, err);
//       process.exit(1);
//     }
//   }

//   process.exit();
// }

// runMigrations();
