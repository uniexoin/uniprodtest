const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Remove theme-landing
content = content.replace(/theme-landing/g, '');

// Replace bg-white in mockups - wait, there are none explicitly mentioned as bg-white in the snippet, but let's check
content = content.replace(/bg-white\b/g, 'bg-surface dark:bg-zinc-900');

// Text slate replacements
content = content.replace(/text-slate-900/g, 'text-foreground');
content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');
content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-400');
content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');

// Border and bg slate replacements
content = content.replace(/border-slate-100/g, 'border-slate-100 dark:border-zinc-800');
content = content.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-zinc-800');
content = content.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-zinc-800/50');

// Specifically for mockups
content = content.replace(/bg-blue-50/g, 'bg-blue-50 dark:bg-blue-950/20');
content = content.replace(/border-blue-100/g, 'border-blue-100 dark:border-blue-900/30');

content = content.replace(/bg-orange-50/g, 'bg-orange-50 dark:bg-orange-950/20');
content = content.replace(/border-orange-100/g, 'border-orange-100 dark:border-orange-900/30');

content = content.replace(/bg-emerald-50/g, 'bg-emerald-50 dark:bg-emerald-950/20');
content = content.replace(/border-emerald-100/g, 'border-emerald-100 dark:border-emerald-900/30');

content = content.replace(/bg-cyan-50/g, 'bg-cyan-50 dark:bg-cyan-950/20');
content = content.replace(/border-cyan-100/g, 'border-cyan-100 dark:border-cyan-900/30');

fs.writeFileSync('src/app/page.tsx', content);
