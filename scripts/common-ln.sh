#!/bin/bash

echo Symbolically linking JWT keys...
ln common/private/jwt-rs256-private.pem login/private/jwt-rs256-private.pem
echo Private key linked
ln common/private/jwt-rs256-public.pem login/private/jwt-rs256-public.pem
ln common/private/jwt-rs256-public.pem jwt/src/main/resources/private/jwt-rs256-public.pem
echo Public key linked