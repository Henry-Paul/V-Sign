import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';
import Link from 'next/link';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  return (
    <Layout>
      <SEOHead title="V SIGN — Premium LED & 3D Signage" description="In-house fabrication • Free site visits • About signage across Andhra Pradesh & Telangana." />
      <header className="bg-gradient-to-r from-primary to-indigo-700 text-white rounded-b-2xl">
        <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Premium LED & 3D Signage — Hyderabad</h1>
            <p className="mt-4 max-w-xl text-lg">We design, fabricate and install high-impact signage for businesses across Andhra Pradesh and Telangana. Free site visit & transparent pricing.</p>

            <div className="mt-6 flex gap-3">
              <Link href="/budget"><a className="bg-accent text-black px-4 py-3 rounded-2xl font-semibold">Get Instant Quote</a></Link>
              <Link href="/products"><a className="border border-white/30 px-4 py-3 rounded-2xl">View Products</a></Link>
            </div>
          </div>

          <div className="md:w-1/2 grid grid-cols-1 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="font-semibold">Trusted by builders & brands</h3>
              <p className="text-sm text-gray-600 mt-2">In-house manufacturing • Fast delivery • Robust warranties</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCTS.slice(0,3).map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow"> <h4 className="font-semibold">1. Configure</h4><p className="text-sm text-gray-600 mt-2">Choose product & options</p></div>
          <div className="bg-white p-6 rounded-2xl shadow"> <h4 className="font-semibold">2. Get Quote</h4><p className="text-sm text-gray-600 mt-2">Instant itemized estimate</p></div>
          <div className="bg-white p-6 rounded-2xl shadow"> <h4 className="font-semibold">3. Install</h4><p className="text-sm text-gray-600 mt-2">We fabricate & install on schedule</p></div>
        </div>
      </section>
    </Layout>
  );
}
