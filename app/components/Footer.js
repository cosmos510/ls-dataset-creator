"use client"

export default function Footer() {
	return (
		<footer className=" py-6 mt-auto text-lg text-center mt-20">
		<p>
		  © {new Date().getFullYear()} LSF Dataset. Tous droits réservés.{' '}
		  <a 
			href="/privacy" 
			className=" underline hover:text-indigo-300 transition-colors duration-200"
		  >
			Politique de Confidentialité
		  </a>
		</p>
	  </footer>
	)
}
