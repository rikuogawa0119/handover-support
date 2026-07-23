-- ダミーデータ投入用SQL
--
-- Supabase の SQL Editor でこのファイルの内容をそのまま実行してください
-- （postgres 権限で実行されるため RLS は無視され、auth.users への直接INSERTも可能です）。
--
-- 注意:
--   ・このスクリプトは「一度だけ」実行する想定です。再実行すると講師アカウントは
--     メール重複でスキップされますが、生徒・授業・宿題・引継ぎメモは重複して増えます。
--   ・ダミー講師のログインパスワードは全員 "password123!" です。
--   ・pgcrypto 拡張（crypt/gen_salt）と gen_random_uuid が使える必要があります。
--     Supabase プロジェクトではデフォルトで有効です。

begin;

-- 1. 講師（auth.users + public.teachers）--------------------------------

create temp table tmp_teachers as
with new_users as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  )
  select
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    v.email,
    crypt('password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  from (values
    ('yamada.taro@example.com', '山田 太郎'),
    ('sato.hanako@example.com', '佐藤 花子'),
    ('suzuki.jiro@example.com', '鈴木 次郎')
  ) as v(email, teacher_name)
  where not exists (select 1 from auth.users u where u.email = v.email)
  returning id, email
)
select nu.id, nu.email, v.teacher_name
from new_users nu
join (values
  ('yamada.taro@example.com', '山田 太郎'),
  ('sato.hanako@example.com', '佐藤 花子'),
  ('suzuki.jiro@example.com', '鈴木 次郎')
) as v(email, teacher_name) on v.email = nu.email;

insert into auth.identities (
  user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select id, id::text, jsonb_build_object('sub', id::text, 'email', email), 'email', now(), now(), now()
from tmp_teachers;

insert into public.teachers (teacher_id, teacher_name, email)
select id, teacher_name, email from tmp_teachers
on conflict (email) do nothing;

-- 既存講師（今回スキップされた分）もこの後の処理で使えるように teacher_id 一覧を作り直す
create temp table tmp_teacher_ids as
select teacher_id from public.teachers
where email in ('yamada.taro@example.com', 'sato.hanako@example.com', 'suzuki.jiro@example.com');

-- 2. 科目 -----------------------------------------------------------------

insert into public.subjects (subject_name) values
  ('数学'), ('英語'), ('国語'), ('理科'), ('社会')
on conflict (subject_name) do nothing;

-- 3. 生徒 -----------------------------------------------------------------

create temp table tmp_students as
with ins as (
  insert into public.students (student_name, grade, school_name, note)
  values
    ('田中 一郎', '中学1年', '市立第一中学校', null),
    ('高橋 美咲', '中学2年', '市立第二中学校', null),
    ('伊藤 健太', '中学3年', '市立第一中学校', '本人はケアレスミスが多いので、途中式を書く習慣をつけさせてください。'),
    ('渡辺 さくら', '高校1年', '県立中央高校', null),
    ('中村 大輔', '高校2年', '県立中央高校', '部活が忙しく宿題が溜まりがちなので、量を調整しつつ進めてください。'),
    ('小林 陽菜', '高校3年', '私立東高校', null)
  returning student_id
)
select student_id from ins;

-- 4. 授業記録 --------------------------------------------------------------

create temp table tmp_lessons as
with ins as (
  insert into public.lessons (student_id, teacher_id, subject_id, lesson_date, lesson_content, understanding, next_plan)
  select
    s.student_id,
    (select teacher_id from tmp_teacher_ids order by random() limit 1),
    (select subject_id from public.subjects order by random() limit 1),
    current_date - (floor(random() * 120))::int,
    (array[
      '二次方程式の解の公式を用いた演習問題を解いた。',
      '現在完了形の用法について例文を交えて確認した。',
      '光合成の仕組みについて教科書の図を用いて解説した。',
      '江戸時代の政治体制について年表を使って整理した。',
      '漢文の返り点の読み方を練習問題で確認した。',
      '連立方程式の文章題を一緒に解いた。',
      '英単語テストの復習と長文読解の練習を行った。',
      '力学（運動方程式）の基礎問題演習を行った。'
    ])[1 + floor(random() * 8)::int],
    (array['GOOD', 'PARTIAL', 'NEEDS_REVIEW']::public.understanding_level[])[1 + floor(random() * 3)::int],
    (array[
      '次回は応用問題に取り組む。',
      '宿題の丸付けから始める。',
      '小テストを実施して理解度を確認する。',
      '苦手分野の復習を中心に進める。',
      '次単元の予習を進める。'
    ])[1 + floor(random() * 5)::int]
  from tmp_students s
  cross join lateral generate_series(1, 3 + floor(random() * 4)::int) as g(n)
  returning lesson_id
)
select lesson_id from ins;

-- 5. 宿題 ------------------------------------------------------------------

insert into public.homework (lesson_id, homework_content, submission_status)
select
  l.lesson_id,
  (array[
    '問題集 p.32〜p.34',
    '英単語帳 Unit 5 暗記',
    '教科書の要点をノートにまとめる',
    'プリント3枚（配布済み）',
    '小論文の下書き作成'
  ])[1 + floor(random() * 5)::int],
  (array['ASSIGNED', 'SUBMITTED', 'NOT_SUBMITTED']::public.submission_status[])[1 + floor(random() * 3)::int]
from tmp_lessons l
where random() < 0.8;

-- 6. 引継ぎメモ --------------------------------------------------------------

insert into public.handover_memos (student_id, teacher_id, memo_content)
select
  s.student_id,
  (select teacher_id from tmp_teacher_ids order by random() limit 1),
  (array[
    '本人はケアレスミスが多いので、途中式を書く習慣をつけさせてください。',
    '部活が忙しく宿題が溜まりがちなので、量を調整しつつ進めてください。',
    '英語の発音に苦手意識があるため、音読を重視してほしいとのご要望あり。',
    '保護者から次回の面談希望の連絡あり。日程調整をお願いします。',
    '最近集中力が続かない様子。休憩を挟みながら進めるとよい。'
  ])[1 + floor(random() * 5)::int]
from tmp_students s
cross join lateral generate_series(1, 1 + floor(random() * 2)::int) as g(n)
where random() < 0.6;

commit;
