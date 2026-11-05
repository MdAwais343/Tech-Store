-- Noor Tech Store database setup.
-- Supabase dashboard -> SQL Editor -> New query -> paste everything -> Run.
-- Safe to run more than once.

-- 1) ADMINS: only these emails can add, edit or delete products and upload photos.
--    To add another admin later: insert into public.admins (email) values ('someone@example.com');
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;  -- no policies: hidden from the public API

insert into public.admins (email) values (lower('CHANGE-ME@example.com')) on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;

-- 2) PRODUCTS TABLE
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

-- 3) PRODUCT PHOTO STORAGE
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

-- 4) STARTER PRODUCTS (only added while the table is empty; delete this block to start with no products)
insert into public.products
  (title, label, category, price, old_price, rating, image, description, is_deal, featured, free_delivery, in_stock)
select * from (values
  ('Drip Coffee Maker and Grinder Set', 'Coffee Maker', 'Kitchen', 39, 55, 4, '/images/products/coffee-brewer.jpg', 'Grind fresh beans and brew into a thermal carafe that keeps coffee hot for hours.', true, false, true, true),
  ('Semi-Automatic Espresso Machine', 'Espresso Machine', 'Kitchen', 69, 99, 4.5, '/images/products/espresso-machine.jpg', '15-bar pressure pump, steam wand for milk and a removable water tank. Café coffee at home.', true, false, true, true),
  ('Stainless Steel Whistling Tea Kettle', 'Tea Kettle', 'Kitchen', 4.9, 7.9, 3.5, '/images/products/stainless-kettle.jpg', 'Classic stovetop kettle with a heat-safe handle and a whistle that tells you when the water is ready.', true, false, true, true),
  ('Stainless Steel Vacuum Flask, 1L', 'Vacuum Flask', 'Kitchen', 5.5, 9, 4, '/images/products/vacuum-flask.jpg', 'Double-wall insulation keeps drinks hot for 12 hours and cold for 24. Comes with a cup lid.', true, false, true, true),
  ('Adjustable Arm LED Desk Lamp', 'LED Desk Lamp', 'Home', 6.5, null, 4, '/images/products/desk-lamp.jpg', 'Flexible arm, warm and cool light modes and a sturdy base. Ideal for study and work.', false, false, true, true),
  ('Compact Mechanical Keyboard with Colour Keycaps', 'Mechanical Keyboard', 'Computers', 18.9, 29.9, 4.5, '/images/products/mechanical-keyboard.jpg', 'Tactile switches, compact 87-key layout and durable keycaps for typing and gaming.', true, true, true, true),
  ('2.4G Wireless Ergonomic Mouse', 'Wireless Mouse', 'Computers', 3.9, null, 4, '/images/products/wireless-mouse.jpg', 'Comfortable ergonomic shape, silent clicks and a USB receiver that works up to 10 metres away.', false, true, true, true),
  ('10000mAh Slim Power Bank with Fast Charging', 'Power Bank', 'Gadgets', 7.5, 12.5, 4.5, '/images/products/power-bank.jpg', 'Slim and light, charges two devices at once. Comes with a 3-in-1 charging cable.', true, true, true, true),
  ('Foldable Over-Ear Headphones with Mic', 'Headphones', 'Audio', 8.5, 14.9, 4, '/images/products/headphones.jpg', 'Soft ear cushions, foldable design and a built-in microphone for calls. 3.5 mm cable included.', true, true, true, true),
  ('Mini Portable Bluetooth Speaker with Strap', 'Bluetooth Speaker', 'Audio', 6.9, 11.5, 4.5, '/images/products/bluetooth-speaker.jpg', 'Pocket-sized speaker with punchy bass, a carry strap and up to 10 hours of battery.', true, true, true, true),
  ('True Wireless Earbuds with Charging Case', 'Wireless Earbuds', 'Audio', 7.9, 15.8, 4, '/images/products/wireless-earbuds.jpg', 'Bluetooth 5.3, clear sound, touch controls and up to 24 hours of playtime with the charging case.', true, true, true, true),
  ('Waterproof Fitness Band with Colour Display', 'Fitness Band', 'Wearables', 4.5, 9, 3.5, '/images/products/fitness-band.jpg', 'Track steps, sleep and heart rate on a slim, comfortable band with a bright colour screen.', true, true, true, true),
  ('Smart Watch with Heart-Rate and Sleep Tracking', 'Smart Watch', 'Wearables', 14.9, 29.8, 4, '/images/products/smart-watch.jpg', 'AMOLED display, 7-day battery, notifications and 20+ sport modes. Works with Android and iOS.', true, true, true, true)
) as v(title, label, category, price, old_price, rating, image, description, is_deal, featured, free_delivery, in_stock)
where not exists (select 1 from public.products);
