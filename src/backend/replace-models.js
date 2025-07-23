// Script to replace MySQL models with PostgreSQL versions
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');

// Files to replace
const replacements = [
  {
    from: 'productModel.js',
    to: 'productModel-postgres.js'
  },
  {
    from: 'categoryModel.js', 
    to: 'categoryModel-postgres.js'
  },
  {
    from: 'customerModel.js',
    to: 'customerModel-postgres.js'
  }
];

console.log('🔄 Replacing MySQL models with PostgreSQL versions...\n');

replacements.forEach(({ from, to }) => {
  const fromPath = path.join(modelsDir, from);
  const toPath = path.join(modelsDir, to);
  const backupPath = path.join(modelsDir, `${from}.backup`);

  try {
    // Check if PostgreSQL version exists
    if (!fs.existsSync(toPath)) {
      console.log(`❌ ${to} not found, skipping ${from}`);
      return;
    }

    // Backup original file
    if (fs.existsSync(fromPath)) {
      fs.copyFileSync(fromPath, backupPath);
      console.log(`📦 Backed up ${from} to ${from}.backup`);
    }

    // Replace with PostgreSQL version
    fs.copyFileSync(toPath, fromPath);
    console.log(`✅ Replaced ${from} with PostgreSQL version`);

  } catch (error) {
    console.error(`❌ Error replacing ${from}:`, error.message);
  }
});

console.log('\n🎉 Model replacement complete!');
console.log('\n📝 Next steps:');
console.log('1. Upload updated models to GitHub');
console.log('2. Redeploy backend');
console.log('3. Update frontend to use APIs instead of localStorage');
