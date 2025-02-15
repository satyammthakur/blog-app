import jwt from"jsonwebtoken" ;
import 'dotenv/config';
const secret = process.env.SECRET
// console.log(secret);

export function createTokenForUser(user){
    const payload = {
        _id:user._id,
        email:user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = jwt.sign(payload , secret);
    return token;
}
export function validateToken(token){
    const payload = jwt.verify(token,secret);
    return payload;
}