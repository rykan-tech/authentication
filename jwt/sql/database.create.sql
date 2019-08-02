-- Database: auth_jwt

-- DROP DATABASE auth_jwt;

CREATE DATABASE auth_jwt
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE users IS 'Contains UUIDs and their associated permissions when issuing JWTs for them';

\connect auth_jwt

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

CREATE USER "auth-jwt-server" WITH
    PASSWORD 'auth-jwt-server-please-change';
GRANT "server-access" TO "auth-jwt-server";

COMMENT ON ROLE "auth-jwt-server" IS 'Used to allow JWT server (of auth macroservice) access';

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

CREATE TABLE jwt_users
(
    user_id uuid NOT NULL PRIMARY KEY,

    subscription character varying(320)
    CONSTRAINT subscription_type_constraint
    CHECK (
        subscription = 'starter'
        OR subscription = 'basic'
        OR subscription = 'standard'
        OR subscription = 'ultimate'
    )
    DEFAULT 'starter',

    permissions jsonb
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- GRANT perms
GRANT SELECT ON TABLE jwt_users TO "auth-jwt-server";
GRANT INSERT ON TABLE jwt_users TO "auth-jwt-server";
GRANT DELETE ON TABLE jwt_users TO "auth-jwt-server";

-- ALTER TABLE jwt_users
	-- OWNER to postgres;