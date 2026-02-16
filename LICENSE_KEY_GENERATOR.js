// 824AI License Key Generator
// Generate unique license keys to distribute to customers

const crypto = require('crypto');

function generateLicenseKey() {
  // Generate random parts: XXXX-XXXX-XXXX format
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 4);
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 4);
  const part3 = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 4);
  
  return `${part1}-${part2}-${part3}`;
}

// Generate 10 sample keys
console.log('824AI License Keys Generated\n' + '='.repeat(40));
for (let i = 0; i < 10; i++) {
  console.log(`Key ${i + 1}: ${generateLicenseKey()}`);
}

console.log('\n' + '='.repeat(40));
console.log('Usage: node LICENSE_KEY_GENERATOR.js');
console.log('Generate as many keys as needed for customers');
console.log('\nEach key is valid format: XXXX-XXXX-XXXX');
console.log('Users can only use a key once (check localStorage)');
