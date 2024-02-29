const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
class UserController{
    async registrations(req,res,next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {login,password} = req.body;
            const userData = await userService.registration(login,password)
            res.cookie('refreshToken',userData.refreshToken,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true })
            // Если буду использовать https нужно добавить флаг секьюр выше
            return res.json(userData)
        }catch(e){
            next(e)
            console.log('Возможно нужно указать флаг если используете httpS')
        }
    }
    async login(req,res,next){
        try{
            const{login,password} = req.body;
            const userData = await userService.login(login,password)
            res.cookie('refreshToken',userData.refreshToken,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true })
            // Если буду использовать https нужно добавить флаг секьюр выше
            return res.json(userData)
        }catch(e){
            next(e)
        }
    }
    async logout(req,res,next){
        try{
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        }catch(e){
            next(e)
        }
    }
    async refresh(req,res,next){
        try{
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken',userData.refreshToken,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true })
            // Если буду использовать https нужно добавить флаг секьюр выше
            return res.json(userData)
        }catch(e){
            next(e)
        }
    }
    async getUsers(req,res,next){
        try{
            const id = req.headers.id
            const users = await userService.getAllUsers(id)
            const only_users = users.map(user => user.users)
            return res.json( only_users)
        }catch(e){
            next(e)
        }
    }
    async getChannel(req,res,next){
        try{
            const login = req.headers.login
            const channels = await userService.getAllChannels(login)
            return res.json(channels)
        }catch(e){
            next(e)
        }
    }
    async findChannel(req,res,next){
        try{
            const title = req.headers.title
            const channels = await userService.findAllChannels(title)
            return res.json(channels)
        }catch(e){
            next(e)
        }
    }
    async upDate(req,res,next){
        try{
            const {login,id} = req.body
           
            const result = await userService.upDateUsers(login,id)
            return res.json(result)
        }catch(e){
            next(e)
        }
    }
    async sendChannel(req,res,next){
        try{
            const {title,users} = req.body
            const channels = await userService.sendChannel(title,users)
            
            return res.json(channels)
        }catch(e){
            next(e)
        }
    }
}

module.exports = new UserController()