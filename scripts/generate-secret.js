#!/usr/bin/env node

const crypto = require('crypto');

// Generate a random 32-byte secret and convert to base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated BETTER_AUTH_SECRET:');
console.log(secret);
console.log('\n📝 Add this to your .env.local file:');
console.log(`BETTER_AUTH_SECRET=${secret}\n`);

