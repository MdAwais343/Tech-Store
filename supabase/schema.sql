-- Run this whole file once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- It is safe to re-run (it will not duplicate the table, policies or bucket).

-- 1) WHO IS AN ADMIN ---------------------------------------------------------------
-- Replace the email below with the admin account you create under Authentication -> Users.
-- Add more emails inside the array, separated by commas.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'email') = any (array['admin@example.com']), false)
$$;

-- 2) PRODUCTS TABLE ----------------------------------------------------------------
create table if not exists public.products (
  id            bigint generated always as identity primary key,
  title         text    not null,
  label         text    not null default '',
  category      text    not null default 'Other',
  price         numeric(10,3) not null check (price > 0),
  old_price     numeric(10,3) check (old_price is null or old_price > price),
  rating        numeric(2,1)  not null default 4 check (rating between 0 and 5),
  image         text    not null default '',
  description   text    not null default '',
  is_deal       boolean not null default false,
  featured      boolean not null default false,
  free_delivery boolean not null default true,
  in_stock      boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products"
  on public.products for select using (true);

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 3) IMAGE STORAGE -----------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
  on storage.objects for select using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- 4) STARTER PRODUCTS (optional: delete this block if you want to start empty) ------
insert into public.products
  (title, label, category, price, old_price, rating, image, description, is_deal, featured, free_delivery, in_stock)
select * from (values
  ('5L Digital Air Fryer, 1700W', 'Air Fryer', 'Kitchen', 24.9, 39.9, 4.5, '/images/products/air-fryer.svg', 'Cook crispy meals with up to 90% less oil. Eight presets and a dishwasher-safe basket.', true, false, true, true),
  ('Waterproof Fitness Band with Step Counter', 'Fitness Band', 'Wearables', 4.5, 9, 3.5, '/images/products/fitness-band.svg', 'Track steps, sleep and heart rate on a slim, comfortable band.', true, false, true, true),
  ('Cordless Car Vacuum Cleaner', 'Car Vacuum', 'Car', 6.9, 11.5, 4, '/images/products/car-vacuum.svg', 'Strong suction in a pocket-sized body. Includes crevice tool and HEPA filter.', true, false, true, true),
  ('5-Speed Electric Hand Mixer', 'Hand Mixer', 'Kitchen', 5.5, null, 3.5, '/images/products/hand-mixer.svg', 'Lightweight mixer with whisk and dough-hook attachments, ideal for baking.', false, false, true, true),
  ('Foldable LED Desk Lamp with 3 Colour Modes', 'LED Desk Lamp', 'Home', 6.5, null, 4, '/images/products/desk-lamp.svg', 'Touch dimmer, three colour temperatures and a USB-C rechargeable battery.', false, false, true, true),
  ('Portable Waterproof Bluetooth Speaker', 'Bluetooth Speaker', 'Gadgets', 9.9, 16.5, 4.5, '/images/products/bluetooth-speaker.svg', 'Powerful bass, IPX6 splash resistance and a 12-hour battery for the beach or the garden.', true, false, true, true),
  ('Bluetooth 5.3 Wireless Earbuds with Charging Case', 'Wireless Earbuds', 'Gadgets', 7.9, 15.8, 4, '/images/products/wireless-earbuds.svg', 'Clear sound, touch controls and up to 24 hours of playtime with the charging case.', true, false, true, true),
  ('Smart Watch with Heart-Rate and Sleep Tracking', 'Smart Watch', 'Wearables', 14.9, 29.8, 4, '/images/products/smart-watch.svg', 'AMOLED display, 7-day battery, notifications and 20+ sport modes. Works with Android and iOS.', true, false, true, true),
  ('Over-Sink Stainless Steel Dish Rack', 'Dish Rack', 'Kitchen', 11, 25.6, 4, '/images/products/dish-rack.svg', 'Extendable two-tier rack with cutlery holder and drip tray. Saves counter space.', true, true, true, true),
  ('Adjustable Back Support Posture Belt', 'Posture Belt', 'Health', 4.9, 7.3, 3.5, '/images/products/posture-belt.svg', 'Breathable lumbar support belt with adjustable straps for all-day comfort.', true, true, true, true),
  ('Digital Blood Glucose Monitor Kit', 'Glucose Monitor', 'Health', 9.5, 28, 4.5, '/images/products/glucose-monitor.svg', 'Fast, accurate readings with a large display. Includes lancets, test strips and carry case.', true, true, true, true),
  ('Full HD Rear-View Mirror Dash Camera', 'Dash Cam Mirror', 'Car', 12.9, 27.4, 4, '/images/products/dash-cam-mirror.svg', 'Mirror-mounted dash cam with loop recording, night vision and a reversing camera input.', true, true, true, true),
  ('Rechargeable 9-in-1 Cordless Cleaning Brush', '9-in-1 Cleaning Brush', 'Cleaning', 5.9, 11.6, 4.5, '/images/products/cleaning-brush.svg', 'Nine interchangeable heads, extendable handle and USB charging. Cleans bathrooms, kitchens and cars.', true, true, true, true),
  ('Self-Squeeze Portable Mini Mop', 'Mini Mop', 'Cleaning', 3.5, 5.4, 4, '/images/products/mini-mop.svg', 'Compact squeeze mop with a microfibre head. Perfect for glass, tiles and tight corners.', true, true, true, true),
  ('Powerful 4500W Double Jar Blender', 'Double Jar Blender', 'Kitchen', 8.9, 27.8, 4, '/images/products/double-jar-blender.svg', 'Two jars for wet and dry grinding, stainless steel blades and a high-torque motor for smoothies, spices and sauces.', true, true, true, true),
  ('Premium Stainless Steel Vacuum Flask Gift Set', 'Vacuum Flask Set', 'Kitchen', 4.5, 9, 4, '/images/products/vacuum-flask-set.svg', 'Double-wall insulated flasks that keep drinks hot for 12 hours and cold for 24. Comes in a gift box with matching cups.', true, true, true, true)
) as v(title, label, category, price, old_price, rating, image, description, is_deal, featured, free_delivery, in_stock)
where not exists (select 1 from public.products);
