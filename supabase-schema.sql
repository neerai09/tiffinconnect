-- Run this entire file in Supabase → SQL Editor → New query → Run

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, name text, avatar text,
  role text check (role in ('customer','provider')) not null default 'customer',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Anyone can view profiles" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create table if not exists public.tiffins (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.profiles(id) on delete cascade not null,
  title text not null, description text,
  price_per_day numeric not null,
  diet_type text check (diet_type in ('veg','nonveg','jain')) default 'veg',
  city text, area text, cuisine text,
  delivery_type text check (delivery_type in ('home','pickup','both')) default 'home',
  menu_items text, cover_emoji text default '🍱',
  active boolean default true, rating numeric, total_orders integer default 0,
  created_at timestamptz default now()
);
alter table public.tiffins enable row level security;
create policy "Anyone can view active tiffins" on public.tiffins for select using (active = true or provider_id = auth.uid());
create policy "Providers can insert tiffins" on public.tiffins for insert with check (auth.uid() = provider_id);
create policy "Providers can update tiffins" on public.tiffins for update using (auth.uid() = provider_id);
create policy "Providers can delete tiffins" on public.tiffins for delete using (auth.uid() = provider_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  provider_id uuid references public.profiles(id) on delete set null,
  tiffin_id uuid references public.tiffins(id) on delete set null,
  tiffin_title text, plan text, days integer,
  price_per_day numeric, total_amount numeric, platform_fee numeric,
  status text check (status in ('pending_payment','active','paused','completed','cancelled')) default 'pending_payment',
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Customers can create orders" on public.orders for insert with check (auth.uid() = customer_id);
create policy "Users can view own orders" on public.orders for select using (auth.uid() = customer_id or auth.uid() = provider_id);
create policy "Users can update own orders" on public.orders for update using (auth.uid() = customer_id or auth.uid() = provider_id);
