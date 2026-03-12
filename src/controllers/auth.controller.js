import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import identityKeyCheck from '../utils/identity.util.js'
import { prisma } from '../lib/prisma.js'

export async function register(req, res, next) {
    const { identity, firstName, lastName, password, confirmPassword } = req.body

    // Validation
    if (!identity.trim() || !firstName.trim() || !lastName.trim() || !password.trim() || !confirmPassword.trim()) {
        return next(createHttpError[400]('Please fill all input'))
    }
    if (confirmPassword !== password) {
        return next(createHttpError[400]('Check confirm password'))
    }

    // check idedntity is email or mobile
    const identityKey = identityKeyCheck(identity)
    console.log(identityKey)
    if (!identityKey) {
        return next(createHttpError[400]("Identity must be email or mobile phone number"))
    }

    // Find user for non-duplicate
    const foundUser = await prisma.user.findUnique({
        where: { [identityKey]: identity }
    })
    // console.log(foundUser)
    if (foundUser) {
        return next(createHttpError[409]("This user is already exists"))
    }

    // Create new user
    const newUser = {
        [identityKey] : identity,
        password : await bcrypt.hash(password, 8),
        firstName : firstName,
        lastName : lastName
    }
    const createdUser = await prisma.user.create({
        data: newUser
    })
    console.log(createdUser)

    res.json({
        message: 'Register succesful',
        user: createdUser
    })
}
export async function login(req, res, next) {
    res.json({
        msg: 'Login Controller',
        body: req.body
    })
}

export async function getMe(req, res, next) {
    res.json({ msg: 'GetMe controller' })
}
