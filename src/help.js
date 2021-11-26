const fs = require("fs");
const infoGroup = JSON.parse(fs.readFileSync("./database/json/infoGroup.json"))

exports.help = (p, pushname, typeUser, totalCmd, totalUser, money) => {
text = `「𝗟 𝗜 𝗦 𝗧 𝗔╷𝗗 𝗘╷𝗖 𝗢 𝗠 𝗔 𝗡 𝗗 𝗢 𝗦」
╴
⎆╴ 𝑷𝒓𝒆𝒇𝒊𝒙:「-, /, ! , #, .」
⎆╴𝑼𝒔𝒆𝒓: *${typeUser}*
⎆╴𝑵𝒂𝒎𝒆: ${pushname}
⎆╴𝒀𝒐𝒖𝒓 𝒎𝒐𝒏𝒆𝒚: *${money}*
⎆╴𝑿𝑷:  _[OFF]_
⎆╴𝑳𝒆𝒗𝒆𝒍: _[OFF]_
⎆╴𝑼𝒔𝒆𝒓𝒔 𝑹𝒆𝒈𝒊𝒔𝒕𝒓𝒂𝒅𝒐: *${totalUser}*
⎆╴𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔: *${totalCmd}*
╴
「𝗡 𝗘 𝗪╷𝗙 𝗘 𝗔 𝗖 𝗧 𝗨 𝗥 𝗘 𝗦」
⎆- _*Seu contador é deletado* após 15 dias_
⎆- _Erro do contador *resolvido*_
⎆- _Comando *${p}ban-inativos* foi aprimorado_
-
❴⎋❵ *${p}ban-inativos* _<limit>_ » kick ghosts
❴⎋❵ *${p}ativos* » Mostra o status das funções
❴⎋❵ *${p}take* » Roubar stickers
❴⎋❵ *${p}delete* » Apaga minhas mensagens
╴
「𝗔 𝗗 𝗠 𝗜 𝗡 𝗜 𝗦 𝗧 𝗥 𝗔 𝗗 𝗢 𝗥」
❴⎋❵ *${p}grupo* » Open/close groups
❴⎋❵ *${p}ephemeral* » Mensagem temporária
❴⎋❵ *${p}add* » adicionar membros
❴⎋❵ *${p}ban* » banir membros _[@ or quotes]_
❴⎋❵ *${p}setname* » Set the groups subject
❴⎋❵ *${p}setdesc* » Set the groups description
❴⎋❵ *${p}promote* » Use @ or quotes
❴⎋❵ *${p}demote* » Use @ or quotes
❴⎋❵ *${p}linkgp* » Send the group's invite
❴⎋❵ *${p}resetlink* » Reseta o link do grupo
❴⎋❵ *${p}adivinha* » Diz seu SO
❴⎋❵ *${p}cita* » Marca todos os membros
❴⎋❵ *${p}aviso* » Call all members
╴ ${'\u200B'.repeat(3000)}
「𝗢 𝗡 𝗟 𝗬 ╷ 𝗢 𝗪 𝗡 𝗘 𝗥」
❴⎋❵ *${p}criargp* » Cria um grupo
❴⎋❵ *${p}join* » Join using group's invite
❴⎋❵ *${p}checar* » Info de usuários
╴
「𝗢 𝗧 𝗛 𝗘 𝗥 𝗦」
❴⎋❵ *${p}cmd-list* » Show your commands
❴⎋❵ *${p}donate* » Faça uma doação
❴⎋❵ *${p}report* » _[ERRO]_
❴⎋❵ *${p}about* 
❴⎋❵ *${p}login* » _idade_
-
「+╷𝗨 𝗦 𝗘 𝗗」
╴
❴⎋❵ *${p}login* · 66 [USED]
❴⎋❵ *${p}menu* · 53 [USED]
╴
×•-•-•-•-•⟮ 𝙷𝚁 𝚃𝚎𝚊𝚖 ⟯•-•-•-•-•×
  `
  return text
}

exports.info = (name, WAVersion, browser, ram, blocked, totalcmd, uptime, number) => {
  status = `「𝗦 𝗢 𝗕 𝗥 𝗘╷𝗢╷𝗕 𝗢 𝗧」
  -
  ⎆╴ 𝑷𝒓𝒆𝒇𝒊𝒙𝒐𝒔: *todos*
  ⎆╴ 𝑴𝒆𝒖 𝑵𝒐𝒏𝒆: *${name}*
  ⎆╴ 𝑽𝒆𝒓𝒔𝒂̄𝒐 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑: *${WAVersion}*
  ⎆╴ 𝑵𝒂𝒗𝒆𝒈𝒂𝒅𝒐𝒓: *${browser}*
  ⎆╴ 𝑹𝑨𝑴: *${ram}*
  -
  ❴⎋❵ NúmberBOT: *${number}*
  ❴⎋❵ Comandos bloqueados: *${blocked}*
  ❴⎋❵ Total de comandos: *${totalcmd}*
  ❴⎋❵ Tempo em *atividade*:\n*${uptime}*
  ╴
  ×•-•-•-•-•⟮ 𝙷𝚁 𝚃𝚎𝚊𝚖 ⟯•-•-•-•-•×
  `
  return status
}