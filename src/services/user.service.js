import { prisma } from "../lib/prisma.js";

export async function getUserBy(field, value) {
    return await prisma.user.findFirst({
        where: {[field] : value}
    })
}

export async function createUser(data) {
    return await prisma.user.create({data : data})
}

// getUserBy('firstName', 'bobby').then(console.log)