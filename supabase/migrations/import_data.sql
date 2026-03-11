-- ============================================================
-- CARELLO HUB - Import data
-- Run this in Supabase Studio SQL Editor AFTER the schema migration
-- ============================================================

-- 1. Import folders
INSERT INTO public.folders (id, name, color, position, created_at) VALUES
('e9a5d22f-3b61-425b-a106-6c8cc5f10dbb', 'GAME', 'hsl(0, 85%, 45%)', 0, '2026-01-30 14:55:22.525084+00');

-- 2. Import apps
INSERT INTO public.apps (id, name, icon_name, href, color, position, created_at, folder_id, position_in_folder) VALUES
('32c1e94b-c7de-455e-a016-22c374bf19a2', 'Code Editor', 'FileCode', 'https://www.onlinegdb.com', 'hsl(0, 60%, 85%)', 0, '2025-10-07 09:19:44.485129+00', NULL, 0),
('c78770bf-8f89-46d8-a233-8a40f9b48fcb', 'MicroASM', 'Cpu', 'https://asm.nicolocarello.it', 'hsl(240, 70%, 65%)', 1, '2025-10-30 09:02:30.09584+00', NULL, 0),
('4795f40c-a2fd-4f83-92f3-03e40068ce69', 'Base Converter', 'Binary', 'https://converter.nicolocarello.it', 'hsl(235, 75%, 80%)', 2, '2025-10-08 13:25:03.262439+00', NULL, 0),
('01adbb99-d177-46a0-b679-2747e402a18c', 'Lezioni', 'Files', 'https://nicolocarello.eu', 'hsl(320, 75%, 40%)', 3, '2025-10-09 08:53:31.155971+00', NULL, 0),
('9b2b6981-9120-4a9b-b7da-8de7df6a27a7', 'Subnetting Tools', 'Network', 'https://subnet.nicolocarello.it', 'hsl(45, 95%, 45%)', 4, '2025-11-28 16:14:28.95083+00', NULL, 0),
('6d0433fc-7ab4-4a69-b782-d24f0e5a3ad4', 'Turing Machine', 'Terminal', 'https://mdt.nicolocarello.it', 'hsl(0, 85%, 60%)', 5, '2025-11-28 16:13:52.662988+00', NULL, 0),
('789b67d0-0148-4e2f-8d60-75182f25b776', 'Flow charts', 'CodeSquare', 'https://flowchart.nicolocarello.it', 'hsl(196, 100%, 15%)', 6, '2025-11-28 16:43:36.033617+00', NULL, 0),
('ad9e7a68-b782-42ab-8240-130a3e5e57b6', 'DFSA', 'GitPullRequest', 'http://dfa.nicolocarello.it', 'hsl(120, 60%, 30%)', 7, '2025-12-04 10:16:42.65261+00', NULL, 0),
('153cfa29-90f8-46f4-9786-4689f4b12169', 'Scheduler', 'Cpu', 'http://scheduler.nicolocarello.it', 'hsl(0, 85%, 35%)', 8, '2025-12-10 20:22:30.705165+00', NULL, 0),
('af7bdb24-76f8-4e03-9bd7-f0c985b8b233', 'Gestionale', 'ClipboardCheck', 'https://ripe.nicolocarello.it', 'hsl(150, 70%, 45%)', 9, '2025-10-07 09:20:32.529543+00', 'e9a5d22f-3b61-425b-a106-6c8cc5f10dbb', 0),
('55defbf9-a030-4753-9e58-a9ed4af2efcd', 'website', 'Link', 'https://nicolocarello.it', 'hsl(217, 91%, 60%)', 10, '2025-10-06 14:37:09.382035+00', 'e9a5d22f-3b61-425b-a106-6c8cc5f10dbb', 1),
('6626e16b-073f-478a-97d6-30f76dc3f4c0', 'Calculator', 'Calculator', 'https://calculator.nicolocarello.it', 'hsl(30, 95%, 55%)', 11, '2025-10-16 11:12:51.547788+00', 'e9a5d22f-3b61-425b-a106-6c8cc5f10dbb', 2);
