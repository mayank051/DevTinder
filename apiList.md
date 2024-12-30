# DevTinder APIS

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/:status/:userId

- POST /request/review/:status/:requestId

conection status : ignored, interested, accepted, rejected

## userRouter

- GET user/connections
- GET user/requests/received
- GET user/requests/sent
- GET user/feed
