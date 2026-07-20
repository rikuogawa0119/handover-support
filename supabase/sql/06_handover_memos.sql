-- 引継ぎメモテーブル

create table if not exists public.handover_memos (
  handover_id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (student_id) on delete cascade,
  teacher_id uuid not null references public.teachers (teacher_id) on delete restrict,
  memo_content text not null,
  created_at timestamptz not null default now()
);

comment on table public.handover_memos is '引継ぎメモテーブル';
comment on column public.handover_memos.handover_id is '引継ぎメモID（主キー）';
comment on column public.handover_memos.student_id is '生徒ID（外部キー）';
comment on column public.handover_memos.teacher_id is '講師ID（外部キー）';
comment on column public.handover_memos.memo_content is 'メモ内容';
comment on column public.handover_memos.created_at is '作成日時';

create index if not exists handover_memos_student_id_idx on public.handover_memos (student_id);
create index if not exists handover_memos_teacher_id_idx on public.handover_memos (teacher_id);

-- Row Level Security
alter table public.handover_memos enable row level security;

-- 代講対応のため、全講師が生徒の引継ぎメモを閲覧できる
create policy "handover_memos_select_authenticated"
  on public.handover_memos for select
  to authenticated
  using (true);

-- 登録は自分（ログイン講師）を記入者として登録する場合のみ許可
create policy "handover_memos_insert_own"
  on public.handover_memos for insert
  to authenticated
  with check (auth.uid() = teacher_id);

-- 更新・削除は記入した本人のみ許可
create policy "handover_memos_update_own"
  on public.handover_memos for update
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "handover_memos_delete_own"
  on public.handover_memos for delete
  to authenticated
  using (auth.uid() = teacher_id);
