import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export function encodePassword(rawPassword: string) {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePasswords(rawPassword: string, hash: string){
    return bcrypt.compareSync(rawPassword, hash);
}

export function generateToken() {
    return randomBytes(32).toString("hex");
}