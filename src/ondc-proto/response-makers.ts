// ...
// handy functions to build ONDC response objects
// ...

export const makeAck = (ack = true, contextError?: {code: string, path: string, message: string}) => {
    const res: Partial<{message: any, error: any}> = {
        "message": {
            "ack": {
                "status": (contextError || !ack) ? "NACK" : "ACK"
            }
        },
    }
    if (contextError !== undefined) {
        res['error'] = {
            "type": "CONTEXT-ERROR",
            ...contextError
        }
    }
    return res;
}
