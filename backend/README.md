# PoC Backend

A stub backend to demonstrate how the middleware converts the asynchronous processing of the backend to a
synchronous one.

# Install
```sh
npm install
```

# Run
```sh
node app.js
```

# What it does

It receives a request to do some work, this demo basically takes a number and multiplies it by two. To simulate
workload delay, it just waits for a configurable time before sending the reply request. Open up `app.js` and modify
`DELAY` as needed.


