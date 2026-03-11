import 'dotenv/config'
import app from './app.js'
import shutdown from './utils/shutdown.util.js'

const PORT = process.env.PORT || 8000

app.listen(PORT, () =>
    console.log(`Server is on port : ${PORT}`))

process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // kill command or Docker stop

// Catch unhandled errors
process.on("uncaughtException", ()=>  shutdown('uncaughtException'))
process.on("unhandledRejection", ()=> shutdown('unhandledRejection'))