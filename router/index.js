const Router = require('express').Router
const userController = require('../controllers/user-controller.js')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware.js')
const messageController = require('../controllers/message-controller.js')
const onlineStatusController = require('../controllers/online-status-controller.js')

router.post('/registration',
        body('login').isLength({min:4, max:21}),
        body('password').isLength({min:6, max:32}),
        userController.registrations)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.get('/refresh',userController.refresh)


router.get('/users',authMiddleware,userController.getUsers) // <<- Поле юзеров справо 
router.post('/channel-new',authMiddleware,userController.sendChannel)
router.get('/channels-get',authMiddleware,userController.getChannel)
router.get('/channels-find',authMiddleware,userController.findChannel)
router.post('/channels-update',authMiddleware,userController.upDate)

router.post('/messeges-send',authMiddleware,messageController.messageSend)//<<- Вводить сообщение из чата 
router.get('/messeges-get',authMiddleware,messageController.messageGet) // Выводить сообщения из канала


router.post('/online-status-send',authMiddleware,onlineStatusController.statusSend)
router.get('/online-status-get',authMiddleware,onlineStatusController.statusGet)

module.exports = router;