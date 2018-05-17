# async-to-sync

This project is done as a proof-of-concept demonstrating the conversion of
asynchronous processing of a backend to a synchronous one.

The backend here works in an asynchronous fashion. It receives an HTTP request,
sends an immediate reply with a correlation ID and starts working on the request.
Then after the work is finished, it sends the result back to the requester using
another HTTP request.

Many backends doing heavy processing uses this type of process so that it does not
have to hold on to an HTTP request for a long time.

It's an excellent system if the client is also a server process. But if the client
is a desktop browser or mobile device, this type of processing can not work direclty
as the client can not run an HTTP server.

In this case, a middleware can help to bridge the gap.

This project is basically such a middleware.

# How it works

Please consult the [README](middleware/README.md) for details. In short, it makes
clever use of Node's event emitter system. It does not require any queue. The
middleware is horizontally scalable, infinitely.
