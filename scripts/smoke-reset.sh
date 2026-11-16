#!/bin/bash
# Seeds 6 test users (u1..u6, session cookies tok1..tok6) and clears community data.
# FOR LOCAL/TEST DATABASES ONLY. Never run against production.
# Requires: psql reachable as below. Adjust PGHOST/PGPORT/DB to your local Postgres.
export PGHOST=${PGHOST:-/tmp} PGPORT=${PGPORT:-5433}
${PSQL:-psql -U postgres jss} -qAt -c "
delete from \"Report\"; delete from \"Block\"; delete from \"Comment\"; delete from \"Post\"; update \"User\" set \"suspendedAt\"=null;
insert into \"User\"(id,email,name,\"updatedAt\") values ('u1','t@example.com','Tester',now()),('u2','b@example.com','Blake',now()),('u3','admin@example.com','Admin',now()),('u4','c@example.com','Casey',now()),('u5','d@example.com','Dana',now()),('u6','e@example.com','Eli',now()) on conflict do nothing;
insert into \"Session\"(\"sessionToken\",\"userId\",expires,\"updatedAt\") select 'tok'||substr(id,2), id, now()+interval '1 day', now() from \"User\" where id like 'u%' on conflict do nothing;" >/dev/null
