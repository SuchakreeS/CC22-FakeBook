import { z } from 'zod'
import bcrypt from 'bcrypt'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

const identityKey = val => emailRegex.test(val) ? 'email' : 'mobile'

export const registerSchema = z.object({
    identity: z.string().min(2, "must have more than 2 characters")
        .refine(val => (emailRegex.test(val) || mobileRegex.test(val)), "Email or Mobile phone is required"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine(input => input.password === input.confirmPassword, {
    message: "Confirm password doesn't match",
    path: ['confirmPassword']
}).transform(async data => ({
    [identityKey(data.identity)]: data.identity,
    password: await bcrypt.hash(data.password, 8),
    firstName: data.firstName,
    lastName: data.lastName,
}))

// Login Schema
export const loginSchema = z.object({
    identity: z.string().min(2, "Email or phone-number require")
        .refine(value => emailRegex.test(value) || mobileRegex.test(value), {
            message: "identity must be a valid email or mobile number"
        }),
    password: z.string().min(4, "password at least 4 characters")
}).transform(data => ({
    [identityKey(data.identity)]: data.identity,
    password: data.password
})
)
