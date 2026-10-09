// Preloads the headline font in production builds. The file name carries a content hash,
// so it can only be written into index.html once the bundle exists.
const PRELOAD = [/montserrat-latin-wght-normal-[\w-]+\.woff2$/];

export default function fontPreload() {
  return {
    name: 'oneness-font-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle || {}).filter((f) => PRELOAD.some((re) => re.test(f)));
        return files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' },
          injectTo: 'head-prepend',
        }));
      },
    },
  };
}
