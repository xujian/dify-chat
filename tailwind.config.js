/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		typography: require('./typography'),
		extend: {
			colors: {
				gray: {
					'50': '#F9FAFB',
					'100': '#F3F4F6',
					'200': '#E5E7EB',
					'300': '#D1D5DB',
					'400': '#9CA3AF',
					'500': '#6B7280',
					'700': '#374151',
					'800': '#1F2A37',
					'900': '#111928'
				},
				primary: {
					'50': '#EBF5FF',
					'100': '#E1EFFE',
					'200': '#C3DDFD',
					'300': '#A4CAFE',
					'600': '#1C64F2',
					'700': '#1A56DB',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				blue: {
					'500': '#E1EFFE'
				},
				green: {
					'50': '#F3FAF7',
					'100': '#DEF7EC',
					'800': '#03543F'
				},
				yellow: {
					'100': '#FDF6B2',
					'800': '#723B13'
				},
				purple: {
					'50': '#F6F5FF'
				},
				indigo: {
					'25': '#F5F8FF',
					'100': '#E0EAFF',
					'600': '#444CE7'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			screens: {
				mobile: '100px',
				tablet: '640px',
				pc: '769px'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
		require("tailwindcss-animate")
	],
}
