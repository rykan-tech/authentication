psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f sql/database.create.sql
psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f sql/database.insert.dev.sql