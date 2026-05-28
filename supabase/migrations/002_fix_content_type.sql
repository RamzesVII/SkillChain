-- Add image and text to content_type constraint
alter table public.blocks
  drop constraint if exists blocks_content_type_check;

alter table public.blocks
  add constraint blocks_content_type_check
  check (content_type in ('video', 'pdf', 'markdown', 'image', 'text'));
