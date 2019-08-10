# Authentication
[![Maintainability](https://api.codeclimate.com/v1/badges/184a35354b09dcffa8ae/maintainability)](https://codeclimate.com/github/rykan-tech/authentication/maintainability) [![CircleCI](https://circleci.com/gh/rykan-tech/authentication.svg?style=svg)](https://circleci.com/gh/rykan-tech/authentication)

Contains the Rykan macroservice Authentication, in turn including all the microservices for authentication
Please see the API defs for more info ([https://gitlab.com/rykan/raml-api-defs](https://gitlab.com/rykan/raml-api-defs))

Please see individual microservices for their build instructions.

Running the command `yarn` in the repo root can be used to install all NodeJS dependencies for all NodeJS based microservices.

In this repo:

- `login`: Contains the login server that authenticates users and issues JWT refresh token.
- `jwt`: Contains the JSON Web Token Server that isues JWT Access Tokens, that in turn are use for authorisation in other microservices.