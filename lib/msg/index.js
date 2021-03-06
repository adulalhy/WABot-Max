const { MessageType } = require('@adiwajshing/baileys');
const { percent } = require('../functions');


// mensagem do comando que mostra a lista de grupos
exports.groupList = async(conn, getAdmin, me) => {
  let texto = 'γπ π π¦ π§ πβ·π πβ·π π₯ π¨ π£ π’ π¦γ\n-\n'
  const grps = await conn.chats.all().filter(t => t.jid.endsWith('@g.us'))
  for (let i = 0; i < grps.length; i++) {
    let groupInfo = await conn.groupMetadata(grps[i].jid)
    let opened = await conn.chats.get(grps[i].jid)
    let participants = groupInfo.participants
    let admins = await getAdmin(participants)
    let isBotAdmin = admins.includes(me.jid)
    let isAdmin = isBotAdmin ? 'Sim' : 'NΓ£o'
    let open = opened.metadata.announce ? 'Fechado' : 'Aberto'
    let edit = opened.metadata.restrict != true ? 'Todos' : 'Admins'
    texto += `β *Grupo:* ${groupInfo.subject}\nβ- *Sou admin:* ${isAdmin}\nβ *Quem pode editar info*: ${edit}\nβ΄ββ΅ *Grupo estΓ‘:* ${open}\nβ *Total membros:* ${participants.length}\n`
    texto += '-\n\n'
   }
   return texto
}


// mensagem do rank de mensagens
exports.responseRank = (org, resulRank, conn, from) => {
  const ids = [];
  let per = 0;
  let getMsg = 0;
  let tyu = "γπ₯ π π‘ πβ·π πβ·π  π π‘ π¦ π π π π‘ π¦γ" + "\n-\n"
    
  for (let y = 0; y < org.counter.length; y++) {
    getMsg += org.counter[y].total
    }
            
  for (let i = 0; i < 5; i++) {
   tyu += `βπ΅πΜππππ: @${resulRank[i].jid.split("@")[0]}\nβ΄ββ΅ *Total:* ${resulRank[i].total} _mensagens_\n-\n`
    per += resulRank[i].total
    ids.push(resulRank[i].jid)
 }
    tyu += `_As mensagens desses 5 membros *correspondem a ${percent(getMsg, per).toFixed(2)}% das mensagens deste grupo*_`
    
  return conn.sendMessage(from, tyu, MessageType.text, {contextInfo: {mentionedJid: ids}});
}


// mensagem de aguarde
exports.wait = () => {
  return '_Processo em andamento..._\n_*Por favor aguarde*_'
}

// mensagem de comandos sΓ³ para grupos
exports.grupo = () => {
  return `_Este comando estΓ‘ disponΓ­vel *apenas em grupos π?*_.`
}

// mensagem de comando sΓ³ para o dono
exports.owner = () => {
  return '_Comando exclusivo *do proprietΓ‘rio*_.'
}

// mensagem de comando sΓ³ para admins
exports.admin = () => {
  return `_Comando excluivo *para administradores*_`
}

// mensagem pra ligar o modo porn
exports.nsfw = () => {
  return `_Modo NSFW *precisa estar ativo primeiro*_`
}

// mensagem de erro encontrado
exports.erro = (prefix) => {
  return `_Erro, talvez o servidor tenha caΓ­do. *VocΓͺ tambΓ©m pode reportar caso o erro persista*_. ${prefix}report _<erro>_`
}

// mensagem de boas vindas / despedida
exports.welkom = (action, id, groupName, groupId) => {
  if (action == 'add') {
  return `γπ π π β·π© π π‘ π π’γ
  -
  Oie @${id.split('@')[0]} β€
  Este Γ© o grupo: ${groupName}
  JΓ‘ tomou Γ‘gua hj onii-chan?
  -
  _Eis aqui algumas informaΓ§Γ΅es suas:_
  π? *Corno*: ${Math.floor(Math.random() * 100)}%
  π¦ *Gostoso(a)*: ${Math.floor(Math.random() * 100)}%
  π₯ *Safado(a)*: ${Math.floor(Math.random() * 100)}%
  π *Gay*: ${Math.floor(Math.random() * 100)}%
  -
  Γβ’-β’-β’-β’-β’β? π·π ππππ β―β’-β’-β’-β’-β’Γ
  `
  } else if (action == 'remove') {
    return `π’ _O @${id.split('@')[0]} saiu do grupo.\nBye Bye sua putinha ππ`
    
  } else if (action == 'promote') {
    return `γπ£ π₯ π’ π  π’ π§ πβ·π π π§ π π π§ π π π’γ
-
ββ΄ π?ππππ: ${groupName}
ββ΄ πΆππππ: @${groupId.split('-')[0]}
β΄
β΄ββ΅ *Novo admin*: @${id.split('@')[0]}
β΄ββ΅ *SuperAdmin*: nΓ£o
-
  Γβ’-β’-β’-β’-β’β? π·π ππππ β―β’-β’-β’-β’-β’Γ
    `
  }
}

// mensagem do comando about
exports.about = () => {
  return 'γ π π π’ π¨ π§β·π¦ π’ π π₯ π γ\n-\n*_Se vocΓͺ gostou da interface do bot, agradeΓ§a ao Crap Nause Dreams. todo o layout foi feito por ele_*\n-\n_Todo o resto (conexΓ£o, funΓ§Γ΅es e comandos) foi desenvolvido por Lucas Hora_\n\nββ΄Crap Nause: wa.me/+559185012862\nββ΄Lucas Hora: wa.me/+5592984928452'
}