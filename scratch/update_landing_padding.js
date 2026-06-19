const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Section paddings
content = content.replace(/py-16 md:py-24/g, 'py-24 md:py-32');
content = content.replace(/py-16/g, 'py-24 md:py-32');
content = content.replace(/px-4 sm:px-6/g, 'px-6 md:px-12 lg:px-24');

// Border radius for mockups / images
content = content.replace(/rounded-xl/g, 'rounded-3xl');
content = content.replace(/rounded-2xl/g, 'rounded-[2rem]');
content = content.replace(/border-8/g, 'border-[12px]');

// Animations easing softening (stiffness: 100, damping: 20)
content = content.replace(/stiffness: 260, damping: 20/g, 'stiffness: 120, damping: 20');

// Shadows
content = content.replace(/shadow-xl/g, 'shadow-premium-soft');
content = content.replace(/shadow-2xl/g, 'shadow-premium-deep');

fs.writeFileSync('src/app/page.tsx', content);
