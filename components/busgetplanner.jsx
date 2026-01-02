import { useState, useEffect } from 'react';

/**
 * Uses the same calculation logic as your budget-planner.js
 * This component exposes a controlled, reactive quote builder.
 */
export default function BudgetPlanner({ initial = {} }) {
  const [form, setForm] = useState({
    productType: 'terrace',
    width: 10,
    height: 3,
    quantity: 1,
    city: 'hyderabad',
    location: 'rooftop',
    material: 'acp',
    ledType: 'standard',
    warranty: '3',
    includesSiteVisit: true,
    includesElectrical: false,
    includesAMC: false,
    ...initial
  });

  const config = {
    baseRates: { terrace: 1200, shop: 850, '3d-letters': 1500, hospital: 850, wayfinding: 800 },
    materialMultipliers: { acp:1.0, stainless:1.8, acrylic:1.4, brass:2.2, flex:0.8 },
    ledMultipliers: { standard:1, premium:1.6 },
    cityMultipliers: { hyderabad:1.0, vijayawada:1.05, vizag:1.06, guntur:1.04 },
    locationMultipliers: { rooftop:1.1, facade:1.1, ground:1.0 },
    warrantyMultipliers: { '3':1.0, '5':1.2, '10':1.5 }
  };

  function calc() {
    const area = Math.max(0.01, form.width * form.height);
    const baseRate = config.baseRates[form.productType] || 850;
    const materialMultiplier = config.materialMultipliers[form.material] || 1;
    const ledMultiplier = config.ledMultipliers[form.ledType] || 1;
    const cityMultiplier = config.cityMultipliers[form.city] || 1;
    const locationMultiplier = config.locationMultipliers[form.location] || 1;
    const warrantyMultiplier = config.warrantyMultipliers[form.warranty] || 1;

    const materialCost = area * baseRate * materialMultiplier * form.quantity;
    const fabrication = materialCost * 0.3;
    const electronics = area * 200 * ledMultiplier * form.quantity;
    const installation = area * 150 * locationMultiplier * form.quantity;
    let amc = form.includesAMC ? (materialCost + fabrication + electronics) * 0.15 : 0;
    const subtotal = (materialCost + fabrication + electronics + installation + amc) * cityMultiplier;
    const gst = subtotal * 0.18;
    const total = Math.round((subtotal + gst) * warrantyMultiplier);

    return { materialCost: Math.round(materialCost), fabrication: Math.round(fabrication), electronics: Math.round(electronics), installation: Math.round(installation), amc: Math.round(amc), subtotal: Math.round(subtotal), gst: Math.round(gst), total };
  }

  const [quote, setQuote] = useState(calc());

  useEffect(() => {
    setQuote(calc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold">Interactive Budget Planner</h2>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label>Product type</label>
          <select value={form.productType} onChange={e => setForm({...form, productType: e.target.value})} className="w-full p-2 border rounded">
            <option value="terrace">Terrace</option>
            <option value="shop">Shop Board</option>
            <option value="3d-letters">3D Letters</option>
            <option value="hospital">Hospital</option>
            <option value="wayfinding">Wayfinding</option>
          </select>

          <label className="mt-2">Width (ft)</label>
          <input type="range" min="1" max="40" value={form.width} onChange={e => setForm({...form, width: +e.target.value})} />
          <div>{form.width} ft</div>

          <label className="mt-2">Height (ft)</label>
          <input type="range" min="1" max="20" value={form.height} onChange={e => setForm({...form, height: +e.target.value})} />
          <div>{form.height} ft</div>

          <label className="mt-2">Quantity</label>
          <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})} className="w-24 p-2 border rounded" />
        </div>

        <div>
          <h3 className="text-lg font-medium">Quote summary</h3>
          <div className="mt-3 p-3 border rounded bg-white shadow-sm">
            <div className="flex justify-between"><span>Material</span><strong>₹{quote.materialCost}</strong></div>
            <div className="flex justify-between"><span>Fabrication</span><strong>₹{quote.fabrication}</strong></div>
            <div className="flex justify-between"><span>Electronics</span><strong>₹{quote.electronics}</strong></div>
            <div className="flex justify-between"><span>Installation</span><strong>₹{quote.installation}</strong></div>
            <div className="flex justify-between"><span>AMC</span><strong>₹{quote.amc}</strong></div>
            <hr className="my-2" />
            <div className="flex justify-between"><span>Subtotal</span><strong>₹{quote.subtotal}</strong></div>
            <div className="flex justify-between"><span>GST (18%)</span><strong>₹{quote.gst}</strong></div>
            <div className="flex justify-between text-xl"><span>Total</span><strong>₹{quote.total}</strong></div>
            <div className="mt-3">
              <button className="px-4 py-2 bg-primary text-white rounded">Save quote</button>
              <button className="ml-2 px-4 py-2 border rounded">Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
