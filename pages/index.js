import SEOHead from '../components/SEOHead';
import BudgetPlanner from '../components/BudgetPlanner';

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "V SIGN",
    "telephone": "+91-XXXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "serviceArea": ["Andhra Pradesh", "Telangana"]
  };

  return (
    <>
      <SEOHead
        title="V SIGN - Premium LED & 3D Signage | Hyderabad"
        description="In-house fabrication • Free site visit • 3-10 year warranties • Service across Andhra Pradesh & Telangana."
        canonical="https://yourdomain.com"
        schema={schema}
      />
      <main>
        <header className="bg-gradient-to-r from-primary to-indigo-700 text-white p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold">Premium LED & 3D Signboards — Hyderabad</h1>
            <p className="mt-2">In-house fabrication • Free site visit • 3-10 year warranties.</p>
          </div>
        </header>

        <section className="container mx-auto py-12">
          <BudgetPlanner />
        </section>
      </main>
    </>
  );
}
