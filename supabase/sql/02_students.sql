-- 生徒テーブル

create table if not exists public.students (
  student_id uuid primary key default gen_random_uuid(),
  student_name text not null,
  grade text,
  school_name text,
  note text,
  created_at timestamptz not null default now()
);

comment on table public.students is '生徒テーブル';
comment on column public.students.student_id is '生徒ID（主キー）';
comment on column public.students.student_name is '生徒名';
comment on column public.students.grade is '学年';
comment on column public.students.school_name is '学校名';
comment on column public.students.note is '注意事項';

-- Row Level Security
alter table public.students enable row level security;

-- ログイン済みの講師は全員が生徒情報を閲覧・登録・更新できる（担当外の生徒の代講対応もあるため）
create policy "students_select_authenticated"
  on public.students for select
  to authenticated
  using (true);

create policy "students_insert_authenticated"
  on public.students for insert
  to authenticated
  with check (true);

create policy "students_update_authenticated"
  on public.students for update
  to authenticated
  using (true)
  with check (true);
