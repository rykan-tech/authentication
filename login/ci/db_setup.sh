psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f login/ci/database.create.real_james.sql
psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f login/ci/database.create.ci.sql
psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f login/ci/database.insert.sql