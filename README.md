# Authentication

Contains the Rykan macroservice Authentication, in turn including all the microservices for authentication
Please see the API defs for more info ([https://gitlab.com/rykan/raml-api-defs](https://gitlab.com/rykan/raml-api-defs))

## Installation

From root: `yarn`

## Setup

Create a new file `database.json` in `login/private/` and copy the contents of `login/private/database.template.json` and insert the correct info.

Run this command in the `login` directory:
```
openssl ecparam -genkey -name prime256v1 -noout -out ./private/jwt-es256-private.pem
openssl ec -in ./private/jwt-es256-private.pem -pubout -out ./private/jwt-es256-public.pem
```
This will generate the ec256 keys to sign JWT refrsh tokens.

## Running

Run `cd login` then `yarn start`

Ensure the Installation and Setup steps have been completed.