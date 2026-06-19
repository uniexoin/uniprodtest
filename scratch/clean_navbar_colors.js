const fs = require('fs');

let content = fs.readFileSync('src/components/navbar.tsx', 'utf8');

content = content.replace(/bg-black border-t border-white\/10/g, 'bg-surface border-t border-border');
content = content.replace(/text-\[\#ff9900\]/g, 'text-accent');
content = content.replace(/text-white\/50 active:text-white\/80/g, 'text-muted-foreground active:text-foreground');
content = content.replace(/border-\[\#ff9900\] bg-\[\#ff9900\]\/10 shadow-\[0_0_12px_rgba\(255,153,0,0\.4\)\]/g, 'border-accent bg-accent/10 shadow-sm');

fs.writeFileSync('src/components/navbar.tsx', content);
