-- Supabase SQL Editor でまとめて実行する場合はこのファイルの内容をコピーするか、
-- 01〜06 を番号順に実行してください（外部キーの依存関係があるため順序が重要です）。
--
-- 01_teachers.sql        講師テーブル（auth.users と 1:1）
-- 02_students.sql        生徒テーブル
-- 03_subjects.sql        科目テーブル
-- 04_lessons.sql         授業記録テーブル（students / teachers / subjects を参照）
-- 05_homework.sql        宿題テーブル（lessons を参照）
-- 06_handover_memos.sql  引継ぎメモテーブル（students / teachers を参照）

\i 01_teachers.sql
\i 02_students.sql
\i 03_subjects.sql
\i 04_lessons.sql
\i 05_homework.sql
\i 06_handover_memos.sql
