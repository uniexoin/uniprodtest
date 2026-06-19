const fs = require('fs');
let content = fs.readFileSync('src/components/footer.tsx', 'utf8');

content = content.replace(/<footer className="relative overflow-hidden w-full mt-auto has-bottom-nav md:pb-0 theme-landing" style={{ background: 'linear-gradient\\(170deg, #0D1B2A 0%, #111827 60%, #0D1B2A 100%\\)' }}>/g, '<footer className="relative overflow-hidden w-full mt-auto has-bottom-nav md:pb-0 bg-background border-t border-border">');

content = content.replace(/text-white\/50/g, 'text-muted-foreground');
content = content.replace(/text-white\/30/g, 'text-muted-foreground');
content = content.replace(/text-white\/40/g, 'text-muted-foreground');
content = content.replace(/text-white\/10/g, 'border-border');
content = content.replace(/border-white\/10/g, 'border-border');
content = content.replace(/bg-white\/5/g, 'bg-secondary');
content = content.replace(/bg-white\/10/g, 'bg-secondary/80');
content = content.replace(/text-white/g, 'text-foreground');
content = content.replace(/bg-zinc-950\/85/g, 'bg-background/95');

fs.writeFileSync('src/components/footer.tsx', content);
