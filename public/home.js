// Home page: ticker, pricing switch, app tour tabs and the crema light streaks.
(function () {
  document.querySelectorAll('[data-ticker]').forEach(function (el) {
    var items = el.dataset.ticker.split('|');
    el.innerHTML = items.concat(items).map(function (t) { return '<span>' + t + '</span>'; }).join('');
  });

  // Pricing switch
  var sw = document.getElementById('bill'), p = document.getElementById('pro-p'), n = document.getElementById('pro-n');
  sw.addEventListener('click', function () {
    var y = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', y);
    p.innerHTML = y ? 'R449 <small>a year</small>' : 'R59 <small>a month</small>';
    n.innerHTML = y ? 'Standard <s>R699</s> a year' : 'Standard <s>R79</s> a month';
  });

  // Tour tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function sel(i) { tabs.forEach(function (t, j) { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; document.getElementById(t.getAttribute('aria-controls')).hidden = i !== j; }); }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { sel(i); });
    t.addEventListener('keydown', function (e) { var k = tabs.length, nx = e.key === 'ArrowRight' ? (i + 1) % k : e.key === 'ArrowLeft' ? (i + k - 1) % k : -1; if (nx >= 0) { sel(nx); tabs[nx].focus(); e.preventDefault(); } });
  });

  // Crema light streaks, like Calibur's light trails. Static frame when reduced motion is on.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvases = Array.prototype.slice.call(document.querySelectorAll('[data-streaks]'));
  var beams = canvases.map(function (c, k) {
    return [0, 1, 2, 3].map(function (i) { return { y: 0.12 + i * 0.24 + (k % 3) * 0.04, a: -0.32 + i * 0.13 + (k % 2) * 0.08, w: 1 + (i % 2) * 1.6, s: 0.00025 + i * 0.00008, o: i * 1.7 + k }; });
  });
  function frame(t) {
    canvases.forEach(function (c, k) {
      var r = c.getBoundingClientRect();
      if (!r.width || r.bottom < -200 || r.top > innerHeight + 200) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      if (c.width !== Math.round(r.width * dpr) || c.height !== Math.round(r.height * dpr)) { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); }
      var x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, r.width, r.height);
      beams[k].forEach(function (b) {
        var ph = Math.sin(t * b.s + b.o);
        var y0 = r.height * (b.y + ph * 0.05), y1 = y0 + r.width * Math.tan(b.a);
        var g = x.createLinearGradient(0, y0, r.width, y1);
        g.addColorStop(0, 'rgba(209,172,91,0)'); g.addColorStop(0.5, 'rgba(209,172,91,' + (0.3 + ph * 0.12).toFixed(3) + ')'); g.addColorStop(1, 'rgba(209,172,91,0)');
        x.strokeStyle = g; x.lineWidth = b.w; x.shadowColor = 'rgba(209,172,91,.6)'; x.shadowBlur = 14;
        x.beginPath(); x.moveTo(0, y0); x.lineTo(r.width, y1); x.stroke();
      });
    });
    if (!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
