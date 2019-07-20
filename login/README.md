# Login microservice
This microservice contains the code for the login server, which handles authentication and issueing JWT refresh tokens

## Setup
Steps assume your in this directory (`cd login` from repo root).

### Database
Create a new file `database.json` in `private/` and copy the contents of `private/database.template.json` and insert the correct info.

Please note the `development` environment will be used if `NODE_ENV` is `development`; else, the `production` environment is the default one.
You can manually specify a enviroment with the `RYKAN_DB_ENV` environment variable.

Setup the postgres database by running `./sql/db_setup_dev.sh`.  This will run the sql build scripts and insert the required test user to run tests.
You'll need to set the environment variables `$POSTGRES_USER` & `$POSTGRES_DB`.
Use the script `./sql/db_setup.sh` for production.

### Encryption keys
Generate signing keys (using the RSA algortihm, specifically RS256 from the JWT RFC) with these commands:
```
openssl genrsa -out ./private/jwt-rs256-private.pem 2048
openssl rsa -in ./private/jwt-rs256-private.pem -pubout > ./private/jwt-rs256-public.pem
```

### Building
Run `yarn` to install dependencies.
Run `yarn run build` to build the typescript files.

## Testing
Run `yarn run test`.
Use `yarn run coverage` to get coverage in the `coverage` directory.

## Additonal commands
Run `yarn run nodemon` to run the server with nodemon

## Additonal environment variables
`RYKAN_API_DEFS_DIR`: specify the directory to find the api defintions (default: `../defs`)

`RYKAN_LOG_SILENT` (`true` or `false` as values): silences all logging (used during tests)

### Database variables
- `RYKAN_POSTGRES_USER`: the user to use to login to the PostgreSQL database
- `RYKAN_POSTGRES_PASSWORD`: the password to use to login to the postgres database
- `RYKAN_POSTGRES_DATABASE`: database in PostgreSQL to connect to
- `RYKAN_POSTGRES_PORT`: Port to connect to the database on
- `RYKAN_POSTGRES_HOST`: Hostname/IP address of database

Please note that if all these variables (apart from `RYKAN_POSTGRES_PASSWORD`, which will default to blank) are specified,
the environment variables will be used by default, overriding the configuration files entirely.
However, if not all the variables are set, only the set environment variables will override what is in the config (i.e. rest of the config is still used).