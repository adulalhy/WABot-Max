const fs = require("fs");
const infoGroup = JSON.parse(fs.readFileSync("./database/json/infoGroup.json"))

exports.help = (p, pushname, typeUser, totalCmd, totalUser, money) => {
text = `γπ π π¦ π§ πβ·π πβ·π π’ π  π π‘ π π’ π¦γ
β΄
ββ΄ π·πππππ:γ-, /, ! , #, .γ
ββ΄πΌπππ: *${typeUser}*
ββ΄π΅πππ: ${pushname}
ββ΄ππππ πππππ: *${money}*
ββ΄πΏπ·:  _[OFF]_
ββ΄π³ππππ: _[OFF]_
ββ΄πΌππππ πΉπππππππππ: *${totalUser}*
ββ΄π¬πππππππ πͺπππππππ: *${totalCmd}*
β΄
γπ‘ π πͺβ·π π π π π§ π¨ π₯ π π¦γ
β- _*Seu contador Γ© deletado* apΓ³s 15 dias_
β- _Erro do contador *resolvido*_
β- _Comando *${p}ban-inativos* foi aprimorado_
-
β΄ββ΅ *${p}ban-inativos* _<limit>_ Β» kick ghosts
β΄ββ΅ *${p}ativos* Β» Mostra o status das funΓ§Γ΅es
β΄ββ΅ *${p}take* Β» Roubar stickers
β΄ββ΅ *${p}delete* Β» Apaga minhas mensagens
β΄
γπ π π  π π‘ π π¦ π§ π₯ π π π’ π₯γ
β΄ββ΅ *${p}grupo* Β» Open/close groups
β΄ββ΅ *${p}ephemeral* Β» Mensagem temporΓ‘ria
β΄ββ΅ *${p}add* Β» adicionar membros
β΄ββ΅ *${p}ban* Β» banir membros _[@ or quotes]_
β΄ββ΅ *${p}setname* Β» Set the groups subject
β΄ββ΅ *${p}setdesc* Β» Set the groups description
β΄ββ΅ *${p}promote* Β» Use @ or quotes
β΄ββ΅ *${p}demote* Β» Use @ or quotes
β΄ββ΅ *${p}linkgp* Β» Send the group's invite
β΄ββ΅ *${p}resetlink* Β» Reseta o link do grupo
β΄ββ΅ *${p}adivinha* Β» Diz seu SO
β΄ββ΅ *${p}cita* Β» Marca todos os membros
β΄ββ΅ *${p}aviso* Β» Call all members
β΄ ${'\u200B'.repeat(3000)}
γπ’ π‘ π π¬ β· π’ πͺ π‘ π π₯γ
β΄ββ΅ *${p}criargp* Β» Cria um grupo
β΄ββ΅ *${p}join* Β» Join using group's invite
β΄ββ΅ *${p}checar* Β» Info de usuΓ‘rios
β΄
γπ’ π§ π π π₯ π¦γ
β΄ββ΅ *${p}cmd-list* Β» Show your commands
β΄ββ΅ *${p}donate* Β» FaΓ§a uma doaΓ§Γ£o
β΄ββ΅ *${p}report* Β» _[ERRO]_
β΄ββ΅ *${p}about* 
β΄ββ΅ *${p}login* Β» _idade_
-
γ+β·π¨ π¦ π πγ
β΄
β΄ββ΅ *${p}login* Β· 66 [USED]
β΄ββ΅ *${p}menu* Β· 53 [USED]
β΄
Γβ’-β’-β’-β’-β’β? π·π ππππ β―β’-β’-β’-β’-β’Γ
  `
  return text
}

exports.info = (name, WAVersion, browser, ram, blocked, totalcmd, uptime, number) => {
  status = `γπ¦ π’ π π₯ πβ·π’β·π π’ π§γ
  -
  ββ΄ π·πππππππ: *todos*
  ββ΄ π΄ππ π΅πππ: *${name}*
  ββ΄ π½ππππΜπ πΎπππππππ: *${WAVersion}*
  ββ΄ π΅ππππππππ: *${browser}*
  ββ΄ πΉπ¨π΄: *${ram}*
  -
  β΄ββ΅ NΓΊmberBOT: *${number}*
  β΄ββ΅ Comandos bloqueados: *${blocked}*
  β΄ββ΅ Total de comandos: *${totalcmd}*
  β΄ββ΅ Tempo em *atividade*:\n*${uptime}*
  β΄
  Γβ’-β’-β’-β’-β’β? π·π ππππ β―β’-β’-β’-β’-β’Γ
  `
  return status
}