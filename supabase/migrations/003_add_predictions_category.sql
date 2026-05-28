-- Add Predictions category (Kalshi / Polymarket alpha)
alter table public.blocks
  drop constraint if exists blocks_category_check;

alter table public.blocks
  add constraint blocks_category_check
  check (category in ('DeFi', 'Trading', 'Dev', 'Research', 'Growth', 'Predictions'));
