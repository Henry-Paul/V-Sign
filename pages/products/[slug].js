import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SEOHead from '../../components/SEOHead';
import { PRODUCTS } from '../../data/products';
import dynamic from 'next/dynamic';
const BudgetWizard = dynamic(() => import('../../components/BudgetWizard'), { ssr: false });

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const product = PRODUCTS.find(p => p.slug === slug);
  if (!product) return <Layout><div className="container mx-auto p-8">Loading...</div></Layout>;

  return (
    <Layout>
      <SEOHead title={`${product.title} — V SIGN`} description={`Configure ${product.title} with our budget planner`} />
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <img src={product.img} alt={product.title} className="w-full h-96 object-cover rounded-2xl shadow-sm" />
          <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
          <p className="text-gray-600 mt-3">High-quality {product.category}. Starting at ₹{product.startingPrice}/sqft. We provide installation, design support and warranty.</p>
        </div>

        <aside>
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-gray-500">Starts from</div>
            <div className="text-2xl font-bold">₹{product.startingPrice}/sqft</div>
            <div className="mt-4">
              <BudgetWizard prefillProduct={product} />
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
