"use client"

export default function Footer() {
	return (
		<footer className=" py-6 mt-auto text-lg text-center">
		<p>
		  © {new Date().getFullYear()} LSF Dataset. All rights reserved.{' '}
		  <a 
			href="/privacy" 
			className="text-indigo-400 underline hover:text-indigo-300 transition-colors duration-200"
		  >
			Politique de Confidentialité
		  </a>
		</p>
	  </footer>
	)
}
