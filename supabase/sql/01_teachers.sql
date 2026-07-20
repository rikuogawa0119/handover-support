-- 講師テーブル
-- teacher_id は Supabase Auth (auth.users) のユーザーIDをそのまま主キーとして利用する。
-- ログイン済みの講師本人と id が一致するレコードとして 1:1 で紐づく。

create table if not exists public.teachers (
  teacher_id uuid primary key references auth.users (id) on delete cascade,
  teacher_name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.teachers is '講師テーブル';
comment on column public.teachers.teacher_id is '講師ID（主キー, auth.users.id と同一）';
comment on column public.teachers.teacher_name is '講師名';
comment on column public.teachers.email is 'メールアドレス';

-- Row Level Security
alter table public.teachers enable row level security;

-- ログイン済みの講師は全講師の一覧を閲覧できる（生徒の担当講師表示・引継ぎ担当者選択などのため）
create policy "teachers_select_authenticated"
  on public.teachers for select
  to authenticated
  using (true);

-- 自分自身のレコードのみ登録・更新できる
create policy "teachers_insert_self"
  on public.teachers for insert
  to authenticated
  with check (auth.uid() = teacher_id);

create policy "teachers_update_self"
  on public.teachers for update
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);
