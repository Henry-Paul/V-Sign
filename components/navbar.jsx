import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar() {
  const router = useRouter();
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/"><a className="text-primary font-bold text-xl">V SIGN</a></Link>
          <span className="text-sm text-gray-500 hidden md:inline">Premium LED & 3D Signage</span>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/products"><a className={router.pathname.startsWith('/products') ? "text-primary font-medium" : "text-gray-600"}>Products</a></Link>
          <Link href="/budget"><a className={router.pathname === '/budget' ? "text-primary font-medium" : "text-gray-600"}>Budget Planner</a></Link>
          <Link href="/services"><a className={router.pathname === '/services' ? "text-primary font-medium" : "text-gray-600"}>Services</a></Link>
          <Link href="/contact"><a className={router.pathname === '/contact' ? "text-primary font-medium" : "text-gray-600"}>Contact</a></Link>
        </nav>

        <div className="flex items-center space-x-3">
          <a href="tel:+919999999999" className="bg-accent text-white px-3 py-2 rounded-xl text-sm">Call Us</a>
          <button onClick={() => window.scrollTo(0,0)} className="md:hidden p-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 12h18" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
