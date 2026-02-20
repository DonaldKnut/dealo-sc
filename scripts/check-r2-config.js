/**
 * Script to check R2 configuration
 * Run with: node scripts/check-r2-config.js
 */

const requiredEnvVars = [
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
  'R2_ACCOUNT_ID'
];

console.log('🔍 Checking R2 Configuration...\n');

const missing = [];
const present = [];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    present.push(varName);
    // Mask sensitive values
    if (varName.includes('KEY') || varName.includes('SECRET')) {
      const value = process.env[varName];
      console.log(`✅ ${varName}: ${value.substring(0, 8)}...${value.substring(value.length - 4)}`);
    } else {
      console.log(`✅ ${varName}: ${process.env[varName]}`);
    }
  } else {
    missing.push(varName);
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n📊 Summary:');
console.log(`✅ Present: ${present.length}/${requiredEnvVars.length}`);
console.log(`❌ Missing: ${missing.length}/${requiredEnvVars.length}`);

if (missing.length > 0) {
  console.log('\n⚠️  Missing environment variables:');
  missing.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 Make sure these are set in your .env.local file');
  process.exit(1);
} else {
  console.log('\n✅ All R2 environment variables are set!');
  
  // Validate endpoint format
  const endpoint = process.env.R2_ENDPOINT;
  if (endpoint && !endpoint.includes('r2.cloudflarestorage.com')) {
    console.log(`\n⚠️  Warning: R2_ENDPOINT format might be incorrect: ${endpoint}`);
    console.log('   Expected format: https://<account-id>.r2.cloudflarestorage.com');
  }
  
  process.exit(0);
}


