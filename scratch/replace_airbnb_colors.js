const fs = require('fs');

let content = fs.readFileSync('src/components/airbnb-listing-card.tsx', 'utf8');

content = content.replace(/bg-white dark:bg-zinc-900\/40/g, 'bg-surface');
content = content.replace(/bg-white\/80 backdrop-blur-sm hover:bg-white/g, 'bg-background/80 backdrop-blur-sm hover:bg-background');
content = content.replace(/bg-white hover:bg-white/g, 'bg-background hover:bg-background');
content = content.replace(/bg-white shadow-sm/g, 'bg-primary shadow-sm');
content = content.replace(/bg-white\/60 hover:bg-white\/80/g, 'bg-primary/40 hover:bg-primary/60');
content = content.replace(/text-slate-900 dark:text-zinc-100/g, 'text-foreground');
content = content.replace(/text-slate-500 dark:text-zinc-400/g, 'text-muted-foreground');
content = content.replace(/text-slate-800 dark:text-zinc-200/g, 'text-foreground/90');
content = content.replace(/bg-slate-100 dark:bg-zinc-800/g, 'bg-background');

fs.writeFileSync('src/components/airbnb-listing-card.tsx', content);
