# shaunhare.co.uk

Personal website built with [VitePress](https://vitepress.dev). Hosted as static content on S3.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static output is written to `dist/`. Upload the contents of that directory to your S3 bucket.

## Deploy to S3

After building, sync to your bucket:

```bash
aws s3 sync dist/ s3://YOUR_BUCKET_NAME/ --delete
```

If you use CloudFront, invalidate the distribution afterwards:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Adding content

- **Pages**: Add `.md` files anywhere under `docs/`
- **Blog posts**: Add `.md` files to `docs/blog/` and link them from `docs/blog/index.md`
- **Navigation**: Update `docs/.vitepress/config.ts` to add nav items
