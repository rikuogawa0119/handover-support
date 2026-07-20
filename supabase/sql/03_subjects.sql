-- 科目テーブル

create table if not exists public.subjects (
  subject_id uuid primary key default gen_random_uuid(),
  subject_name text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.subjects is '科目テーブル';
comment on column public.subjects.subject_id is '科目ID（主キー）';
comment on column public.subjects.subject_name is '科目名';

-- Row Level Security
alter table public.subjects enable row level security;

-- 科目マスタはログイン済みの講師なら誰でも閲覧できる
create policy "subjects_select_authenticated"
  on public.subjects for select
  to authenticated
  using (true);

-- 科目マスタの登録・更新もログイン済みの講師なら可能とする（管理者権限を分けたい場合は別途 role 判定を追加）
create policy "subjects_insert_authenticated"
  on public.subjects for insert
  to authenticated
  with check (true);

create policy "subjects_update_authenticated"
  on public.subjects for update
  to authenticated
  using (true)
  with check (true);
