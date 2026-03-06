Deno.serve(async (req) => {
  try {
    const manifest = {
      name: "Freshdesk Manager",
      short_name: "FD Manager",
      description: "Gerenciador de tickets Freshdesk com IA",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait-primary",
      background_color: "#ffffff",
      theme_color: "#0f766e",
      icons: [
        {
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect fill='%230f766e' width='192' height='192'/%3E%3Ctext x='50%' y='50%' font-size='96' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3EFD%3C/text%3E%3C/svg%3E",
          sizes: "192x192",
          type: "image/svg+xml",
          purpose: "any"
        },
        {
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect fill='%230f766e' width='512' height='512'/%3E%3Ctext x='50%' y='50%' font-size='256' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3EFD%3C/text%3E%3C/svg%3E",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable"
        }
      ],
      categories: ["productivity"],
      prefer_related_applications: false
    };

    return Response.json(manifest, {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});