const fs = require('fs');

let content = fs.readFileSync('src/app/vehicles/[id]/page.tsx', 'utf8');

// Replace standard colors to semantic
content = content.replace(/bg-white/g, 'bg-background');
content = content.replace(/bg-slate-50/g, 'bg-surface');
content = content.replace(/bg-slate-100/g, 'bg-surface border-border');
content = content.replace(/bg-zinc-100/g, 'bg-surface');
content = content.replace(/text-slate-900/g, 'text-foreground');
content = content.replace(/text-slate-800/g, 'text-foreground');
content = content.replace(/text-slate-700/g, 'text-muted-foreground');
content = content.replace(/text-slate-600/g, 'text-foreground/90');
content = content.replace(/text-slate-500/g, 'text-muted-foreground');
content = content.replace(/text-orange-500/g, 'text-accent');
content = content.replace(/text-\[\#ff9900\]/g, 'text-accent');
content = content.replace(/bg-\[\#ff9900\]/g, 'bg-accent');
content = content.replace(/border-slate-100/g, 'border-border');
content = content.replace(/bg-black\/70 text-white/g, 'bg-background/70 text-foreground');
content = content.replace(/bg-black\/60 text-white/g, 'bg-background/60 text-foreground');
content = content.replace(/text-white/g, 'text-accent-foreground'); // Assuming the main orange buttons use text-white

// Adding the theme wrapper class to the main div
content = content.replace(
  /<div className="min-h-screen bg-background pb-24 font-sans">/, 
  '<div className="theme-car min-h-screen bg-background text-foreground pb-24 font-sans transition-colors duration-500">'
);

fs.writeFileSync('src/app/vehicles/[id]/page.tsx', content);
