const User = require('../models/User');
const Noticias = require('../models/Noticias');
const bcrypt = require('bcryptjs');


class UserCtrl{
    async store(req, res){
       const { email, password } = req.body;
       const userExist = await User.findOne({email});
       if(userExist){ return res.json({msg: 'Email já cadastrado'})}
       const newUser = await User.create({ email, password});
       return res.json({newUser})

    }

    // ======================
    
    async authetication(req, res){
        const { email, password} = req.body;
        const user = await User.findOne({email}).select('+password');
       if(!user){ return res.status(400).render('admin-login',{msg: 'Email não cadastrado!'})}

       if(!await bcrypt.compare(password, user.password)){
               return res.status(400).render('admin-login',{msg: 'Senha invalida!'})
           }
           req.session.login = user;
          res.redirect('/painel/admin')
    }
    // ======================
    async indexShow(req, res){
        const noticiasPost = await Noticias.find().sort({'_id': -1});
         res.render('admin-painel', { noticias: noticiasPost, noticiaUp:{}, msg:""});
    }
}


module.exports = new UserCtrl();

