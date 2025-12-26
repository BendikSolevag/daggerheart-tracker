drop table if exists public.parties;

create table public.parties (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);
insert into public.abilities (
  slug,
  name
)
values
(
  'eventyrklubben',
  'Eventyrklubben'
);