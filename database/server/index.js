const mongodb = require('mongodb').MongoClient
const chalk = require('chalk');

senha = encodeURIComponent('OLSDH017');
const url = `mongodb+srv://mongo_max:${senha}@cluster0.rdvu5.mongodb.net/ids_grupos?retryWrites=true&w=majority`

mongodb.connect(url, async(err, connection) => {
  if (err) return console.log(err)
  const db = connection.db("ids_grupos")
  console.log('Database rodando...\n' + connection)
})
/*
//função pra escrever na collection
var perfil = (id, nome, idade) => {
  mongodb.connect(url, function(err, banco) {
  if (err) throw err;

// banco de dados
  const dbo = banco.db('ids_grupos');
  
// objetos da collection
  const obj = {
    number: id,
    pushname: nome,
    age: idade
  };
  
// nome da collection
var colecao = '2021'
  
// metodo insertOne
  dbo.collection(colecao).insertOne(obj, (e, res) => {
    if (e) throw e
    console.log('Dados adicionados ao MongoDB ;)')
     })
  });
}

//pesquisa na database
const idMongo = (id) => {
  mongodb.connect(url, async(err, banco) => {
    if (!id) return
    if (err) throw err;
    dbo = banco.db('ids_grupos');
    colecao = '2021'
 var res = await dbo.collection(colecao).find(v => v.jid == id)
 console.log(res)
 })
}

module.exports = { perfil, idMongo }
*/