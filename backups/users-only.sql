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
