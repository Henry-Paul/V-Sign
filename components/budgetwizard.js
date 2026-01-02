import { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Multi-step quote builder:
 * Steps:
 * 1) Choose product (or prefilled)
 * 2) Dimensions & quantity
 * 3) Options (material, led, warranty)
 * 4) Add-ons (site visit, electrical, AMC)
 * 5) Review & Save
 */

const MATERIALS = [
  { id: 'acp', name: 'ACP', mult: 1.0 },
  { id: 'acrylic', name: 'Acrylic', mult: 1.3 },
  { id: 'stainless', name: 'Stainless Steel', mult: 1.8 },
  { id: 'brass', name: 'Brass', mult: 2.2 },
];

const LEDS = [
  { id: 'std', name: 'Standard LED', mult: 1.0 },
  { id: 'premium', name: 'Premium LED', mult: 1.6 }
];

export default function BudgetWizard({ prefillProduct }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    productSlug: prefillProduct?.slug || PRODUCTS[0].slug,
    width: prefillProduct ? 10 : 6,
    height: prefillProduct ? 3 : 3,
    quantity: 1,
    city: 'hyderabad',
    material: 'acp',
    led: 'std',
    warranty: '3',
    siteVisit: true,
    electrical: false,
    amc: false
  });

  const product = useMemo(() => PRODUCTS.find(p => p.slug === form.productSlug), [form.productSlug]);

  function next() { setStep(s => Math.min(5, s + 1)); window.scrollTo(0,0); }
  function back() { setStep(s => Math.max(1, s - 1)); window.scrollTo(0,0); }

  function calcQuote() {
    const area = Math.max(0.01, form.width * form.height);
    const base = product?.startingPrice || 1000;
    const mat = MATERIALS.find(m => m.id === form.material)?.mult || 1;
    const led = LEDS.find(l => l.id === form.led)?.mult || 1;
    const cityMult = form.city === 'hyderabad' ? 1 : 1.05;
    const warrantyMult = form.warranty === '3' ? 1 : form.warranty === '5' ? 1.2 : 1.5;

    const materialCost = Math.round(area * base * mat * form.quantity);
    const fabrication = Math.round(materialCost * 0.28);
    const electronics = Math.round(area * 220 * led * form.quantity);
    const installation = Math.round(area * 150 * form.quantity);
    const amc = form.amc ? Math.round((materialCost + fabrication + electronics) * 0.12) : 0;

    const subtotal = Math.round((materialCost + fabrication + electronics + installation + amc) * cityMult);
    const gst = Math.round(subtotal * 0.18);
    const total = Math.round((subtotal + gst) * warrantyMult);

    return { materialCost, fabrication, electronics, installation, amc, subtotal, gst, total, area };
  }

  const quote = calcQuote();

  function saveQuote() {
    // Download a JSON file as an example
    const payload = { form, quote, createdAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `vsign-quote-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-2">
      <div className="bg-white rounded-2xl p-4 shadow">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Quote Builder</div>
            <div className="text-lg font-semibold">Create your custom estimate</div>
          </div>
          <div className="text-right text-sm">
            <div className="text-xs text-gray-400">Step {step} / 5</div>
            <div className="text-sm font-medium text-gray-600">{['Choose','Dimensions','Options','Add-ons','Review'][step-1]}</div>
          </div>
        </div>

        {/* Step UI */}
        <div className="mt-4">
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium">Choose product</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                {PRODUCTS.map(p => (
                  <button key={p.id} onClick={() => setForm({...form, productSlug: p.slug})}
                    className={clsx("p-3 rounded-xl border", form.productSlug === p.slug ? "border-primary bg-primary/5" : "border-gray-100 bg-white")}>
                    <img src={p.img} alt={p.title} className="w-full h-28 object-cover rounded-md" />
                    <div className="mt-2 text-sm font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">Starts ₹{p.startingPrice}/sqft</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium">Dimensions</label>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Width (ft)</div>
                  <input type="range" min="1" max="40" value={form.width} onChange={e => setForm({...form, width: +e.target.value})} />
                  <div className="text-sm font-medium">{form.width} ft</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Height (ft)</div>
                  <input type="range" min="1" max="20" value={form.height} onChange={e => setForm({...form, height: +e.target.value})} />
                  <div className="text-sm font-medium">{form.height} ft</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Quantity</label>
                  <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: Math.max(1,+e.target.value)})} className="mt-1 p-2 border rounded w-28" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-medium">Options</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-xs text-gray-500">Material</div>
                  <div className="flex gap-2 mt-2">
                    {MATERIALS.map(m => (
                      <button key={m.id} onClick={() => setForm({...form, material: m.id})}
                        className={clsx("px-3 py-2 rounded-xl border text-sm", form.material === m.id ? "bg-primary/10 border-primary" : "bg-white border-gray-100")}>
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">LED Type</div>
                  <div className="flex gap-2 mt-2">
                    {LEDS.map(l => (
                      <button key={l.id} onClick={() => setForm({...form, led: l.id})}
                        className={clsx("px-3 py-2 rounded-xl border text-sm", form.led === l.id ? "bg-primary/10 border-primary" : "bg-white border-gray-100")}>
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 mt-3">
                  <label className="text-xs text-gray-500">Warranty</label>
                  <select value={form.warranty} onChange={e => setForm({...form, warranty: e.target.value})} className="p-2 border rounded w-40 mt-1">
                    <option value="3">3 years</option>
                    <option value="5">5 years</option>
                    <option value="10">10 years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <label className="block text-sm font-medium">Add-ons</label>
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-xl">
                  <input type="checkbox" checked={form.siteVisit} onChange={e => setForm({...form, siteVisit: e.target.checked})} />
                  <div>
                    <div className="font-medium">Site visit & measurement</div>
                    <div className="text-xs text-gray-500">Expert measurement and placement recommendation</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-xl">
                  <input type="checkbox" checked={form.electrical} onChange={e => setForm({...form, electrical: e.target.checked})} />
                  <div>
                    <div className="font-medium">Electrical permit & wiring</div>
                    <div className="text-xs text-gray-500">If required for rooftop or high-rise installations</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-xl">
                  <input type="checkbox" checked={form.amc} onChange={e => setForm({...form, amc: e.target.checked})} />
                  <div>
                    <div className="font-medium">Annual Maintenance Contract (AMC)</div>
                    <div className="text-xs text-gray-500">Scheduled maintenance and priority support</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <label className="block text-sm font-medium">Review</label>
              <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex justify-between">
                  <div><strong>{product.title}</strong> · {quote.area} sqft · x{form.quantity}</div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Subtotal</div>
                    <div className="font-semibold text-lg">₹{quote.subtotal}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>Material</div><div className="text-right">₹{quote.materialCost}</div>
                  <div>Fabrication</div><div className="text-right">₹{quote.fabrication}</div>
                  <div>Electronics</div><div className="text-right">₹{quote.electronics}</div>
                  <div>Installation</div><div className="text-right">₹{quote.installation}</div>
                  <div>AMC</div><div className="text-right">₹{quote.amc}</div>
                  <div>GST (18%)</div><div className="text-right">₹{quote.gst}</div>
                  <div className="font-bold">Total</div><div className="text-right font-bold">₹{quote.total}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            {step > 1 && <button onClick={back} className="px-4 py-2 rounded-lg border mr-2">Back</button>}
            {step < 5 && <button onClick={next} className="px-4 py-2 rounded-lg bg-primary text-white">Next</button>}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 mr-4">Estimated total</div>
            <div className="font-semibold text-xl">₹{quote.total}</div>
            <button onClick={saveQuote} className="px-4 py-2 rounded-lg border">Save</button>
            <button onClick={() => alert('PDF generation: hook serverless / Puppeteer or wkhtmltopdf here')} className="px-4 py-2 bg-accent text-white rounded-lg">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
