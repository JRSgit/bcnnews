const express = require('express');
const router = express.Router();

const _ctrl = require('./controles/Noticias');
const _userCtrl = require('./controles/User');

router.get('/', _ctrl.index);
router.get('/api', _ctrl.indexAll);

router.get('/:slug', _ctrl.slug);

router.get('/login/admin', _ctrl.admin);
router.get('/logout/admin', _ctrl.logout)
router.get('/painel/admin', _userCtrl.indexShow)
router.get('/auth/admin/:id', _ctrl.update)
router.get('/delete/noticia/:id', _ctrl.delete)

router.get('/noticia/edit/:id', _ctrl.edit)

router.post('/cadastro/admin', _userCtrl.store);
router.post('/auth/admin', _userCtrl.authetication);
router.post('/post/noticia', _ctrl.store);
router.post('/post/noticia/:id', _ctrl.update)



module.exports = router;