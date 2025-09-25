const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to process files recursively
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file === 'node_modules' || file === '.next' || file === '.git') {
        return;
      }
      processDirectory(fullPath);
    } else {
      // Process TypeScript files
      if (file.endsWith('.tsx')) {
        convertFile(fullPath, '.jsx');
      } else if (file.endsWith('.ts')) {
        convertFile(fullPath, '.js');
      } else if (file === 'next-env.d.ts') {
        // Remove TypeScript declaration file
        fs.unlinkSync(fullPath);
      }
    }
  });
}

// Function to convert a single file
function convertFile(filePath, newExt) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove TypeScript-specific syntax
    content = content
      // Remove type annotations
      .replace(/\s*:\s*[\w\[\]{}|<>]+(?=,|;|\s*[=)])/g, '')
      // Remove interface and type declarations
      .replace(/export\s+(interface|type)\s+\w+\s*({[^}]*}|[^;{]*);?/g, '')
      // Remove 'as' type assertions
      .replace(/\s+as\s+[\w\[\]{}|<>]+/g, '')
      // Remove 'import type' and 'export type'
      .replace(/import\s+type\s+/g, 'import ')
      .replace(/export\s+type\s+/g, 'export ');
    
    // Create new file path with .js or .jsx extension
    const newFilePath = filePath.replace(/\.tsx?$/, newExt);
    
    // Write the converted content to the new file
    fs.writeFileSync(newFilePath, content);
    
    // Remove the original TypeScript file
    fs.unlinkSync(filePath);
    
    console.log(`Converted: ${filePath} -> ${newFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to update imports in all JavaScript files
function updateImports(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file === '.next' || file === '.git') {
        return;
      }
      updateImports(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      updateFileImports(fullPath);
    }
  });
}

// Function to update imports in a single file
function updateFileImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update import/require paths to remove .ts/.tsx extensions
    content = content
      .replace(/(from\s+['"]\.*?)\.tsx?(['"])/g, '$1$2')
      .replace(/(require\(['"]\.*?)\.tsx?(['"]\))/g, '$1$2');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated imports in: ${filePath}`);
  } catch (error) {
    console.error(`Error updating imports in ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  const rootDir = path.join(__dirname);
  
  console.log('Starting TypeScript to JavaScript conversion...');
  
  // Convert .ts/.tsx files to .js/.jsx
  processDirectory(rootDir);
  
  // Update import paths in all JavaScript files
  updateImports(rootDir);
  
  console.log('Conversion completed!');
  
  // Remove TypeScript configuration files
  const tsConfigPath = path.join(rootDir, 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    fs.unlinkSync(tsConfigPath);
    console.log('Removed tsconfig.json');
  }
  
  console.log('\nNext steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run dev');
}

main();
