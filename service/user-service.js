const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const TokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const tokenService = require('./token-service')
const ApiError = require('../exceptions/api-error')
const ChannelModel = require('../models/channel-model')


class UserService{
    async registration(login,password){
        const candidate = await UserModel.findOne({login})
        if(candidate){
            throw ApiError.BadRequest('Такой пользователь уже существует: ' + login)
        }
        const hashPassword = await bcrypt.hash(password,3)
        const user = await UserModel.create({login,password:hashPassword}) 
        
        const userDto = new UserDto(user); 
        const tokens = TokenService.generateTokens({...userDto}) // payload tyt
        
        await tokenService.saveToken(userDto.id,tokens.refreshToken)
        this.upDateUsers(login,'65be9322f7c2dc1e0b1b52eb')
        return {
            ...tokens,
            user:userDto
        }
    }

    async login(login,password){
        const user = await UserModel.findOne({login})
        if(!user){
            throw ApiError.BadRequest('Пользователя не существует: ' + login)
        }
        const isPassEquals = await bcrypt.compare(password, user.password) //Сравнение 
        if(!isPassEquals){
            throw ApiError.BadRequest('Неверный пароль...')
        }
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id,tokens.refreshToken)

        return {
            ...tokens,
            user:userDto
        }//Здесь возвращет токены и этого пользователя
    }

    async logout(refreshToken){
        const token = tokenService.removeToken(refreshToken)
        return token
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFormDB = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFormDB){
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id,tokens.refreshToken)

        return {
            ...tokens,
            user:userDto
        }
    }
    async getAllUsers(id){
        const users = await ChannelModel.find({_id:id})
        return users
    }
    async getAllChannels(login){
        const models = await ChannelModel.find()
        const result = models.filter((elem)=> elem.users.filter(el=> el == login) == login)
        return result
    }
    async findAllChannels(title){
        const models = await ChannelModel.find({title:title}) 
        return models
    }
    async upDateUsers(login,id){
        const models = await ChannelModel.updateOne({_id:id},{$push:{users:login}})
        return models 
    }
    async sendChannel(title,users){
        const new_channel = await ChannelModel.findOne({title})
        if(new_channel){
            throw ApiError.BadRequest('Такой канал уже существует: ' + title)
        }
        if(!users){
            throw ApiError.BadRequest('Пустой массив')
        }
        const post_channel = await ChannelModel.create({title,users})
        return post_channel
    }
    
}

module.exports = new UserService();