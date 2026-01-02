import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ p }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="relative h-44 w-full">
        <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{p.title}</h3>
        <div className="text-sm text-gray-500">{p.category}</div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Starts from</div>
            <div className="font-bold text-xl">₹{p.startingPrice}/sqft</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-2">
              {p.badges.map((b,i)=> <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{b}</span>)}
            </div>
            <Link href={`/products/${p.slug}`}>
              <a className="mt-3 inline-block bg-primary text-white px-3 py-2 rounded-xl text-sm">Configure</a>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
