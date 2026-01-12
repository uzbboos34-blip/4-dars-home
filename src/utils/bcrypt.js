import bcrypt from "bcrypt";


export function passHash(password) {
    return bcrypt.hash(password, 10)
}
export function passCompare(password, passHash) {
    return bcrypt.compare(password, passHash)
}

