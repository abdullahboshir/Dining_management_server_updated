import mongoose from 'mongoose';

const migrationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  runAt: { type: Date, default: Date.now },
});

export const Migration = mongoose.model('Migration', migrationSchema);
