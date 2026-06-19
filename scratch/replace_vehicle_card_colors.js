const fs = require('fs');

let content = fs.readFileSync('src/components/vehicle-card.tsx', 'utf8');

// Container
content = content.replace(/bg-zinc-100/g, 'bg-surface');
content = content.replace(/border-zinc-200/g, 'border-border');

// Title
content = content.replace(/text-slate-900/g, 'text-foreground');

// Rating Pill
content = content.replace(/bg-green-50/g, 'bg-green-500/10');
content = content.replace(/border-green-100/g, 'border-green-500/20');
content = content.replace(/text-green-600/g, 'text-green-600 dark:text-green-400');

// Specs Row Pills
content = content.replace(/bg-slate-100\/80/g, 'bg-surface/80');
content = content.replace(/border-slate-200\/50/g, 'border-border/50');
content = content.replace(/text-slate-700/g, 'text-foreground/80');

// Icons in Specs Row (was hardcoded orange)
content = content.replace(/text-\[\#ff9900\]/g, 'text-accent');

// Price Tag
content = content.replace(/bg-\[\#ff9900\]/g, 'bg-accent');
content = content.replace(/text-white/g, 'text-accent-foreground');

fs.writeFileSync('src/components/vehicle-card.tsx', content);
