const fs = require('fs');
const pages = ['/', '/services', '/budget-planner', '/contact', '/blogs'];
const domain = 'https://yourdomain.com';
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `<url><loc>${domain}${p}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap written to public/sitemap.xml');
