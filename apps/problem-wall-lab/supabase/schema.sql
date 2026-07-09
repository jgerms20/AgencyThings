create table if not exists problem_wall_source_signals (
  id text primary key,
  title text not null,
  source text not null,
  source_type text not null,
  url text,
  published_at date not null,
  audience text not null,
  behavior text not null,
  tension text not null,
  stat text,
  urgency text,
  why_it_matters text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists problem_wall_candidates (
  id text primary key,
  week_of date not null,
  client_id text not null,
  client_name text not null,
  strategist text not null,
  email text not null,
  problem text not null,
  opportunity text not null,
  details text not null,
  audience text not null,
  status text not null default 'draft',
  burst_total integer not null default 0,
  burst_breakdown jsonb not null default '{}',
  source_ids text[] not null default '{}',
  image_prompt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists problem_wall_candidates_week_idx
  on problem_wall_candidates (week_of desc, status);

create index if not exists problem_wall_source_signals_published_idx
  on problem_wall_source_signals (published_at desc);
