--
-- PostgreSQL database dump
--

\restrict YNHwzr1sYcVwHMniqqare2trFMJLF24mTZgy7azAattmKwazbU7E9JkxlSAP5rE

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: active_effects; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.active_effects (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    character_id character varying NOT NULL,
    applied_by character varying,
    type character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    value character varying,
    is_active boolean DEFAULT true,
    duration integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.active_effects OWNER TO roleplug;

--
-- Name: chapter_events; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.chapter_events (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    chapter_id character varying NOT NULL,
    session_id character varying NOT NULL,
    event_type character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    character_id character varying,
    user_id character varying,
    is_important boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chapter_events OWNER TO roleplug;

--
-- Name: chapters; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.chapters (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    order_index integer DEFAULT 0 NOT NULL,
    status character varying DEFAULT 'planned'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chapters OWNER TO roleplug;

--
-- Name: characters; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.characters (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying,
    session_id character varying NOT NULL,
    name character varying NOT NULL,
    occupation character varying NOT NULL,
    age integer,
    birthplace character varying,
    residence character varying,
    gender character varying,
    height character varying,
    build character varying,
    hair_color character varying,
    eye_color character varying,
    strength integer NOT NULL,
    constitution integer NOT NULL,
    size integer NOT NULL,
    dexterity integer NOT NULL,
    appearance integer NOT NULL,
    intelligence integer NOT NULL,
    power integer NOT NULL,
    education integer NOT NULL,
    luck integer NOT NULL,
    hit_points integer NOT NULL,
    max_hit_points integer NOT NULL,
    sanity integer NOT NULL,
    max_sanity integer NOT NULL,
    magic_points integer NOT NULL,
    max_magic_points integer NOT NULL,
    avatar_url character varying,
    avatar_prompt text,
    skills jsonb DEFAULT '{}'::jsonb NOT NULL,
    skills_locked boolean DEFAULT false,
    available_skill_points integer DEFAULT 0,
    notes text,
    money numeric(10,2) DEFAULT 0.00,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.characters OWNER TO roleplug;

--
-- Name: game_sessions; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.game_sessions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    code character varying(6),
    gm_id character varying NOT NULL,
    status character varying DEFAULT 'preparation'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.game_sessions OWNER TO roleplug;

--
-- Name: inventory; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.inventory (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    character_id character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    category character varying NOT NULL,
    quantity integer DEFAULT 1,
    weight integer DEFAULT 1,
    is_equipped boolean DEFAULT false,
    damage character varying,
    armor integer,
    properties jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inventory OWNER TO roleplug;

--
-- Name: narrative_entries; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.narrative_entries (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying NOT NULL,
    gm_id character varying NOT NULL,
    content text NOT NULL,
    entry_type character varying DEFAULT 'note'::character varying,
    is_ai_generated boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.narrative_entries OWNER TO roleplug;

--
-- Name: roll_history; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.roll_history (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    character_id character varying,
    session_id character varying,
    roll_type character varying NOT NULL,
    skill_name character varying,
    skill_value integer,
    dice_formula character varying NOT NULL,
    result integer NOT NULL,
    outcome character varying,
    is_gm_roll boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.roll_history OWNER TO roleplug;

--
-- Name: sanity_conditions; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.sanity_conditions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    character_id character varying NOT NULL,
    type character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    duration character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sanity_conditions OWNER TO roleplug;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO roleplug;

--
-- Name: users; Type: TABLE; Schema: public; Owner: roleplug
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    password_hash character varying,
    auth_type character varying DEFAULT 'replit'::character varying,
    is_gm boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO roleplug;

--
-- Data for Name: active_effects; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.active_effects (id, character_id, applied_by, type, name, description, value, is_active, duration, created_at) FROM stdin;
\.


--
-- Data for Name: chapter_events; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.chapter_events (id, chapter_id, session_id, event_type, title, description, metadata, character_id, user_id, is_important, created_at) FROM stdin;
\.


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.chapters (id, session_id, name, description, order_index, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.characters (id, user_id, session_id, name, occupation, age, birthplace, residence, gender, height, build, hair_color, eye_color, strength, constitution, size, dexterity, appearance, intelligence, power, education, luck, hit_points, max_hit_points, sanity, max_sanity, magic_points, max_magic_points, avatar_url, avatar_prompt, skills, skills_locked, available_skill_points, notes, money, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: game_sessions; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.game_sessions (id, name, code, gm_id, status, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.inventory (id, character_id, name, description, category, quantity, weight, is_equipped, damage, armor, properties, created_at, updated_at) FROM stdin;
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
\.


--
-- Data for Name: sanity_conditions; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.sanity_conditions (id, character_id, type, name, description, is_active, duration, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.sessions (sid, sess, expire) FROM stdin;
qXs7xIC-IkQbyMXhrYcgrJmd-HhXjGjn	{"user": {"id": "dbfd51de-3362-47c8-86f5-e3ca88eb8d3f", "email": "testcurl4@example.com", "authType": "local"}, "cookie": {"path": "/", "expires": "2026-02-01T16:42:17.773Z", "httpOnly": true, "originalMaxAge": 2592000000}}	2026-02-01 16:42:18
Ur0iUCrImDdEjqwRk33dCoQTySQlltAv	{"user": {"id": "dbfd51de-3362-47c8-86f5-e3ca88eb8d3f", "email": "testcurl4@example.com", "authType": "local"}, "cookie": {"path": "/", "expires": "2026-02-01T16:42:25.084Z", "httpOnly": true, "originalMaxAge": 2592000000}}	2026-02-01 16:42:35
Vw7syBuYBlq2zliLRqObzgvUHpYtf_Jn	{"user": {"id": "d09e0db2-b0c6-42dd-9ecd-97a547cc27df", "email": "test-direct@example.com", "authType": "local"}, "cookie": {"path": "/", "expires": "2026-02-01T16:55:13.152Z", "httpOnly": true, "originalMaxAge": 2592000000}}	2026-02-01 16:55:14
82K68-QlK8zBpmkTY1eDSXwddNse4TOV	{"user": {"id": "810b2650-aa79-421d-9862-789d10578358", "email": "test-nginx@example.com", "authType": "local"}, "cookie": {"path": "/", "expires": "2026-02-01T16:55:14.281Z", "httpOnly": true, "originalMaxAge": 2592000000}}	2026-02-01 16:55:15
OHwmM-5_glF2-RA1OvNsJj3LcA1eqGk3	{"user": {"id": "1b7f8679-0f38-4b75-9412-0b7a478f709f", "email": "test1767372970689@example.com", "authType": "local"}, "cookie": {"path": "/", "expires": "2026-02-01T16:56:19.294Z", "httpOnly": true, "originalMaxAge": 2592000000}}	2026-02-01 16:56:20
tZvXDi7Q2SYoawN3oNLG_lkNQdNwRUk-	{"user": {"id": "dfe56c1e-aef1-450c-b6cd-eaeec114c7e4", "email": "test1767373109636@example.com", "authType": "local"}, "cookie": {"path": "/", "expires": "2026-02-01T16:58:40.306Z", "httpOnly": true, "originalMaxAge": 2592000000}}	2026-02-01 16:58:41
DSTBMzPTowwlMyPvI9XpDmc-jtuGQJiw	{"cookie": {"path": "/", "expires": "2026-02-01T17:00:56.489Z", "httpOnly": true, "originalMaxAge": 2592000000}, "passport": {"user": {"id": "b42b432a-01bb-4dde-a285-50b58e50224a", "email": "test1767373249626@example.com", "authType": "local"}}}	2026-02-01 17:00:57
fHPE1LWSTrPStkmkSAr3fyxSvOjiArT7	{"cookie": {"path": "/", "expires": "2026-02-01T17:01:19.430Z", "httpOnly": true, "originalMaxAge": 2592000000}, "passport": {"user": {"id": "12d61020-07fc-4eac-8561-888e230304c2", "email": "test1767373271453@example.com", "authType": "local"}}}	2026-02-01 17:01:20
HhuI4OO5C1PzkXsUBw89n6RF-RVUfX0O	{"cookie": {"path": "/", "expires": "2026-02-01T17:01:31.553Z", "httpOnly": true, "originalMaxAge": 2592000000}, "passport": {"user": {"id": "12d61020-07fc-4eac-8561-888e230304c2", "email": "test1767373271453@example.com", "authType": "local"}}}	2026-02-01 17:01:32
XCyGQyt3UtWSmJg7xb2fAJ5wRvfeMMJ6	{"cookie": {"path": "/", "expires": "2026-02-01T17:05:10.402Z", "httpOnly": true, "originalMaxAge": 2592000000}, "passport": {"user": {"id": "977bf6d3-e54a-468e-8bc1-957b46f2fb33", "email": "workflow@test.com", "authType": "local"}}}	2026-02-01 17:05:11
zkFeXpboyFhGptc9F-t0uz4hS3sg7G63	{"cookie": {"path": "/", "expires": "2026-02-01T17:02:53.399Z", "httpOnly": true, "originalMaxAge": 2592000000}, "passport": {"user": {"id": "cf140d47-cf59-4e83-b77d-cf9e3a535790", "email": "final-test-1767373372435@example.com", "authType": "local"}}}	2026-02-01 17:02:54
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: roleplug
--

COPY public.users (id, email, first_name, last_name, profile_image_url, password_hash, auth_type, is_gm, created_at, updated_at) FROM stdin;
dbfd51de-3362-47c8-86f5-e3ca88eb8d3f	testcurl4@example.com	Test	User	\N	$2b$12$rO1JgBOD.mr7RWwy0Z/gQeKpZbueza6DwtnKHXrsRlzDvs0MlZb6.	local	t	2026-01-02 16:42:17.765852	2026-01-02 16:42:17.765852
d09e0db2-b0c6-42dd-9ecd-97a547cc27df	test-direct@example.com	Test	Direct	\N	$2b$12$8DsyFQaQDgOU/.6YARU.SeDVNkh8AqUX1p85iw.uIMMbuPlOnKjha	local	t	2026-01-02 16:55:13.146597	2026-01-02 16:55:13.146597
810b2650-aa79-421d-9862-789d10578358	test-nginx@example.com	Test	Nginx	\N	$2b$12$nd2IFhBYp7hm2RjBoZkyJu64Q.Gnjn/NljNdTuQb7o/WMD0oAg/Y2	local	t	2026-01-02 16:55:14.275521	2026-01-02 16:55:14.275521
1b7f8679-0f38-4b75-9412-0b7a478f709f	test1767372970689@example.com	Test	User	\N	$2b$12$a54MoL.mI61eVocgAOqvweuGGirhZumln1u98Pnh4Wy/8TgNIIQhe	local	t	2026-01-02 16:56:19.279139	2026-01-02 16:56:19.279139
dfe56c1e-aef1-450c-b6cd-eaeec114c7e4	test1767373109636@example.com	Test	User	\N	$2b$12$DHHxZC3I.sSpEq34WzQjluf3ktmXIu1deAsWd4ZKPu82BlsbibiYm	local	t	2026-01-02 16:58:40.288042	2026-01-02 16:58:40.288042
b42b432a-01bb-4dde-a285-50b58e50224a	test1767373249626@example.com	Test	User	\N	$2b$12$X0ub/8IBM2bdCP4.ffB.yOVnY4ykyQbmw8P1Kzl/aoqSDLawzkEeu	local	t	2026-01-02 17:00:56.391447	2026-01-02 17:00:56.391447
12d61020-07fc-4eac-8561-888e230304c2	test1767373271453@example.com	Test	LoginTest	\N	$2b$12$lIXB5PoSUp82PVbIsmSvzueZRbcBMwhHaAcrvwdqB8fN8Ggg9y0ZC	local	t	2026-01-02 17:01:19.333049	2026-01-02 17:01:19.333049
cf140d47-cf59-4e83-b77d-cf9e3a535790	final-test-1767373372435@example.com	Final	Test	\N	$2b$12$x9pzA.lh2B5ioppR/5QyVO13H2xpGh8zrCrhZ3nT/F2LUm6brxX.K	local	t	2026-01-02 17:02:53.227126	2026-01-02 17:02:53.227126
977bf6d3-e54a-468e-8bc1-957b46f2fb33	workflow@test.com	Work	Flow	\N	$2b$12$Rzm6M8sgjnt0x8vE9zV8mOJ/CwwB4wXTruchcRMB0vUtYTkMCpZYC	local	t	2026-01-02 17:05:09.672488	2026-01-02 17:05:09.672488
\.


--
-- Name: active_effects active_effects_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.active_effects
    ADD CONSTRAINT active_effects_pkey PRIMARY KEY (id);


--
-- Name: chapter_events chapter_events_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.chapter_events
    ADD CONSTRAINT chapter_events_pkey PRIMARY KEY (id);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: game_sessions game_sessions_code_key; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.game_sessions
    ADD CONSTRAINT game_sessions_code_key UNIQUE (code);


--
-- Name: game_sessions game_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.game_sessions
    ADD CONSTRAINT game_sessions_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: narrative_entries narrative_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.narrative_entries
    ADD CONSTRAINT narrative_entries_pkey PRIMARY KEY (id);


--
-- Name: roll_history roll_history_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.roll_history
    ADD CONSTRAINT roll_history_pkey PRIMARY KEY (id);


--
-- Name: sanity_conditions sanity_conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.sanity_conditions
    ADD CONSTRAINT sanity_conditions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: roleplug
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: active_effects active_effects_applied_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.active_effects
    ADD CONSTRAINT active_effects_applied_by_fkey FOREIGN KEY (applied_by) REFERENCES public.users(id);


--
-- Name: active_effects active_effects_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.active_effects
    ADD CONSTRAINT active_effects_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: chapter_events chapter_events_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.chapter_events
    ADD CONSTRAINT chapter_events_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: chapter_events chapter_events_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.chapter_events
    ADD CONSTRAINT chapter_events_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: chapter_events chapter_events_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.chapter_events
    ADD CONSTRAINT chapter_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id);


--
-- Name: chapter_events chapter_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.chapter_events
    ADD CONSTRAINT chapter_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chapters chapters_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id);


--
-- Name: characters characters_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id);


--
-- Name: characters characters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: game_sessions game_sessions_gm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.game_sessions
    ADD CONSTRAINT game_sessions_gm_id_fkey FOREIGN KEY (gm_id) REFERENCES public.users(id);


--
-- Name: inventory inventory_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: narrative_entries narrative_entries_gm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.narrative_entries
    ADD CONSTRAINT narrative_entries_gm_id_fkey FOREIGN KEY (gm_id) REFERENCES public.users(id);


--
-- Name: narrative_entries narrative_entries_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.narrative_entries
    ADD CONSTRAINT narrative_entries_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id);


--
-- Name: roll_history roll_history_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.roll_history
    ADD CONSTRAINT roll_history_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: roll_history roll_history_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.roll_history
    ADD CONSTRAINT roll_history_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id);


--
-- Name: roll_history roll_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.roll_history
    ADD CONSTRAINT roll_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sanity_conditions sanity_conditions_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roleplug
--

ALTER TABLE ONLY public.sanity_conditions
    ADD CONSTRAINT sanity_conditions_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- PostgreSQL database dump complete
--

\unrestrict YNHwzr1sYcVwHMniqqare2trFMJLF24mTZgy7azAattmKwazbU7E9JkxlSAP5rE

