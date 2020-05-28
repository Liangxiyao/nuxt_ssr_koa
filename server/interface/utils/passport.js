import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import UserModel from '../../dbs/models/users';

//提交数据(策略),在使用 passport.authenticate('策略', ...) 的时候，会执行策略
passport.use(new LocalStrategy(async (username, password, done) => {
  let where = {
    username
  }
  let result = await UserModel.findOne(where)
  if (result != null) {
    if (result.password === password) {
      return done(null,result)
    } else {
      return done(null,false,'密码错误')
    }
  } else {
    return done(null, false,'用户不存在')
  }
}))

//序列化 在调用 ctx.login() 时会触发
passport.serializeUser((user, done) => {
  done(null,user)
})
//反序列化,session中如果存在passport":{"user":"xxx"}时会触发
passport.deserializeUser((user, done) => {
  return done(null,user)
})


export default passport