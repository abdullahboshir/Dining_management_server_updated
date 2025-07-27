import crypto from 'crypto';

// Generate comment ID: cmd-<createdAt>-<random>
export const generateCommentId = () => {
  const timestamp = Date.now(); // Unix timestamp in milliseconds
  const random = crypto.randomBytes(4).toString('hex'); // 8-character random string
  return `cmd-${timestamp}-${random}`; // Example: cmd-1712345678901-ab12cd34
};