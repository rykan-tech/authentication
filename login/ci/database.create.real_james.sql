-- Database: user_data

-- DROP DATABASE user_data;

CREATE DATABASE users
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

ALTER DATABASE users OWNER TO "login-server-ci";

-- SCHEMA: public

-- DROP SCHEMA public ;

CREATE SCHEMA public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO postgres;

GRANT ALL ON SCHEMA public TO PUBLIC;

-- Table: public.accounts

-- DROP TABLE public.accounts;

CREATE TABLE public.accounts
(
    username character varying(320) COLLATE pg_catalog."default" NOT NULL,
    password character(60) COLLATE pg_catalog."default" NOT NULL,
    user_id uuid NOT NULL PRIMARY KEY,
    -- email character varying(320) COLLATE pg_catalog."default" NOT NULL,
    -- recovery_email character varying(320) COLLATE pg_catalog."default",
    -- phone character varying(35) COLLATE pg_catalog."default",
    -- fullname character varying(320) COLLATE pg_catalog."default" NOT NULL,
	-- birth date NOT NULL,
    CONSTRAINT uniqueness UNIQUE (username, user_id, email)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.accounts
    OWNER to postgres;