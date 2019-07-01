--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

-- Started on 2019-07-01 19:11:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2112 (class 1262 OID 24578)
-- Name: users; Type: DATABASE; Schema: -; Owner: login-server-ci
--

CREATE DATABASE users WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';


ALTER DATABASE users OWNER TO "login-server-ci";

\connect users

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2113 (class 1262 OID 24578)
-- Dependencies: 2112
-- Name: users; Type: COMMENT; Schema: -; Owner: login-server-ci
--

COMMENT ON DATABASE users IS 'Contains the username and password and UUID combos';


--
-- TOC entry 1 (class 3079 OID 12355)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2116 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 24579)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 2117 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 182 (class 1259 OID 24590)
-- Name: userlogins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE userlogins (
    username text,
    password text,
    id uuid NOT NULL
);


ALTER TABLE userlogins OWNER TO postgres;

--
-- TOC entry 2107 (class 0 OID 24590)
-- Dependencies: 182
-- Data for Name: userlogins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY userlogins (username, password, id) FROM stdin;
test_user	$2b$12$fzgBiFE.TY1yHcbypiN/aeoLVuJfZKunV/bRxQ1MdS5wy2EsoDxdW	d2c6c3cf-a8cf-4d55-9088-f2ad346fb6f4
\.


--
-- TOC entry 1992 (class 2606 OID 24597)
-- Name: primaries; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userlogins
    ADD CONSTRAINT primaries PRIMARY KEY (id);


--
-- TOC entry 2115 (class 0 OID 0)
-- Dependencies: 7
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 2118 (class 0 OID 0)
-- Dependencies: 182
-- Name: userlogins; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE userlogins FROM PUBLIC;
REVOKE ALL ON TABLE userlogins FROM postgres;
GRANT ALL ON TABLE userlogins TO postgres;
GRANT SELECT ON TABLE userlogins TO "login-server-ci";


-- Completed on 2019-07-01 19:11:36

--
-- PostgreSQL database dump complete
--

