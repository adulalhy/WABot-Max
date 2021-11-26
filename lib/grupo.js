const fs = require('fs');
const ms = require("ms");
const infoGroup = JSON.parse(fs.readFileSync('./database/json/infoGroup.json'));

// Esta função retorna um infoGroup com todos os admins de um grupo
const getAdmin = (participant) => {
  arry = [];
  for (let a of participant) {
    a.isAdmin ? arry.push(`${a.jid}`) : ''
  }
  return arry
}

// Esta função faz uma checagem sobre as informações de um grupo. Caso o grupo não tenha nenhuma informação registrada, ele retorna false
const check = async(jid) => {
    let found = false
    Object.keys(infoGroup).forEach(q => {
      if (infoGroup[q].groupId == jid)
      found = q
    })
    return found ? infoGroup[found] : false
  }
  
// Esta função altera algumas funções do grupo especificado, ex: welcome, antifake, antichat, etc..
const groupInfo = async(id, func, feacture, action) => {
  
// Aqui ele retorna as informações sobre o id especificado
  const checar = await check(id)
  if (checar) {
    checar.info[0][func] = action
      fs.writeFileSync('./database/json/infoGroup.json', JSON.stringify(infoGroup, null, 4))
  } else {
    let metadata = {
      groupId: id,
      expired: Date.now() + ms("20 days"),
      info: [feacture]
    }
    infoGroup.push(metadata)
    fs.writeFileSync('./database/json/infoGroup.json', JSON.stringify(infoGroup, null, 4))
  }
}

// Esta função diz se a função especificada está ativa ou não.
const verify = async(id, func) => {
async function found(jid) {
  let position = false
  Object.keys(infoGroup).forEach(i => {
    if (infoGroup[i].groupId == jid)
    position = i
  })
  return position ? infoGroup[position] : false
 }
 
 const grupo = await found(id)
 return grupo ? grupo.info[0][func] : false
 }
 

// Quando uma função nova for criada, não precisa adicionar o objeto dela manualmente. Estas função possibilitam automatizar isso
 
 module.exports = { check, getAdmin, groupInfo, verify }
 