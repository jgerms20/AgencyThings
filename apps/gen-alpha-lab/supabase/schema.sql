create table if not exists public.gen_alpha_lab_records (
  id text primary key,
  kind text not null check (kind in ('report', 'article', 'podcast', 'interview', 'field-note')),
  title text not null,
  source text not null,
  summary text not null,
  tags text[] not null default '{}',
  status text not null check (status in ('new', 'queued', 'reviewed')),
  confidence text not null check (confidence in ('low', 'medium', 'high')),
  url text,
  author text,
  published_at date,
  transcript text,
  file_name text,
  storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists gen_alpha_lab_records_kind_idx
  on public.gen_alpha_lab_records (kind);

create index if not exists gen_alpha_lab_records_status_idx
  on public.gen_alpha_lab_records (status);

create index if not exists gen_alpha_lab_records_tags_idx
  on public.gen_alpha_lab_records using gin (tags);

alter table public.gen_alpha_lab_records enable row level security;

create policy "Service role can manage lab records"
  on public.gen_alpha_lab_records
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into storage.buckets (id, name, public)
values ('gen-alpha-lab', 'gen-alpha-lab', false)
on conflict (id) do nothing;
