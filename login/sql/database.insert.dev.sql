--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

-- Started on 2019-07-01 19:11:36

--
-- TOC entry 2107 (class 0 OID 24590)
-- Dependencies: 182
-- Data for Name: logins; Type: TABLE DATA; Schema: public; Owner: postgres
--

-- Sets up the database for development purposes

\connect users

INSERT INTO logins VALUES ('test_user@rykanmail.com', '$2b$12$fzgBiFE.TY1yHcbypiN/aeoLVuJfZKunV/bRxQ1MdS5wy2EsoDxdW', '969ee333-62d8-45bf-9f4c-82e55e5050a3');