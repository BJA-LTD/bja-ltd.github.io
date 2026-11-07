window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function(){
  var c = null; try { c = localStorage.getItem('og.consent'); } catch (_) {}
  var g = c === 'yes' ? 'granted' : 'denied';
  gtag('consent', 'default', {ad_storage: g, ad_user_data: g, ad_personalization: g, analytics_storage: g});
  gtag('set', 'ads_data_redaction', g === 'denied');
  gtag('set', 'url_passthrough', true);
})();
gtag('js', new Date());
