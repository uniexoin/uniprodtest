const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add theme-landing to root
content = content.replace(
  /<div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-clip ">/g,
  '<div className="theme-landing flex flex-col min-h-screen bg-background text-foreground overflow-x-clip transition-colors duration-500">'
);

// 2. Replace hardcoded light mode colors
content = content.replace(/bg-white/g, 'bg-surface');
content = content.replace(/bg-slate-50/g, 'bg-background');
content = content.replace(/bg-slate-100/g, 'bg-surface');
content = content.replace(/bg-slate-900/g, 'bg-primary');
content = content.replace(/bg-slate-800/g, 'bg-secondary');

// 3. Text colors
content = content.replace(/text-slate-900/g, 'text-foreground');
content = content.replace(/text-slate-800/g, 'text-foreground');
content = content.replace(/text-slate-700/g, 'text-foreground\/90');
content = content.replace(/text-slate-600/g, 'text-foreground\/90');
content = content.replace(/text-slate-500/g, 'text-muted-foreground');

// 4. Dark mode classes clean up (as we are now mapping things automatically)
// The user's prompt means they want the UI to correctly adapt using CSS variables.
// dark:bg-zinc-900 -> We just let the CSS variables handle the dark mode.
content = content.replace(/dark:bg-zinc-900\/10/g, '');
content = content.replace(/dark:bg-zinc-900\/20/g, '');
content = content.replace(/dark:bg-zinc-900\/40/g, '');
content = content.replace(/dark:bg-zinc-900\/60/g, '');
content = content.replace(/dark:bg-zinc-900/g, '');
content = content.replace(/dark:bg-zinc-800\/50/g, '');
content = content.replace(/dark:bg-zinc-800/g, '');
content = content.replace(/dark:text-zinc-100/g, '');
content = content.replace(/dark:text-zinc-200/g, '');
content = content.replace(/dark:text-zinc-300/g, '');
content = content.replace(/dark:text-zinc-400/g, '');
content = content.replace(/dark:border-zinc-800/g, '');
content = content.replace(/dark:text-slate-300/g, '');
content = content.replace(/dark:text-slate-200/g, '');
content = content.replace(/dark:text-slate-400/g, '');

// Clean up extra spaces
content = content.replace(/  +/g, ' ');

fs.writeFileSync('src/app/page.tsx', content);
