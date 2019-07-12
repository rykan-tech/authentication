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

COMMENT ON DATABASE users IS 'Contains the username and password and UUID combos';

\connect users

-- Create roles
CREATE ROLE "server-access" WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1;
COMMENT ON ROLE "server-access" IS 'Used to allow servers to access the database';

-- User: "server-access"
-- DROP USER "server-access";

-- PLEASE CHNAGE THE PASSWORD

CREATE USER "login-server" WITH
    PASSWORD 'login-server-please-change';
GRANT "server-access" TO "login-server";

COMMENT ON ROLE "login-server" IS 'Used to allow login server access';

-- SCHEMA: public

-- DROP SCHEMA public ;

CREATE SCHEMA public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO postgres;

GRANT ALL ON SCHEMA public TO PUBLIC;

-- Table: public.logins

-- DROP TABLE public.logins;

CREATE TABLE logins
(
    username character varying(320) COLLATE pg_catalog."default" NOT NULL,
    password character(60) COLLATE pg_catalog."default" NOT NULL,
    user_id uuid NOT NULL PRIMARY KEY,
    -- email character varying(320) COLLATE pg_catalog."default" NOT NULL,
    -- recovery_email character varying(320) COLLATE pg_catalog."default",
    -- phone character varying(35) COLLATE pg_catalog."default",
    -- fullname character varying(320) COLLATE pg_catalog."default" NOT NULL,
	-- birth date NOT NULL,
    CONSTRAINT uniqueness UNIQUE (username, user_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- GRANT perms
GRANT SELECT ON TABLE logins TO "login-server";

-- ALTER TABLE logins
	-- OWNER to postgres;