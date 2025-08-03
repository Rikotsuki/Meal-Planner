 const { z } = require("zod");

const loginReqDto = z.object({
   email: z.string().email("Invalid Emails!"),
   password: z.string()
})
const registerReqDto = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid Emails!"),
    password: z.string().min(6, "Password must be at least 6 characters long")  
 });
const updateUserDto=z.object({
    name:z.string().min(1,"Name is required")
})
const verfiyEmailDto= z.object({
    email:z.string().email("Invalid Emails!"),
    code:z.number().min(6).max(6),
})
const forgetPasswordDto= z.object({
    email:z.string().email("Invalid Passwords!"),
    code:z.number().min(6).max(6),
})
module.exports = {loginReqDto, registerReqDto,updateUserDto,verfiyEmailDto,forgetPasswordDto};
