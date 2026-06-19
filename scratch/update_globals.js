const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

const newUtils = `
  /* ── Premium UI Layout Utilities ──────────────────── */
  .shadow-premium-soft {
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 3px rgba(0,0,0,0.02);
  }
  .dark .shadow-premium-soft {
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 3px rgba(0,0,0,0.2);
  }
  .shadow-premium-deep {
    box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04);
  }
  .dark .shadow-premium-deep {
    box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3);
  }
  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-4px) scale(1.01);
  }
`;

content = content.replace('/* ── Typography System Utilities ──────────────────── */', newUtils + '\n  /* ── Typography System Utilities ──────────────────── */');

fs.writeFileSync('src/app/globals.css', content);
