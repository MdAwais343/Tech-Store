# Noor Tech Store – React storefront

A Vite + React store with a hero carousel, product grid, search, deals, product pages and a cart that checks out over WhatsApp. No backend required.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Make it yours

| What | Where |
| --- | --- |
| Store name, currency, WhatsApp number, email, phone | `src/config.js` |
| Products, prices, deals, stock | The **/admin** dashboard (see below). `src/data/products.js` holds the starter list and the hero setup |
| Hero carousel and the two promo cards on the home page | `heroSlides` and `promoCards` in `src/data/products.js`. They pick their photo, "from" price and discount from your products by category (or the Deal flag), and hide themselves when a category has no products |
| Colours | CSS variables at the top of `src/index.css` |
| About / Why us / Delivery / Privacy / Terms text | `src/pages/InfoPage.jsx` |

## Admin dashboard (`/admin`)

Add, edit and delete products, upload photos, and switch **Deal**, **Featured** (shown under Recommended items) and **In stock** per product. A product with an old price higher than its price shows a "% OFF" badge. Changes appear on the store immediately.

**Before Supabase is connected** the dashboard runs in *demo mode*: it saves to your own browser only, so visitors never see the changes. Use it to try things out.

### Go live with Supabase (free tier, about 10 minutes)

1. Create a project at supabase.com.
2. **Authentication → Users → Add user**: create your admin email and password (tick *Auto Confirm*). Then **Authentication → Sign In / Providers → Email**: turn off *Allow new users to sign up*.
3. Open `supabase/schema.sql`, replace `CHANGE-ME@example.com` with your admin email (the one from step 2), then paste the whole file into **SQL Editor → New query → Run**. This creates the `products` table, the `product-images` storage bucket, the security rules and the starter products. To add another admin later, run `insert into public.admins (email) values ('someone@example.com');`.
4. **Project Settings → API**: copy the *Project URL* and the *anon public* key.
5. Locally: copy `.env.example` to `.env.local` and paste both values. On Vercel: **Settings → Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.
6. Open `/admin` and sign in.

**Security:** the anon key is public by design. Only the emails in the `public.admins` table can add, edit or delete products or upload images. Everyone else can only read. Never put the `service_role` key in this app.

## Where the images live

The 13 starter product photos in `public/images/products/` are free-licence stock photos from Unsplash. They are stand-ins: replace them with photos of the products you actually sell (dashboard → Edit → Upload photo).

Photos you upload in the dashboard go to your Supabase `product-images` bucket (public URLs, resized to max 1000px). You can also use any of the options below. Replace the generated placeholder images using any ONE of these:

### Option 1 – Inside the project (simplest, best to start)
Put files in `public/images/products/` and point to them in `src/data/products.js`:

```js
image: '/images/products/my-flask.jpg'
```

Anything in `public/` is deployed by Vercel as-is. Tips: use JPG/WebP at about 800×800 px, and keep each file under ~200 KB. The home page hero has no banner images of its own: it uses the photos of your products.

### Option 2 – External image hosting (best once you have many products)
Upload to a service and paste the full URL as `image`:

```js
image: 'https://res.cloudinary.com/<your-cloud>/image/upload/v1/my-flask.jpg'
```

Good choices: **Cloudinary** (free tier, resizes and compresses for you), **Vercel Blob**, **Supabase Storage**, **AWS S3 / Cloudflare R2**. No code change is needed. If you use a URL from a different domain you only need to make sure the host allows hot-linking.

### Option 3 – Upload from the admin dashboard
Easiest day to day: click **Add product → Upload photo**. See *Admin dashboard* above.

> Use only photos you own or have a licence for. Do not copy product images from other shops' websites.

## Deploy on Vercel

1. Push this folder to GitHub (`git init`, commit, create a repo, push).
2. On vercel.com choose **Add New → Project**, import the repo.
3. Vercel detects Vite automatically (Build command `npm run build`, Output `dist`). Click **Deploy**.
4. Every later `git push` redeploys. Add your own domain under **Project → Settings → Domains**.

`vercel.json` already rewrites all routes to `index.html`, so refreshing `/product/3` or `/cart` works.

CLI alternative: `npm i -g vercel && vercel --prod`.

## Notes

- The cart is stored in the browser (`localStorage`). Checkout opens WhatsApp with the order pre-filled. For card payments or order tracking you will need a backend or a service such as Stripe.
- The newsletter box in the footer is front-end only; connect it to an email service before relying on it.
