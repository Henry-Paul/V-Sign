import Layout from '../../components/Layout';
import SEOHead from '../../components/SEOHead';
import ProductCard from '../../components/ProductCard';
import { PRODUCTS } from '../../data/products';

export default function Products() {
  return (
    <Layout>
      <SEOHead title="Products — V SIGN" description="Browse our LED, ACP, 3D letters and commercial signage products." />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <div className="text-sm text-gray-500">Showing {PRODUCTS.length} products</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </Layout>
  );
}
