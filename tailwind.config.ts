import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--surface)',
  				foreground: 'var(--foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--surface)',
  				foreground: 'var(--foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: '#ef4444',
  				foreground: '#ffffff'
  			},
  			border: 'var(--border)',
  			input: 'var(--border)',
  			ring: 'var(--ring)',
        surface: 'var(--surface)',
        'primary-container': 'var(--primary-container)',
        'on-primary-container': 'var(--on-primary-container)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary-container': 'var(--on-secondary-container)',
        'tertiary': 'var(--tertiary)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-tertiary-container': 'var(--on-tertiary-container)',
        'surface-variant': 'var(--surface-variant)',
        'surface-container': 'var(--surface-container)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container-high': 'var(--surface-container-high)',
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'outline': 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        'error-container': 'var(--error-container)',
        'on-error': 'var(--on-error)',
        'on-error-container': 'var(--on-error-container)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [],
};
export default config;
