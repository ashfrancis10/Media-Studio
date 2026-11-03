create table if not exists site_state (
  id integer primary key default 1,
  owner_id text,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_state_singleton check (id = 1)
);
