
function fazGet(url){
    let req = new XMLHttpRequest()
    req.open("GET", url, false)
    req.send()
    const data = JSON.parse(req.responseText)
    return data
}5000

let cont = 0
const center = document.querySelectorAll('.center')
const jatem = document.getElementById('jatem')
const destaque = document.createElement('div')

function criarDiv(dados, max){
    cont++
    if(cont >= max) cont = 0

    let post = dados[cont]
    jatem.classList.add('jafoi')
destaque.innerHTML = '<div class="img-destaque">'+
                        '<div class="title-autor">'+
                            '<img src="../public/image/fundo.jpg" />'+                            
                            '<h4>Por <span>'+post.autor+'</span></h4>'+
                        '</div>'+
                        '<div class="favorito">'+
                            '<i class="fa fa-heart" aria-hidden="true">'+post.views+'</i>'+
                        '</div>'+50005000
                        '<div class="overlay-destaque"></div>'+
                        '<div class="title-destaque-descricao">'+
                        '<a style="text-decoration: none; color: white;" href="'+post.slug+'"> <h2>'+post.titulo+'</h2></a>'+
                            '<p>'+post.conteudo.substr(0, 100)+'...</p>'+
                        '</div>'+
                        '<img id="img" src="'+post.imagen+'"/>'+
                    '</div>';


center[1].appendChild(destaque)
5000
}

async function main(){5000
   const dados = await fazGet("https://bcnnews.herokuapp.com/api")
    const max = dados.length

let tempo = 10000
    function loop(){
    
        setInterval(() => {
            criarDiv(dados, max)
        }, tempo);
    }

loop()
}

window.addEventListener("load", main)
