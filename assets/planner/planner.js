/* planner.js - V SIGN shared planner */
/* Place at: assets/planner/planner.js */
/* Usage: include planner.css in <head>, include planner.js before </body>
   Call openPlanner('led-shop') or openPlanner() from any page. */

(function () {
  // Namespace
  const NS = 'VSignPlanner';

  // Utility: load CSS/Script dynamically
  function loadScript(url) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${url}"]`)) return res();
      const s = document.createElement('script');
      s.src = url; s.async = true;
      s.onload = () => res();
      s.onerror = () => rej(new Error('Failed to load ' + url));
      document.head.appendChild(s);
    });
  }

  // Inject modal HTML if not present
  function ensureModal() {
    if (document.getElementById('vs-planner-backdrop')) return;
    const html = `
      <div id="vs-planner-backdrop" class="vs-planner-backdrop" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="vs-planner-modal" role="document" aria-labelledby="vs-planner-title">
          <div class="vs-planner-head">
            <div>
              <div id="vs-planner-title" class="vs-planner-title">Interactive Budget Planner</div>
              <div class="vs-planner-sub">Smart estimator — area × per-sqft ranges. Pre-fill via Configure buttons.</div>
              <div class="vs-step-bar"><div id="vs-step-fill" class="vs-step-fill" style="width:0%"></div></div>
            </div>
            <div>
              <button id="vs-close-btn" class="vs-btn vs-btn-ghost" aria-label="Close planner">Close</button>
            </div>
          </div>

          <div class="vs-grid">
            <div class="vs-left">
              <div id="vs-step-area">
                <!-- step 1 -->
                <div class="vs-step" data-step="1">
                  <label class="vs-label">Select service</label>
                  <select id="vs-service" class="vs-select" aria-label="Service select">
                    <option value="led-shop">LED Shop Board — ₹850 – ₹1,500 / sqft</option>
                    <option value="acp-hoarding">ACP Hoarding — ₹1,200 – ₹2,500 / sqft</option>
                    <option value="3d-letters">3D Stainless Letters — ₹1,500 – ₹4,000 / sqft</option>
                    <option value="wayfinding">Wayfinding — ₹800 – ₹1,800 / sqft</option>
                    <option value="hospital">Hospital — ₹900 – ₹2,000 / sqft</option>
                    <option value="school">School Signage — ₹800 – ₹1,600 / sqft</option>
                  </select>
                </div>

                <!-- step 2 -->
                <div class="vs-step" data-step="2" style="margin-top:12px">
                  <div class="vs-col-2">
                    <div>
                      <label class="vs-label">Width (ft)</label>
                      <input id="vs-width" type="number" min="0.1" step="0.1" value="10" class="vs-input" />
                    </div>
                    <div>
                      <label class="vs-label">Height (ft)</label>
                      <input id="vs-height" type="number" min="0.1" step="0.1" value="3" class="vs-input" />
                    </div>
                  </div>
                </div>

                <!-- step 3 -->
                <div class="vs-step" data-step="3" style="margin-top:12px">
                  <label class="vs-label">City</label>
                  <select id="vs-city" class="vs-select">
                    <option value="hyderabad">Hyderabad</option>
                    <option value="vijayawada">Vijayawada</option>
                    <option value="visakhapatnam">Visakhapatnam</option>
                    <option value="guntur">Guntur</option>
                  </select>

                  <div style="margin-top:10px">
                    <label class="vs-label">Warranty</label>
                    <select id="vs-warranty" class="vs-select">
                      <option value="3">3 years</option>
                      <option value="5">5 years (+20%)</option>
                      <option value="10">10 years (+50%)</option>
                    </select>
                  </div>

                  <div style="margin-top:10px">
                    <label class="vs-label"><input id="vs-amc" type="checkbox" /> Include AMC estimate</label>
                  </div>
                </div>

                <!-- step controls -->
                <div style="margin-top:14px" class="vs-row">
                  <button id="vs-back" class="vs-btn vs-btn-ghost">Back</button>
                  <button id="vs-next" class="vs-btn vs-btn-primary">Next</button>
                </div>
              </div>
            </div>

            <div class="vs-right">
              <div class="vs-card">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <div class="vs-muted">Price per sqft</div>
                    <div id="vs-price-range" class="vs-price">₹850 – ₹1,500</div>
                  </div>
                  <div style="text-align:right">
                    <div class="vs-muted">Area</div>
                    <div id="vs-area" style="font-weight:700">30 sqft</div>
                  </div>
                </div>

                <div style="margin-top:12px">
                  <div class="vs-line"><div>Material</div><div id="vs-line-material" class="vs-muted">₹0 — ₹0</div></div>
                  <div class="vs-line"><div>Fabrication</div><div id="vs-line-fab" class="vs-muted">₹0 — ₹0</div></div>
                  <div class="vs-line"><div>Electronics</div><div id="vs-line-elect" class="vs-muted">₹0 — ₹0</div></div>
                  <div class="vs-line"><div>Installation</div><div id="vs-line-install" class="vs-muted">₹0 — ₹0</div></div>
                  <div class="vs-line"><div>AMC (opt)</div><div id="vs-line-amc" class="vs-muted">₹0 — ₹0</div></div>
                  <div class="vs-line"><div>Subtotal</div><div id="vs-line-sub" class="vs-muted">₹0 — ₹0</div></div>
                  <div class="vs-line"><div>GST (18%)</div><div id="vs-line-gst" class="vs-muted">₹0 — ₹0</div></div>

                  <div style="display:flex;justify-content:space-between;padding-top:10px">
                    <div class="vs-muted">Estimated total</div>
                    <div id="vs-total" class="vs-total">₹0 — ₹0</div>
                  </div>

                  <div style="margin-top:12px;display:flex;gap:8px">
                    <button id="vs-save" class="vs-btn vs-btn-primary">Save</button>
                    <button id="vs-pdf" class="vs-btn vs-btn-ghost">Download PDF</button>
                    <button id="vs-share" class="vs-btn vs-btn-ghost">Share</button>
                  </div>
                  <div class="vs-muted" style="margin-top:10px">This is an initial estimate. Final quote requires a site visit.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper.firstElementChild);
  }

  // Planner logic & state
  function createPlanner() {
    // DOM references
    const $ = id => document.getElementById(id);
    const backdrop = $('vs-planner-backdrop');
    const closeBtn = $('vs-close-btn');
    const serviceEl = $('vs-service');
    const widthEl = $('vs-width');
    const heightEl = $('vs-height');
    const cityEl = $('vs-city');
    const warrantyEl = $('vs-warranty');
    const amcEl = $('vs-amc');
    const stepFill = $('vs-step-fill');
    const steps = Array.from(document.querySelectorAll('.vs-step'));
    const backBtn = $('vs-back');
    const nextBtn = $('vs-next');
    const saveBtn = $('vs-save');
    const pdfBtn = $('vs-pdf');
    const shareBtn = $('vs-share');

    const priceRange = $('vs-price-range');
    const areaDisplay = $('vs-area');
    const lineMaterial = $('vs-line-material');
    const lineFab = $('vs-line-fab');
    const lineElect = $('vs-line-elect');
    const lineInstall = $('vs-line-install');
    const lineAmc = $('vs-line-amc');
    const lineSub = $('vs-line-sub');
    const lineGst = $('vs-line-gst');
    const totalDisplay = $('vs-total');

    // service rates (same as earlier)
    const SERVICE_RATES = {
      'led-shop': {min:850, max:1500, label:'LED Shop Board'},
      'acp-hoarding': {min:1200, max:2500, label:'ACP Hoarding'},
      '3d-letters': {min:1500, max:4000, label:'3D Stainless Letters'},
      'wayfinding': {min:800, max:1800, label:'Wayfinding'},
      'hospital': {min:900, max:2000, label:'Hospital Signage'},
      'school': {min:800, max:1600, label:'School Signage'}
    };

    // state
    const state = {
      step: 1,
      service: serviceEl.value,
      width: Number(widthEl.value || 0),
      height: Number(heightEl.value || 0),
      city: cityEl.value,
      warranty: warrantyEl.value,
      amc: !!amcEl.checked
    };

    // helpers
    function setStep(n){
      state.step = Math.max(1, Math.min(3, n));
      steps.forEach((s, i) => s.style.display = (i+1 <= state.step) ? '' : 'none');
      const pct = Math.max(6, (state.step-1)/2 * 100);
      stepFill.style.width = pct + '%';
      backBtn.style.display = (state.step === 1) ? 'none' : 'inline-block';
      nextBtn.textContent = (state.step === 3) ? 'Finish' : 'Next';
      recalc();
    }

    function open(prefillSlug){
      if(prefillSlug && SERVICE_RATES[prefillSlug]) {
        serviceEl.value = prefillSlug;
        state.service = prefillSlug;
      }
      backdrop.style.display = 'flex';
      backdrop.setAttribute('aria-hidden', 'false');
      setStep(1);
      recalc();
    }

    function close(){
      backdrop.style.display = 'none';
      backdrop.setAttribute('aria-hidden', 'true');
    }

    function recalc(){
      // compute area
      const w = Number(state.width || 0); const h = Number(state.height || 0);
      const area = Math.max(0.01, Math.round((w*h) * 100) / 100);

      const rates = SERVICE_RATES[state.service] || SERVICE_RATES['led-shop'];
      const minRate = rates.min; const maxRate = rates.max;
      const matMin = Math.round(area * minRate); const matMax = Math.round(area * maxRate);
      const fabMin = Math.round(matMin * 0.30); const fabMax = Math.round(matMax * 0.30);
      const electMin = Math.round(area * 200); const electMax = Math.round(area * 400);
      const installMin = Math.round(area * 150); const installMax = Math.round(area * 300);
      const amcMin = state.amc ? Math.round((matMin + fabMin + electMin) * 0.12) : 0;
      const amcMax = state.amc ? Math.round((matMax + fabMax + electMax) * 0.12) : 0;
      const cityMult = (state.city === 'hyderabad') ? 1.00 : 1.05;
      const warrantyMult = (state.warranty === '3') ? 1.00 : (state.warranty === '5') ? 1.20 : 1.50;

      const subMin = Math.round((matMin + fabMin + electMin + installMin + amcMin) * cityMult);
      const subMax = Math.round((matMax + fabMax + electMax + installMax + amcMax) * cityMult);
      const gstMin = Math.round(subMin * 0.18); const gstMax = Math.round(subMax * 0.18);
      const totalMin = Math.round((subMin + gstMin) * warrantyMult); const totalMax = Math.round((subMax + gstMax) * warrantyMult);

      // update UI
      priceRange.textContent = `₹${minRate.toLocaleString()} – ₹${maxRate.toLocaleString()} / sqft`;
      areaDisplay.textContent = `${area.toLocaleString()} sqft`;
      lineMaterial.textContent = `₹${matMin.toLocaleString()} — ₹${matMax.toLocaleString()}`;
      lineFab.textContent = `₹${fabMin.toLocaleString()} — ₹${fabMax.toLocaleString()}`;
      lineElect.textContent = `₹${electMin.toLocaleString()} — ₹${electMax.toLocaleString()}`;
      lineInstall.textContent = `₹${installMin.toLocaleString()} — ₹${installMax.toLocaleString()}`;
      lineAmc.textContent = `₹${amcMin.toLocaleString()} — ₹${amcMax.toLocaleString()}`;
      lineSub.textContent = `₹${subMin.toLocaleString()} — ₹${subMax.toLocaleString()}`;
      lineGst.textContent = `₹${gstMin.toLocaleString()} — ₹${gstMax.toLocaleString()}`;
      totalDisplay.textContent = `₹${totalMin.toLocaleString()} — ₹${totalMax.toLocaleString()}`;
    }

    // button actions
    closeBtn.addEventListener('click', close);
    backBtn.addEventListener('click', () => setStep(state.step - 1));
    nextBtn.addEventListener('click', () => {
      if(state.step < 3) setStep(state.step + 1);
      else {
        // finish - keep showing the modal but maybe show success hint
        alert('Estimate complete. Use Save to download estimate or Download PDF to create a printable quote.');
      }
    });

    // watchers
    serviceEl.addEventListener('change', (e)=> { state.service = e.target.value; recalc(); });
    widthEl.addEventListener('input', (e)=> { state.width = Number(e.target.value||0); recalc(); });
    heightEl.addEventListener('input', (e)=> { state.height = Number(e.target.value||0); recalc(); });
    cityEl.addEventListener('change', (e)=> { state.city = e.target.value; recalc(); });
    warrantyEl.addEventListener('change', (e)=> { state.warranty = e.target.value; recalc(); });
    amcEl.addEventListener('change', (e)=> { state.amc = e.target.checked; recalc(); });

    // save JSON
    saveBtn.addEventListener('click', () => {
      const payload = {
        createdAt: new Date().toISOString(),
        service: state.service,
        width: state.width,
        height: state.height,
        city: state.city,
        warranty: state.warranty,
        amc: state.amc
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `vsign-quote-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
      alert('Quote saved to your computer (JSON).');
    });

    // share via WhatsApp
    shareBtn.addEventListener('click', () => {
      const text = encodeURIComponent(`V SIGN estimate:
Service: ${SERVICE_RATES[state.service].label}
Size: ${state.width}ft x ${state.height}ft
Est: ${totalDisplay.textContent}
Visit: vsign.example`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });

    // download PDF: dynamically load html2pdf if needed and print the modal content
    pdfBtn.addEventListener('click', async () => {
      // load html2pdf if not loaded
      if (typeof html2pdf === 'undefined') {
        try {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js');
        } catch (err) {
          alert('Failed to load PDF library. Save JSON instead.');
          return;
        }
      }
      // Build a small printable container from modal content
      const el = document.createElement('div');
      el.style.padding = '18px';
      el.style.fontFamily = 'Inter, Arial, sans-serif';
      el.innerHTML = `
        <h2 style="color:${SERVICE_RATES[state.service].label ? '#0B3D91':'#0B3D91'}">${SERVICE_RATES[state.service].label || 'Estimate'}</h2>
        <p>Size: ${state.width} ft × ${state.height} ft</p>
        <p>Region: ${state.city}</p>
        <hr/>
        <p><strong>Estimated total:</strong> ${totalDisplay.textContent}</p>
        <p><small>Generated: ${new Date().toLocaleString()}</small></p>
      `;
      document.body.appendChild(el);
      const opt = {
        margin: 10,
        filename: `vsign-quote-${Date.now()}.pdf`,
        image: {type:'jpeg', quality:0.95},
        html2canvas: {scale: 2, useCORS:true},
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
      };
      try {
        html2pdf().set(opt).from(el).save().then(() => el.remove());
      } catch (e) {
        alert('PDF generation failed. Save JSON instead.');
        el.remove();
      }
    });

    // expose functions globally
    return {
      open: open,
      close: close,
      recalc: recalc,
      setStep: setStep
    };
  }

  // Boot: ensure CSS & modal then create planner instance
  function bootPlanner() {
    // ensure CSS - if not present, create <link>
    if (!document.querySelector('link[href$="planner.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = (function(){
        // Assume file is at assets/planner/planner.css relative to site root
        // If your files are in a different folder, update the href in your HTML instead.
        return '/assets/planner/planner.css';
      })();
      document.head.appendChild(link);
    }

    ensureModal();
    const instance = createPlanner();

    // attach global helpers so existing onclicks continue to work
    window.openPlanner = function(prefill){ instance.open(prefill); };
    window.closePlanner = function(){ instance.close(); };
    // also attach namespace for advanced control
    window[NS] = instance;
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPlanner);
  } else {
    bootPlanner();
  }
})();
