const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetReplacement = "typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` : 'https://e-rentals.in/og-image.jpg'";

walkDir('C:\\Users\\vikas\\Desktop\\e-rentals.in\\erentals-frontend\\src\\app', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Pattern: url: logoUrl,
    if (content.match(/url:\s*logoUrl,/)) {
       content = content.replace(/url:\s*logoUrl,/g, 'url: ' + targetReplacement + ',');
       changed = true;
    }
    
    // Pattern: images: [logoUrl]
    if (content.match(/images:\s*\[logoUrl\]/)) {
       content = content.replace(/images:\s*\[logoUrl\]/g, 'images: [' + targetReplacement + ']');
       changed = true;
    }

    // Pattern explicit
    if (content.includes('images: [typeof process')) {
       // Just find any images array that has e-rental-logo.png
       const regex = /images:\s*\[[^\]]+e-rental-logo\.png[^\]]+\]/g;
       if (regex.test(content)) {
           content = content.replace(regex, 'images: [' + targetReplacement + ']');
           changed = true;
       }
    }

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Updated OG Image in ' + filePath);
    }
  }
});
