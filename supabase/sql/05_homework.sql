-- 宿題テーブル

do $$ begin
  create type public.submission_status as enum ('UNSET', 'ASSIGNED', 'SUBMITTED', 'NOT_SUBMITTED');
exception
  when duplicate_object then null;
end $$;

comment on type public.submission_status is '提出状況（UNSET: 未設定, ASSIGNED: 出題済, SUBMITTED: 提出済, NOT_SUBMITTED: 未提出）';

create table if not exists public.homework (
  homework_id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (lesson_id) on delete cascade,
  homework_content text not null,
  submission_status public.submission_status not null default 'UNSET',
  created_at timestamptz not null default now()
);

comment on table public.homework is '宿題テーブル';
comment on column public.homework.homework_id is '宿題ID（主キー）';
comment on column public.homework.lesson_id is '授業記録ID（外部キー）';
comment on column public.homework.homework_content is '宿題内容';
comment on column public.homework.submission_status is '提出状況';

create index if not exists homework_lesson_id_idx on public.homework (lesson_id);

-- Row Level Security
alter table public.homework enable row level security;

-- 全講師が宿題情報を閲覧できる
create policy "homework_select_authenticated"
  on public.homework for select
  to authenticated
  using (true);

-- 紐づく授業記録を担当した講師のみ登録・更新・削除できる
create policy "homework_insert_own_lesson"
  on public.homework for insert
  to authenticated
  with check (
    exists (
      select 1 from public.lessons
      where lessons.lesson_id = homework.lesson_id
        and lessons.teacher_id = auth.uid()
    )
  );

create policy "homework_update_own_lesson"
  on public.homework for update
  to authenticated
  using (
    exists (
      select 1 from public.lessons
      where lessons.lesson_id = homework.lesson_id
        and lessons.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.lessons
      where lessons.lesson_id = homework.lesson_id
        and lessons.teacher_id = auth.uid()
    )
  );

create policy "homework_delete_own_lesson"
  on public.homework for delete
  to authenticated
  using (
    exists (
      select 1 from public.lessons
      where lessons.lesson_id = homework.lesson_id
        and lessons.teacher_id = auth.uid()
    )
  );
