const fs = require('fs');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Background wrappers
    content = content.replace(/bg-slate-50\/50(?! dark:bg-zinc-950)/g, 'bg-slate-50/50 dark:bg-zinc-950');
    content = content.replace(/bg-slate-50(?!(\/| dark:))/g, 'bg-slate-50 dark:bg-zinc-800');
    
    // Text Visibility
    content = content.replace(/text-slate-900(?! dark:)/g, 'text-slate-900 dark:text-zinc-100');
    content = content.replace(/text-slate-800(?! dark:)/g, 'text-slate-800 dark:text-zinc-200');
    content = content.replace(/text-slate-700(?! dark:)/g, 'text-slate-700 dark:text-zinc-300');
    content = content.replace(/text-slate-600(?! dark:)/g, 'text-slate-600 dark:text-zinc-400');
    content = content.replace(/text-slate-500(?! dark:)/g, 'text-slate-500 dark:text-zinc-400');
    
    // Loaders & borders
    content = content.replace(/bg-slate-100(?!(\/| dark:))/g, 'bg-slate-100 dark:bg-zinc-800');
    content = content.replace(/border-slate-100(?! dark:)/g, 'border-slate-100 dark:border-zinc-800');
    
    // Cards & Panels
    content = content.replace(/bg-white(?!(\/| dark:))/g, 'bg-white dark:bg-zinc-900/60');

    fs.writeFileSync(filePath, content);
}

replaceInFile('src/components/dashboard.tsx');
replaceInFile('src/app/dashboard/page.tsx');
replaceInFile('src/app/dashboard/vendor-analytics.tsx');
