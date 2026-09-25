export default async function handler(req, res) {
  let { slug } = req.query || {};

  if (Array.isArray(slug)) {
    slug = slug[0];
  }

  if (typeof slug === 'string') {
    slug = slug.trim().replace(/\/+$/, '');
  }

  const defaultMeta = {
    title: 'Blogfólio',
    description: 'Desenvolvedor de Software. Busco a engenharia por trás do pixel e a lógica por trás da solução.',
    image: 'https://matheusmorete.space/molde.webp',
    url: 'https://matheusmorete.space',
  };

  let meta = { ...defaultMeta };

  if (slug) {
    meta.url = `https://matheusmorete.space/blog/${encodeURIComponent(slug)}`;

    try {
      const supabaseUrl =
        process.env.VITE_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        'https://diarrprlrkggufzccejo.supabase.co';
      const supabaseKey =
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        'sb_publishable_D8COeMZSn7ibOpxm2nzauw_CtxqbCNo';

      const response = await fetch(
        `${supabaseUrl}/rest/v1/posts?slug=ilike.${encodeURIComponent(slug)}&select=slug,title,subtitle,description,content`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        const posts = await response.json();
        const post = posts?.[0];

        if (post) {
          meta.title = post.title ? `${post.title} | Blogfólio` : defaultMeta.title;
          meta.description = post.description || post.subtitle || defaultMeta.description;
          meta.url = `https://matheusmorete.space/blog/${encodeURIComponent(post.slug || slug)}`;

          let imageUrl = '';
          if (typeof post.content === 'object' && post.content !== null) {
            imageUrl = post.content.image_url || '';
          } else if (typeof post.content === 'string') {
            try {
              const parsed = JSON.parse(post.content);
              imageUrl = parsed?.image_url || '';
            } catch {
              // Not JSON
            }
          }

          if (imageUrl) {
            meta.image = imageUrl;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching post for Open Graph:', err);
    }
  }

  const escapeHtml = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);
  const safeImage = escapeHtml(meta.image);
  const safeUrl = escapeHtml(meta.url);

  let imageMime = 'image/png';
  if (safeImage.endsWith('.jpg') || safeImage.endsWith('.jpeg')) {
    imageMime = 'image/jpeg';
  } else if (safeImage.endsWith('.webp')) {
    imageMime = 'image/webp';
  }

  const html = `<!DOCTYPE html>
<html lang="pt-br" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">

  <!-- Open Graph / LinkedIn / Facebook / WhatsApp / Discord -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Blogfólio">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:image:secure_url" content="${safeImage}">
  <meta property="og:image:type" content="${imageMime}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${safeTitle}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImage}">

  <link rel="canonical" href="${safeUrl}">

  <script>
    if (window.location.pathname.startsWith('/api')) {
      window.location.replace("${safeUrl}");
    }
  </script>
</head>
<body>
  <p><a href="${safeUrl}">${safeTitle}</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
  );
  return res.status(200).send(html);
}
