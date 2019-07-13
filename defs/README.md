# raml-api-defs

Contains definitions for all the Rykan APIs (public & private) in RAML format, Thrift/gRPC (private) and Protobufs

Each folder corresponds to a macroservice, with each subfolder corresponding to a microservice

NOTE: Please ensure RAML Libraries have the file extension `.library.raml`, to help with CI

## What is a macro service?
These are essentially domains/groups of microservices that server a particular function.  For example:
- Authentication (with microservices such as Session Management, User (web) Login Authentication, Api authentication, MFA stuff, etc)
- Mail (with microservices such as Mail User Agent (webmail), Mail Delivery Agent, Mail Tranfer Agent, etc)

# Full list of services (macro services with sub list of microservices)
Each macroservice has its own uber RAML file, with separate docs for each.
- API Gateway/router (`api`)
- Common (`common`)
- Authentication (`auth`)
  - Login using JSON (api) authentication (`jwt` - JSON web tokens): (`login`) (drafted)
  -  JWT revoking (`/jwt/revoke`), handled by the API Gateway (drafted)
  - MFA/2FA (`mfa`) with providers:
    - Authenticator app (`mfa-app`)
    - Via email (`mfa-email`)
    - Via SMS (`mfa-text`)
  - Rykan OAuth/SSO (Single Sign-On) (`sso`) (sign in with Rykan)
  - Security (`security`):
    - Account security, i.e. checking for unusual activity (`security-account`)
- Accounts (`accounts`)
  - Profile Management (`profile`):
    - Sign up
    - Profile edits
    - Public Profile fetching
    - Private Profile fetching
  - Device Management
  - Billing

# How it works
Each macroservice has a folder corresponding to it with these files:
- `api.raml`: The public API, exposed by the API gateway (`api` folder)
- `api-private.raml`: Private, HTTP based APIs
- `thrift` folder: Contains Apache Thrift definitions
- `proto` folder: Contains Google Protobufs definitions
