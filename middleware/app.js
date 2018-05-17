/**
 * PoC Middleware to convert and asynchronous process to a sync one.
 *
 * @author masum
 * @since May 16, 2018
 */
const Hapi = require('hapi')
const Joi = require('joi')
const rp = require('request-promise-native')
const EventEmitter = require('events')

// Set environment variables to override. Make sure the backend CPS can reach us through this host/port.
const LISTEN_HOST = process.env.HOST || 'localhost'
const LISTEN_PORT = process.env.PORT || 4000

const cpsUrl = 'http://localhost:3000/multiply'

const replyEvents = new EventEmitter()

const server = Hapi.server({
    host: LISTEN_HOST,
    port: LISTEN_PORT
})

const replyUrl = `http://${LISTEN_HOST}:${LISTEN_PORT}/process-reply`

server.route([
    {
        method: 'GET',
        path: '/multiply',
        config: {
            validate: {
                query: {
                    p: Joi.number().required()
                }
            }
        },
        handler: async function (request) {
            const p = request.query.p
            const options = {
                uri: cpsUrl,
                qs: { p, replyUrl },
                json: true
            }

            console.log(`Sending request to CPS with p: ${p}`)
            let cpsResponse
            try {
                cpsResponse = await rp(options)
            } catch (error) {
                console.log(`Error in sending request to CPS: ${error}`)
            }

            const { cid, status } = cpsResponse
            console.log(`  CPS accepted request with correlation ID: ${cid}, status: ${status}`)

            const eventPromise = new Promise(function (resolve) {
                replyEvents.once(cid, resolve)
            })

            const result = await eventPromise

            console.log(`  Sending response to client for correlation ID: ${cid}, p: ${p}, result: ${result}`)

            return { result }
        }
    },

    {
        method: 'POST',
        path: '/process-reply',
        handler: async function (request) {
            const { cid, p, result, status } = request.payload
            console.log(`  Got response from CPS for correlation ID: ${cid}, p: ${p}, result: ${result}, status: ${status}`)
            replyEvents.emit(cid, result)

            return { status: 'OK' }
        }
    }
])

const init = async () => {
    try {
        await server.start()
    } catch (error) {
        console.log(`Error in running Hapi server: ${error}`)
    }

    console.log(`[*] Middleware running on: ${server.info.uri}\n`)
}

// noinspection JSIgnoredPromiseFromCall
init()
