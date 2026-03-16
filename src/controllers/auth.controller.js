import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import { prisma } from '../lib/prisma.js'
import { loginSchema, registerSchema } from '../validations/schema.js'
import jwt from 'jsonwebtoken'
import { createUser, getUserBy } from '../services/user.service.js'

export async function register(req, res, next) {

    // Validation
    const data = await registerSchema.parseAsync(req.body)
    console.log('data =', data)

    // check idedntity is email or mobile
    const identityKey = data.email ? 'email' : 'mobile'

    // Find user for non-duplicate
    const foundUser = await getUserBy(identityKey, data[identityKey])
    if (foundUser) {
        return next(createHttpError[409]("This user is already exists"))
    }

    // Create new user
    const createdUser = await createUser(data)
    const userInfo = {
        id: createdUser.id,
        [identityKey]: data.identity,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName
    }

    res.json({
        message: 'Register succesful',
        user: userInfo
    })
}
export async function login(req, res, next) {
    const data = loginSchema.parse(req.body)
    const identityKey = data.email ? "email" : "mobile"
    // Find this User
    const foundUser = await prisma.user.findFirst({
        where: { [identityKey]: data[identityKey] }
    })
    if (!foundUser) {
        return next(createHttpError[401]('Invalid login 1'))
    }

    //  Check password
    let pwOk = await bcrypt.compare(data.password, foundUser.password)
    if (!pwOk) {
        return next(createHttpError[401]('Invalid login 2'))
    }
    // Create Token
    const payload = {id: foundUser.id}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '15d'
    })
    const {password, createdAt, updatedAt, ...userInfo} = foundUser
    res.json({
        message: "login Done",
        token: token,
        user: userInfo,
    })
}

export async function getMe(req, res, next) {
    // console.log('in get me', req.user)
    res.json({user: req.user})
}