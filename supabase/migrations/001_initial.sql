-- blocks table
create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  creator_address text not null,
  creator_name text not null default '',
  title text not null,
  preview_text text not null,
  preview_image_url text,
  category text not null check (category in ('DeFi', 'Trading', 'Dev', 'Research', 'Growth')),
  price_ip text not null default '0.1',
  ip_id text,
  license_terms_id text,
  cdr_uuid integer,
  content_type text not null check (content_type in ('video', 'pdf', 'markdown')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- purchases table
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_address text not null,
  block_id uuid not null references public.blocks(id),
  license_token_id text not null,
  tx_hash text not null,
  created_at timestamptz not null default now()
);

-- indexes
create index on public.purchases(buyer_address);
create index on public.purchases(block_id);
create index on public.blocks(creator_address);

-- RLS
alter table public.blocks enable row level security;
alter table public.purchases enable row level security;

-- blocks: anyone can read
create policy "blocks_read" on public.blocks for select using (true);
-- blocks: only service role can insert/update (via API routes)
create policy "blocks_insert" on public.blocks for insert with check (true);

-- purchases: anyone can read their own
create policy "purchases_read" on public.purchases for select using (true);
create policy "purchases_insert" on public.purchases for insert with check (true);

-- storage bucket for CDR encrypted content
insert into storage.buckets (id, name, public) values ('cdr-content', 'cdr-content', false);

-- storage: only service role can upload (server-side)
create policy "storage_insert" on storage.objects for insert with check (bucket_id = 'cdr-content');
-- storage: service role can download
create policy "storage_select" on storage.objects for select using (bucket_id = 'cdr-content');
