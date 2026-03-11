export async function register(req, res, next) {
    res.send('Register Controller')
}
export async function login(req, res, next) {
    res.json({
        msg: 'Login Controller',
        body: req.body
    })
}

export async function getMe (req, res, next) {
    res.json({ msg: 'GetMe controller' })
}
