# PoC for Middleware

This is a PoC for a middleware that turns an asynchronous process into a synchronous one. It accepts a request with a
parameter, sends it to the backend, waits for the reply, then sends back the reply
to the client.

The crucial part in this is waiting without blocking any thread, process or taking any
significant memory.

## Install
```sh
npm install
```

## Run
If the backend CPS is on the same machine, just run it like this:

```sh
node app.js
```

## Usage

Send an HTTP request like this:

```sh
curl http://localhost:4000/multiply?p=23
```

You should receive a response after a while like this:

```json
{"result":46}
```

## How it works

This PoC uses node's event mechanism effectively to wait for the reply. The event system in node is designed to be fast,
as much of the communication in node happens using this system. This is the sequence that goes on:

1. Receive request from client
1. Transform the request if needed, then send to backend (CPS). Backend replies with correlation ID.
1. Register a listener for an event with the correlation ID as the channel. We use the `.once` method of event emitter
so the listener is unregistered automatically as soon as the event is received.
1. Wait on the event. No process/thread is blocked.
1. The listener is activated when the event is received, and we send the reply back to the client.

A separate endpoint receives the reply back from the backend, and emits an event using the correlation ID as
its channel.

## Scaling

Just in the present form, this middleware should be able to handle a few hundred requests per second.

But as it is a single node process, it will only use a single CPU in the machine. If you want to use more CPUs, just
run more instances of this process. Each process should be run on a different port (if you run on the same machine).
Here is an example that runs 2 processes on the same machine:

1. Open two terminal windows.
2. On the first one, run this:
```sh
$ PORT=4000 node app.js
```
3. On the second one, run this:
```sh
$ PORT=4001 node app.js
```

### Multiple instances

How will multiple instances work? Simple, we are sending the `replyUrl` to the backend. The backend will send
the reply request to that URL, which is the URL of the instance that sent the request.

## No need for Redis or other queues

This solution is minimal and beautiful as it does not even need Redis or any other form of queues. Node itself is
replacing the queue.
