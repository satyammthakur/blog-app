import { validateToken } from "../services/auth.service.js";

export function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }
        try{
            const userPayload = validateToken(tokenCookieValue);
            req.user=userPayload;
        }
        catch(error) {}
        next();
    }
}