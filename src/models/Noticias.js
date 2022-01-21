const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    titulo: String,
    imagen: String,
    categoria: String,
    conteudo: String,
    slug: String,
    autor: String,
    views: { type: Number, default: 1}
},{collection: 'post'})

postSchema.pre('save', function() {
    
        this.imagen = `http://localhost:5000/files/${this.imagen}`
    
})

// ${process.env.APP_URL}

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;