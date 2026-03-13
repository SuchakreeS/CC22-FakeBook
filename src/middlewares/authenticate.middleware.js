import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { getUserBy } from '../services/user.service.js'

export default async function authenticate(req, res, next) {
    const authorization = req.headers.authorization
    // console.log(authorization)
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(createHttpError[401]('Unauthorized 1'))
    }
    // ดึงtoken
    //Full
    // const token = authorization.split(' ')[1]

    //Destructure
    const [_, token] = authorization.split(' ')
    // console.log(token)

    // If no token
    if (!token) {
        return next(createHttpError[401]('Unauthorized 2'))
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(payload)

    // เอา id ใน paylaod หา user
    const foundUser = await prisma.user.findUnique({
        where: { id: payload.id }
    })

    //Using Service getUserby
    // const foundedUser = getUserBy('id', payload.id)
    // console.log(foundUser)

    // rip password, createdAt, updatedAt out
    const { password, createdAt, updatedAt, ...userInfo } = foundUser
    req.user = userInfo
    // console.log(userInfo)
    next()
}