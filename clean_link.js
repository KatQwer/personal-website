if (window.location.pathname.endsWith('.html')) {
  const clean_url = window.location.pathname.replace('.html', '');
  window.location.replace(clean_url);
}