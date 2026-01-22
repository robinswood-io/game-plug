COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at, password_hash, auth_type, is_gm, authentik_id) FROM stdin;
test-user-1	test@example.com	Test	User	https://example.com/avatar.png	2025-08-23 12:06:58.951666	2025-08-23 12:06:58.951666	\N	replit	f	\N
aedab82a-882c-4101-9161-aa6cda6202f7	gm-test-rJ3ig8@test.com	Test	GM	\N	2025-11-16 15:00:31.523389	2025-11-16 15:00:31.523389	$2b$12$W.V0taHHKNT6upbg3HNJyug1b1z0iAfjNO3hyG90IBI2AgiaWZkCe	local	t	\N
ac72e340-9120-4fb0-a180-736771be78b4	gm_GWdyTF@example.com	GM	User	\N	2025-11-16 15:15:15.381064	2025-11-16 15:15:15.381064	$2b$12$urncw4E3xeRQjAHGDWKwG.Zf742W8FqA.x4O9hmply0VnBaxgSEgK	local	t	\N
ojlU1_	gm_ANTtRo@example.com	GM	User		2025-11-16 15:22:04.046256	2025-11-16 15:22:04.046256	\N	replit	f	\N
gm-test-user-unique	gmtest-unique@example.com	Test	GM		2025-11-16 16:08:51.705315	2025-11-16 16:08:51.705315	\N	replit	f	\N
UJndQH	UJndQH@example.com	John	Doe		2025-09-20 08:10:41.772822	2025-09-20 08:10:41.772822	\N	replit	f	\N
gm-test	gm@test.com	Game	Master		2025-09-20 10:18:25.131696	2025-09-20 10:18:25.131696	\N	replit	f	\N
gm-test-2	gm2@test.com	Game	Master		2025-09-20 10:34:47.324296	2025-09-20 10:34:47.324296	\N	replit	f	\N
gm-final-test	gm-final-test@example.com	Test	GM		2025-11-16 16:14:23.660742	2025-11-16 16:14:23.660742	\N	replit	f	\N
gm_magic_test	gm@magic.test	Magic	GM		2025-09-23 11:56:24.871098	2025-09-23 11:56:24.871098	\N	replit	f	\N
ba02a818-a42d-4e8e-ad02-eb914a097ad0	gm.magic2.test@example.com	Magic	GM	\N	2025-09-23 12:20:46.578119	2025-09-23 12:20:46.578119	$2b$12$MFm4vqXzYil7UeurAMm5uuYoKQ.RrmIUKMjAcj2ZzwgjieRRuCqFa	local	t	\N
N1W0xb	N1W0xb@example.com	John	Doe		2025-09-23 13:25:36.236977	2025-09-23 13:25:36.236977	\N	replit	f	\N
gm_f7vcUg	gm@example.com	Game	Master		2025-10-19 10:09:08.816933	2025-10-19 10:09:08.816933	\N	replit	f	\N
player_U05Z6o	player@example.com	Test	Player		2025-10-19 10:13:26.032559	2025-10-19 10:13:26.032559	\N	replit	f	\N
ws_gm_a2WRGy	gmZLwq@example.com	WS	GM		2025-10-19 10:20:42.206505	2025-10-19 10:20:42.206505	\N	replit	f	\N
ws_player_Qna330	playeruzIK@example.com	WS	Player		2025-10-19 10:24:21.761099	2025-10-19 10:24:21.761099	\N	replit	f	\N
ws_gm2_${nanoid(6)}	gm2${nanoid(4)}@example.com	WS	GM2		2025-10-19 10:33:07.790066	2025-10-19 10:33:07.790066	\N	replit	f	\N
ws_player2_0eb9s-	player2VJyE@example.com	WS	Player2		2025-10-19 10:34:49.949809	2025-10-19 10:34:49.949809	\N	replit	f	\N
effect_gm_sVVvXC	effectgme9V-@example.com	Effect	GM		2025-10-19 11:25:14.946986	2025-10-19 11:25:14.946986	\N	replit	f	\N
effect_player_tfc8yJ	effectplayeribRy@example.com	Effect	Player		2025-10-19 11:28:19.674132	2025-10-19 11:28:19.674132	\N	replit	f	\N
gm-working-test	gm-working@example.com	Working	Test		2025-11-16 16:20:56.156212	2025-11-16 16:20:56.156212	\N	replit	f	\N
gm_test_002	gmtest@example.com	Test	GM		2025-10-19 12:10:34.809104	2025-10-19 12:10:34.809104	\N	replit	f	\N
test-gm-123	testgm@example.com	Test	GM		2025-10-19 13:03:47.151864	2025-10-19 13:03:47.151864	\N	replit	f	\N
test-gm-456	testgm2@example.com	Test	GM 2		2025-10-19 13:10:48.036944	2025-10-19 13:10:48.036944	\N	replit	f	\N
test-gm-789	testgm3@example.com	Test GM 3			2025-10-19 13:15:48.449049	2025-10-19 13:15:48.449049	\N	replit	f	\N
test-gm-ws	testgmws@example.com	Test	GM WS		2025-10-19 13:24:33.861166	2025-10-19 13:24:33.861166	\N	replit	f	\N
gm-effect-test-26YSHP	gm-effects@test.com	Effect	Tester		2025-10-19 14:53:23.258666	2025-10-19 14:53:23.258666	\N	replit	f	\N
gm-realtime-test	gm-realtime@example.com	Realtime	Test		2025-11-16 17:06:26.439813	2025-11-16 17:06:26.439813	\N	replit	f	\N
test-gm-quick-entry	gm-test@example.com	Test	GM		2025-10-19 15:55:13.188202	2025-10-19 15:55:13.188202	\N	replit	f	\N
test-gm-quick-entry-v2	gm-test-v2@example.com	Test	GM		2025-10-19 16:05:35.660373	2025-10-19 16:05:35.660373	\N	replit	f	\N
test-gm-final	gm-final@example.com	Test	GM		2025-10-19 16:20:17.82457	2025-10-19 16:20:17.82457	\N	replit	f	\N
test-gm-import-001	gm-import-test@example.com	GM	Test		2025-10-19 16:46:37.391481	2025-10-19 16:46:37.391481	\N	replit	f	\N
test-gm-import-002	gm-import-test2@example.com	GM	Test2		2025-10-19 16:58:41.196099	2025-10-19 16:58:41.196099	\N	replit	f	\N
test-gm-import-003	gm-import-test3@example.com	GM	Test3		2025-10-19 17:05:06.636197	2025-10-19 17:05:06.636197	\N	replit	f	\N
test-gm-effects-001	gm-effects-test@example.com	GM	Effects		2025-10-19 17:19:10.793229	2025-10-19 17:19:10.793229	\N	replit	f	\N
42b130c5-988d-458e-85c2-369076329350	gm_CJfePi@test.com	Test	GM	\N	2025-10-19 18:03:24.385168	2025-10-19 18:03:24.385168	$2b$12$6lYhDiYGRniCPX38eQqKLuzpE3449.kvPMG1bFFRSJQS03GfzqdTS	local	t	\N
HR-1MC9tx2	gmXcMsLW@test.com	Test	GM		2025-10-19 18:12:42.46968	2025-10-19 18:21:08.724	\N	replit	t	\N
pKJgBt40xL	gm_test_Oh7Pfj@test.com	TestGM	User		2025-10-19 18:27:34.310617	2025-10-19 18:27:34.310617	\N	replit	f	\N
gm_3FaJqCVc88	gmtest2gtCSH@test.com	TestGM	User		2025-10-19 18:35:43.350484	2025-10-19 18:35:43.350484	\N	replit	f	\N
gm_xuzdjFbLef	gmtestm121sX@test.com	TestGM	User		2025-10-19 18:52:53.421705	2025-10-19 18:52:53.421705	\N	replit	f	\N
test-gm-import	gm-import@test.com	Test	GM		2025-11-16 12:52:39.730307	2025-11-16 12:52:39.730307	\N	replit	f	\N
test-gm-import-state	gm-import-state@test.com	Test	GM		2025-11-16 13:03:35.15252	2025-11-16 13:03:35.15252	\N	replit	f	\N
gm-test-import-options	test-gm@example.com	Test	GM		2025-11-16 13:08:19.921319	2025-11-16 13:08:19.921319	\N	replit	f	\N
gm-projection-test	projection@test.com	Test	GM		2025-11-16 13:24:31.204426	2025-11-16 13:24:31.204426	\N	replit	f	\N
gm-projection-test-v2	projection2@test.com	Test	GM		2025-11-16 13:29:01.153289	2025-11-16 13:29:01.153289	\N	replit	f	\N
5743af79-8ef2-4824-b778-c09297db8a6e	testgmkueyhM@example.com	Test	GM	\N	2025-11-16 14:11:18.338511	2025-11-16 14:11:18.338511	$2b$12$qonN7MMnLBFN9/e7HpboK.tq7M1LiPC99xIK0YzPHA4V.IABhvt3e	local	t	\N
bf65c8c5-7953-4791-b40a-3fd02436b7a6	testgmek4PTY@example.com	Test	GM	\N	2025-11-16 14:13:43.676908	2025-11-16 14:13:43.676908	$2b$12$/CJ0JbuYRilYNXKuSbzS2eh708NFT3.0aQdX20NeSWP2GBrBiSaDK	local	t	\N
9307db28-1d73-43fc-b0ea-3a197f6a4e9a	testgmHU8VU1@example.com	Test	GM	\N	2025-11-16 14:20:36.95106	2025-11-16 14:20:36.95106	$2b$12$b9GQp69MWYRcpp10BmX/FO.E1.OY4s17Q5WS4ugZb8/YQdqacLXC2	local	t	\N
ca56cbe9-9f3d-43a1-9019-84ac90af9947	testgmHaUiip@example.com	Test	GM	\N	2025-11-16 14:24:26.295846	2025-11-16 14:24:26.295846	$2b$12$6t7QX0ufTJ9PZniFHYo.tuCKb8IiKtz2GSa6kueX5cSSooTRgMmIG	local	t	\N
94668f41-2a2b-45cb-9521-e82190897f5b	testgm6N4d2M@example.com	Test	GM	\N	2025-11-16 14:30:29.818018	2025-11-16 14:30:29.818018	$2b$12$Tl5lCX7kmtgapU1CYT2byOjQynujyeOdYvyRtkOO28uqYK.d1pPYy	local	t	\N
9bb7d0a3-0ebf-4f9d-9186-14adc0f0f2f7	gm6NqBntzI@test.local	TestGM	Account	\N	2025-11-16 14:37:02.89894	2025-11-16 14:37:02.89894	$2b$12$XKQyLrxiyklaz7s2HSriP.M7GBnf86ACv4ftkl0huVs/1magsSi9S	local	t	\N
53a504f9-7832-439b-a886-e84e0176fb7e	thibault@youcom.io	Thibault	Fritsch	\N	2025-11-19 16:42:33.87033	2025-12-31 10:29:04.781188	$2b$12$vQcPQaK9PLHlTb.M5BP6uexrYK2TzK7BoufVW0Cpt2hX9yiSfMaPe	local	t	\N
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: template; Owner: roleplug
--

COPY template.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: template; Owner: roleplug
--

COPY template.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: template; Owner: roleplug
--

COPY template.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add LDAP Provider	1	add_ldapprovider
2	Can change LDAP Provider	1	change_ldapprovider
3	Can delete LDAP Provider	1	delete_ldapprovider
4	Can view LDAP Provider	1	view_ldapprovider
5	Search full LDAP directory	1	search_full_directory
6	Can add Tenant	2	add_tenant
7	Can change Tenant	2	change_tenant
8	Can delete Tenant	2	delete_tenant
9	Can view Tenant	2	view_tenant
10	Can add Domain	3	add_domain
11	Can change Domain	3	change_domain
12	Can delete Domain	3	delete_domain
13	Can view Domain	3	view_domain
14	Can add pg activity	4	add_pgactivity
15	Can change pg activity	4	change_pgactivity
16	Can delete pg activity	4	delete_pgactivity
17	Can view pg activity	4	view_pgactivity
18	Can add pg lock	5	add_pglock
19	Can change pg lock	5	change_pglock
20	Can delete pg lock	5	delete_pglock
21	Can view pg lock	5	view_pglock
22	Can add blocked pg lock	6	add_blockedpglock
23	Can change blocked pg lock	6	change_blockedpglock
COPY public.game_sessions (id, name, gm_id, is_active, created_at, updated_at, code, status) FROM stdin;
84128d4d-6b88-4571-a39f-573748fdc82d	Les Mystères d'Arkham	UJndQH	t	2025-09-20 08:11:18.29667	2025-09-20 08:11:18.29667	XFNTVT	active
4f337e8f-92db-4297-a7bb-3cfc291cf1ae	Session par défaut	gm-test	t	2025-09-20 10:19:28.921654	2025-09-20 10:19:28.921654	\N	preparation
c2c1b970-676c-4435-ab4c-d1963ae8faec	Combat Test ovfZ	gm-test	t	2025-09-20 10:20:34.153241	2025-09-20 10:20:34.153241	K5E3RW	active
20d2eed2-409b-4d84-bd68-cdd956891dd4	Auto Test oBVS	gm-test-2	t	2025-09-20 10:35:35.16939	2025-09-20 10:35:35.16939	ACNJJE	active
25304e8a-0b1d-456f-8aa1-bd0cd1452012	Test Magie Session	gm_magic_test	t	2025-09-23 11:57:14.532176	2025-09-23 11:57:14.532176	V6QL3N	active
3e12b4d7-d84e-4d67-a3b1-809382e02ae8	Test Session qbZh	N1W0xb	t	2025-09-23 13:26:20.416689	2025-09-23 13:26:20.416689	LFZMBR	active
242c5ce5-5282-43a7-9e50-9d6371cdee8a	WS_Test_Session_8pYX-t	gm_f7vcUg	t	2025-10-19 10:11:50.536539	2025-10-19 10:11:50.536539	GDMR4P	active
d4fc7526-ebd4-4364-a9ae-37ca15bbf705	WS_UI_Test_xrvWZ7	ws_gm_a2WRGy	t	2025-10-19 10:22:18.723468	2025-10-19 10:22:18.723468	PYZLZU	active
721cf1fd-6bcf-420f-ad5f-6764a9b7d640	Session par défaut	ws_player_Qna330	t	2025-10-19 10:28:32.578129	2025-10-19 10:28:32.578129	\N	preparation
e03cdab0-8d5b-4eff-8d89-ee67da376c32	WS_Fix_Test_YsWzwH	ws_gm2_${nanoid(6)}	t	2025-10-19 10:34:11.830935	2025-10-19 10:34:11.830935	XDKEA8	active
0b359925-f249-4001-8e74-6ea9ce08a5b7	Session par défaut	ws_player2_0eb9s-	t	2025-10-19 10:36:33.269873	2025-10-19 10:36:33.269873	\N	preparation
a79a90df-045e-4074-ad72-623f2ea03845	Effect_Test_GQ-g4G	effect_gm_sVVvXC	t	2025-10-19 11:27:30.492218	2025-10-19 11:27:30.492218	NJ64GS	active
6ee9fe06-a55c-432e-adfd-16abda5e0d9d	Session par défaut	effect_player_tfc8yJ	t	2025-10-19 11:30:55.016116	2025-10-19 11:30:55.016116	\N	preparation
970ec02d-de0f-4b35-8efc-aded35c06354	Test Session rXQ2	test-gm-123	t	2025-10-19 13:05:53.164998	2025-10-19 13:05:53.164998	FDFMFL	active
f54cf659-7257-4c37-ae48-d67e0dcc8550	QR Test Session UKB8	test-gm-456	t	2025-10-19 13:11:42.772031	2025-10-19 13:11:42.772031	CKJNLV	active
12ad017c-6836-4c7c-b9b7-16a2a6f9cb4b	QR Test RoP_	test-gm-789	t	2025-10-19 13:17:56.858752	2025-10-19 13:17:56.858752	Y8SE9K	active
106171ee-4736-464a-a363-b7ffb2b432ce	WebSocket Test vH2	test-gm-ws	t	2025-10-19 13:26:50.922272	2025-10-19 13:26:50.922272	X4ELS6	active
a68dd59d-03ad-4d08-a442-45b5edffc045	Test Session 6Nqoc3	gm-effect-test-26YSHP	t	2025-10-19 14:54:27.67491	2025-10-19 14:54:27.67491	YJTJR6	active
fbc6b321-a126-4007-9fb9-0046ae7ba7d3	Test Session 7zQpUT	gm-effect-test-26YSHP	t	2025-10-19 14:55:02.542786	2025-10-19 14:55:02.542786	6DRDY5	active
27208065-d781-42ea-9712-6f0f279e9b29	Chapitre 1 : Le Cercle des Curieux	test-gm-quick-entry-v2	t	2025-10-19 16:08:17.625779	2025-10-19 16:08:17.625779	PSTCM3	active
d20af03d-8a8f-4f65-8c62-0d4891321fd3	Session A - Test Import	test-gm-import-001	t	2025-10-19 16:48:36.955875	2025-10-19 16:48:36.955875	282XP5	active
0e0068fa-3b39-4ba5-98ca-3aa44a0d986c	Session B - With Import	test-gm-import-001	t	2025-10-19 16:54:12.1329	2025-10-19 16:54:12.1329	CQE3F4	active
92df6e2c-92b5-4a59-963a-9e5f7fc7224d	Session A - Test Import	test-gm-import-002	t	2025-10-19 16:59:50.722327	2025-10-19 16:59:50.722327	2U79ED	active
25dc7dbc-b7a3-4dad-b659-82d1018bfde1	Session B - With Import	test-gm-import-002	t	2025-10-19 17:02:38.716352	2025-10-19 17:02:38.716352	G2UWEN	active
a3418fe9-6147-40b0-8666-1b1ee45b655b	Session Alpha	test-gm-import-003	t	2025-10-19 17:06:14.216605	2025-10-19 17:06:14.216605	5HE2Z3	active
5f531189-c25a-4186-86a3-37d7b914c81c	Session Beta - Imported	test-gm-import-003	t	2025-10-19 17:09:17.012575	2025-10-19 17:09:17.012575	RYQ5PR	active
f140e558-6577-4ad1-a428-9249c92ab250	Test Effects History	test-gm-effects-001	t	2025-10-19 17:20:45.805102	2025-10-19 17:20:45.805102	BCEBM4	active
fb15bb5a-8dba-44bb-b638-a1893674fdef	Vote Test iaxFER	HR-1MC9tx2	t	2025-10-19 18:13:56.747693	2025-10-19 18:13:56.747693	K4GNFD	active
d2fd5afa-84d8-4e30-8d68-7ddd79b4e436	Vote Test Session pljK3J	pKJgBt40xL	t	2025-10-19 18:28:57.280413	2025-10-19 18:28:57.280413	2NA3N3	active
170007ce-c56a-459b-b173-761894936ffe	Poll Test HUw3S2	gm_3FaJqCVc88	t	2025-10-19 18:36:55.684157	2025-10-19 18:36:55.684157	74D8P7	active
aa93de9b-133e-489b-bb56-cca1c96dbb0c	Skill Drop Test 2JYS-3	gm_xuzdjFbLef	t	2025-10-19 18:53:47.060033	2025-10-19 18:53:47.060033	GWYU5K	active
0a220266-50f0-48e8-bd67-e2886259dcca	Session Source	test-gm-import	t	2025-11-16 12:53:49.126515	2025-11-16 12:53:49.126515	NTK9EZ	active
5c42e181-1323-422b-8699-2c898215c322	Session Target	test-gm-import	t	2025-11-16 12:56:21.022418	2025-11-16 12:56:21.022418	Z955HL	active
93ca69f8-cce9-4458-b9b8-c93e11bb63d8	Session Source 2	test-gm-import-state	t	2025-11-16 13:05:00.155344	2025-11-16 13:05:00.155344	QCZU9N	active
0c570fc6-4213-4c7f-8fd9-5ffab0c5b4d4	Session Source Test	gm-test-import-options	t	2025-11-16 13:08:45.12541	2025-11-16 13:08:45.12541	KATNPL	active
73d9c224-d6e8-4467-9566-0afe00f95f62	Session Source Test	gm-test-import-options	t	2025-11-16 13:10:04.326595	2025-11-16 13:10:04.326595	CSATUU	active
3ab138ef-fda1-4bd4-89d4-d7cc775e10e8	Session Target Test	gm-test-import-options	t	2025-11-16 13:12:27.504192	2025-11-16 13:12:27.504192	86TJFE	active
81dfde87-e5ac-49f5-888e-10753b59439f	Session Target Keep	gm-test-import-options	t	2025-11-16 13:14:30.976212	2025-11-16 13:14:30.976212	RDYN8B	active
1d35f189-4fa6-457f-8578-4594cb86aa13	Test Projection Session	gm-projection-test	t	2025-11-16 13:25:01.643462	2025-11-16 13:25:01.643462	V5P4S7	active
cc663dee-8fbe-45e2-895e-381e2bd38cd9	Test Projection Session	gm-projection-test	t	2025-11-16 13:25:15.559771	2025-11-16 13:25:15.559771	BCPMWR	active
2d2d3c5e-d3e6-485e-81b2-020493e2a22c	Test Projection Session V2	gm-projection-test-v2	t	2025-11-16 13:29:22.55082	2025-11-16 13:29:22.55082	C9PK6Y	active
5f30af42-559d-4f40-82f3-4d8a494f8bf2	Session Test Narrative	ca56cbe9-9f3d-43a1-9019-84ac90af9947	t	2025-11-16 14:25:24.797103	2025-11-16 14:25:24.797103	9D8YZX	active
3cbd44fd-44f0-4a9c-bf6b-5b690f9b0be1	Session Test Narrative	94668f41-2a2b-45cb-9521-e82190897f5b	t	2025-11-16 14:31:50.333931	2025-11-16 14:31:50.333931	SF4DPH	active
fc305fe3-1618-49de-b645-b14f9510370d	Test Session 7jTg	9bb7d0a3-0ebf-4f9d-9186-14adc0f0f2f7	t	2025-11-16 14:38:20.357173	2025-11-16 14:38:20.357173	5ZN5BJ	active
f3033402-2de8-4807-9114-c892ede508fb	Test Session tepV	aedab82a-882c-4101-9161-aa6cda6202f7	t	2025-11-16 15:01:24.585962	2025-11-16 15:01:24.585962	T7AEVZ	active
4d60bca1-eb0d-4378-a4c4-308dba789302	Session Test QR vPzs	ac72e340-9120-4fb0-a180-736771be78b4	t	2025-11-16 15:16:59.984441	2025-11-16 15:16:59.984441	KDV5DP	active
15a60aea-61ab-474b-b4c1-063345d7659c	Session Test QR bw2c	ojlU1_	t	2025-11-16 15:22:30.913335	2025-11-16 15:22:30.913335	TF74W6	active
3623f48a-9fab-4ebb-bfff-eafe5d833d29	Test Projection ygfwtc	gm-test-user-unique	t	2025-11-16 16:10:05.099037	2025-11-16 16:10:05.099037	QZ4VHA	active
3cab697b-ad9f-4ae1-b9bd-fe50cb631e04	Projection Final Test FOgXMj	gm-final-test	t	2025-11-16 16:15:36.034997	2025-11-16 16:15:36.034997	MWPZW7	active
ca98f715-f623-4242-bf63-de863d659320	Working Projection DFmMrN	gm-working-test	t	2025-11-16 16:22:33.447021	2025-11-16 16:22:33.447021	H2WMKJ	active
36acbdd5-05db-46c0-9fdf-941efa142d42	Realtime Test LZQ6iS	gm-realtime-test	t	2025-11-16 17:08:04.859134	2025-11-16 17:08:04.859134	JBXMVX	active
6924315e-6810-41a6-ae3c-32845506c0c7	Chapitre II	53a504f9-7832-439b-a886-e84e0176fb7e	t	2025-11-16 15:37:36.709482	2025-11-16 15:37:36.709482	XYX89Z	active
4ecf830f-3c1b-4b47-a5e8-1a1ab97cd75e	Nouvelle Aventure - Les Ombres de Paris	gm-test	t	2025-12-31 09:48:27.985076	2025-12-31 09:48:27.985076	PARIS1	active
e49872b4-ff93-4cff-8576-c518de829a27	Chapitre 1 : Le Cercle des Curieux	53a504f9-7832-439b-a886-e84e0176fb7e	t	2025-08-24 12:57:06.768882	2025-12-31 09:53:56.955636	ARCANE	active
\.


--
-- Data for Name: guardian_groupobjectpermission; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.guardian_groupobjectpermission (id, object_pk, content_type_id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: guardian_userobjectpermission; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.guardian_userobjectpermission (id, object_pk, content_type_id, permission_id, user_id) FROM stdin;
22	2e7159ef-b92f-4163-8f26-e17560b3e559	17	69	2
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.inventory (id, character_id, name, description, category, quantity, weight, is_equipped, damage, armor, properties, created_at, updated_at) FROM stdin;
19644d4a-5647-427e-a2e4-4789c4fb3dec	75f7c917-244f-4d1d-9022-0151f9133366	Matraque de police	Gourdin en bois dur utilisé par les forces de l'ordre	weapon	1	1	f	1d6	\N	{}	2025-08-24 16:55:14.175789	2025-08-24 16:55:14.175789
05bbbaf6-3563-4643-a0c4-9882c9649595	dd5f4fdd-1880-48a8-a3f8-d883056c93d7	Revolver .38	Arme de poing standard, fiable et précise	weapon	1	1	f	1d10	\N	{}	2025-08-24 16:55:42.31654	2025-08-24 16:55:42.31654
ddcd78cf-e8e3-477f-bb10-481b833fc37f	3b1da7a0-1ea2-4dfd-96f0-4fdee5818169	Couteau de poche	Petit couteau pliant utilitaire	weapon	1	0	f	1d3	\N	{}	2025-08-24 18:25:58.659775	2025-08-24 18:25:58.659775
60c10ed3-4a17-49f6-957c-29d6cf3f1dbf	dd5f4fdd-1880-48a8-a3f8-d883056c93d7	Couteau de poche	Petit couteau pliant utilitaire	weapon	1	0	f	1d3	\N	{}	2025-08-24 18:26:21.229153	2025-08-24 18:26:21.229153
f8ac7351-0e83-4b9f-8fed-5250242d5bb9	ede2f8cf-f8dd-4e05-99a5-5966c277cdd2	Couteau de poche	Petit couteau pliant utilitaire	weapon	1	0	f	1d3	\N	{}	2025-08-24 18:27:53.247344	2025-08-24 18:27:53.247344
\.


--
-- Data for Name: narrative_entries; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.narrative_entries (id, session_id, gm_id, content, entry_type, is_ai_generated, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roll_history; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.roll_history (id, user_id, character_id, session_id, roll_type, skill_name, skill_value, dice_formula, result, outcome, is_gm_roll, created_at) FROM stdin;
4b1f5a6c-7c50-47a2-8d8b-f8971fa74818	gm_magic_test	05e4cbc7-7c7c-4024-ba4a-7214556700d1	25304e8a-0b1d-456f-8aa1-bd0cd1452012	skill	Occultisme	51	1d100	31	success	f	2025-09-23 12:07:48.92443
\.


--
-- Data for Name: sanity_conditions; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.sanity_conditions (id, character_id, type, name, description, is_active, duration, created_at) FROM stdin;
0345c86a-e56d-442d-95bc-8ae0d3e19b52	3b1da7a0-1ea2-4dfd-96f0-4fdee5818169	phobia	Ophiophobie	Développé suite à une perte de sanité mentale importante	t	\N	2025-08-24 18:38:04.065023
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.sessions (sid, sess, expire) FROM stdin;
D0TR7uMfRIJ6bcNLnZlgC9_7xYF8QXpp	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "domain": ".robinswood.io", "secure": false, "expires": "2026-01-07T10:55:35.287Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}}	2026-01-07 10:55:36
ktGuOTMGrJpNPQDFAhmUehs7z1OF21X9	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "secure": true, "expires": "2026-01-07T10:23:18.918Z", "httpOnly": true, "originalMaxAge": 604800000}}	2026-01-07 10:23:19
_5GUgjq9ObJQ79R1rTHOOLLv4qmkp1Fb	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "secure": true, "expires": "2026-01-07T10:29:29.178Z", "httpOnly": true, "originalMaxAge": 604800000}}	2026-01-07 10:29:30
zPNPmF5Z1LYwD6WaRnKPtt3v5IHaoELA	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "secure": true, "expires": "2026-01-07T10:30:25.565Z", "httpOnly": true, "originalMaxAge": 604800000}}	2026-01-07 10:30:26
hBDggeN-5mwRb7l-5mxeCIniDClJ2_Q1	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "secure": true, "expires": "2026-01-07T10:32:16.983Z", "httpOnly": true, "originalMaxAge": 604800000}}	2026-01-07 10:32:17
cHgn4ZG7EVxKE8IZM7ZEEnd3E-2PzMRl	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "secure": true, "expires": "2026-01-07T10:37:31.211Z", "httpOnly": true, "originalMaxAge": 604800000}}	2026-01-07 10:37:32
V3E0A4sWHAxHJ0JSnxAT2Ta7ObRleUH0	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "secure": true, "expires": "2026-01-07T10:42:05.242Z", "httpOnly": true, "originalMaxAge": 604800000}}	2026-01-07 10:42:06
nCiVzqIpj8A2gDLSTkjV8sxTPzeZTHnp	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "secure": true, "expires": "2026-01-07T10:42:54.827Z", "httpOnly": true, "originalMaxAge": 604800000}}	2026-01-07 10:42:55
4vT9RGnKPKeefQW8t03K-QsmlhtU_V1t	{"user": {"id": "53a504f9-7832-439b-a886-e84e0176fb7e", "email": "thibault@youcom.io", "authType": "local"}, "cookie": {"path": "/", "domain": ".robinswood.io", "secure": false, "expires": "2026-01-07T10:54:45.857Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}}	2026-01-07 10:54:47
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.characters (id, user_id, session_id, name, occupation, age, birthplace, residence, gender, strength, constitution, size, dexterity, appearance, intelligence, power, education, luck, hit_points, max_hit_points, sanity, max_sanity, magic_points, max_magic_points, avatar_url, avatar_prompt, skills, is_active, created_at, updated_at, skills_locked, notes, money, available_skill_points, height, build, hair_color, eye_color) FROM stdin;
2d4988c5-cbb0-4c5d-836c-44e1b2f91f18	gm-test-2	20d2eed2-409b-4d84-bd68-cdd956891dd4	Marcus Whitmore	Antiquaire	25				50	65	50	40	45	55	70	75	70	11	11	70	99	14	14	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 37, "climb": 40, "dodge": 20, "pilot": 1, "throw": 25, "track": 10, "listen": 39, "occult": 5, "history": 70, "stealth": 20, "appraise": 55, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 40, "survival": 10, "art_craft": 50, "fast_talk": 27, "first_aid": 30, "locksmith": 1, "accounting": 30, "drive_auto": 20, "intimidate": 15, "psychology": 29, "archaeology": 23, "electronics": 1, "library_use": 75, "spot_hidden": 64, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 26, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-20 10:41:45.127048	2025-09-20 10:41:45.127048	t	\N	50.00	0	\N	\N	\N	\N
f0dd8c3e-f1cd-439a-8090-3415f3856f01	gm-test-2	20d2eed2-409b-4d84-bd68-cdd956891dd4	Marcus Whitmore	Antiquaire	25				50	80	75	30	45	80	60	75	75	15	15	60	99	12	12	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 47, "climb": 40, "dodge": 15, "pilot": 1, "throw": 25, "track": 10, "listen": 46, "occult": 5, "history": 70, "stealth": 20, "appraise": 55, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 40, "survival": 10, "art_craft": 50, "fast_talk": 37, "first_aid": 30, "locksmith": 1, "accounting": 30, "drive_auto": 20, "intimidate": 15, "psychology": 36, "archaeology": 33, "electronics": 1, "library_use": 75, "spot_hidden": 71, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 26, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-20 10:47:10.354017	2025-09-20 10:47:10.354017	t	\N	50.00	0	\N	\N	\N	\N
6c91cde1-da51-442e-807c-32d419dbd2be	ws_player2_0eb9s-	0b359925-f249-4001-8e74-6ea9ce08a5b7	WS_Fix_Char_wCDS8a	Détective Privé	25				60	75	70	60	65	70	45	60	30	14	14	45	99	9	9	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 30, "pilot": 1, "throw": 25, "track": 10, "listen": 71, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 29, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 33, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 43, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 60, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 48, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 10:36:33.518097	2025-10-19 10:36:33.518097	t	\N	50.00	0	\N	\N	\N	\N
bed5f85d-c7a0-479c-b91b-a1b5f95b589e	effect_player_tfc8yJ	6ee9fe06-a55c-432e-adfd-16abda5e0d9d	Effect_Char_R_qNEx	Détective Privé	25				55	75	80	60	35	60	65	55	55	15	15	65	99	13	13	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 30, "pilot": 1, "throw": 25, "track": 10, "listen": 65, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 25, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 31, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 41, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 55, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 44, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 11:30:55.276226	2025-10-19 11:30:55.276226	t	\N	50.00	0	\N	\N	\N	\N
2ad5387c-fa98-4f88-afca-9713258c497d	gm-test-2	20d2eed2-409b-4d84-bd68-cdd956891dd4	Marcus Whitmore	Antiquaire	25				55	85	90	60	75	80	50	65	25	17	17	50	99	10	10	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 47, "climb": 40, "dodge": 30, "pilot": 1, "throw": 25, "track": 10, "listen": 46, "occult": 5, "history": 63, "stealth": 20, "appraise": 48, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 36, "survival": 10, "art_craft": 43, "fast_talk": 37, "first_aid": 30, "locksmith": 1, "accounting": 26, "drive_auto": 20, "intimidate": 15, "psychology": 36, "archaeology": 33, "electronics": 1, "library_use": 68, "spot_hidden": 67, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 65, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 22, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-20 10:45:02.96774	2025-09-20 10:45:02.96774	t	\N	50.00	0	\N	\N	\N	\N
54fb42d7-c967-4ed2-9ae6-fb41bdc66994	gm-test-2	20d2eed2-409b-4d84-bd68-cdd956891dd4	Marcus Whitmore	Antiquaire	25				30	70	70	65	50	85	30	65	45	14	14	30	99	6	6	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 49, "climb": 40, "dodge": 32, "pilot": 1, "throw": 25, "track": 10, "listen": 47, "occult": 5, "history": 63, "stealth": 20, "appraise": 48, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 36, "survival": 10, "art_craft": 43, "fast_talk": 39, "first_aid": 30, "locksmith": 1, "accounting": 26, "drive_auto": 20, "intimidate": 15, "psychology": 37, "archaeology": 35, "electronics": 1, "library_use": 68, "spot_hidden": 68, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 65, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 22, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-20 10:50:16.046107	2025-09-20 10:50:16.046107	t	\N	50.00	0	\N	\N	\N	\N
05e4cbc7-7c7c-4024-ba4a-7214556700d1	gm_magic_test	25304e8a-0b1d-456f-8aa1-bd0cd1452012	Investigateur Mage	Occultiste	25				80	45	55	50	60	80	75	70	50	10	10	60	99	15	11	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 39, "climb": 40, "dodge": 25, "pilot": 1, "throw": 25, "track": 10, "listen": 41, "occult": 51, "history": 66, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 38, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 54, "archaeology": 1, "electronics": 1, "library_use": 71, "spot_hidden": 65, "anthropology": 47, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 24, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 29, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 24, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-23 12:02:38.660014	2025-09-23 12:02:38.660014	t	\N	50.00	0	\N	\N	\N	\N
cc5ee621-9c48-46b2-8e7a-622970c93a3b	ws_player_Qna330	721cf1fd-6bcf-420f-ad5f-6764a9b7d640	WS_Char_QV00u4	Détective Privé	25				35	40	80	60	40	60	55	45	50	12	12	55	99	11	11	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 30, "pilot": 1, "throw": 25, "track": 10, "listen": 65, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 25, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 31, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 41, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 45, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 44, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 10:28:32.852082	2025-10-19 10:28:32.852082	t	\N	50.00	0	\N	\N	\N	\N
b18b249c-4e34-4483-9e55-8ed6bafa0002	gm-test-2	20d2eed2-409b-4d84-bd68-cdd956891dd4	Marcus Whitmore	Antiquaire	25				70	60	80	50	60	80	40	55	55	14	14	40	99	8	8	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 47, "climb": 40, "dodge": 25, "pilot": 1, "throw": 25, "track": 10, "listen": 46, "occult": 5, "history": 56, "stealth": 20, "appraise": 41, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 33, "survival": 10, "art_craft": 36, "fast_talk": 37, "first_aid": 30, "locksmith": 1, "accounting": 23, "drive_auto": 20, "intimidate": 15, "psychology": 36, "archaeology": 33, "electronics": 1, "library_use": 61, "spot_hidden": 64, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 55, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 19, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-20 10:37:47.698678	2025-09-20 10:37:47.698678	t	\N	50.00	0	\N	\N	\N	\N
82d3d622-6a2d-4696-bd47-008656f69b10	gm-test-2	20d2eed2-409b-4d84-bd68-cdd956891dd4	Marcus Whitmore	Antiquaire	25				45	30	60	65	30	90	50	75	65	9	9	50	99	10	10	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 51, "climb": 40, "dodge": 32, "pilot": 1, "throw": 25, "track": 10, "listen": 49, "occult": 5, "history": 70, "stealth": 20, "appraise": 55, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 40, "survival": 10, "art_craft": 50, "fast_talk": 41, "first_aid": 30, "locksmith": 1, "accounting": 30, "drive_auto": 20, "intimidate": 15, "psychology": 39, "archaeology": 37, "electronics": 1, "library_use": 75, "spot_hidden": 74, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 26, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-20 10:39:54.817999	2025-09-20 10:39:54.817999	t	\N	50.00	0	\N	\N	\N	\N
03ce4c23-6040-47fb-9c6b-7a942c8b1ccd	gm-test	4f337e8f-92db-4297-a7bb-3cfc291cf1ae	YwW_5R	Antiquaire	25				75	50	75	45	40	65	70	70	55	12	12	70	99	14	14	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 41, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 42, "occult": 5, "history": 66, "stealth": 20, "appraise": 51, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 38, "survival": 10, "art_craft": 46, "fast_talk": 31, "first_aid": 30, "locksmith": 1, "accounting": 28, "drive_auto": 20, "intimidate": 15, "psychology": 32, "archaeology": 27, "electronics": 1, "library_use": 71, "spot_hidden": 65, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 24, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-09-20 10:19:29.039358	2025-09-20 10:19:29.039358	t	\N	50.00	0	\N	\N	\N	\N
dd5f4fdd-1880-48a8-a3f8-d883056c93d7	\N	e49872b4-ff93-4cff-8576-c518de829a27	Maurice Lefèvre 	Inspecteur de Police	48	Dunkerque	Le Touquet 		80	75	60	45	40	70	65	60	70	13	13	63	99	13	13	\N	intelligent and sharp gaze, strong and robust build, dramatic shadows, vintage 1920s style	{"law": 53, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 63, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 49, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 58, "locksmith": 1, "accounting": 5, "drive_auto": 48, "intimidate": 39, "psychology": 53, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 63, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 60, "credit_rating": 29, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 53, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 53, "firearms_handgun": 68, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-08-24 13:54:01.941814	2025-12-31 10:22:47.645	t	\N	0.00	0	\N	\N	\N	\N
7b876aca-6fc1-4e70-b2b1-b886b6a53f0c	test-gm-ws	106171ee-4736-464a-a363-b7ffb2b432ce	Test Hero r1O	Détective Privé	25				55	45	45	50	45	65	35	80	70	9	9	35	99	7	7	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 25, "pilot": 1, "throw": 25, "track": 10, "listen": 68, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 27, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 32, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 42, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 80, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 46, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 13:28:17.403835	2025-10-19 13:28:17.403835	t	\N	50.00	0	\N	\N	\N	\N
d5a47d58-d2e2-45b6-ae70-35db6b713728	\N	e49872b4-ff93-4cff-8576-c518de829a27	Dr. Nia Vanseirk 	Médecin	34	Bruxelles	Brest		65	35	70	30	40	75	50	80	65	10	10	50	99	10	10	\N	scholarly and intellectual demeanor, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 14, "swim": 25, "charm": 15, "climb": 40, "dodge": 15, "pilot": 1, "throw": 25, "track": 10, "listen": 40, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 63, "navigate": 10, "persuade": 45, "survival": 15, "fast_talk": 5, "first_aid": 89, "locksmith": 1, "accounting": 31, "drive_auto": 20, "intimidate": 15, "psychology": 57, "reputation": 30, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 66, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 80, "credit_rating": 30, "natural_world": 10, "cthulhu_mythos": 11, "fighting_brawl": 30, "fighting_sword": 1, "language_greek": 1, "language_latin": 21, "language_other": 1, "psychoanalysis": 1, "science_biology": 35, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 27, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 31, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-08-24 14:15:43.477407	2025-11-16 14:27:32.048	f	\N	0.00	0	\N	\N	\N	\N
15d28164-40df-4e18-bb57-5d0dc0c4cfee	\N	106171ee-4736-464a-a363-b7ffb2b432ce	Player Hero O5f	Détective Privé	25				30	30	55	75	65	75	75	60	35	8	8	75	99	15	15	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 37, "pilot": 1, "throw": 25, "track": 10, "listen": 75, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 31, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 35, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 45, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 60, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 50, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 13:30:13.42489	2025-10-19 13:30:13.42489	t	\N	50.00	0	\N	\N	\N	\N
ede2f8cf-f8dd-4e05-99a5-5966c277cdd2	\N	e49872b4-ff93-4cff-8576-c518de829a27	Armand de Khorne	Occultiste	35	Verdun (Meuse)	Strasbourg 		40	60	80	35	45	65	40	75	75	9	14	25	99	8	8	\N	mysterious investigator with a determined expression, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 35, "climb": 40, "dodge": 17, "pilot": 1, "throw": 25, "track": 10, "listen": 35, "occult": 55, "history": 70, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 11, "medicine": 5, "navigate": 10, "persuade": 40, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 11, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 40, "archaeology": 1, "electronics": 1, "library_use": 75, "spot_hidden": 35, "anthropology": 51, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 20, "cthulhu_mythos": 25, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 26, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 30, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 30, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 26, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-08-24 14:02:17.031979	2025-11-16 14:27:32.297	f	\N	0.00	0	\N	\N	\N	\N
4279032f-263b-497d-9e39-c3bbdbe17ad6	test-gm-import-002	92df6e2c-92b5-4a59-963a-9e5f7fc7224d	Sherlock Holmes	Détective Privé	25				60	40	50	45	60	55	65	65	50	9	9	65	99	13	13	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 61, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 23, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 29, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 39, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 65, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 42, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 17:01:05.108047	2025-10-19 17:01:05.108047	t	\N	50.00	0	\N	\N	\N	\N
8b83107f-6346-42ef-830d-b2f68e1af790	test-gm-import-002	25dc7dbc-b7a3-4dad-b659-82d1018bfde1	Sherlock Holmes	Détective Privé	25				60	40	50	45	60	55	65	65	50	9	9	65	99	13	13	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 61, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 23, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 29, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 39, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 65, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 42, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 17:02:40.152539	2025-10-19 17:02:40.152539	t	\N	50.00	0	\N	\N	\N	\N
6a4686ec-8d63-4965-bb57-8f9210ff61fc	test-gm-quick-entry-v2	27208065-d781-42ea-9712-6f0f279e9b29	Dr. Marcus Whitmore	Médecin	25				70	65	40	55	60	65	55	55	70	10	10	55	99	11	11	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 27, "pilot": 1, "throw": 25, "track": 10, "listen": 42, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 41, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 32, "reputation": 26, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 42, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 55, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 27, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 16:10:24.325639	2025-10-19 16:16:00.048	t	\N	50.00	0	\N	\N	\N	\N
fe98e980-b07b-48ec-908c-aea05e15c2d0	gm-effect-test-26YSHP	fbc6b321-a126-4007-9fb9-0046ae7ba7d3	Test Character hiYfGP	Investigateur	\N	\N	\N	\N	12	12	12	12	10	12	11	12	10	12	12	50	65	2	2	\N	\N	{}	t	2025-10-19 14:56:00.060032	2025-10-19 14:56:00.060032	t	\N	0.00	0	\N	\N	\N	\N
2e52d4bd-34ce-4ea9-8726-d42e232c9c80	test-gm-import-003	a3418fe9-6147-40b0-8666-1b1ee45b655b	Dr. Watson	Médecin	25				40	50	70	55	35	60	45	70	50	12	12	45	99	9	9	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 27, "pilot": 1, "throw": 25, "track": 10, "listen": 41, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 39, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 31, "reputation": 24, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 41, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 25, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 17:07:32.004079	2025-10-19 17:07:32.004079	t	\N	50.00	0	\N	\N	\N	\N
83b5da3f-5c82-4561-82ba-65a50067046d	test-gm-import-001	d20af03d-8a8f-4f65-8c62-0d4891321fd3	Sherlock Holmes	Détective Privé	25				65	50	90	50	70	65	50	70	70	14	14	50	99	10	10	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 25, "pilot": 1, "throw": 25, "track": 10, "listen": 68, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 27, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 32, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 42, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 46, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 16:51:27.889211	2025-10-19 16:51:27.889211	t	\N	50.00	0	\N	\N	\N	\N
b1529baf-d88e-4e2d-9cce-c0faf16b4be7	test-gm-import-003	5f531189-c25a-4186-86a3-37d7b914c81c	Dr. Watson	Médecin	25				40	50	70	55	35	60	45	70	50	12	12	45	99	9	9	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 27, "pilot": 1, "throw": 25, "track": 10, "listen": 41, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 39, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 31, "reputation": 24, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 41, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 25, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 17:09:18.452823	2025-10-19 17:09:18.452823	t	\N	50.00	0	\N	\N	\N	\N
a3519639-1a34-4224-8fe4-ac2349233708	test-gm-import	5c42e181-1323-422b-8699-2c898215c322	John Investigator	Détective Privé	25	\N	\N	\N	65	50	75	45	45	60	60	75	70	12	12	99	99	12	12	\N	\N	{"law": 51, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 65, "occult": 5, "history": 20, "stealth": 43, "appraise": 5, "disguise": 47, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 28, "first_aid": 30, "locksmith": 25, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 54, "archaeology": 1, "electronics": 1, "library_use": 71, "spot_hidden": 64, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 44, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 51, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 12:57:51.476439	2025-11-16 12:57:51.476439	t	\N	0.00	0	\N	\N	\N	\N
54b5c34c-0899-4d0d-87d4-e4c6a6124eac	test-gm-effects-001	f140e558-6577-4ad1-a428-9249c92ab250	Test Character	Détective Privé	25				75	50	65	40	35	40	65	50	30	9	11	65	99	13	13	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 20, "pilot": 1, "throw": 25, "track": 10, "listen": 51, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 17, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 25, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 35, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 50, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 36, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 17:23:33.820757	2025-10-19 17:29:20.876	t	\N	50.00	0	\N	\N	\N	\N
54fa6913-aaf5-4eb1-bc11-cc5039cec583	HR-1MC9tx2	fb15bb5a-8dba-44bb-b638-a1893674fdef	Alice raIJfP	Private Investigator	30	New York	Boston	\N	60	55	65	70	50	75	60	65	50	12	12	60	99	12	12	\N	\N	{}	t	2025-10-19 18:14:36.062893	2025-10-19 18:14:36.062893	t	\N	0.00	0	\N	\N	\N	\N
a4493f88-39c4-4cef-a400-60ca5b5ff5ce	HR-1MC9tx2	fb15bb5a-8dba-44bb-b638-a1893674fdef	Bob WZFusU	Investigateur	28	Chicago	Chicago	\N	55	50	60	65	45	70	55	60	55	11	11	55	99	11	11	\N	\N	{}	t	2025-10-19 18:14:53.668743	2025-10-19 18:14:53.668743	t	\N	0.00	0	\N	\N	\N	\N
00c15e07-9615-4e1e-bc9c-40ab0994efcf	pKJgBt40xL	d2fd5afa-84d8-4e30-8d68-7ddd79b4e436	Alice Test	Detective	30	New York	Boston	\N	60	55	65	70	50	75	60	65	50	12	12	60	99	12	12	\N	\N	{}	t	2025-10-19 18:30:04.503193	2025-10-19 18:30:04.503193	t	\N	0.00	0	\N	\N	\N	\N
8343a13f-f9ae-485b-8058-b508aa2bf91d	pKJgBt40xL	d2fd5afa-84d8-4e30-8d68-7ddd79b4e436	Bob Test	Journalist	28	Chicago	Boston	\N	55	60	60	65	60	70	55	70	45	12	12	55	99	11	11	\N	\N	{}	t	2025-10-19 18:30:35.468519	2025-10-19 18:30:35.468519	t	\N	0.00	0	\N	\N	\N	\N
226e9826-f626-499c-87c0-3c635e48b745	gm_3FaJqCVc88	170007ce-c56a-459b-b173-761894936ffe	Alice	Detective	30	NY	Boston	\N	60	55	65	70	50	75	60	65	50	12	12	60	99	12	12	\N	\N	{}	t	2025-10-19 18:37:43.584598	2025-10-19 18:37:43.584598	t	\N	0.00	0	\N	\N	\N	\N
693ca477-c718-4cfe-98a1-d00fd9081bd8	gm_3FaJqCVc88	170007ce-c56a-459b-b173-761894936ffe	Bob	Journalist	28	Chicago	Boston	\N	55	60	60	65	60	70	55	70	45	12	12	55	99	11	11	\N	\N	{}	t	2025-10-19 18:38:14.436218	2025-10-19 18:38:14.436218	t	\N	0.00	0	\N	\N	\N	\N
c616c9f6-4f45-4909-a663-d404ac67b031	gm_xuzdjFbLef	aa93de9b-133e-489b-bb56-cca1c96dbb0c	Alice Test	Detective	30	NY	Boston	\N	60	55	65	70	50	75	60	65	50	12	12	60	99	12	12	\N	\N	{}	t	2025-10-19 18:54:37.587394	2025-10-19 18:54:37.587394	t	\N	0.00	0	\N	\N	\N	\N
e2160637-5bad-4f6e-abb8-b6aa9f4dd823	test-gm-import	0a220266-50f0-48e8-bd67-e2886259dcca	John Investigator	Détective Privé	25				65	50	75	45	45	60	60	75	70	12	12	60	99	12	12	\N	\N	{"law": 51, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 65, "occult": 5, "history": 20, "stealth": 43, "appraise": 5, "disguise": 47, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 28, "first_aid": 30, "locksmith": 25, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 54, "archaeology": 1, "electronics": 1, "library_use": 71, "spot_hidden": 64, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 44, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 51, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 12:55:23.101096	2025-11-16 12:55:23.101096	t	\N	50.00	0	\N	\N	\N	\N
5d8a88e4-7102-4eb7-aa3b-8f07c6aecbf8	gm-test-import-options	73d9c224-d6e8-4467-9566-0afe00f95f62	Test Character	Détective Privé	25				40	55	60	45	45	55	70	90	60	11	11	70	99	14	14	\N	\N	{"law": 50, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 61, "occult": 5, "history": 20, "stealth": 42, "appraise": 5, "disguise": 46, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 27, "first_aid": 30, "locksmith": 23, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 51, "archaeology": 1, "electronics": 1, "library_use": 70, "spot_hidden": 61, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 90, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 42, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 50, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 13:11:33.226486	2025-11-16 13:11:33.226486	t	\N	50.00	0	\N	\N	\N	\N
d7728bbf-7eb4-4011-a182-a0df7cecb55b	gm-test-import-options	3ab138ef-fda1-4bd4-89d4-d7cc775e10e8	Test Character	Détective Privé	25	\N	\N	\N	40	55	60	45	45	55	70	90	60	11	11	99	99	14	14	\N	\N	{"law": 50, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 61, "occult": 5, "history": 20, "stealth": 42, "appraise": 5, "disguise": 46, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 27, "first_aid": 30, "locksmith": 23, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 51, "archaeology": 1, "electronics": 1, "library_use": 70, "spot_hidden": 61, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 90, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 42, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 50, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 13:13:17.124855	2025-11-16 13:13:17.124855	t	\N	0.00	0	\N	\N	\N	\N
17a77851-e8b3-42a2-8771-9e038377a2fc	gm-test-import-options	81dfde87-e5ac-49f5-888e-10753b59439f	Test Character	Détective Privé	25	\N	\N	\N	40	55	60	45	45	55	70	90	60	11	11	70	99	14	14	\N	\N	{"law": 50, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 61, "occult": 5, "history": 20, "stealth": 42, "appraise": 5, "disguise": 46, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 27, "first_aid": 30, "locksmith": 23, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 51, "archaeology": 1, "electronics": 1, "library_use": 70, "spot_hidden": 61, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 90, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 42, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 50, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 13:15:35.470434	2025-11-16 13:15:35.470434	t	\N	50.00	0	\N	\N	\N	\N
e13f63dc-fa26-45a5-b613-d7583fc9cc74	\N	e49872b4-ff93-4cff-8576-c518de829a27	Helena Snatch	Antiquaire	36	Lorient	Paris	Femme	30	30	55	65	40	65	45	80	75	5	8	45	99	9	9	\N	Femme, scholarly and intellectual demeanor, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 41, "climb": 40, "dodge": 32, "pilot": 1, "throw": 25, "track": 10, "listen": 38, "occult": 5, "history": 73, "stealth": 20, "appraise": 58, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 41, "survival": 10, "art_craft": 53, "fast_talk": 31, "first_aid": 30, "locksmith": 1, "accounting": 31, "drive_auto": 20, "intimidate": 15, "psychology": 28, "archaeology": 27, "electronics": 1, "library_use": 78, "spot_hidden": 64, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 80, "credit_rating": 28, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 27, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-10-19 13:38:05.263595	2025-11-16 14:27:31.802	f	\N	50.00	0	\N	\N	\N	\N
2ea17bf5-5a37-4084-bcde-d0c81dd51a69	ojlU1_	15a60aea-61ab-474b-b4c1-063345d7659c	Détective pRPw	Détective Privé	35	\N	\N	\N	65	70	60	75	50	80	65	85	60	13	13	65	65	13	13	\N	\N	{}	t	2025-11-16 15:23:00.651694	2025-11-16 15:23:00.651694	t	\N	0.00	0	\N	\N	\N	\N
8bd725bd-36b6-4153-9410-65610770d5ac	\N	6924315e-6810-41a6-ae3c-32845506c0c7	Armand de Khorne	Occultiste	35	Verdun (Meuse)	Strasbourg 	\N	40	60	80	35	45	65	40	75	75	8	14	88	99	8	8	\N	mysterious investigator with a determined expression, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 35, "climb": 40, "dodge": 17, "pilot": 1, "throw": 25, "track": 10, "listen": 35, "occult": 55, "history": 70, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 11, "medicine": 5, "navigate": 10, "persuade": 40, "survival": 10, "fast_talk": 5, "first_aid": 30, "locksmith": 11, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 40, "archaeology": 1, "electronics": 1, "library_use": 75, "spot_hidden": 35, "anthropology": 51, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 20, "cthulhu_mythos": 25, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 26, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 30, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 30, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 26, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 15:38:06.67785	2025-11-16 17:09:55.227	f	\N	0.00	0	\N	\N	\N	\N
21739f16-89b7-44aa-be15-0d59f3da7186	\N	6924315e-6810-41a6-ae3c-32845506c0c7	Helena Snatch	Antiquaire	36	Lorient	Paris	Femme	30	30	55	65	40	65	45	80	75	8	8	93	99	9	9	\N	Femme, scholarly and intellectual demeanor, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 41, "climb": 40, "dodge": 32, "pilot": 1, "throw": 25, "track": 10, "listen": 38, "occult": 5, "history": 73, "stealth": 20, "appraise": 58, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 41, "survival": 10, "art_craft": 53, "fast_talk": 31, "first_aid": 30, "locksmith": 1, "accounting": 31, "drive_auto": 20, "intimidate": 15, "psychology": 28, "archaeology": 27, "electronics": 1, "library_use": 78, "spot_hidden": 64, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 80, "credit_rating": 28, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 27, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 15:37:48.604266	2025-11-16 17:10:18.41	f	\N	0.00	0	\N	\N	\N	\N
f962f819-ad69-4111-b1f7-02cdcdffc29b	\N	6924315e-6810-41a6-ae3c-32845506c0c7	Dr. Nia Vanseirk 	Médecin	34	Bruxelles	Brest	\N	65	35	70	30	40	75	50	80	65	10	10	95	99	10	10	\N	scholarly and intellectual demeanor, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 14, "swim": 25, "charm": 15, "climb": 40, "dodge": 15, "pilot": 1, "throw": 25, "track": 10, "listen": 40, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 63, "navigate": 10, "persuade": 45, "survival": 15, "fast_talk": 5, "first_aid": 89, "locksmith": 1, "accounting": 31, "drive_auto": 20, "intimidate": 15, "psychology": 57, "reputation": 30, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 66, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 80, "credit_rating": 30, "natural_world": 10, "cthulhu_mythos": 11, "fighting_brawl": 30, "fighting_sword": 1, "language_greek": 1, "language_latin": 21, "language_other": 1, "psychoanalysis": 1, "science_biology": 35, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 27, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 31, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 15:37:57.725647	2025-11-16 17:09:52.846	f	\N	0.00	0	\N	\N	\N	\N
622bf74e-2384-4b65-9f86-2648662fe6bc	\N	6924315e-6810-41a6-ae3c-32845506c0c7	Maurice Lefèvre 	Inspecteur de Police	48	Dunkerque	Le Touquet 	\N	80	75	60	45	40	70	65	60	70	13	13	99	99	13	13	\N	intelligent and sharp gaze, strong and robust build, dramatic shadows, vintage 1920s style	{"law": 53, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 22, "pilot": 1, "throw": 25, "track": 10, "listen": 63, "occult": 5, "history": 20, "stealth": 20, "appraise": 5, "disguise": 49, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 5, "first_aid": 58, "locksmith": 1, "accounting": 5, "drive_auto": 48, "intimidate": 39, "psychology": 53, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 63, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 60, "credit_rating": 29, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 53, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 53, "firearms_handgun": 68, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 15:38:21.55442	2025-11-16 17:10:00.462	t	\N	0.00	0	\N	\N	\N	\N
774f71e2-3028-406e-9fcc-1422e811fc53	\N	6924315e-6810-41a6-ae3c-32845506c0c7	Dr. Lucien Mortegarde	Aliéniste	33	Noirétable	Mortagne	\N	70	70	65	55	70	70	75	70	55	7	13	95	99	15	15	\N	attractive appearance, intelligent and sharp gaze, strong and robust build, dramatic shadows, vintage 1920s style	{"law": 27, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 47, "pilot": 1, "throw": 25, "track": 24, "listen": 75, "occult": 5, "history": 20, "stealth": 25, "appraise": 5, "disguise": 1, "hypnosis": 26, "medicine": 51, "navigate": 10, "persuade": 43, "survival": 25, "fast_talk": 5, "first_aid": 33, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 52, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 25, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 25, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 6, "language_other": 47, "psychoanalysis": 24, "science_biology": 34, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 24, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 15:38:52.768429	2025-11-16 17:09:39.368	f	\N	0.00	0	\N	\N	\N	\N
37806e6c-468c-4f0b-b3b3-d2e03c454641	gm-realtime-test	36acbdd5-05db-46c0-9fdf-941efa142d42	Test Character AtpL	Antiquaire	25				45	50	60	40	65	65	75	70	50	11	11	75	99	15	15	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 41, "climb": 40, "dodge": 20, "pilot": 1, "throw": 25, "track": 10, "listen": 42, "occult": 5, "history": 66, "stealth": 20, "appraise": 51, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 38, "survival": 10, "art_craft": 46, "fast_talk": 31, "first_aid": 30, "locksmith": 1, "accounting": 28, "drive_auto": 20, "intimidate": 15, "psychology": 32, "archaeology": 27, "electronics": 1, "library_use": 71, "spot_hidden": 65, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 24, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 17:11:36.453699	2025-11-16 17:11:36.453699	t	\N	50.00	0	\N	\N	\N	\N
f2d8f367-e2ee-4b98-a780-797060c56438	\N	6924315e-6810-41a6-ae3c-32845506c0c7	Vlad Kowalski	Détective Privé	35	Krakow	Paris	\N	45	40	65	50	75	40	25	75	65	10	10	99	99	5	5	\N	attractive appearance, dramatic shadows, vintage 1920s style	{"law": 46, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 25, "pilot": 1, "throw": 25, "track": 10, "listen": 49, "occult": 5, "history": 20, "stealth": 40, "appraise": 5, "disguise": 42, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 25, "first_aid": 30, "locksmith": 17, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 43, "archaeology": 1, "electronics": 1, "library_use": 66, "spot_hidden": 53, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 23, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 36, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 46, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 15:38:29.464299	2025-11-16 17:09:49.468	f	\N	0.00	0	\N	\N	\N	\N
4b96255e-aff6-4892-ac78-e29d4f03821d	53a504f9-7832-439b-a886-e84e0176fb7e	6924315e-6810-41a6-ae3c-32845506c0c7	Jean Luc Melanchon	Archéologue	39	Amiens	Paris	\N	50	70	60	40	80	40	50	55	65	13	13	99	99	10	10	\N	attractive appearance, healthy and vigorous appearance, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 56, "dodge": 20, "pilot": 1, "throw": 25, "track": 10, "listen": 33, "occult": 5, "history": 56, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 28, "persuade": 15, "survival": 26, "fast_talk": 5, "first_aid": 30, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 23, "archaeology": 37, "electronics": 1, "library_use": 61, "spot_hidden": 51, "anthropology": 37, "computer_use": 1, "fighting_axe": 1, "language_own": 55, "credit_rating": 23, "natural_world": 26, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 19, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 38, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-11-16 15:38:34.057819	2025-11-16 17:09:46.919	f	\N	0.00	0	\N	\N	\N	\N
95e414b7-ecbc-4925-8faf-ee143a6525d8	\N	4ecf830f-3c1b-4b47-a5e8-1a1ab97cd75e	Vlad Kowalski	Détective Privé	35	Krakow	Paris		45	40	65	50	75	40	25	75	65	10	10	99	99	5	5	\N	attractive appearance, dramatic shadows, vintage 1920s style	{"law": 46, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 25, "pilot": 1, "throw": 25, "track": 10, "listen": 49, "occult": 5, "history": 20, "stealth": 40, "appraise": 5, "disguise": 42, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 25, "first_aid": 30, "locksmith": 17, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 43, "archaeology": 1, "electronics": 1, "library_use": 66, "spot_hidden": 53, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 23, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 36, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 46, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-12-31 09:49:08.794719	2025-12-31 10:22:47.622	t	\N	0.00	0	\N	\N	\N	\N
e195d25a-a723-4740-86b4-7f7be46de6d5	53a504f9-7832-439b-a886-e84e0176fb7e	e49872b4-ff93-4cff-8576-c518de829a27	Jean Luc Melanchon	Archéologue	39	Amiens	Paris		50	70	60	40	80	40	50	55	65	11	13	33	99	10	10	\N	attractive appearance, healthy and vigorous appearance, dramatic shadows, vintage 1920s style	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 56, "dodge": 20, "pilot": 1, "throw": 25, "track": 10, "listen": 33, "occult": 5, "history": 56, "stealth": 20, "appraise": 5, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 28, "persuade": 15, "survival": 26, "fast_talk": 5, "first_aid": 30, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 23, "archaeology": 37, "electronics": 1, "library_use": 61, "spot_hidden": 51, "anthropology": 37, "computer_use": 1, "fighting_axe": 1, "language_own": 55, "credit_rating": 23, "natural_world": 26, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 19, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 38, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-08-24 13:51:53.358461	2025-12-31 10:22:47.658	f	\N	0.00	0	\N	\N	\N	\N
0e5f9b06-4719-4560-baa2-05b2bae7ec7d	\N	4ecf830f-3c1b-4b47-a5e8-1a1ab97cd75e	Marcus Whitmore	Antiquaire	25				50	65	50	40	45	55	70	75	70	11	11	99	99	14	14	\N	\N	{"law": 5, "jump": 25, "ride": 5, "swim": 25, "charm": 37, "climb": 40, "dodge": 20, "pilot": 1, "throw": 25, "track": 10, "listen": 39, "occult": 5, "history": 70, "stealth": 20, "appraise": 55, "disguise": 1, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 40, "survival": 10, "art_craft": 50, "fast_talk": 27, "first_aid": 30, "locksmith": 1, "accounting": 30, "drive_auto": 20, "intimidate": 15, "psychology": 29, "archaeology": 23, "electronics": 1, "library_use": 75, "spot_hidden": 64, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 26, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-12-31 09:49:12.098371	2025-12-31 09:49:12.098371	t	\N	0.00	0	\N	\N	\N	\N
9c3528c2-0843-4a52-b81d-2ada647c97e6	\N	4ecf830f-3c1b-4b47-a5e8-1a1ab97cd75e	Dr. Lucien Mortegarde	Aliéniste	33	Noirétable	Mortagne		70	70	65	55	70	70	75	70	55	13	13	99	99	15	15	\N	attractive appearance, intelligent and sharp gaze, strong and robust build, dramatic shadows, vintage 1920s style	{"law": 27, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 47, "pilot": 1, "throw": 25, "track": 24, "listen": 75, "occult": 5, "history": 20, "stealth": 25, "appraise": 5, "disguise": 1, "hypnosis": 26, "medicine": 51, "navigate": 10, "persuade": 43, "survival": 25, "fast_talk": 5, "first_aid": 33, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 52, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 25, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 25, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 6, "language_other": 47, "psychoanalysis": 24, "science_biology": 34, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 24, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-12-31 09:49:10.668654	2025-12-31 10:22:47.605	t	\N	0.00	0	\N	\N	\N	\N
75f7c917-244f-4d1d-9022-0151f9133366	\N	e49872b4-ff93-4cff-8576-c518de829a27	Dr. Lucien Mortegarde	Aliéniste	33	Noirétable	Mortagne		70	70	65	55	70	70	75	70	55	12	13	66	99	15	15	\N	attractive appearance, intelligent and sharp gaze, strong and robust build, dramatic shadows, vintage 1920s style	{"law": 27, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 47, "pilot": 1, "throw": 25, "track": 24, "listen": 75, "occult": 5, "history": 20, "stealth": 25, "appraise": 5, "disguise": 1, "hypnosis": 26, "medicine": 51, "navigate": 10, "persuade": 43, "survival": 25, "fast_talk": 5, "first_aid": 33, "locksmith": 1, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 52, "archaeology": 1, "electronics": 1, "library_use": 25, "spot_hidden": 25, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 70, "credit_rating": 15, "natural_world": 10, "cthulhu_mythos": 25, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 6, "language_other": 47, "psychoanalysis": 24, "science_biology": 34, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 20, "science_pharmacy": 24, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 5, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-08-24 14:05:20.949583	2025-12-31 10:22:47.632	f	\N	4.00	0	\N	\N	\N	\N
3b1da7a0-1ea2-4dfd-96f0-4fdee5818169	\N	e49872b4-ff93-4cff-8576-c518de829a27	Vlad Kowalski	Détective Privé	35	Krakow	Paris		45	40	65	50	75	40	25	75	65	10	10	28	99	5	5	\N	attractive appearance, dramatic shadows, vintage 1920s style	{"law": 46, "jump": 25, "ride": 5, "swim": 25, "charm": 15, "climb": 40, "dodge": 25, "pilot": 1, "throw": 25, "track": 10, "listen": 49, "occult": 5, "history": 20, "stealth": 40, "appraise": 5, "disguise": 42, "hypnosis": 1, "medicine": 5, "navigate": 10, "persuade": 15, "survival": 10, "fast_talk": 25, "first_aid": 30, "locksmith": 17, "accounting": 5, "drive_auto": 20, "intimidate": 15, "psychology": 43, "archaeology": 1, "electronics": 1, "library_use": 66, "spot_hidden": 53, "anthropology": 1, "computer_use": 1, "fighting_axe": 1, "language_own": 75, "credit_rating": 23, "natural_world": 10, "cthulhu_mythos": 0, "fighting_brawl": 25, "fighting_sword": 1, "language_greek": 1, "language_latin": 1, "language_other": 1, "psychoanalysis": 1, "science_biology": 1, "science_geology": 1, "science_physics": 1, "sleight_of_hand": 10, "art_craft_acting": 5, "firearms_handgun": 36, "science_pharmacy": 1, "art_craft_forgery": 5, "art_craft_writing": 5, "electrical_repair": 10, "mechanical_repair": 20, "science_astronomy": 1, "science_chemistry": 1, "art_craft_fine_art": 5, "science_mathematics": 1, "firearms_machine_gun": 1, "art_craft_photography": 46, "firearms_rifle_shotgun": 25, "firearms_submachine_gun": 1, "operate_heavy_machinery": 1}	t	2025-08-24 13:52:34.82167	2025-12-31 10:22:47.65	f	\N	0.00	0	\N	\N	\N	\N
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	authentik_providers_ldap	ldapprovider
2	authentik_tenants	tenant
3	authentik_tenants	domain
4	pgactivity	pgactivity
5	pglock	pglock
6	pglock	blockedpglock
7	auth	permission
8	auth	group
9	contenttypes	contenttype
10	sessions	session
11	authentik_admin	versionhistory
12	authentik_crypto	certificatekeypair
13	authentik_flows	flow
14	authentik_flows	stage
15	authentik_flows	flowstagebinding
16	authentik_flows	flowtoken
17	authentik_outposts	outpost
18	authentik_outposts	outpostserviceconnection
19	authentik_outposts	dockerserviceconnection
20	authentik_outposts	kubernetesserviceconnection
21	authentik_policies_dummy	dummypolicy
22	authentik_policies_event_matcher	eventmatcherpolicy
23	authentik_policies_expiry	passwordexpirypolicy
24	authentik_policies_expression	expressionpolicy
25	authentik_policies_geoip	geoippolicy
26	authentik_policies_password	passwordpolicy
27	authentik_policies_reputation	reputationpolicy
28	authentik_policies_reputation	reputation
29	authentik_policies	policy
30	authentik_policies	policybinding
31	authentik_policies	policybindingmodel
32	authentik_providers_oauth2	oauth2provider
33	authentik_providers_oauth2	scopemapping
34	authentik_providers_oauth2	refreshtoken
35	authentik_providers_oauth2	authorizationcode
36	authentik_providers_oauth2	devicetoken
37	authentik_providers_oauth2	accesstoken
38	authentik_providers_proxy	proxyprovider
39	authentik_providers_radius	radiusprovider
40	authentik_providers_radius	radiusproviderpropertymapping
41	authentik_providers_saml	samlpropertymapping
42	authentik_providers_saml	samlprovider
43	authentik_providers_scim	scimmapping
44	authentik_providers_scim	scimprovider
45	authentik_providers_scim	scimprovidergroup
46	authentik_providers_scim	scimprovideruser
47	authentik_rbac	role
48	authentik_rbac	systempermission
49	authentik_sources_kerberos	groupkerberossourceconnection
50	authentik_sources_kerberos	kerberossource
51	authentik_sources_kerberos	kerberossourcepropertymapping
52	authentik_sources_kerberos	userkerberossourceconnection
53	authentik_sources_ldap	ldapsource
54	authentik_sources_ldap	ldapsourcepropertymapping
55	authentik_sources_oauth	oauthsource
56	authentik_sources_oauth	useroauthsourceconnection
57	authentik_sources_oauth	groupoauthsourceconnection
58	authentik_sources_oauth	oauthsourcepropertymapping
59	authentik_sources_plex	plexsource
60	authentik_sources_plex	groupplexsourceconnection
61	authentik_sources_plex	plexsourcepropertymapping
62	authentik_sources_plex	userplexsourceconnection
63	authentik_sources_saml	samlsource
64	authentik_sources_saml	usersamlsourceconnection
65	authentik_sources_saml	groupsamlsourceconnection
66	authentik_sources_saml	samlsourcepropertymapping
67	authentik_sources_scim	scimsource
68	authentik_sources_scim	scimsourcegroup
69	authentik_sources_scim	scimsourceuser
70	authentik_sources_scim	scimsourcepropertymapping
71	authentik_stages_authenticator_duo	authenticatorduostage
72	authentik_stages_authenticator_duo	duodevice
73	authentik_stages_authenticator_sms	authenticatorsmsstage
74	authentik_stages_authenticator_sms	smsdevice
75	authentik_stages_authenticator_static	authenticatorstaticstage
76	authentik_stages_authenticator_static	staticdevice
77	authentik_stages_authenticator_static	statictoken
78	authentik_stages_authenticator_totp	authenticatortotpstage
79	authentik_stages_authenticator_totp	totpdevice
80	authentik_stages_authenticator_validate	authenticatorvalidatestage
81	authentik_stages_authenticator_webauthn	webauthndevicetype
82	authentik_stages_authenticator_webauthn	authenticatorwebauthnstage
83	authentik_stages_authenticator_webauthn	webauthndevice
84	authentik_stages_captcha	captchastage
85	authentik_stages_consent	consentstage
86	authentik_stages_consent	userconsent
87	authentik_stages_deny	denystage
88	authentik_stages_dummy	dummystage
89	authentik_stages_email	emailstage
90	authentik_stages_identification	identificationstage
91	authentik_stages_invitation	invitationstage
92	authentik_stages_invitation	invitation
93	authentik_stages_password	passwordstage
94	authentik_stages_prompt	prompt
95	authentik_stages_prompt	promptstage
96	authentik_stages_user_delete	userdeletestage
97	authentik_stages_user_login	userloginstage
98	authentik_stages_user_logout	userlogoutstage
99	authentik_stages_user_write	userwritestage
100	authentik_brands	brand
101	authentik_blueprints	blueprintinstance
102	guardian	groupobjectpermission
103	guardian	userobjectpermission
104	authentik_core	user
105	authentik_core	propertymapping
106	authentik_core	source
107	authentik_core	usersourceconnection
108	authentik_core	token
109	authentik_core	provider
110	authentik_core	group
111	authentik_core	application
112	authentik_core	authenticatedsession
113	authentik_core	groupsourceconnection
114	authentik_enterprise	license
115	authentik_enterprise	licenseusage
116	authentik_providers_google_workspace	googleworkspaceprovidermapping
117	authentik_providers_google_workspace	googleworkspaceprovider
118	authentik_providers_google_workspace	googleworkspaceprovidergroup
119	authentik_providers_google_workspace	googleworkspaceprovideruser
120	authentik_providers_microsoft_entra	microsoftentraprovidermapping
121	authentik_providers_microsoft_entra	microsoftentraprovider
122	authentik_providers_microsoft_entra	microsoftentraprovidergroup
123	authentik_providers_microsoft_entra	microsoftentraprovideruser
124	authentik_providers_rac	racpropertymapping
125	authentik_providers_rac	racprovider
126	authentik_providers_rac	endpoint
127	authentik_providers_rac	connectiontoken
128	authentik_stages_authenticator_endpoint_gdtc	authenticatorendpointgdtcstage
129	authentik_stages_authenticator_endpoint_gdtc	endpointdevice
130	authentik_stages_authenticator_endpoint_gdtc	endpointdeviceconnection
131	authentik_stages_source	sourcestage
132	authentik_events	event
133	authentik_events	notificationtransport
134	authentik_events	notificationrule
135	authentik_events	notification
136	authentik_events	notificationwebhookmapping
137	authentik_events	systemtask
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-11-21 13:51:08.663638+00
2	contenttypes	0002_remove_content_type_name	2025-11-21 13:51:08.69965+00
3	auth	0001_initial	2025-11-21 13:51:08.811746+00
4	auth	0002_alter_permission_name_max_length	2025-11-21 13:51:08.81766+00
5	auth	0003_alter_user_email_max_length	2025-11-21 13:51:08.822964+00
6	auth	0004_alter_user_username_opts	2025-11-21 13:51:08.827108+00
7	auth	0005_alter_user_last_login_null	2025-11-21 13:51:08.832593+00
8	auth	0006_require_contenttypes_0002	2025-11-21 13:51:08.834799+00
9	auth	0007_alter_validators_add_error_messages	2025-11-21 13:51:08.853369+00
10	auth	0008_alter_user_username_max_length	2025-11-21 13:51:08.865016+00
11	auth	0009_alter_user_last_name_max_length	2025-11-21 13:51:08.869564+00
12	auth	0010_alter_group_name_max_length	2025-11-21 13:51:08.880744+00
13	auth	0011_update_proxy_permissions	2025-11-21 13:51:08.890386+00
14	auth	0012_alter_user_first_name_max_length	2025-11-21 13:51:08.895605+00
15	authentik_policies	0001_initial	2025-11-21 13:51:08.936849+00
16	authentik_policies	0002_auto_20200528_1647	2025-11-21 13:51:09.02957+00
17	authentik_flows	0001_initial	2025-11-21 13:51:09.194009+00
18	authentik_flows	0003_auto_20200523_1133	2025-11-21 13:51:09.201285+00
19	authentik_flows	0006_auto_20200629_0857	2025-11-21 13:51:09.20859+00
20	authentik_flows	0007_auto_20200703_2059	2025-11-21 13:51:09.210075+00
21	authentik_blueprints	0001_initial	2025-11-21 13:51:10.010553+00
22	authentik_blueprints	0002_blueprintinstance_content	2025-11-21 13:51:10.060918+00
23	authentik_blueprints	0003_alter_blueprintinstance_name	2025-11-21 13:51:10.207105+00
24	authentik_rbac	0001_initial	2025-11-21 13:51:10.36262+00
25	authentik_rbac	0002_systempermission	2025-11-21 13:51:10.386164+00
26	authentik_rbac	0003_alter_systempermission_options	2025-11-21 13:51:10.398104+00
27	authentik_tenants	0001_initial	2025-11-21 13:51:10.873175+00
28	authentik_tenants	0002_tenant_default_token_duration_and_more	2025-11-21 13:51:10.903431+00
29	authentik_flows	0008_default_flows	2025-11-21 13:51:10.912994+00
30	authentik_flows	0009_source_flows	2025-11-21 13:51:10.917645+00
31	authentik_flows	0010_provider_flows	2025-11-21 13:51:10.921967+00
32	authentik_flows	0011_flow_title	2025-11-21 13:51:10.963576+00
33	authentik_flows	0012_auto_20200908_1542	2025-11-21 13:51:11.118716+00
34	authentik_flows	0013_auto_20200924_1605	2025-11-21 13:51:11.119942+00
35	authentik_flows	0014_auto_20200925_2332	2025-11-21 13:51:11.120708+00
36	authentik_flows	0015_flowstagebinding_evaluate_on_plan	2025-11-21 13:51:11.1217+00
37	authentik_flows	0016_auto_20201202_1307	2025-11-21 13:51:11.124757+00
38	authentik_flows	0017_auto_20210329_1334	2025-11-21 13:51:11.125803+00
39	authentik_flows	0018_oob_flows	2025-11-21 13:51:11.127116+00
40	authentik_flows	0019_alter_flow_background	2025-11-21 13:51:11.180164+00
41	authentik_flows	0020_flow_compatibility_mode	2025-11-21 13:51:11.182731+00
42	authentik_flows	0021_flowstagebinding_invalid_response_action	2025-11-21 13:51:11.18428+00
43	authentik_flows	0022_alter_flowstagebinding_invalid_response_action	2025-11-21 13:51:11.184887+00
44	authentik_flows	0023_alter_flow_background	2025-11-21 13:51:11.185586+00
45	authentik_flows	0024_alter_flow_compatibility_mode	2025-11-21 13:51:11.186333+00
46	authentik_crypto	0001_initial	2025-11-21 13:51:11.208172+00
47	authentik_core	0001_initial	2025-11-21 13:51:11.818231+00
48	authentik_providers_saml	0001_initial	2025-11-21 13:51:11.86224+00
49	authentik_providers_saml	0002_default_saml_property_mappings	2025-11-21 13:51:11.864898+00
50	authentik_providers_saml	0003_samlprovider_sp_binding	2025-11-21 13:51:11.866743+00
51	authentik_providers_saml	0004_auto_20200620_1950	2025-11-21 13:51:11.867581+00
52	authentik_providers_saml	0005_remove_samlprovider_processor_path	2025-11-21 13:51:11.868211+00
53	authentik_core	0002_auto_20200523_1133	2025-11-21 13:51:12.298986+00
54	authentik_core	0003_default_user	2025-11-21 13:51:12.300254+00
55	authentik_core	0004_auto_20200703_2213	2025-11-21 13:51:12.301134+00
56	authentik_core	0005_token_intent	2025-11-21 13:51:12.301856+00
57	authentik_core	0006_auto_20200709_1608	2025-11-21 13:51:12.302616+00
58	authentik_core	0007_auto_20200815_1841	2025-11-21 13:51:12.303379+00
59	authentik_core	0008_auto_20200824_1532	2025-11-21 13:51:12.306649+00
60	authentik_core	0009_group_is_superuser	2025-11-21 13:51:12.30786+00
61	authentik_core	0010_auto_20200917_1021	2025-11-21 13:51:12.308902+00
62	authentik_core	0011_provider_name_temp	2025-11-21 13:51:12.31046+00
63	authentik_providers_saml	0006_remove_samlprovider_name	2025-11-21 13:51:12.336775+00
64	authentik_crypto	0002_create_self_signed_kp	2025-11-21 13:51:12.337966+00
65	authentik_providers_oauth2	0001_initial	2025-11-21 13:51:12.492995+00
66	authentik_providers_oauth2	0002_oauth2provider_sub_mode	2025-11-21 13:51:12.502437+00
67	authentik_providers_oauth2	0003_auto_20200916_2129	2025-11-21 13:51:12.51905+00
68	authentik_providers_oauth2	0004_remove_oauth2provider_post_logout_redirect_uris	2025-11-21 13:51:12.53092+00
69	authentik_providers_oauth2	0005_auto_20200920_1240	2025-11-21 13:51:12.537805+00
70	authentik_providers_oauth2	0006_remove_oauth2provider_name	2025-11-21 13:51:12.570793+00
71	authentik_core	0012_auto_20201003_1737	2025-11-21 13:51:12.776083+00
72	authentik_core	0013_auto_20201003_2132	2025-11-21 13:51:12.77685+00
73	authentik_core	0014_auto_20201018_1158	2025-11-21 13:51:12.777463+00
74	authentik_core	0015_application_icon	2025-11-21 13:51:12.777945+00
75	authentik_core	0016_auto_20201202_2234	2025-11-21 13:51:12.77843+00
76	authentik_core	0017_managed	2025-11-21 13:51:12.800934+00
77	authentik_core	0018_auto_20210330_1345	2025-11-21 13:51:13.12153+00
78	authentik_core	0019_source_managed	2025-11-21 13:51:13.124736+00
79	authentik_core	0020_source_user_matching_mode	2025-11-21 13:51:13.125933+00
80	authentik_core	0021_alter_application_slug	2025-11-21 13:51:13.126984+00
81	authentik_core	0022_authenticatedsession	2025-11-21 13:51:13.127885+00
82	authentik_core	0023_alter_application_meta_launch_url	2025-11-21 13:51:13.128731+00
83	authentik_core	0024_alter_token_identifier	2025-11-21 13:51:13.129756+00
84	authentik_core	0025_alter_application_meta_icon	2025-11-21 13:51:13.131451+00
85	authentik_core	0026_alter_application_meta_icon	2025-11-21 13:51:13.132668+00
86	authentik_core	0027_bootstrap_token	2025-11-21 13:51:13.133655+00
87	authentik_core	0028_alter_token_intent	2025-11-21 13:51:13.134594+00
88	authentik_flows	0020_flowtoken	2025-11-21 13:51:13.176008+00
89	authentik_flows	0021_auto_20211227_2103	2025-11-21 13:51:13.178062+00
90	authentik_flows	0022_flow_layout	2025-11-21 13:51:13.193478+00
91	authentik_flows	0023_flow_denied_action	2025-11-21 13:51:13.212974+00
92	authentik_flows	0024_flow_authentication	2025-11-21 13:51:13.22328+00
93	authentik_flows	0025_alter_flowstagebinding_evaluate_on_plan_and_more	2025-11-21 13:51:13.253616+00
94	authentik_core	0019_application_group	2025-11-21 13:51:13.268032+00
95	authentik_core	0020_application_open_in_new_tab	2025-11-21 13:51:13.279722+00
96	authentik_core	0021_source_user_path_user_path	2025-11-21 13:51:13.308446+00
97	authentik_core	0022_alter_group_parent	2025-11-21 13:51:13.335586+00
98	authentik_core	0023_source_authentik_c_slug_ccb2e5_idx_and_more	2025-11-21 13:51:13.370517+00
99	authentik_core	0024_source_icon	2025-11-21 13:51:13.386528+00
100	authentik_core	0025_alter_provider_authorization_flow	2025-11-21 13:51:13.64613+00
101	authentik_providers_scim	0001_initial	2025-11-21 13:51:13.868278+00
102	authentik_providers_scim	0002_scimuser	2025-11-21 13:51:13.870104+00
103	authentik_providers_scim	0003_scimgroup	2025-11-21 13:51:13.870988+00
104	authentik_providers_scim	0004_scimprovider_property_mappings_group	2025-11-21 13:51:13.873547+00
105	authentik_providers_scim	0005_scimprovider_exclude_users_service_account_and_more	2025-11-21 13:51:13.875736+00
106	authentik_providers_scim	0006_rename_parent_group_scimprovider_filter_group	2025-11-21 13:51:13.877267+00
107	authentik_providers_ldap	0001_initial	2025-11-21 13:51:13.92172+00
108	authentik_providers_ldap	0002_ldapprovider_search_group	2025-11-21 13:51:13.924552+00
109	authentik_providers_ldap	0003_auto_20210713_1138	2025-11-21 13:51:13.925613+00
110	authentik_providers_ldap	0004_auto_20210713_2115	2025-11-21 13:51:13.926643+00
111	authentik_providers_ldap	0005_ldapprovider_search_mode	2025-11-21 13:51:13.92771+00
112	authentik_providers_ldap	0002_ldapprovider_bind_mode	2025-11-21 13:51:13.94396+00
113	authentik_core	0026_alter_propertymapping_name_alter_provider_name	2025-11-21 13:51:14.060922+00
114	authentik_core	0027_alter_user_uuid	2025-11-21 13:51:14.079953+00
115	authentik_core	0028_provider_authentication_flow	2025-11-21 13:51:14.111126+00
116	authentik_core	0029_provider_backchannel_applications_and_more	2025-11-21 13:51:16.728591+00
117	authentik_core	0030_user_type	2025-11-21 13:51:16.786973+00
118	authentik_core	0031_alter_user_type	2025-11-21 13:51:16.834728+00
119	authentik_core	0032_group_roles	2025-11-21 13:51:16.924446+00
120	authentik_core	0033_alter_user_options	2025-11-21 13:51:16.940629+00
121	authentik_core	0034_alter_authenticatedsession_expires_and_more	2025-11-21 13:51:16.98065+00
122	authentik_core	0035_alter_group_options_and_more	2025-11-21 13:51:17.182589+00
123	authentik_policies	0003_auto_20200908_1542	2025-11-21 13:51:17.217002+00
124	authentik_stages_prompt	0001_initial	2025-11-21 13:51:17.317118+00
125	authentik_stages_prompt	0002_auto_20200920_1859	2025-11-21 13:51:17.346076+00
126	authentik_stages_prompt	0003_auto_20210222_1821	2025-11-21 13:51:17.374664+00
127	authentik_stages_prompt	0004_prompt_sub_text	2025-11-21 13:51:17.382007+00
128	authentik_stages_prompt	0005_alter_prompt_field_key	2025-11-21 13:51:17.418077+00
129	authentik_stages_prompt	0006_alter_prompt_type	2025-11-21 13:51:17.458221+00
130	authentik_stages_prompt	0007_prompt_placeholder_expression	2025-11-21 13:51:17.547002+00
131	authentik_crypto	0003_certificatekeypair_managed	2025-11-21 13:51:17.685445+00
132	authentik_brands	0001_initial	2025-11-21 13:51:18.163629+00
133	authentik_brands	0002_default	2025-11-21 13:51:18.167281+00
134	authentik_brands	0003_tenant_branding_favicon	2025-11-21 13:51:18.17808+00
135	authentik_brands	0004_tenant_event_retention	2025-11-21 13:51:18.180831+00
136	authentik_brands	0005_tenant_web_certificate	2025-11-21 13:51:18.1829+00
137	authentik_brands	0002_tenant_flow_user_settings	2025-11-21 13:51:18.427003+00
138	authentik_brands	0003_tenant_attributes	2025-11-21 13:51:18.480438+00
139	authentik_brands	0004_tenant_flow_device_code	2025-11-21 13:51:18.52512+00
140	authentik_brands	0005_tenantuuid_to_branduuid	2025-11-21 13:51:18.558665+00
141	authentik_brands	0006_brand_authentik_b_domain_b9b24a_idx_and_more	2025-11-21 13:51:18.595599+00
142	authentik_brands	0007_brand_default_application	2025-11-21 13:51:18.657218+00
143	authentik_flows	0026_alter_flow_options	2025-11-21 13:51:18.81439+00
144	authentik_flows	0027_auto_20231028_1424	2025-11-21 13:51:19.000129+00
145	authentik_policies	0004_policy_execution_logging	2025-11-21 13:51:19.009857+00
146	authentik_policies	0005_binding_group	2025-11-21 13:51:19.185778+00
147	authentik_policies	0006_auto_20210329_1334	2025-11-21 13:51:19.192652+00
148	authentik_policies	0007_policybindingmodel_policy_engine_mode	2025-11-21 13:51:19.260327+00
149	authentik_policies	0008_policybinding_authentik_p_policy__534e15_idx_and_more	2025-11-21 13:51:19.965779+00
150	authentik_policies	0009_alter_policy_name	2025-11-21 13:51:20.031807+00
151	authentik_policies	0010_alter_policy_name	2025-11-21 13:51:21.843346+00
152	authentik_policies	0011_policybinding_failure_result_and_more	2025-11-21 13:51:21.957751+00
153	authentik_sources_ldap	0001_initial	2025-11-21 13:51:25.91241+00
154	authentik_sources_ldap	0002_ldapsource_sync_users	2025-11-21 13:51:25.921056+00
155	authentik_sources_ldap	0003_default_ldap_property_mappings	2025-11-21 13:51:25.93911+00
156	authentik_sources_ldap	0004_auto_20200524_1146	2025-11-21 13:51:25.942085+00
157	authentik_sources_ldap	0005_auto_20200913_1947	2025-11-21 13:51:25.945036+00
158	authentik_sources_ldap	0006_auto_20200915_1919	2025-11-21 13:51:25.96004+00
159	authentik_sources_ldap	0007_ldapsource_sync_users_password	2025-11-21 13:51:25.961981+00
160	authentik_sources_ldap	0008_managed	2025-11-21 13:51:25.974363+00
161	authentik_sources_ldap	0009_auto_20210204_1834	2025-11-21 13:51:25.991215+00
162	authentik_sources_ldap	0010_auto_20210205_1027	2025-11-21 13:51:26.009222+00
163	authentik_sources_ldap	0011_ldapsource_property_mappings_group	2025-11-21 13:51:26.044143+00
164	authentik_sources_ldap	0012_auto_20210812_1703	2025-11-21 13:51:26.049792+00
165	authentik_sources_ldap	0002_auto_20211203_0900	2025-11-21 13:51:26.407068+00
166	authentik_crypto	0004_alter_certificatekeypair_name	2025-11-21 13:51:26.852937+00
167	authentik_sources_ldap	0003_ldapsource_client_certificate_ldapsource_sni_and_more	2025-11-21 13:51:27.2195+00
168	authentik_sources_ldap	0004_ldapsource_password_login_update_internal_password	2025-11-21 13:51:27.368145+00
169	authentik_core	0036_source_group_property_mappings_and_more	2025-11-21 13:51:29.333149+00
170	authentik_sources_ldap	0005_remove_ldappropertymapping_object_field_and_more	2025-11-21 13:51:29.630931+00
171	authentik_core	0037_remove_source_property_mappings	2025-11-21 13:51:29.714086+00
172	authentik_core	0038_source_authentik_c_enabled_d72365_idx	2025-11-21 13:51:29.762095+00
173	authentik_core	0039_source_group_matching_mode_alter_group_name_and_more	2025-11-21 13:51:29.910992+00
174	authentik_core	0040_provider_invalidation_flow	2025-11-21 13:51:30.02869+00
175	authentik_enterprise	0001_initial	2025-11-21 13:51:30.059544+00
176	authentik_enterprise	0002_rename_users_license_internal_users_and_more	2025-11-21 13:51:30.099232+00
177	authentik_enterprise	0003_remove_licenseusage_within_limits_and_more	2025-11-21 13:51:30.235948+00
178	authentik_policies_event_matcher	0001_initial	2025-11-21 13:51:30.316384+00
179	authentik_policies_event_matcher	0002_auto_20201230_2046	2025-11-21 13:51:30.318017+00
180	authentik_policies_event_matcher	0003_auto_20210110_1907	2025-11-21 13:51:30.319378+00
181	authentik_policies_event_matcher	0004_auto_20210112_2158	2025-11-21 13:51:30.322964+00
182	authentik_policies_event_matcher	0005_auto_20210202_1821	2025-11-21 13:51:30.325753+00
183	authentik_policies_event_matcher	0006_auto_20210203_1134	2025-11-21 13:51:30.327354+00
184	authentik_policies_event_matcher	0007_auto_20210209_1657	2025-11-21 13:51:30.335293+00
185	authentik_policies_event_matcher	0008_auto_20210213_1640	2025-11-21 13:51:30.348793+00
186	authentik_policies_event_matcher	0009_auto_20210215_2159	2025-11-21 13:51:30.353403+00
187	authentik_policies_event_matcher	0010_auto_20210222_1821	2025-11-21 13:51:30.359825+00
188	authentik_policies_event_matcher	0011_auto_20210302_0856	2025-11-21 13:51:30.362308+00
189	authentik_policies_event_matcher	0012_auto_20210323_1339	2025-11-21 13:51:30.366487+00
190	authentik_policies_event_matcher	0013_alter_eventmatcherpolicy_app	2025-11-21 13:51:30.369359+00
191	authentik_policies_event_matcher	0014_alter_eventmatcherpolicy_app	2025-11-21 13:51:30.370842+00
192	authentik_policies_event_matcher	0015_alter_eventmatcherpolicy_app	2025-11-21 13:51:30.377598+00
193	authentik_policies_event_matcher	0016_alter_eventmatcherpolicy_action	2025-11-21 13:51:30.381049+00
194	authentik_policies_event_matcher	0017_alter_eventmatcherpolicy_action	2025-11-21 13:51:30.383338+00
195	authentik_policies_event_matcher	0018_alter_eventmatcherpolicy_action	2025-11-21 13:51:30.384607+00
196	authentik_events	0001_initial	2025-11-21 13:51:31.312494+00
197	authentik_events	0002_auto_20200918_2116	2025-11-21 13:51:31.314076+00
198	authentik_events	0003_auto_20200917_1155	2025-11-21 13:51:31.31509+00
199	authentik_events	0004_auto_20200921_1829	2025-11-21 13:51:31.316559+00
200	authentik_events	0005_auto_20201005_2139	2025-11-21 13:51:31.317602+00
201	authentik_events	0006_auto_20201017_2024	2025-11-21 13:51:31.318376+00
202	authentik_events	0007_auto_20201215_0939	2025-11-21 13:51:31.31933+00
203	authentik_events	0008_auto_20201220_1651	2025-11-21 13:51:31.320316+00
204	authentik_events	0009_auto_20201227_1210	2025-11-21 13:51:31.323867+00
205	authentik_events	0010_notification_notificationtransport_notificationrule	2025-11-21 13:51:31.325449+00
206	authentik_events	0011_notification_rules_default_v1	2025-11-21 13:51:31.326329+00
207	authentik_events	0012_auto_20210202_1821	2025-11-21 13:51:31.327249+00
208	authentik_events	0013_auto_20210209_1657	2025-11-21 13:51:31.328026+00
209	authentik_events	0014_expiry	2025-11-21 13:51:31.328951+00
210	authentik_events	0015_alter_event_action	2025-11-21 13:51:31.330283+00
211	authentik_events	0016_add_tenant	2025-11-21 13:51:31.331521+00
212	authentik_events	0017_alter_event_action	2025-11-21 13:51:31.335313+00
213	authentik_events	0018_auto_20210911_2217	2025-11-21 13:51:31.340047+00
214	authentik_events	0019_alter_notificationtransport_webhook_url	2025-11-21 13:51:31.34217+00
215	authentik_events	0002_alter_notificationtransport_mode	2025-11-21 13:51:31.434709+00
216	authentik_events	0003_rename_tenant_event_brand	2025-11-21 13:51:31.444395+00
217	authentik_events	0004_systemtask	2025-11-21 13:51:31.46044+00
218	authentik_events	0005_remove_systemtask_finish_timestamp_and_more	2025-11-21 13:51:31.461958+00
219	authentik_events	0006_alter_systemtask_expires	2025-11-21 13:51:31.474204+00
220	authentik_events	0007_event_authentik_e_action_9a9dd9_idx_and_more	2025-11-21 13:51:31.550988+00
221	authentik_outposts	0001_initial	2025-11-21 13:51:33.556821+00
222	authentik_outposts	0002_auto_20200826_1306	2025-11-21 13:51:33.559645+00
223	authentik_outposts	0003_auto_20200827_2108	2025-11-21 13:51:33.560732+00
224	authentik_outposts	0004_auto_20200830_1056	2025-11-21 13:51:33.561565+00
225	authentik_outposts	0005_auto_20200909_1733	2025-11-21 13:51:33.562638+00
226	authentik_outposts	0006_auto_20201003_2239	2025-11-21 13:51:33.564107+00
227	authentik_outposts	0007_remove_outpost_channels	2025-11-21 13:51:33.56527+00
228	authentik_outposts	0008_auto_20201014_1547	2025-11-21 13:51:33.566197+00
229	authentik_outposts	0009_fix_missing_token_identifier	2025-11-21 13:51:33.567331+00
230	authentik_outposts	0010_service_connection	2025-11-21 13:51:33.56982+00
231	authentik_outposts	0011_docker_tls_auth	2025-11-21 13:51:33.572953+00
232	authentik_outposts	0012_service_connection_non_unique	2025-11-21 13:51:33.57432+00
233	authentik_outposts	0013_auto_20201203_2009	2025-11-21 13:51:33.575693+00
234	authentik_outposts	0014_auto_20201213_1407	2025-11-21 13:51:33.57675+00
235	authentik_outposts	0015_auto_20201224_1206	2025-11-21 13:51:33.579598+00
236	authentik_outposts	0016_alter_outpost_type	2025-11-21 13:51:33.580726+00
237	authentik_outposts	0017_outpost_managed	2025-11-21 13:51:33.581446+00
238	authentik_outposts	0018_kubernetesserviceconnection_verify_ssl	2025-11-21 13:51:33.59157+00
239	authentik_outposts	0019_alter_outpost_name_and_more	2025-11-21 13:51:33.715767+00
240	authentik_outposts	0020_alter_outpost_type	2025-11-21 13:51:33.773039+00
241	authentik_outposts	0021_alter_outpost_type	2025-11-21 13:51:33.787206+00
242	authentik_policies_dummy	0001_initial	2025-11-21 13:51:33.856764+00
243	authentik_policies_dummy	0002_dummypolicy_authentik_p_policy__648f9b_idx	2025-11-21 13:51:33.874861+00
244	authentik_policies_event_matcher	0019_alter_eventmatcherpolicy_app	2025-11-21 13:51:33.883019+00
245	authentik_policies_event_matcher	0020_eventmatcherpolicy_authentik_p_policy__e605cf_idx	2025-11-21 13:51:33.8983+00
246	authentik_policies_event_matcher	0021_alter_eventmatcherpolicy_app	2025-11-21 13:51:33.918514+00
247	authentik_policies_event_matcher	0022_eventmatcherpolicy_model	2025-11-21 13:51:33.948811+00
248	authentik_policies_event_matcher	0023_alter_eventmatcherpolicy_action_and_more	2025-11-21 13:51:34.041864+00
249	authentik_policies_expiry	0001_initial	2025-11-21 13:51:34.091606+00
250	authentik_policies_expiry	0002_passwordexpirypolicy_authentik_p_policy__cf73a7_idx	2025-11-21 13:51:34.102887+00
251	authentik_policies_expression	0001_initial	2025-11-21 13:51:34.16378+00
252	authentik_policies_expression	0002_auto_20200926_1156	2025-11-21 13:51:34.213388+00
253	authentik_policies_expression	0003_auto_20201203_1223	2025-11-21 13:51:34.282994+00
254	authentik_policies_expression	0004_expressionpolicy_authentik_p_policy__fb6feb_idx	2025-11-21 13:51:34.29832+00
255	authentik_policies_geoip	0001_initial	2025-11-21 13:51:34.509944+00
256	authentik_policies_password	0001_initial	2025-11-21 13:51:34.555564+00
257	authentik_policies_password	0002_passwordpolicy_password_field	2025-11-21 13:51:34.566799+00
258	authentik_policies_password	0003_passwordpolicy_amount_digits	2025-11-21 13:51:34.616339+00
259	authentik_policies_password	0004_passwordpolicy_authentik_p_policy__855e80_idx	2025-11-21 13:51:34.629993+00
260	authentik_policies_password	0005_passwordpolicy_check_have_i_been_pwned_and_more	2025-11-21 13:51:34.69567+00
261	authentik_policies_reputation	0001_initial	2025-11-21 13:51:34.881501+00
262	authentik_policies_reputation	0002_auto_20210529_2046	2025-11-21 13:51:35.000262+00
263	authentik_policies_reputation	0003_reputation_delete_ipreputation_delete_userreputation	2025-11-21 13:51:35.031437+00
264	authentik_policies_reputation	0004_reputationpolicy_authentik_p_policy__8f0d70_idx	2025-11-21 13:51:35.046537+00
265	authentik_policies_reputation	0005_reputation_expires_reputation_expiring	2025-11-21 13:51:35.059718+00
266	authentik_policies_reputation	0006_reputation_ip_asn_data	2025-11-21 13:51:35.068239+00
267	authentik_policies_reputation	0007_reputation_authentik_p_identif_9434d7_idx_and_more	2025-11-21 13:51:35.089266+00
268	authentik_providers_google_workspace	0001_initial	2025-11-21 13:51:35.483832+00
269	authentik_providers_google_workspace	0002_alter_googleworkspaceprovidergroup_options_and_more	2025-11-21 13:51:35.485257+00
270	authentik_providers_google_workspace	0003_googleworkspaceprovidergroup_attributes_and_more	2025-11-21 13:51:35.536361+00
271	guardian	0001_initial	2025-11-21 13:51:36.242296+00
272	guardian	0002_generic_permissions_index	2025-11-21 13:51:36.280425+00
273	authentik_providers_ldap	0003_ldapprovider_mfa_support_and_more	2025-11-21 13:51:36.397889+00
274	authentik_providers_ldap	0004_alter_ldapprovider_options_and_more	2025-11-21 13:51:36.567897+00
275	authentik_providers_microsoft_entra	0001_initial	2025-11-21 13:51:36.867083+00
276	authentik_providers_microsoft_entra	0002_microsoftentraprovidergroup_attributes_and_more	2025-11-21 13:51:36.928633+00
277	authentik_sources_oauth	0001_initial	2025-11-21 13:51:37.760879+00
278	authentik_sources_oauth	0002_auto_20200520_1108	2025-11-21 13:51:37.911128+00
279	authentik_sources_oauth	0003_auto_20210416_0726	2025-11-21 13:51:37.967497+00
280	authentik_sources_oauth	0004_auto_20210417_1900	2025-11-21 13:51:38.128813+00
281	authentik_sources_oauth	0005_update_provider_type_names	2025-11-21 13:51:38.180835+00
282	authentik_sources_oauth	0006_oauthsource_additional_scopes	2025-11-21 13:51:38.195961+00
283	authentik_sources_oauth	0007_oauthsource_oidc_jwks_oauthsource_oidc_jwks_url_and_more	2025-11-21 13:51:38.247575+00
284	authentik_providers_oauth2	0007_auto_20201016_1107	2025-11-21 13:51:38.68008+00
285	authentik_providers_oauth2	0008_oauth2provider_issuer_mode	2025-11-21 13:51:38.683054+00
286	authentik_providers_oauth2	0009_remove_oauth2provider_response_type	2025-11-21 13:51:38.684521+00
287	authentik_providers_oauth2	0010_auto_20201227_1804	2025-11-21 13:51:38.68694+00
288	authentik_providers_oauth2	0011_managed	2025-11-21 13:51:38.703782+00
289	authentik_providers_oauth2	0012_oauth2provider_access_code_validity	2025-11-21 13:51:38.706505+00
290	authentik_providers_oauth2	0013_alter_authorizationcode_nonce	2025-11-21 13:51:38.707497+00
291	authentik_providers_oauth2	0014_alter_oauth2provider_rsa_key	2025-11-21 13:51:38.708233+00
292	authentik_providers_oauth2	0015_auto_20210703_1313	2025-11-21 13:51:38.709122+00
293	authentik_providers_oauth2	0016_alter_authorizationcode_nonce	2025-11-21 13:51:38.709993+00
294	authentik_providers_oauth2	0017_alter_oauth2provider_token_validity	2025-11-21 13:51:38.711144+00
295	authentik_providers_oauth2	0008_rename_rsa_key_oauth2provider_signing_key_and_more	2025-11-21 13:51:38.751824+00
296	authentik_providers_oauth2	0009_oauth2provider_verification_keys_and_more	2025-11-21 13:51:38.85822+00
297	authentik_providers_oauth2	0010_alter_oauth2provider_verification_keys	2025-11-21 13:51:38.913157+00
298	authentik_providers_oauth2	0011_oauth2provider_jwks_sources_and_more	2025-11-21 13:51:39.05275+00
299	authentik_providers_oauth2	0012_remove_oauth2provider_verification_keys	2025-11-21 13:51:39.123215+00
300	authentik_providers_oauth2	0013_devicetoken	2025-11-21 13:51:39.17583+00
301	authentik_providers_oauth2	0014_alter_refreshtoken_options_and_more	2025-11-21 13:51:39.604827+00
302	authentik_providers_oauth2	0015_accesstoken_auth_time_authorizationcode_auth_time_and_more	2025-11-21 13:51:39.685652+00
303	authentik_providers_oauth2	0016_alter_refreshtoken_token	2025-11-21 13:51:39.730918+00
304	authentik_providers_oauth2	0017_accesstoken_session_id_authorizationcode_session_id_and_more	2025-11-21 13:51:39.793111+00
305	authentik_providers_oauth2	0018_alter_accesstoken_expires_and_more	2025-11-21 13:51:39.87671+00
306	authentik_providers_oauth2	0019_accesstoken_authentik_p_token_4bc870_idx_and_more	2025-11-21 13:51:39.878886+00
307	authentik_providers_oauth2	0020_remove_accesstoken_authentik_p_token_4bc870_idx_and_more	2025-11-21 13:51:39.882797+00
308	authentik_providers_oauth2	0021_oauth2provider_encryption_key_and_more	2025-11-21 13:51:39.977727+00
309	authentik_providers_oauth2	0022_remove_accesstoken_session_id_and_more	2025-11-21 13:51:40.414778+00
310	authentik_providers_oauth2	0023_alter_accesstoken_refreshtoken_use_hash_index	2025-11-21 13:51:40.454795+00
311	authentik_providers_proxy	0001_initial	2025-11-21 13:51:40.743727+00
312	authentik_providers_proxy	0002_proxyprovider_cookie_secret	2025-11-21 13:51:40.74485+00
313	authentik_providers_proxy	0003_proxyprovider_certificate	2025-11-21 13:51:40.745608+00
314	authentik_providers_proxy	0004_auto_20200913_1947	2025-11-21 13:51:40.746337+00
315	authentik_providers_proxy	0005_auto_20200914_1536	2025-11-21 13:51:40.747366+00
316	authentik_providers_proxy	0006_proxyprovider_skip_path_regex	2025-11-21 13:51:40.748387+00
317	authentik_providers_proxy	0007_auto_20200923_1017	2025-11-21 13:51:40.749133+00
318	authentik_providers_proxy	0008_auto_20200930_0810	2025-11-21 13:51:40.749742+00
319	authentik_providers_proxy	0009_auto_20201007_1721	2025-11-21 13:51:40.750556+00
320	authentik_providers_proxy	0010_auto_20201214_0942	2025-11-21 13:51:40.751601+00
321	authentik_providers_proxy	0011_proxyprovider_forward_auth_mode	2025-11-21 13:51:40.752218+00
322	authentik_providers_proxy	0012_proxyprovider_cookie_domain	2025-11-21 13:51:40.752896+00
323	authentik_providers_proxy	0013_mode	2025-11-21 13:51:40.754243+00
324	authentik_providers_proxy	0014_proxy_v2	2025-11-21 13:51:40.755599+00
325	authentik_providers_proxy	0015_proxyprovider_receive_header_auth	2025-11-21 13:51:40.773997+00
326	authentik_providers_rac	0001_initial	2025-11-21 13:51:41.062972+00
327	authentik_providers_rac	0002_endpoint_maximum_connections	2025-11-21 13:51:41.064494+00
328	authentik_providers_rac	0003_alter_connectiontoken_options_and_more	2025-11-21 13:51:41.065299+00
329	authentik_providers_rac	0004_alter_connectiontoken_expires	2025-11-21 13:51:41.081071+00
330	authentik_providers_rac	0005_alter_racpropertymapping_options	2025-11-21 13:51:41.094043+00
331	authentik_providers_radius	0001_initial	2025-11-21 13:51:41.164342+00
332	authentik_providers_radius	0002_radiusprovider_mfa_support	2025-11-21 13:51:41.181486+00
333	authentik_providers_radius	0003_radiusproviderpropertymapping	2025-11-21 13:51:41.246567+00
334	authentik_providers_radius	0004_alter_radiusproviderpropertymapping_options	2025-11-21 13:51:41.260634+00
335	authentik_providers_saml	0007_samlprovider_verification_kp	2025-11-21 13:51:41.390385+00
336	authentik_providers_saml	0008_auto_20201112_1036	2025-11-21 13:51:41.71084+00
337	authentik_providers_saml	0009_auto_20201112_2016	2025-11-21 13:51:41.741876+00
338	authentik_providers_saml	0010_auto_20201230_2112	2025-11-21 13:51:41.76002+00
339	authentik_providers_saml	0011_samlprovider_name_id_mapping	2025-11-21 13:51:41.810521+00
340	authentik_providers_saml	0012_managed	2025-11-21 13:51:41.858327+00
341	authentik_providers_saml	0013_samlprovider_default_relay_state	2025-11-21 13:51:41.879755+00
342	authentik_providers_saml	0014_alter_samlprovider_digest_algorithm_and_more	2025-11-21 13:51:41.940048+00
343	authentik_providers_saml	0015_alter_samlpropertymapping_options	2025-11-21 13:51:41.977902+00
344	authentik_providers_saml	0016_samlprovider_encryption_kp_and_more	2025-11-21 13:51:42.078694+00
345	authentik_providers_scim	0007_scimgroup_scim_id_scimuser_scim_id_and_more	2025-11-21 13:51:42.512594+00
346	authentik_providers_scim	0008_rename_scimgroup_scimprovidergroup_and_more	2025-11-21 13:51:42.66124+00
347	authentik_providers_scim	0009_alter_scimmapping_options	2025-11-21 13:51:42.673102+00
348	authentik_providers_scim	0010_scimprovider_verify_certificates	2025-11-21 13:51:42.701775+00
349	authentik_rbac	0004_alter_systempermission_options	2025-11-21 13:51:42.705929+00
350	authentik_sources_kerberos	0001_initial	2025-11-21 13:51:43.598744+00
351	authentik_sources_ldap	0006_rename_ldappropertymapping_ldapsourcepropertymapping_and_more	2025-11-21 13:51:43.699191+00
352	authentik_sources_oauth	0008_groupoauthsourceconnection_and_more	2025-11-21 13:51:43.830514+00
353	authentik_sources_plex	0001_initial	2025-11-21 13:51:44.984706+00
354	authentik_sources_plex	0002_auto_20210505_1717	2025-11-21 13:51:45.132726+00
355	authentik_sources_plex	0003_alter_plexsource_plex_token	2025-11-21 13:51:45.158831+00
356	authentik_sources_plex	0004_groupplexsourceconnection_plexsourcepropertymapping_and_more	2025-11-21 13:51:46.256106+00
357	authentik_sources_saml	0001_initial	2025-11-21 13:51:46.437206+00
358	authentik_sources_saml	0002_auto_20200523_2329	2025-11-21 13:51:46.43985+00
359	authentik_sources_saml	0003_auto_20200624_1957	2025-11-21 13:51:46.442949+00
360	authentik_sources_saml	0004_auto_20200708_1207	2025-11-21 13:51:46.444033+00
361	authentik_sources_saml	0005_samlsource_name_id_policy	2025-11-21 13:51:46.444856+00
362	authentik_sources_saml	0006_samlsource_allow_idp_initiated	2025-11-21 13:51:46.446058+00
363	authentik_sources_saml	0007_auto_20201112_1055	2025-11-21 13:51:46.447048+00
364	authentik_sources_saml	0008_auto_20201112_2016	2025-11-21 13:51:46.447922+00
365	authentik_sources_saml	0009_auto_20210301_0949	2025-11-21 13:51:46.448695+00
366	authentik_sources_saml	0010_samlsource_pre_authentication_flow	2025-11-21 13:51:46.528682+00
367	authentik_sources_saml	0011_auto_20210324_0736	2025-11-21 13:51:46.680281+00
368	authentik_sources_saml	0012_usersamlsourceconnection	2025-11-21 13:51:46.74238+00
369	authentik_sources_saml	0013_samlsource_verification_kp_and_more	2025-11-21 13:51:47.7331+00
370	authentik_sources_saml	0014_alter_samlsource_digest_algorithm_and_more	2025-11-21 13:51:47.786027+00
371	authentik_sources_saml	0015_groupsamlsourceconnection_samlsourcepropertymapping	2025-11-21 13:51:48.04394+00
372	authentik_sources_saml	0016_samlsource_encryption_kp	2025-11-21 13:51:48.156783+00
373	authentik_sources_saml	0017_fix_x509subjectname	2025-11-21 13:51:48.260277+00
374	authentik_sources_scim	0001_initial	2025-11-21 13:51:48.535212+00
375	authentik_sources_scim	0002_scimsourcepropertymapping	2025-11-21 13:51:48.794265+00
376	authentik_stages_authenticator_duo	0001_initial	2025-11-21 13:51:48.92581+00
377	authentik_stages_authenticator_duo	0002_default_setup_flow	2025-11-21 13:51:48.92741+00
378	authentik_stages_authenticator_duo	0003_duodevice_last_t	2025-11-21 13:51:48.953391+00
379	authentik_stages_authenticator_duo	0004_authenticatorduostage_admin_integration_key_and_more	2025-11-21 13:51:48.990352+00
380	authentik_stages_authenticator_duo	0005_authenticatorduostage_friendly_name	2025-11-21 13:51:49.009164+00
381	authentik_stages_authenticator_duo	0006_duodevice_created_duodevice_last_updated_and_more	2025-11-21 13:51:49.077313+00
382	authentik_stages_authenticator_endpoint_gdtc	0001_initial	2025-11-21 13:51:49.295609+00
383	authentik_stages_authenticator_sms	0001_initial	2025-11-21 13:51:49.616076+00
384	authentik_stages_authenticator_sms	0002_authenticatorsmsstage_from_number	2025-11-21 13:51:49.616987+00
385	authentik_stages_authenticator_sms	0003_auto_20211014_0813	2025-11-21 13:51:49.617772+00
386	authentik_stages_authenticator_sms	0004_auto_20211014_0936	2025-11-21 13:51:49.618429+00
387	authentik_stages_authenticator_sms	0002_alter_authenticatorsmsstage_from_number	2025-11-21 13:51:49.631631+00
388	authentik_stages_authenticator_sms	0003_smsdevice_last_used_on	2025-11-21 13:51:49.657563+00
389	authentik_stages_authenticator_sms	0004_authenticatorsmsstage_verify_only_and_more	2025-11-21 13:51:49.702774+00
390	authentik_stages_authenticator_sms	0005_authenticatorsmsstage_mapping	2025-11-21 13:51:49.757541+00
391	authentik_stages_authenticator_sms	0006_authenticatorsmsstage_friendly_name	2025-11-21 13:51:49.774742+00
392	authentik_stages_authenticator_sms	0007_smsdevice_created_smsdevice_last_updated_and_more	2025-11-21 13:51:49.826625+00
393	authentik_stages_authenticator_static	0001_initial	2025-11-21 13:51:49.880093+00
394	authentik_stages_authenticator_static	0002_otpstaticstage_configure_flow	2025-11-21 13:51:49.934983+00
395	authentik_stages_authenticator_static	0003_default_setup_flow	2025-11-21 13:51:49.936156+00
396	authentik_stages_authenticator_static	0004_auto_20210216_0838	2025-11-21 13:51:50.025354+00
397	authentik_stages_authenticator_static	0005_default_setup_flow	2025-11-21 13:51:50.02739+00
398	authentik_stages_authenticator_static	0006_authenticatorstaticstage_friendly_name	2025-11-21 13:51:50.050004+00
399	authentik_stages_authenticator_static	0007_authenticatorstaticstage_token_length_and_more	2025-11-21 13:51:50.280291+00
400	authentik_stages_authenticator_static	0008_initial	2025-11-21 13:51:50.454523+00
401	authentik_stages_authenticator_static	0009_throttling	2025-11-21 13:51:50.562191+00
402	authentik_stages_authenticator_static	0010_staticdevice_created_staticdevice_last_updated_and_more	2025-11-21 13:51:50.621495+00
403	authentik_stages_authenticator_totp	0001_initial	2025-11-21 13:51:50.685074+00
404	authentik_stages_authenticator_totp	0002_auto_20200701_1900	2025-11-21 13:51:50.693656+00
405	authentik_stages_authenticator_totp	0003_otptimestage_configure_flow	2025-11-21 13:51:50.760062+00
406	authentik_stages_authenticator_totp	0004_default_setup_flow	2025-11-21 13:51:50.761236+00
407	authentik_stages_authenticator_totp	0005_auto_20210216_0838	2025-11-21 13:51:51.032075+00
408	authentik_stages_authenticator_totp	0006_default_setup_flow	2025-11-21 13:51:51.034102+00
409	authentik_stages_authenticator_totp	0007_authenticatortotpstage_friendly_name	2025-11-21 13:51:51.056096+00
410	authentik_stages_authenticator_totp	0008_initial	2025-11-21 13:51:51.152694+00
411	authentik_stages_authenticator_totp	0009_auto_20190420_0723	2025-11-21 13:51:51.198606+00
412	authentik_stages_authenticator_totp	0010_alter_totpdevice_key	2025-11-21 13:51:51.267928+00
413	authentik_stages_authenticator_totp	0011_totpdevice_created_totpdevice_last_updated_and_more	2025-11-21 13:51:51.336873+00
414	authentik_stages_authenticator_webauthn	0001_initial	2025-11-21 13:51:51.515177+00
415	authentik_stages_authenticator_webauthn	0002_default_setup_flow	2025-11-21 13:51:51.516711+00
416	authentik_stages_authenticator_webauthn	0003_webauthndevice_confirmed	2025-11-21 13:51:51.517631+00
417	authentik_stages_authenticator_webauthn	0004_auto_20210304_1850	2025-11-21 13:51:51.518853+00
418	authentik_stages_authenticator_webauthn	0005_authenticatewebauthnstage_user_verification	2025-11-21 13:51:51.520037+00
419	authentik_stages_authenticator_webauthn	0006_authenticatewebauthnstage_authenticator_attachment_and_more	2025-11-21 13:51:51.521557+00
420	authentik_stages_authenticator_webauthn	0007_rename_last_used_on_webauthndevice_last_t	2025-11-21 13:51:51.524009+00
421	authentik_stages_authenticator_webauthn	0008_alter_webauthndevice_credential_id	2025-11-21 13:51:51.526329+00
422	authentik_stages_authenticator_webauthn	0009_authenticatewebauthnstage_friendly_name	2025-11-21 13:51:51.527291+00
423	authentik_stages_authenticator_webauthn	0010_webauthndevicetype_authenticatorwebauthnstage_and_more	2025-11-21 13:51:51.528312+00
424	authentik_stages_authenticator_webauthn	0011_webauthndevice_aaguid	2025-11-21 13:51:51.529375+00
425	authentik_stages_authenticator_validate	0001_initial	2025-11-21 13:51:51.604395+00
426	authentik_stages_authenticator_validate	0002_auto_20210216_0838	2025-11-21 13:51:51.812926+00
427	authentik_stages_authenticator_validate	0003_authenticatorvalidatestage_device_classes	2025-11-21 13:51:51.826879+00
428	authentik_stages_authenticator_validate	0004_auto_20210301_0949	2025-11-21 13:51:51.842392+00
429	authentik_stages_authenticator_validate	0005_authenticatorvalidatestage_configuration_stage	2025-11-21 13:51:51.91514+00
430	authentik_stages_authenticator_validate	0006_auto_20210301_1757	2025-11-21 13:51:51.927947+00
431	authentik_stages_authenticator_validate	0007_auto_20210403_0927	2025-11-21 13:51:51.942996+00
432	authentik_stages_authenticator_validate	0008_alter_authenticatorvalidatestage_device_classes	2025-11-21 13:51:51.961583+00
433	authentik_stages_authenticator_validate	0009_default_stage	2025-11-21 13:51:51.96527+00
434	authentik_stages_authenticator_validate	0010_remove_authenticatorvalidatestage_configuration_stage_and_more	2025-11-21 13:51:52.216085+00
435	authentik_stages_authenticator_validate	0011_authenticatorvalidatestage_last_auth_threshold	2025-11-21 13:51:52.229111+00
436	authentik_stages_authenticator_validate	0012_authenticatorvalidatestage_webauthn_user_verification	2025-11-21 13:51:52.246196+00
437	authentik_stages_authenticator_validate	0013_authenticatorvalidatestage_webauthn_allowed_device_types	2025-11-21 13:51:52.317562+00
438	authentik_stages_authenticator_webauthn	0012_webauthndevice_created_webauthndevice_last_updated_and_more	2025-11-21 13:51:52.385823+00
439	authentik_stages_captcha	0001_initial	2025-11-21 13:51:52.592327+00
440	authentik_stages_captcha	0002_captchastage_api_url_captchastage_js_url_and_more	2025-11-21 13:51:52.642412+00
441	authentik_stages_captcha	0003_captchastage_error_on_invalid_score_and_more	2025-11-21 13:51:53.302879+00
442	authentik_stages_consent	0001_initial	2025-11-21 13:51:53.52279+00
443	authentik_stages_consent	0002_auto_20200720_0941	2025-11-21 13:51:53.692548+00
444	authentik_stages_consent	0003_auto_20200924_1403	2025-11-21 13:51:53.774375+00
445	authentik_stages_consent	0004_alter_userconsent_unique_together_and_more	2025-11-21 13:51:53.865089+00
446	authentik_stages_consent	0005_alter_consentstage_mode	2025-11-21 13:51:53.880511+00
447	authentik_stages_consent	0006_alter_userconsent_expires	2025-11-21 13:51:53.926763+00
448	authentik_stages_deny	0001_initial	2025-11-21 13:51:54.208265+00
449	authentik_stages_deny	0002_denystage_deny_message	2025-11-21 13:51:54.234584+00
450	authentik_stages_dummy	0001_initial	2025-11-21 13:51:54.318972+00
451	authentik_stages_dummy	0002_dummystage_throw_error	2025-11-21 13:51:54.335308+00
452	authentik_stages_email	0001_initial	2025-11-21 13:51:54.425991+00
453	authentik_stages_email	0002_emailstage_use_global_settings	2025-11-21 13:51:54.523239+00
454	authentik_stages_email	0003_auto_20210404_1054	2025-11-21 13:51:54.54042+00
455	authentik_stages_email	0004_emailstage_activate_user_on_success	2025-11-21 13:51:54.566166+00
456	authentik_stages_password	0001_initial	2025-11-21 13:51:54.673097+00
457	authentik_stages_password	0002_passwordstage_change_flow	2025-11-21 13:51:54.757429+00
458	authentik_stages_password	0003_passwordstage_failed_attempts_before_cancel	2025-11-21 13:51:54.781968+00
459	authentik_stages_password	0004_auto_20200925_1057	2025-11-21 13:51:55.059244+00
460	authentik_stages_password	0005_auto_20210402_2221	2025-11-21 13:51:55.080182+00
461	authentik_stages_identification	0001_initial	2025-11-21 13:51:55.153007+00
462	authentik_stages_identification	0002_auto_20200530_2204	2025-11-21 13:51:55.898811+00
463	authentik_stages_identification	0003_auto_20200615_1641	2025-11-21 13:51:55.900042+00
464	authentik_stages_identification	0004_identificationstage_case_insensitive_matching	2025-11-21 13:51:55.900674+00
465	authentik_stages_identification	0005_auto_20201003_1734	2025-11-21 13:51:55.901238+00
466	authentik_stages_identification	0006_identificationstage_show_matched_user	2025-11-21 13:51:55.901996+00
467	authentik_stages_identification	0007_remove_identificationstage_template	2025-11-21 13:51:55.902636+00
468	authentik_stages_identification	0008_alter_identificationstage_user_fields	2025-11-21 13:51:55.903563+00
469	authentik_stages_identification	0009_identificationstage_sources	2025-11-21 13:51:55.905922+00
470	authentik_stages_identification	0010_identificationstage_password_stage	2025-11-21 13:51:55.907337+00
471	authentik_stages_identification	0011_alter_identificationstage_user_fields	2025-11-21 13:51:55.908267+00
472	authentik_stages_identification	0012_identificationstage_show_source_labels	2025-11-21 13:51:55.909526+00
473	authentik_stages_identification	0013_identificationstage_passwordless_flow	2025-11-21 13:51:55.910994+00
474	authentik_stages_identification	0014_identificationstage_pretend	2025-11-21 13:51:55.959335+00
475	authentik_stages_identification	0015_identificationstage_captcha_stage	2025-11-21 13:51:56.049294+00
476	authentik_stages_invitation	0001_initial	2025-11-21 13:51:56.419504+00
477	authentik_stages_invitation	0002_auto_20201225_2143	2025-11-21 13:51:56.42065+00
478	authentik_stages_invitation	0003_auto_20201227_1210	2025-11-21 13:51:56.422858+00
479	authentik_stages_invitation	0004_invitation_single_use	2025-11-21 13:51:56.423795+00
480	authentik_stages_invitation	0005_auto_20210901_1211	2025-11-21 13:51:56.424447+00
481	authentik_stages_invitation	0006_invitation_name	2025-11-21 13:51:56.425093+00
482	authentik_stages_invitation	0007_invitation_flow	2025-11-21 13:51:56.494808+00
483	authentik_stages_invitation	0008_alter_invitation_expires	2025-11-21 13:51:56.52743+00
484	authentik_stages_password	0006_passwordchange_rename	2025-11-21 13:51:56.529517+00
485	authentik_stages_password	0007_app_password	2025-11-21 13:51:56.653133+00
486	authentik_stages_password	0008_replace_inbuilt	2025-11-21 13:51:56.747403+00
487	authentik_stages_password	0009_passwordstage_allow_show_password	2025-11-21 13:51:56.798044+00
488	authentik_stages_password	0010_alter_passwordstage_backends	2025-11-21 13:51:56.832437+00
489	authentik_stages_prompt	0008_alter_prompt_type	2025-11-21 13:51:56.899698+00
490	authentik_stages_prompt	0009_prompt_name	2025-11-21 13:51:57.191239+00
491	authentik_stages_prompt	0010_alter_prompt_placeholder_alter_prompt_type	2025-11-21 13:51:57.332917+00
492	authentik_stages_prompt	0011_prompt_initial_value_prompt_initial_value_expression_and_more	2025-11-21 13:51:57.471571+00
493	authentik_stages_source	0001_initial	2025-11-21 13:51:57.593222+00
494	authentik_stages_user_delete	0001_initial	2025-11-21 13:51:57.9338+00
495	authentik_stages_user_login	0001_initial	2025-11-21 13:51:58.64665+00
496	authentik_stages_user_login	0002_userloginstage_session_duration	2025-11-21 13:51:59.010227+00
497	authentik_stages_user_login	0003_session_duration_delta	2025-11-21 13:51:59.593875+00
498	authentik_stages_user_login	0004_userloginstage_terminate_other_sessions	2025-11-21 13:51:59.634113+00
499	authentik_stages_user_login	0005_userloginstage_remember_me_offset	2025-11-21 13:51:59.655148+00
500	authentik_stages_user_login	0006_userloginstage_geoip_binding_and_more	2025-11-21 13:51:59.71516+00
501	authentik_stages_user_logout	0001_initial	2025-11-21 13:51:59.81725+00
502	authentik_stages_user_write	0001_initial	2025-11-21 13:51:59.959614+00
503	authentik_stages_user_write	0002_auto_20200918_1653	2025-11-21 13:52:00.516526+00
504	authentik_stages_user_write	0003_userwritestage_create_users_as_inactive	2025-11-21 13:52:00.549556+00
505	authentik_stages_user_write	0004_userwritestage_create_users_group	2025-11-21 13:52:00.681643+00
506	authentik_stages_user_write	0005_userwritestage_user_path_template	2025-11-21 13:52:00.731932+00
507	authentik_stages_user_write	0006_userwritestage_can_create_users	2025-11-21 13:52:00.790327+00
508	authentik_stages_user_write	0007_remove_userwritestage_can_create_users_and_more	2025-11-21 13:52:00.976004+00
509	authentik_stages_user_write	0008_userwritestage_user_type	2025-11-21 13:52:01.014486+00
510	authentik_tenants	0003_alter_tenant_default_token_duration	2025-11-21 13:52:01.02234+00
511	sessions	0001_initial	2025-11-21 13:52:01.055345+00
512	authentik_flows	0012_auto_20200908_1542_squashed_0017_auto_20210329_1334	2025-11-21 13:52:01.065331+00
513	authentik_flows	0019_alter_flow_background_squashed_0024_alter_flow_compatibility_mode	2025-11-21 13:52:01.071176+00
514	authentik_flows	0001_squashed_0007_auto_20200703_2059	2025-11-21 13:52:01.076431+00
515	authentik_outposts	0001_squashed_0017_outpost_managed	2025-11-21 13:52:01.078895+00
516	authentik_policies_event_matcher	0001_squashed_0018_alter_eventmatcherpolicy_action	2025-11-21 13:52:01.083117+00
517	authentik_providers_ldap	0001_squashed_0005_ldapprovider_search_mode	2025-11-21 13:52:01.086224+00
518	authentik_providers_oauth2	0007_auto_20201016_1107_squashed_0017_alter_oauth2provider_token_validity	2025-11-21 13:52:01.090717+00
519	authentik_providers_proxy	0001_squashed_0014_proxy_v2	2025-11-21 13:52:01.093804+00
520	authentik_providers_saml	0001_squashed_0005_remove_samlprovider_processor_path	2025-11-21 13:52:01.095442+00
521	authentik_providers_scim	0001_squashed_0006_rename_parent_group_scimprovider_filter_group	2025-11-21 13:52:01.097108+00
522	authentik_sources_ldap	0001_squashed_0012_auto_20210812_1703	2025-11-21 13:52:01.098738+00
523	authentik_sources_saml	0001_squashed_0009_auto_20210301_0949	2025-11-21 13:52:01.1008+00
524	authentik_stages_authenticator_sms	0001_squashed_0004_auto_20211014_0936	2025-11-21 13:52:01.102733+00
525	authentik_stages_authenticator_webauthn	0001_squashed_0011_webauthndevice_aaguid	2025-11-21 13:52:01.103744+00
526	authentik_stages_identification	0002_auto_20200530_2204_squashed_0013_identificationstage_passwordless_flow	2025-11-21 13:52:01.106871+00
527	authentik_stages_invitation	0001_squashed_0006_invitation_name	2025-11-21 13:52:01.109453+00
528	authentik_brands	0001_squashed_0005_tenant_web_certificate	2025-11-21 13:52:01.112624+00
529	authentik_core	0012_auto_20201003_1737_squashed_0016_auto_20201202_2234	2025-11-21 13:52:01.118405+00
530	authentik_core	0002_auto_20200523_1133_squashed_0011_provider_name_temp	2025-11-21 13:52:01.12707+00
531	authentik_core	0018_auto_20210330_1345_squashed_0028_alter_token_intent	2025-11-21 13:52:01.131118+00
532	authentik_providers_google_workspace	0001_squashed_0002_alter_googleworkspaceprovidergroup_options_and_more	2025-11-21 13:52:01.133888+00
533	authentik_providers_rac	0001_squashed_0003_alter_connectiontoken_options_and_more	2025-11-21 13:52:01.136398+00
534	authentik_events	0001_squashed_0019_alter_notificationtransport_webhook_url	2025-11-21 13:52:01.140618+00
535	authentik_events	0004_systemtask_squashed_0005_remove_systemtask_finish_timestamp_and_more	2025-11-21 13:52:01.144475+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: game_sessions; Type: TABLE DATA; Schema: public; Owner: roleplug
--

