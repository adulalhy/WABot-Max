const chalk = require('chalk');

/* Cores do chalk hexadecimal
 ~> Verde: #32CD32
 ~> Vermelho: #FF0000
 ~> Verde Escuro: #006400
*/

function typeMsg(type) {
	let msgType = (type ==  'imageMessage') ? chalk.hex('#FF0000').bold('IMAGEM') : (type == 'videoMessage') ? chalk.hex('#FF0000').bold('VIDEO') : (type == 'conversation') ? chalk.hex('#FF0000').bold('MENSAGEM') : (type == 'audioMessage') ? chalk.hex('#FF0000').bold('AUDIO') : (type == 'stickerMessage') ? chalk.hex('#FF0000').bold('STICKER') : (type == 'extendedTextMessage') ? chalk.hex('#FF0000').bold('MARCANDO') : (type == 'documentMessage') ? chalk.hex('#FF0000').bold('DOCUMENTO') : (type == 'buttonsMessage') ? chalk.hex('#FF0000').bold('BOTÃO') : type
	return msgType
}

// Comando no grupo
const WAGroupCMD = (cmd, id, nick, groupName, data, hora) => {
  return console.log(`${chalk.bgHex('#006400').bold('[CMD]')} - ${chalk.hex('#32CD32').bold(cmd)} - de ${id.split('@')[0]} [ ${nick} ]\nEM ${groupName} | ${data} - ${hora}\n`)
}

// Comando no privado
const WANotGroupCMD = (comando, id, nick, data, hora) => {
  return console.log(`${chalk.bgHex('#006400').bold('[CMD]')} - ${chalk.hex('#32CD32').bold(comando)} - de ${id.split('@')[0]} [${nick}]\nNO PRIVADO | ${data} - ${hora}\n`)
}

// Mensagem em grupo
const WAGroupMess = (id, nick, groupName, data, hora, type) => {
  return console.log(`${chalk.bgHex("#FF0000").bold('[RECV]')} - ${typeMsg(type)} -de ${id.split('@')[0]} [${nick}]\nEM ${groupName} | ${data} - ${hora}\n`)
}

// Mensagem no privado
const NotGroupMess = (id, nick, data, hora, type) => {
  return console.log(`${chalk.bgHex("#FF0000").bold('[RECV]')} - ${typeMsg(type)} -de ${id.split('@')[0]} [${nick}]\nNO PRIVADO | ${data} - ${hora}`)
}

module.exports = {
  WAGroupCMD,
  WANotGroupCMD,
  WAGroupMess,
  NotGroupMess
}