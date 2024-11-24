import Link from 'next/link';
import LogoutButton from './components/LogoutButton';
export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Welcome to the LSF Dataset Creator</h1>
      <p className="mb-6 text-lg">Help us build a dataset by capturing pictures of your hand signs in French Sign Language (LSF).</p>
      <Link href="/take-photo" className="bg-blue-500 text-white py-2 px-6 rounded-full text-xl hover:bg-blue-600">
        
          Start Taking Photos
      </Link>

      <div>
      <h1>logout</h1>
      <LogoutButton />
    </div>
    </div>
  );
}