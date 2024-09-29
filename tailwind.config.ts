import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
import daisyTheme from 'daisyui/src/theming/themes'

const config: Config = {
	content: ['./src/routes/**/*.{html,js,svelte,ts}', './src/components/**/*.{html,js,svelte,ts}'],
	theme: {
		// extend: {
		//   backgroundImage: {
		//     "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
		//     "gradient-conic":
		//       "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
		//   },
		// },
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				fantasy: {
					...daisyTheme.fantasy,
					// "primary": "#e95f0b",
					error: '#ff0000',
					'error-content': '#ffffff',
					'--rounded-box': '0.5rem', // border radius rounded-box utility class, used in card and other large boxes
					'--rounded-btn': '0.25rem' // border radius rounded-btn utility class, used in buttons and similar element
				}
			}
		]
	}
}
export default config
