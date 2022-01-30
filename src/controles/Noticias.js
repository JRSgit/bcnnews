const Posts = require('../models/Noticias')
const fs = require('fs')


class CtrlNoticias {
    async index(req, res) {
        const { busca } = req.query;
        if (busca == null) {
            await Posts.find({}).sort({ '_id': -1 }).exec((err, posts) => {
                posts = posts.map((val) => {
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta: val.conteudo.substr(0, 100),
                        imagen: val.imagen,
                        slug: val.slug,
                        categoria: val.categoria,
                        autor: val.autor,
                        views: val.views
                    }
                })

                Posts.find({}).sort({ 'views': -1 }).limit(3).exec((err, postsTop) => {
                    postsTop = postsTop.map((val) => {
                        return {
                            titulo: val.titulo,
                            conteudo: val.conteudo,
                            descricaoCurta: val.conteudo.substr(0, 100),
                            imagen: val.imagen,
                            slug: val.slug,
                            categoria: val.categoria,
                            autor: val.autor,
                            views: val.views
                        }
                    })

                    res.render('home', { post: posts, postTop: postsTop });
                })

            });

        } else {
            const { busca } = req.query;
            Posts.find({ titulo: { $regex: busca, $options: "i" } }, (err, result) => {

                res.render('busca', { post: result, contagem: result.length });
            })

        }

    }


    async slug(req, res) {
            const { slug } = req.params;

            await Posts.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }, (err, result) => {
                if (result != null) {
                    Posts.find({}).sort({ 'views': -1 }).limit(3).exec((err, postsTop) => {
                        postsTop = postsTop.map((val) => {
                            return {
                                titulo: val.titulo,
                                conteudo: val.conteudo,
                                descricaoCurta: val.conteudo.substr(0, 100),
                                imagen: val.imagen,
                                slug: val.slug,
                                categoria: val.categoria,
                                autor: val.autor,
                                views: val.views
                            }
                        })

                        res.render('noticias', { noticia: result, postTop: postsTop });
                    })
                } else {
                    res.redirect('/');
                }

            })

        }
        //= ==================== 
    async admin(req, res) {
            if (req.session.login == null) {
                res.render('admin-login', { msg: "Usúario Deslogado" })
            } else {
                return res.render('admin-painel', { userLog: req.session.login })
            }

        }
        //  =====================

    async logout(req, res) {
            req.session.login = null;
            return res.render('admin-login', { msg: "Usúario Deslogado" })
        }
        // ==================
    async update(req, res) {
            // res.render('admin-painel', { noticiaUp: upNoticia, noticias: allNoticia, userLog: {}, msg: "" });

            const imagen = req.files.imagen
            const upPost = req.body;
            const { id } = req.params;
            if (!imagen) {
                if (!id) {
                    return res.status(400).redirect('/login/admin')
                }
                // const allNoticia = await Posts.find();
                const upNoticia = await Posts.findByIdAndUpdate({ _id: id }, upPost);
                return res.status(200).redirect('/painel/admin');

                // return res.status(401).render('admin-painel', {
                //     noticiaUp: upNoticia, noticias: allNoticia, userLog: {}, msg: "Adicione uma imagen a notícia"
                // });
            }
            let formato = imagen.name.split('.');
            var imagem = "";
            const ext = imagen.mimetype.split('/')

            if (
                formato[formato.length - 1] == "jpg" ||
                formato[formato.length - 1] == "png"
            ) {
                imagem = new Date().getTime() + `.${ext[1]}`;
                await req.files.imagen.mv(__dirname + '/public/imagens/' + imagem)
            } else {
                fs.unlinkSync(req.files.imagen.tempFilePath);
            }

            upPost.imagen = imagem;
            // const allNoticia = await Posts.find();
            await Posts.findByIdAndUpdate({ _id: id }, upPost);
            return res.status(200).redirect('/painel/admin');

            // const newNoticia = req.body;
            // newNoticia.imagen = imagem;

        }
        // ========================
    async edit(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).redirect('/login/admin')
        }
        const allNoticia = await Posts.find();
        const upNoticia = await Posts.findOne({ _id: id });
        res.render('admin-painel', { noticiaUp: upNoticia, noticias: allNoticia, userLog: {}, msg: "" });
    }


    // =========================
    async store(req, res) {

            const { imagen } = req.files
            if (!imagen) {
                return res.status(401).render('admin-painel', {
                    noticiaUp: upNoticia,
                    noticias: allNoticia,
                    userLog: {},
                    msg: "Adicione uma imagen a notícia"
                });
            }
            let formato = imagen.name.split('.');
            var imagem = "";
            const ext = imagen.mimetype.split('/')

            if (
                formato[formato.length - 1] == "jpg" ||
                formato[formato.length - 1] == "png" ||
                formato[formato.length - 1] == "webp"
            ) {
                imagem = new Date().getTime() + `.${ext[1]}`;
                await req.files.imagen.mv(__dirname + '/public/imagens/' + imagem)

            } else {
                fs.unlinkSync(req.files.imagen.tempFilePath);
            }
            const newNoticia = req.body;
            newNoticia.imagen = imagem;

            const newPost = await Posts.create(newNoticia);

            if (!newPost) {
                return res.status(401).render('admin-painel', {
                    noticiaUp: upNoticia,
                    noticias: allNoticia,
                    userLog: {},
                    msg: "Post não gravado no banco"
                });
            }

            return res.status(200).redirect('/painel/admin');

        }
        // =========================
    async delete(req, res) {
            const { id } = req.params;
            await Posts.findByIdAndDelete({ _id: id });
            return res.redirect('/painel/admin')

        }
        // =======================
    async indexAll(req, res) {
        const post = await Posts.find();
        res.json(post)
    }
}
module.exports = new CtrlNoticias();