--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Boards; Type: TABLE; Schema: public; Owner: dpbe_user
--

CREATE TABLE public."Boards" (
    id character varying NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public."Boards" OWNER TO dpbe_user;

--
-- Name: Images; Type: TABLE; Schema: public; Owner: dpbe_user
--

CREATE TABLE public."Images" (
    id character varying NOT NULL,
    post_id character varying,
    path character varying NOT NULL
);


ALTER TABLE public."Images" OWNER TO dpbe_user;

--
-- Name: Posts; Type: TABLE; Schema: public; Owner: dpbe_user
--

CREATE TABLE public."Posts" (
    id character varying NOT NULL,
    thread_id character varying,
    text character varying NOT NULL,
    created_by character varying,
    reply_to_id character varying,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Posts" OWNER TO dpbe_user;

--
-- Name: Threads; Type: TABLE; Schema: public; Owner: dpbe_user
--

CREATE TABLE public."Threads" (
    id character varying NOT NULL,
    board_id character varying,
    title character varying,
    description character varying,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying
);


ALTER TABLE public."Threads" OWNER TO dpbe_user;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: dpbe_user
--

CREATE TABLE public."Users" (
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public."Users" OWNER TO dpbe_user;

--
-- Name: Boards Boards_pkey; Type: CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_pkey" PRIMARY KEY (id);


--
-- Name: Images Images_pkey; Type: CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Images"
    ADD CONSTRAINT "Images_pkey" PRIMARY KEY (id);


--
-- Name: Posts Posts_pkey; Type: CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_pkey" PRIMARY KEY (id);


--
-- Name: Threads Threads_pkey; Type: CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Threads"
    ADD CONSTRAINT "Threads_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (username);


--
-- Name: Threads fk_board; Type: FK CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Threads"
    ADD CONSTRAINT fk_board FOREIGN KEY (board_id) REFERENCES public."Boards"(id);


--
-- Name: Threads fk_created_by; Type: FK CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Threads"
    ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public."Users"(username);


--
-- Name: Posts fk_created_by_posts; Type: FK CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT fk_created_by_posts FOREIGN KEY (created_by) REFERENCES public."Users"(username);


--
-- Name: Posts fk_parent_post; Type: FK CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT fk_parent_post FOREIGN KEY (reply_to_id) REFERENCES public."Posts"(id);


--
-- Name: Images fk_post; Type: FK CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Images"
    ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES public."Posts"(id);


--
-- Name: Posts fk_thread; Type: FK CONSTRAINT; Schema: public; Owner: dpbe_user
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT fk_thread FOREIGN KEY (thread_id) REFERENCES public."Threads"(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

