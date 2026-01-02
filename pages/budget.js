import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';
import dynamic from 'next/dynamic';
const BudgetWizard = dynamic(() => import('../components/BudgetWizard'), { ssr: false });

export default function BudgetPage() {
  return (
    <Layout>
      <SEOHead title="Budget Planner — V SIGN" description="Create a custom signage quote with transparent pricing." />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Interactive Budget Planner</h1>
        <p className="text-gray-600 mt-2">Step through the configurator to get an instant estimate. Save or download the quote when ready.</p>
        <div className="mt-6">
          <BudgetWizard />
        </div>
      </div>
    </Layout>
  );
}
