const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard.tsx', 'utf8');

content = content.replace(/bg-background\/85 dark:bg-zinc-950\/85/g, 'bg-background/85');
content = content.replace(/shadow-slate-100\/10 dark:shadow-none/g, 'shadow-border/10');
content = content.replace(/bg-background dark:bg-zinc-900\/60/g, 'bg-surface');
content = content.replace(/hover:border-slate-300 dark:hover:border-zinc-700/g, 'hover:border-primary/50');
content = content.replace(/border border-border dark:border-zinc-800/g, 'border border-border');
content = content.replace(/text-foreground\/80 dark:text-zinc-300/g, 'text-muted-foreground');
content = content.replace(/text-foreground dark:text-zinc-200/g, 'text-foreground');
content = content.replace(/bg-slate-900 dark:bg-zinc-100/g, 'bg-foreground');
content = content.replace(/bg-slate-100 dark:bg-zinc-800/g, 'bg-surface border border-border/50');
content = content.replace(/bg-zinc-100 border-2 border-zinc-300/g, 'bg-surface border-2 border-border');
content = content.replace(/bg-white border border-zinc-200/g, 'bg-background border border-border');
content = content.replace(/hover:bg-white dark:bg-zinc-900\/60/g, 'hover:bg-surface');

fs.writeFileSync('src/components/dashboard.tsx', content);
