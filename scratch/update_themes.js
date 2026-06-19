const fs = require('fs');

let content = fs.readFileSync('src/app/globals.css', 'utf8');

const replacementThemes = `
  /* ── Landing Page Theme ────────────────────── */
  .theme-landing {
    --primary: #0D1B2A;
    --primary-foreground: #FFFFFF;
    --secondary: #1B2A4A;
    --secondary-foreground: #FFFFFF;
    --accent: #C9A84C;
    --accent-foreground: #0D1B2A;
    --background: #E8F1F2;
    --foreground: #0D1B2A;
    --muted-foreground: #1B2A4A90;
    --surface: #F4F4F4;
    --border: #0D1B2A15;
    --ring: #C9A84C;
  }
  .dark .theme-landing {
    --primary: #C9A84C;
    --primary-foreground: #0D1B2A;
    --secondary: #E8F1F2;
    --secondary-foreground: #0D1B2A;
    --accent: #C9A84C;
    --accent-foreground: #FFFFFF;
    --background: #08090C;
    --foreground: #F8FAFC;
    --muted-foreground: #94A3B8;
    --surface: #11131A;
    --border: rgba(255, 255, 255, 0.08);
    --ring: #C9A84C;
  }

  /* ── Car Rental Theme ──────────────────────── */
  .theme-car {
    --primary: #1A3C5E;
    --primary-foreground: #FFFFFF;
    --secondary: #2E6DA4;
    --secondary-foreground: #FFFFFF;
    --accent: #E63946;
    --accent-foreground: #FFFFFF;
    --background: #F8F9FA;
    --foreground: #1A3C5E;
    --muted-foreground: #1A3C5E90;
    --surface: #FFFFFF;
    --border: #B0BEC560;
    --ring: #E63946;
  }
  .dark .theme-car {
    --primary: #2E6DA4;
    --primary-foreground: #FFFFFF;
    --secondary: #B0BEC5;
    --secondary-foreground: #1A3C5E;
    --accent: #E63946;
    --accent-foreground: #FFFFFF;
    --background: #0B1218;
    --foreground: #F8F9FA;
    --muted-foreground: #B0BEC5;
    --surface: #15202B;
    --border: #2E6DA440;
    --ring: #E63946;
  }

  /* ── Home Rental Theme ──────────────────────── */
  .theme-house {
    --primary: #2D6A4F;
    --primary-foreground: #FFFFFF;
    --secondary: #52B788;
    --secondary-foreground: #FFFFFF;
    --accent: #D4A96A;
    --accent-foreground: #141C16;
    --background: #F1EDE4;
    --foreground: #141C16;
    --muted-foreground: #2D6A4F90;
    --surface: #B7D7C2;
    --border: #2D6A4F20;
    --ring: #D4A96A;
  }
  .dark .theme-house {
    --primary: #52B788;
    --primary-foreground: #0A140F;
    --secondary: #B7D7C2;
    --secondary-foreground: #0A140F;
    --accent: #D4A96A;
    --accent-foreground: #141C16;
    --background: #0A140F;
    --foreground: #F1EDE4;
    --muted-foreground: #B7D7C2;
    --surface: #122119;
    --border: #52B78830;
    --ring: #D4A96A;
  }

  /* ── Laundry Theme ──────────────────────────── */
  .theme-laundry {
    --primary: #0077B6;
    --primary-foreground: #FFFFFF;
    --secondary: #00B4D8;
    --secondary-foreground: #FFFFFF;
    --accent: #90E0EF;
    --accent-foreground: #0077B6;
    --background: #CAF0F8;
    --foreground: #002B44;
    --muted-foreground: #0077B690;
    --surface: #FFFFFF;
    --border: #0077B620;
    --ring: #00B4D8;
  }
  .dark .theme-laundry {
    --primary: #00B4D8;
    --primary-foreground: #051622;
    --secondary: #90E0EF;
    --secondary-foreground: #051622;
    --accent: #0077B6;
    --accent-foreground: #FFFFFF;
    --background: #051622;
    --foreground: #CAF0F8;
    --muted-foreground: #90E0EF;
    --surface: #0B2435;
    --border: #00B4D830;
    --ring: #00B4D8;
  }

  /* ── Food & Beverage Theme ──────────────────── */
  .theme-food {
    --primary: #7B2D00;
    --primary-foreground: #FFFFFF;
    --secondary: #E05C00;
    --secondary-foreground: #FFFFFF;
    --accent: #F4A261;
    --accent-foreground: #7B2D00;
    --background: #FFF8F0;
    --foreground: #2D2D2D;
    --muted-foreground: #7B2D0090;
    --surface: #FFFFFF;
    --border: #7B2D0020;
    --ring: #E05C00;
  }
  .dark .theme-food {
    --primary: #F4A261;
    --primary-foreground: #16100B;
    --secondary: #E05C00;
    --secondary-foreground: #FFFFFF;
    --accent: #E05C00;
    --accent-foreground: #FFFFFF;
    --background: #16100B;
    --foreground: #FFF8F0;
    --muted-foreground: #F4A261;
    --surface: #211812;
    --border: #F4A26130;
    --ring: #F4A261;
  }
`;

// Extract from globals.css using regex
const regex = /  \/\* ── Landing Page Theme ────────────────────── \*\/[\s\S]*?  \/\* ── Marketplace Theme ───────────────────────── \*\//;
content = content.replace(regex, replacementThemes + '\n\n  /* ── Marketplace Theme ───────────────────────── */');

fs.writeFileSync('src/app/globals.css', content);
