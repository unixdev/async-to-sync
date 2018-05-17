/**
 * PoC backend to demonstrate conversion from asynchronous to synchronous process.
 *
 * Receives a work request, just waits for `DELAY` seconds and sends a reply.
 *
 * @author masum
 * @since May 16, 2018
 */
const express = require('express')
const rp = require('request-promise-native')

const DELAY = 5 * 1000							// ms

const app = express()

let correlationId = 0

app.get('/multiply', function (req, res) {
    const cid = ++correlationId		// copy the global value
    const p = req.query.p
    const replyUrl = req.query.replyUrl

    if (!p || !replyUrl) {
        res.status(400).send({
            message: 'Required parameters p or replyUrl is missing',
            status: 'error'
        })
        return
    }

    console.log(`Accepted request, correlation ID: ${cid}, p: ${p}`)
    res.send({cid, p, status: 'accepted'})

    setTimeout(function () {
        console.log(`  Sending reply for correlation ID: ${cid} to ${replyUrl}`)
        const options = {
            uri: replyUrl,
            method: 'POST',
            body: {cid, p, result: p * 2, status: 'replied'},
            json: true
        }

        rp(options)
            .then(function () {
                console.log(`  Sent reply for correlation ID: ${cid}`)
            })
            .catch(function (error) {
                console.log(`  Error in sending reply for correlation ID: ${cid}, error: ${error}`)
            })
    }, DELAY)
})

app.listen(3000, () => console.log('[*] Demo backend listening on port 3000\n'))
