export class InternalServerError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
    }
}

export class BedRequestError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
        this.name = "BedRequestError"
    }
}

export class NotFoundError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
        this.name = "NotFoundError"
    }
}

export class ConflicError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
        this.name = "ConflicError"
    }
}

export class ForBiddenError extends Error {
    constructor(status,message) {
        super()
        this.status = status
        this.message = message
        this.name = "ForBiddenError"
    }
}

export class Unauthorized extends Error {
    constructor(status,message) {
        super()
        this.status = status
        this.message = message
        this.name = "Unauthorized"
    }
}

