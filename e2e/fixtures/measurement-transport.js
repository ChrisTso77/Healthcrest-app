// Deterministic transport for the documented Vercel beforeSend protocol.
// The real installed React/Next SDKs load this script and register their hooks.
// This fixture is only served by Playwright; it is not a production collector.
(function () {
  var kind = '__KIND__';
  var state = window.__hcMeasurementTransport = window.__hcMeasurementTransport || {};
  function post(path, value) {
    if (value) return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
    return Promise.resolve();
  }
  if (kind === 'analytics') {
    state.emitPage = function (override) {
      var value = override || { type: 'pageview', url: location.href, unexpected: 'DO-NOT-SEND' };
      return post('/_vercel/insights/view', state.pageFilter ? state.pageFilter(value) : null);
    };
    var queued = window.vaq || [];
    window.va = function (action, value) {
      if (action === 'beforeSend') state.pageFilter = value;
      if (action === 'pageview') state.emitPage();
      if (action === 'event') state.emitPage({ type: 'event', url: location.href, data: value });
    };
    queued.forEach(function (entry) { window.va(entry[0], entry[1]); });
    window.vaq = [];
  } else {
    state.emitVital = function (override) {
      var value = override || { type: 'vital', url: location.href, route: '/PRIVATE-ROUTE', unexpected: 'DO-NOT-SEND' };
      var filtered = state.vitalFilter ? state.vitalFilter(value) : null;
      return post('/_vercel/speed-insights/vitals', filtered ? Object.assign({}, filtered, { metric: { name: 'LCP', value: 321 } }) : null);
    };
    var queuedSpeed = window.siq || [];
    window.si = function (action, value) { if (action === 'beforeSend') state.vitalFilter = value; };
    queuedSpeed.forEach(function (entry) { window.si(entry[0], entry[1]); });
    window.siq = [];
    state.emitVital();
  }
})();
