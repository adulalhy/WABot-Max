const {
  MessageType,
  GroupSettingChange 
} = require('@adiwajshing/baileys');

const { getAdmin, groupInfo } = require('../lib/grupo')
const { percent } = require('../lib/functions');

const ms = require("ms");
const fs = require('fs');

const infoUser = JSON.parse(fs.readFileSync('./database/json/infoUser.json'));
const counter = JSON.parse(fs.readFileSync('./database/json/counterMsg.json'))

// esta função retorna um Boolean sobre os usuários registrados
exports.checkUser = async(id) => {
    let fd = await infoUser.find(i => i.jid === id)
    return fd !== undefined ? true : false
    }

// Função pra escrever na json de acordo com as situações
exports.getInfo = async(id, comando, nick, age, date, time) => {
   async function verificar(number) {
     let position = false
     Object.keys(infoUser).forEach(async(w) => {
       if (infoUser[w].jid == id)
     position = w
     });
  return position ? infoUser[position].cmds : false
   };

   const check = await verificar(id)
   
   async function checkCMD(com) {
     let pos = false
     Object.keys(check).forEach((a) => {
       if (check[a].cmd == com)
       pos = a
     })
     return pos ? check[pos] : false
   }
   
   const verif = await checkCMD(comando)
   
   if (check && verif) {
     verif.total += 1
     fs.writeFileSync('./database/json/infoUser.json', JSON.stringify(infoUser, null, 4))
   } else if (check && !verif) {
check.push({cmd: comando, total: 1})
fs.writeFileSync('./database/json/infoUser.json', JSON.stringify(infoUser, null, 4))
   } else if (!check) {
      let info = {
        jid: id,
        nome: nick,
        idade: age,
        data: date,
        hora: time,
        expired: Date.now() + ms("10 days"),
        cmds: [
          {
            cmd: comando,
          total: 1
          }
              ]
      }
     infoUser.push(info)
    fs.writeFileSync('./database/json/infoUser.json', JSON.stringify(infoUser, null, 4))
    }
}

// Função pra contar quantos comandos foram usados
exports.totalCmd = async() => {
  let ra = []
  let total = 0
  async function count() {
    Object.keys(infoUser).forEach(async(q) => {
  let fd = await infoUser.find(i => i.jid === infoUser[q].jid)
  let r = 0
  for (let i = 0; i < fd.cmds.length; i++) {
       r += fd.cmds[i].total
              }
    ra.push(r)
              })
         }
         await count();
              for (let i = 0; i < ra.length; i++) {
                total += ra[i]
              }
          return total
}

// Função pra retornar todos os comandos usados por uma pessoa específica
exports.filtro = async(id) => {
  let filtro = await infoUser.filter(v => v.jid == id)
  let cmdUser = filtro[0].cmds
  if (!filtro) return false
  tar_ = `*_Esta é a sua lista de comandos._*\n_Estes são os comandos que *você* já usou_:${'\u200B'.repeat(2000)}`
  for (let i = 0; i < cmdUser.length; i++) {
    tar_ += `-\n⎘ _Comando_: ${cmdUser[i].cmd}\n⎆ _Total_: ${cmdUser[i].total}\n-`
  }
  tar_ += ''
  return tar_
}


/* Esta função organiza o registro de
* comandos e faz um rank total dos comandos
* mais usados
*/
exports.rankingCmd = async() => {
/* Este array vai mostrar os comandos e os
* total de vezes que foi usado, mas sem
* repetições. o comando só aparece uma vez
*/
  let newRank = [];
  
/* Este array armazena os comandos usados por
* todos os usuários. Aqui o mesmo comandos
* pode aparecer mais de uma vez
*/
  let rkc = [];
  Object.keys(infoUser).forEach(async(t) => {
    let position = await infoUser.find(v => v.jid == infoUser[t].jid)
  })
}


/* Esta função retorna um objeto, que é
* composto por 2 propriedades:
* A 1° é o nome do comando
* A 2* é a quantidade de vezes que o comando
* foi usado. Ele retorna os 5 mais usados
*/
exports.moreUsed = async() => {
  let firstArry = [];
  let secondArry = [];
  async function insert() {
  Object.keys(infoUser).forEach(async(i) => {
    let isUser = await infoUser.find(v => v.jid == infoUser[i].jid)
    for (let u = 0; u < isUser.cmds.length; u++) {
      firstArry.push(isUser.cmds[u])
    }
  })
 }
 await insert();
 async function select() {
 Object.keys(firstArry).forEach(i => {
   secondArry.push(firstArry[firstArry.length - 1])
   for (let v = 0; v < secondArry.length - 2; v++) {
     if (firstArry[i].cmd == secondArry[v].cmd) {
       secondArry[v].total += firstArry[i].total
     } else {
       secondArry.push(firstArry[i])
     }
   }
  }) 
  return secondArry
 }
 
 let tyu = await select();
 console.log(tyu)
}



/* ======= CONTADOR DE MENSAGENS =========*/
/* Esta função conta e escreve a quantidade
* mensagens enviadas em um grupo
* 2 parâmetros: o id do grupo e o 
* id da pessoa
*/
exports.counterMsg = async(groupId, jid) => {
    const checkGroup = async(id) => {
    let position = false
    Object.keys(counter).forEach(i => {
      if (counter[i].groupId == id)
      position = i
    })
    return position ? counter[position] : false
  }
  
  const found = await checkGroup(groupId)
  if (found) {
    async function found2(id) {
  let search = null;
  Object.keys(found.counter).forEach(q => {
    if (found.counter[q].jid == id)
      search = q
    })
    return search ? found.counter[search] : false
    }
    
    const isMsg = await found2(jid)
    if (isMsg) {
      isMsg.total += 1
    fs.writeFileSync('./database/json/counterMsg.json', JSON.stringify(counter, null, 4))
    } else if (!isMsg) {
      let info = { jid: jid, total: 1}
     found.counter.push(info)
    fs.writeFileSync('./database/json/counterMsg.json', JSON.stringify(counter, null, 4))
    }
} else if (!found) {
  let info = {
    groupId: groupId,
    expired: Date.now() + ms("10 days"),
    counter: [
      {
        jid: jid,
        total: 1
      }
             ]
  }
  counter.push(info)
  fs.writeFileSync('./database/json/counterMsg.json', JSON.stringify(counter, null, 4))
  }
}


/* Esta função deleta o contador de mensagens* e de comandos. Ela é usada quando o* usuário sai do grupo ou é removido 
*/
exports.deleteCounterMsgAndCmd = async(from, id) => {
  async function local(gid) {
    let ts = null
  Object.keys(counter).forEach(t => {
    if (counter[t].groupId === gid) {
      ts = t
    }
  })
  return ts ? counter[ts] : false
  }
  const delLocal = await local(from)
  if (delLocal) {
    Object.keys(delLocal.counter).forEach(u => {
      if (delLocal.counter === id) {
         console.log("Contador de mensagens do usuário: " + infoUser[i] + " foi deletado")
        delLocal.counter.splice(t, 1)
      }
    })
  }
}


/*
* função pra banir inativos do grupo
* precisa do parâmetro limit, que é a 
* quantidade de mensagens que ele se baseia
*/
exports.kickGhost = async(groupId, limit) => {
  const verify = async(id) => {
    let post = false
    Object.keys(counter).forEach(a => {
      if (counter[a].groupId == id)
      post = a
    })
    return post ? counter[post] : false
  } 
  const isGroup = await verify(groupId)
  const result = await isGroup.counter.filter(v => v.total < limit)
  return result
}

// Função pra retornar a propriedade counter de determinado grupo
exports.getCounterMsg = async(groupId) => {
  let posi = null;
  Object.keys(counter).forEach(i => {
    if (counter[i].groupId == groupId)
    posi = i
  })
  return posi ? counter[posi] : false
}


// função que remover os inativos
exports.banInativos = async(conn, groupMembers, getMembers, from, ack, isWelcome) => {
  let textAdm = "_*Admins estão dispensados da verificação*_\n"
  const allAdmins = getAdmin(groupMembers)
  const status = isWelcome ? '_*já estavam ativas, por isso ela foi desligada temporariamente*_' : '_*Já estavam desativadas, e assim continuou*_.'
  if (isWelcome === true) {
		await groupInfo(from, 'welcome', {welcome: true}, false)
  }
  async function remover() {
    await conn.groupSettingChange(from, GroupSettingChange.messageSend, true)
    for (let p = 0; p < allAdmins.length; p++) {
    textAdm += `@${allAdmins[p].split('@')[0]}\n`
     }
  await conn.sendMessage(from, textAdm, MessageType.text, {contextInfo: {mentionedJid: allAdmins}})
    for (let i = 0; i < getMembers.length; i++) {
    setTimeout( function() {
      if (getAdmin(groupMembers).includes(getMembers[i].jid)) return
    conn.groupRemove(from, [getMembers[i].jid])
                  }, i * 3000) // 3 segundos
                }
        
 await conn.groupSettingChange(from, GroupSettingChange.messageSend, false)
         }
   await remover()
   
  if (isWelcome === true) {
		await groupInfo(from, 'welcome', {welcome: true}, true)
  }
  return conn.sendMessage(from, `_${getMembers.length} membros removidos. *Isso corresponde a ${percent(groupMembers.length, getMembers.length).toFixed(2)}% do total de membros deste grupo*_\n\n_As boas vindas_ ${status}`, MessageType.text, {quoted: ack})
}