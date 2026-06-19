const fs = require('fs');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Make vendor tables more spacious
    content = content.replace(/py-3 px-4/g, 'py-4 px-6');
    content = content.replace(/py-4/g, 'py-5');
    content = content.replace(/px-4 sm:px-6/g, 'px-6 sm:px-8');
    
    // Softer borders and premium shadows for vendor analytics cards
    content = content.replace(/shadow-sm/g, 'shadow-premium-soft hover-lift');
    content = content.replace(/rounded-xl/g, 'rounded-2xl');
    
    fs.writeFileSync(filePath, content);
}

replaceInFile('src/app/dashboard/vendor-analytics.tsx');
replaceInFile('src/app/dashboard/page.tsx');
