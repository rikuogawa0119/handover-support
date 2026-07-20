-- 授業記録テーブル

do $$ begin
  create type public.understanding_level as enum ('GOOD', 'PARTIAL', 'NEEDS_REVIEW');
exception
  when duplicate_object then null;
end $$;

comment on type public.understanding_level is '理解度（GOOD: 良好, PARTIAL: 一部理解, NEEDS_REVIEW: 要復習）';

create table if not exists public.lessons (
  lesson_id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (student_id) on delete cascade,
  teacher_id uuid not null references public.teachers (teacher_id) on delete restrict,
  subject_id uuid not null references public.subjects (subject_id) on delete restrict,
  lesson_date date not null,
  lesson_content text not null,
  understanding public.understanding_level not null,
  next_plan text not null,
  created_at timestamptz not null default now()
);

comment on table public.lessons is '授業記録テーブル';
comment on column public.lessons.lesson_id is '授業記録ID（主キー）';
comment on column public.lessons.student_id is '生徒ID（外部キー）';
comment on column public.lessons.teacher_id is '講師ID（外部キー）';
comment on column public.lessons.subject_id is '科目ID（外部キー）';
comment on column public.lessons.lesson_date is '授業日';
comment on column public.lessons.lesson_content is '授業内容';
comment on column public.lessons.understanding is '理解度';
comment on column public.lessons.next_plan is '次回実施内容';

create index if not exists lessons_student_id_idx on public.lessons (student_id);
create index if not exists lessons_teacher_id_idx on public.lessons (teacher_id);
create index if not exists lessons_subject_id_idx on public.lessons (subject_id);

-- Row Level Security
alter table public.lessons enable row level security;

-- 生徒ごとの授業履歴を全講師が参照できるようにする（代講対応のため）
create policy "lessons_select_authenticated"
  on public.lessons for select
  to authenticated
  using (true);

-- 授業記録の登録は自分（ログイン講師）を担当講師として登録する場合のみ許可
create policy "lessons_insert_own"
  on public.lessons for insert
  to authenticated
  with check (auth.uid() = teacher_id);

-- 更新・削除は記録した本人のみ許可
create policy "lessons_update_own"
  on public.lessons for update
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "lessons_delete_own"
  on public.lessons for delete
  to authenticated
  using (auth.uid() = teacher_id);
