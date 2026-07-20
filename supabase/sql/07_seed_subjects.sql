-- 科目マスタの初期データ
-- Supabase SQL Editor で実行してください（postgres 権限で実行されるため RLS を気にせず投入できます）。

insert into public.subjects (subject_name) values
  ('数学'),
  ('英語'),
  ('国語'),
  ('理科'),
  ('社会')
on conflict (subject_name) do nothing;
