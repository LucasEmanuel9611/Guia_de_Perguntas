const express = require("express");
const app = express();
const connection = require("./database/database");
const bodyParser = require("body-parser");
const Pergunta = require("./database/pergunta");
const Resposta = require("./database/Resposta")

//* database
connection
  .authenticate()
  .then(() => {
    console.log("connection sucessfull");
  })
  .catch((msgError) => {
    console.log(msgError);
  });

// Estou dizendo para o Express usar o EJS como View engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Rotas
app.get("/", (req, res) => {
    
/* minha tabela é vasculhada com findAll usando raw (dados cru) 
e order (nome do campo, ASC ou DESC), se tudo ocorrrer certo elas 
são passadas a varialvel perguntas e dadas ao front-end por meio de 
uma outra variavel pergunta*/


//raw informações essenciais
//metodo finAll: equivalente a SELECT ALL FROM "table"
    Pergunta.findAll({raw: true, order:[
      ['id','DESC']
    ]}).then(pergunta =>{
        console.log(pergunta)
        res.render("index",{
            perguntas:pergunta
        });
    })
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

//essa rota ira separar as perguntas por id especifico

/* 
usa o metodo findOne para buscar 1 campo com a condição where{primeiro o campo
do banco e depois o que procurar} a pergunta será passada para a variavel 
pergunta, no then e passada para o front por meio de outra variavel pergunta
que sera carregada se a pergunta for encontrada
*/
app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id //name do campo
  Pergunta.findOne({
    where:{id:id}
  }).then(pergunta=> {
    if(pergunta != undefined){
      /* fará busca na tabela respostas no campo perguntaId e comparar com 
      id da pergunta da página */
        
      Resposta.findAll({
          where: {perguntaId: pergunta.id},
          order:[['id','DESC']] //comando de ordenação
        }).then(respostas => {
          res.render("pergunta",{
            pergunta:pergunta,
            //respostas é um array
            respostas:respostas
            })
        })
        
    }else{
      res.redirect("/")
    }
  })
})


// ! Rotas de envio de dados
app.post("/salvarpergunta", (req, res) => {
    var titulo =req.body.titulo
    var descricao =req.body.descricao
  //metodo create salva dados na tabela
  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
      //o sucesso no cadastro da pergunta será o redirecionamento para pág inicial 
    res.redirect("/");
  });
});

/* 
vai enviar minha resposta para a tabela de respostas usando meu model
Respontas este  que representa minha tabela
*/
app.post("/responder", (req, res) =>{
  var corpo = req.body.corpo
  var perguntaId = req.body.pergunta // * (name) nome do campo
  Resposta.create({
    corpo:corpo,
    perguntaId:perguntaId
  }).then(() =>{
    res.redirect("/pergunta/"+perguntaId)
  })
})

app.listen(3000, () => {
  console.log("Tudo OK!");
});
