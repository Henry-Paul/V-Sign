import Head from 'next/head';

export default function SEOHead({ title, description, canonical }) {
  return (
    <Head>
      <title>{title || 'V SIGN — Premium Signage'}</title>
      <meta name="description" content={description || 'In-house fabrication. Free site visit. Service across Andhra Pradesh & Telangana.'} />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
}
