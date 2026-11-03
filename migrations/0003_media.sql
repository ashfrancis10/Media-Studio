create table if not exists site_media (
  id text primary key,
  owner_id text not null,
  mime text not null,
  data text not null,
  created_at timestamptz not null default now()
);

create index if not exists site_media_owner_idx on site_media (owner_id);
