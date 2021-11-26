const { MessageType } = require('@adiwajshing/baileys');
const { percent } = require('../functions');


// mensagem do comando que mostra a lista de grupos
exports.groupList = async(conn, getAdmin, me) => {
  let texto = '「𝗟 𝗜 𝗦 𝗧 𝗔╷𝗗 𝗘╷𝗚 𝗥 𝗨 𝗣 𝗢 𝗦」\n-\n'
  const grps = await conn.chats.all().filter(t => t.jid.endsWith('@g.us'))
  for (let i = 0; i < grps.length; i++) {
    let groupInfo = await conn.groupMetadata(grps[i].jid)
    let opened = await conn.chats.get(grps[i].jid)
    let participants = groupInfo.participants
    let admins = await getAdmin(participants)
    let isBotAdmin = admins.includes(me.jid)
    let isAdmin = isBotAdmin ? 'Sim' : 'Não'
    let open = opened.metadata.announce ? 'Fechado' : 'Aberto'
    let edit = opened.metadata.restrict != true ? 'Todos' : 'Admins'
    texto += `⎇ *Grupo:* ${groupInfo.subject}\n⎆- *Sou admin:* ${isAdmin}\n⎋ *Quem pode editar info*: ${edit}\n❴⎋❵ *Grupo está:* ${open}\n⎘ *Total membros:* ${participants.length}\n`
    texto += '-\n\n'
   }
   return texto
}


// mensagem do rank de mensagens
exports.responseRank = (org, resulRank, conn, from) => {
  const ids = [];
  let per = 0;
  let getMsg = 0;
  let tyu = "「𝗥 𝗔 𝗡 𝗞╷𝗗 𝗘╷𝗠 𝗘 𝗡 𝗦 𝗔 𝗚 𝗘 𝗡 𝗦」" + "\n-\n"
    
  for (let y = 0; y < org.counter.length; y++) {
    getMsg += org.counter[y].total
    }
            
  for (let i = 0; i < 5; i++) {
   tyu += `⎆𝑵𝒖́𝒎𝒆𝒓𝒐: @${resulRank[i].jid.split("@")[0]}\n❴⎋❵ *Total:* ${resulRank[i].total} _mensagens_\n-\n`
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

// mensagem de comandos só para grupos
exports.grupo = () => {
  return `_Este comando está disponível *apenas em grupos 👮*_.`
}

// mensagem de comando só para o dono
exports.owner = () => {
  return '_Comando exclusivo *do proprietário*_.'
}

// mensagem de comando só para admins
exports.admin = () => {
  return `_Comando excluivo *para administradores*_`
}

// mensagem pra ligar o modo porn
exports.nsfw = () => {
  return `_Modo NSFW *precisa estar ativo primeiro*_`
}

// mensagem de erro encontrado
exports.erro = (prefix) => {
  return `_Erro, talvez o servidor tenha caído. *Você também pode reportar caso o erro persista*_. ${prefix}report _<erro>_`
}

// mensagem de boas vindas / despedida
exports.welkom = (action, id, groupName, groupId) => {
  if (action == 'add') {
  return `「𝗕 𝗘 𝗠╷𝗩 𝗜 𝗡 𝗗 𝗢」
  -
  Oie @${id.split('@')[0]} ❤
  Este é o grupo: ${groupName}
  Já tomou água hj onii-chan?
  -
  _Eis aqui algumas informações suas:_
  🐮 *Corno*: ${Math.floor(Math.random() * 100)}%
  🐦 *Gostoso(a)*: ${Math.floor(Math.random() * 100)}%
  🔥 *Safado(a)*: ${Math.floor(Math.random() * 100)}%
  🌈 *Gay*: ${Math.floor(Math.random() * 100)}%
  -
  ×•-•-•-•-•⟮ 𝙷𝚁 𝚃𝚎𝚊𝚖 ⟯•-•-•-•-•×
  `
  } else if (action == 'remove') {
    return `😢 _O @${id.split('@')[0]} saiu do grupo.\nBye Bye sua putinha 😄👍`
    
  } else if (action == 'promote') {
    return `「𝗣 𝗥 𝗢 𝗠 𝗢 𝗧 𝗘╷𝗗 𝗘 𝗧 𝗘 𝗖 𝗧 𝗔 𝗗 𝗢」
-
⎆╴ 𝑮𝒓𝒖𝒑𝒐: ${groupName}
⎆╴ 𝑶𝒘𝒏𝒆𝒓: @${groupId.split('-')[0]}
╴
❴⎋❵ *Novo admin*: @${id.split('@')[0]}
❴⎋❵ *SuperAdmin*: não
-
  ×•-•-•-•-•⟮ 𝙷𝚁 𝚃𝚎𝚊𝚖 ⟯•-•-•-•-•×
    `
  }
}

// mensagem do comando about
exports.about = () => {
  return '「 𝗔 𝗕 𝗢 𝗨 𝗧╷𝗦 𝗢 𝗕 𝗥 𝗘 」\n-\n*_Se você gostou da interface do bot, agradeça ao Crap Nause Dreams. todo o layout foi feito por ele_*\n-\n_Todo o resto (conexão, funções e comandos) foi desenvolvido por Lucas Hora_\n\n⎆╴Crap Nause: wa.me/+559185012862\n⎆╴Lucas Hora: wa.me/+5592984928452'
}