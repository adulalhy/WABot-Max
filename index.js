//node modules
const {
  ChatModification,
  WAConnection,
  MessageType,
  GroupSettingChange,
  WA_DEFAULT_EPHEMERAL,
  WAMessageProto
} = require('./custom_modules/@adiwajshing/baileys');

//plugins e exportações lib
//const { NewMoney, getMoney } = require('./lib/banking');

const { getInfoSound } = require('./lib/soundclound');

const { convertSticker } = require('./lib/swm');

const { check, getAdmin, groupInfo, verify } = require('./lib/grupo');

const { participants, init, kyun, isPrefix, ranking, percent } = require('./lib/functions');

const mess = require('./lib/msg');
const { insert, response } = require('./lib/simi');

const { nivel } = require('./lib/bateria');

const { checkUser, getInfo, totalCmd, filtro, counterMsg, kickGhost, rankingCmd, moreUsed, getCounterMsg, banInativos, deleteCounterMsgAndCmd } = require('./lib/contador');

const { wait, grupo, admin, nsfw, erro, welkom, about, owner, groupList, responseRank } = mess

const { WAGroupCMD, WANotGroupCMD, WAGroupMess, NotGroupMess } = require('./lib/console');

//exportações em ./src
const { help, info } = require('./src/help');

// exportações de jogos
const { ANA_check, ANA_Start, ANA_Options } = require('./games/anagrama');

// sistema de avisos para grupos
const {clientWarn} = require('./lib/avisos')
const acessWarn = new clientWarn();


//modulos npm
const fs = require('fs');
const axios = require('axios');
const yts = require('yt-search')
const ytdl = require('ytdl-core');
const chalk = require('chalk');
const { exec } = require('child_process');
const moment = require('moment-timezone');
const now = require('performance-now');
const ffmpeg = require('fluent-ffmpeg');

//declaração de arquivos json lidos como arry
const bateria = JSON.parse(fs.readFileSync('./database/json/bateria.json'));
const infoUser = JSON.parse(fs.readFileSync('./database/json/infoUser.json'));
const infoGroup = JSON.parse(fs.readFileSync('./database/json/infoGroup.json'));
const infoBot = JSON.parse(fs.readFileSync('./database/json/infoBot.json'));
const counter = JSON.parse(fs.readFileSync('./database/json/counterMsg.json'));

//Database MongoDB
const mongo = require('./database/server');

// Informações do bot
const { ownerNumber, blocked, TotalCMD, prefixos, botName } = infoBot
prefix = prefixos[0]
chr = []

// Início da parte principal da api do Whatsapp Web
async function iniciar() {
  const conn = new WAConnection();
  conn.logger.level = 'warn'
  init()
  conn.on('qr', () => {
    console.log("Escaneie o Qr Code para ter acesso a api do WhatsApp Web")
  })
  
	fs.existsSync('./auth_info.json') && conn.loadAuthInfo('./auth_info.json')
	conn.on('connecting', () => {
	  console.log(chalk.hex("#FF0000").bold('Conectando...'))
})

  conn.on('open', () => {
    console.log(chalk.hex('#32CD32').bold('Iniciado!'))
  })
  
await conn.connect({timeoutMs: 60*1000})
  fs.writeFileSync('./auth_info.json', JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))

// Evento de mudança nos metadados da bateria
conn.on('CB:action,,battery', async (json) => {
	if (bateria.length > 100) 
		bateria.splice('ta');
		fs.writeFileSync('./database/json/bateria.json', JSON.stringify(bateria))
		global.batteryLevelStr = json[2][0][1].value
		global.batterylevel = parseInt(batteryLevelStr)
		if (json[2][0][1].live == 'true') { carregando = 'sim'
		chr.push(carregando)
		}
		if (json[2][0][1].live == 'false') {
		  carregando = 'não'
		  chr.push(carregando)
		}
		console.log(chalk.hex('#32CD32').bold(`Sua bateria está em: ${global.batteryLevelStr}%`));
		bateria.push(global.batteryLevelStr);
		fs.writeFileSync('./database/json/bateria.json', JSON.stringify(bateria))
});


// Evento de novos membros/novos admins
conn.on('group-participants-update', async(info) => {
  console.log(info)
  const grupoEvent = await conn.groupMetadata(info.jid)
  const id = info.participants
  const groupName = grupoEvent.subject
  let statusWel = await verify(grupoEvent.id, 'welcome')
  if (info['action'] == 'add' && statusWel) {
    for (let i = 0; i < id.length; i++) {
  if (statusWel) return conn.sendMessage(grupoEvent.id.replace('@g.us-', '@g.us'), welkom('add', id[i], groupName), MessageType.text, {contextInfo: {mentionedJid: [id[i]]}})
   }
  } else if (info['action'] == 'remove') {
    for (let i = 0; i < id.length; i++) {
    await deleteCounterMsgAndCmd(grupoEvent.id, id[i])
  if (statusWel) return conn.sendMessage(grupoEvent.id.replace('@g.us-', '@g.us'), welkom('remove', id[i], groupName), MessageType.text, {contextInfo: {mentionedJid: [id[i]]}})
    }
  } else if (info['action'] == 'promote') {
    conn.sendMessage(grupoEvent.id.replace('@g.us-', '@g.us'), welkom('promote', id, groupName, grupoEvent.id),MessageType.text, {contextInfo: {mentionedJid: [id, grupoEvent.id.split('-')[0] + '@s.whatsapp.net']}})
  }
})


//Evento de mensagens recebidas
conn.on('chat-update', async (ack) => {
  try {
    if (!ack.hasNewMessage) return
    ack = ack.messages.all()[0];
    if (!ack.message) return
    if (ack.key && ack.key.remoteJid == 'status@broadcast') return
   ack.message = (Object.keys(ack.message)[0] === 'ephemeralMessage') ? ack.message.ephemeralMessage.message : ack.message
   const content = JSON.stringify(ack.message)
   // data e hora usando módulo
   const hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
   const data = moment.tz('America/Sao_Paulo').format('DD/MM/YY')
    //tipos de mensagens
    const { text, image, audio, document, sticker } = MessageType
    const me = conn.user
    const type = Object.keys(ack.message)[0];
    const from = ack.key.remoteJid.endsWith('@g.us-') ? ack.key.remoteJid.replace('@g.us-', '@g.us') : ack.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const allChats = await conn.chats.all();
    const allGroups = await allChats.filter(v => v.jid.endsWith('@g.us'))
    const idWa = ack.key.fromMe ? me.jid : isGroup ? ack.participant : from

    
  //contantes que retornam um valor boolenano sobre um array
   const isWelcome = await verify(from, 'welcome');
   const isAntiFake = await verify(from, 'antifake')
   const isSimi = await verify(from, 'simi');
   const isOwner = ack.key.fromMe ? me.jid : ownerNumber.includes(idWa)
   const status = (query) => { return query ? 'ATIVO ✅' : 'DESATIVADO ❌' }
   const isUser = await checkUser(idWa)
   const isAna = await ANA_check(from)
   const cmds = await totalCmd()
   
    //grupo metadados
    const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
    const groupMembers = isGroup ? groupMetadata.participants : ''
    const groupName = groupMetadata.subject
    const grupoDesc = groupMetadata.description
    const grupoAdmin = isGroup ? getAdmin(groupMembers) : ''
    const isAdminGrupo = isOwner ? true : grupoAdmin.includes(idWa) || false
    const isBotAdmin = grupoAdmin.includes(me.jid);
    
    // marcação de @
    var mencionado = isGroup && (type == 'extendedTextMessage') && ack.message.extendedTextMessage.contextInfo.mentionedJid ? ack.message.extendedTextMessage.contextInfo.mentionedJid : false
    
    // marcação de mensagem
    var marcado = isGroup && (type == 'extendedTextMessage') && ack.message.extendedTextMessage.contextInfo.participant ? ack.message.extendedTextMessage.contextInfo.participant : false
    
    // mancionado com @ ou mensagem marcada
    var men = isGroup ? mencionado[0] || marcado : false
    var typeUser = isOwner ? 'Owner' : 'noPremium'
    var charging = chr[chr.length - 1]
    var charg = charging ? charging : 'não'
    var batanu = bateria[bateria.length - 1]
    var nv = nivel(batanu)
    
		const isWANumber = async(id) => {
		  var query = await conn.isOnWhatsApp(id) || false
		  return query}
		const totalUser = infoUser.length
		const name = me.name
		const { wa_version } = conn.user.phone
		const WAVersion = wa_version
		const browser = conn.browserDescription
		const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB`
		  
		  
		//adivinha vazado
		const deviceType = ack.key.id.length > 21 ? "Android" : ack.key.id.substring(0,2) == "3A" ? "iOS" : "WhatsApp WEB"
		
		// Tipos de media
		  const isEphemeral = (type == 'extendedTextMessage' && content.includes('expiration')) ? true : false
		  const isConversation = (type == 'conversation') || (type == 'extendedTextMessage' && isEphemeral && !content.includes('quotedMessage')) ? true : false
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
  // const isUser = (idWa == mongo.idMongo(idWa)) ? true : false
  
  // Estrutura das mensagens
  var msg = /* mensagem
  */ (type == 'conversation') && prefixos.includes(ack.message.conversation[0]) ? ack.message.conversation :
    /* marcação
    */(type == 'extendedTextMessage') && prefixos.includes(ack.message.extendedTextMessage.text[0]) ? ack.message.extendedTextMessage.text :
    /* imagem
    */ (type == 'imageMessage') && prefixos.includes(ack.message.imageMessage.caption[0]) ? ack.message.imageMessage.caption :
    /* video
    */(type == 'videoMessage') && prefixos.includes(ack.message.videoMessage.caption[0]) ? ack.message.videoMessage.caption :
    /* documento
    */ (type == 'documentMessage') && prefixos.includes(ack.message.documentMessage.fileName[0]) ? ack.message.documentMessage.fileName :
    /* list response
    */ (type == 'listResponseMessage') && prefixos.includes(ack.message.listResponseMessage.singleSelectReply.selectedRowId[0]) ? ack.message.listResponseMessage.singleSelectReply.selectedRowId :
    /* botton response
    */ (type == 'buttonsResponseMessage') && prefixos.includes(ack.message.buttonsResponseMessage.selectedButtonId[0]) ? ack.message.buttonsResponseMessage.selectedButtonId :
    /* contato
    */ (type == 'contactMessage') && prefixos.includes(ack.message.contactMessage.displayName[0]) ? ack.message.contactMessage.displayName :
    /* requeste payment
    */ (type == 'requestPaymentMessage') && prefixos.includes(ack.message.requestPaymentMessage.noteMessage.extendedTextMessage.text[0]) ? ack.message.requestPaymentMessage.noteMessage.extendedTextMessage.text :
    /* location mensage
    */ (type == 'locationMessage') && prefixos.includes(ack.message.locationMessage.name[0]) ? ack.message.locationMessage.name :
    /* carrinho de paganentos
    */ (type == 'orderMessage') && prefixos.includes(ack.message.orderMessage.message[0]) ? ack.message.orderMessage.message :
    /* catalogo
    */ (type == 'productMessage') && prefixos.includes(ack.message.productMessage.product.title[0]) ? ack.message.productMessage.product.tile : ''
    
    var budy = (type == 'conversation') ? ack.message.conversation : (type == 'extendedTextMessage') ? ack.message.extendedTextMessage.text : ''
    
    //Definições de comando
  	const comando = msg.slice(1).trim().split(/ +/).shift().toLowerCase();
  	const space = msg.trim().split(/ +/).slice(1);
  	const isCmd = prefixos.includes(msg[0]) && (comando != '' || !comando.startsWith(msg[0])) ? true : false
  	//fim das definições de comando
  	
  	//pushname e outro
	const pushname = (ack.key.fromMe) ? me.name : conn.contacts[idWa] != undefined ? conn.contacts[idWa].vname || conn.contacts[idWa].notify: 'User MaxBOT'
  	
  	conn.chatRead(from)
  	//comando no grupo
  	if (isCmd && isGroup) {
  	  WAGroupCMD(comando, idWa, pushname, groupName, data, hora)
  	 const yourMoney = 0//await getMoney(idWa, 'money')
  	 //if (!isOwner && comando !== 'login' && (yourMoney <= 0 || String(yourMoney).includes('-'))) return conn.sendMessage(from, '_Você está sem dinheiro. *Converse mais no grupo para poder usar mais comandos*_',MessageType.text, {quoted: ack});
  	 // NewMoney(idWa, 'money', 'delete')
  	}
  	
  	//mensagem no grupo
  	if (!isCmd && isGroup) {
  	  // funçao que estiliza o console
  	  WAGroupMess(idWa, pushname, groupName, data, hora, type)
  	  
  	  // função que conta as mensagens
  	  await counterMsg(from, idWa)
  	  
  	  /*função que adiciona dinheiro
  	   NewMoney(idWa, 'money', 'add') */
  	  
  	  // função que detecta as palavras do anagrama
  	  if (isAna) {
  	    const isWordANA = await ANA_Options(from, idWa, 120, budy)
  	  if (isWordANA) {
  	    conn.sendMessage(from, isWordANA, MessageType.text, {quoted: ack})
  	  const newWord = await ANA_check(from)
  	     setTimeout( () => {
  	       conn.sendMessage(from, `_Sua dica da nova palavra é_\n*${newWord.word.embaralhada}, e você tem ${kyun(newWord.expired)} para acertar*`, MessageType.text, {quoted: ack})
  	       }, 5000); // 5 segundos
  	     }
  	  }
  	  //simi
  	  if (ack.key.fromMe) return
  	  if (isConversation || type == 'extendedTextMessage') {
  	    if (type == 'extendedTextMessage' && content.includes('quotedMessage') && prefixos.includes(ack.message.extendedTextMessage.contextInfo.quotedMessage.conversation[0])) return
  	    insert(type, ack, isEphemeral)
  	  const sami = await response(budy)
  	  if (sami && isSimi) conn.sendMessage(from, sami, MessageType.text, {quoted: ack, thumbnail: fs.readFileSync('./img/botlogo.jpeg', 'base64')});
  	  } 
  	    	}
  	
  	//comando no privado
  	if (!isGroup && isCmd) {
  	  WANotGroupCMD(comando, idWa, pushname, data, hora)
  	}
  	
  	//mensagem no privado
  	if (!isCmd && !isGroup) {
  	  NotGroupMess(idWa, pushname, data, hora, type)
  	}

  	//eviando textos/midias
    const reply  = function(texto) {
      conn.sendMessage(from, texto, text, {quoted: ack});
    }
    const sendMsg = function(id, texto) {
      conn.sendMessage(id, texto, MessageType.text);
    }
    const sendImg = function(id, diretório) {
      conn.sendMessage(id, diretório, MessageType.text, {thumbnail: null});
    }
    
	if (isCmd && !isUser && (comando !== 'login' && comando !== '')) {
	  return reply(`「𝗦 𝗘 ╷ 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗘」\n-\n_Você ainda não está registrado em meu banco de dados._\n-\n⎆ *Envie:* ${prefix}login idade`)
	}
	
	

/* =============================
      VERIFICADOS DO WHATSAPP
   ============================= */
   
//verificado de mensagem falsa de sender
const sfake = { key: { 
        participant: `${idWa}`, mentionedJid: `${idWa}`, ...(from ?
	 { remoteJid: `${from}` } : {}) 
                },
	 message: { 
		"extendedTextMessage": {
                 "text":`Bateria: ${nv}\nCarregando: ${charg}`
                        }
	                  } 
                     }
                     
//verificado marca a pessoa + bateria
const ping = { key: {id: ack.key.id, fromMe: false, participant: '0@s.whatsapp.net', ...(from ? { remoteJid: me.jid} : {})}, message: { extendedTextMessage: { text: `Bateria: ${nv}\nCarregando: ${charg}`}}}

//função pra enviar botão de ativação
const ativarButton = async(cond, comando, mess) => {
/* 
~> cond: condiciona de ativação
~> mess: mensagem grande de texto do botão
~> comando: nome do comando que o botão vai chamar (aquele com _)
   */
  let ctt = cond ? '⎋ Desativar' : '⎆ Ativar'
		
    const CttBut = [
          {
            buttonId: `${prefix}${comando}_`, buttonText: { displayText: `${ctt}` 
          }, type: 1 }, {
            buttonId: `${prefix}ativos`, buttonText: { displayText: 'Mostrar ativos' }, type: 1 
          }
          ]
        
        let messCttBut = { contentText: mess, footerText: 'Somente admins podem decidir', buttons: CttBut, headerType: 1 }
        
  const sendantictt =  await conn.sendMessage(from, messCttBut, MessageType.buttonsMessage, {quoted: ack});
  
   conn.relayWAMessage(sendantictt, {waitForAck: true});
}   
  
    switch (comando) {
      case 'menu': 
        getInfo(idWa, comando)
        let money = 0//await getMoney(idWa, 'money')
        conn.sendMessage(from, help(prefix, pushname, typeUser, cmds, totalUser, money), MessageType.text, {quoted: sfake});
        break
      case 'login':
      if (isUser) return reply('Você já está registrado na database.');
    if (!space[0]) return reply('Coloque sua idade após o comando')
    let nick = pushname ? pushname : 'Batatinha frita'
    let age = space[0]
     getInfo(idWa, comando, nick, age, data, hora)
ready = `
「𝗡 𝗢 𝗩 𝗢 ╷ 𝗟 𝗢 𝗚 𝗜 𝗡」
-
⎆╴𝑺𝒆𝒖 𝑵𝒐𝒎𝒆: ${nick}
⎆╴𝑺𝒖𝒂 𝑰𝒅𝒂𝒅𝒆: ${age}
⎆╴𝑺𝒆𝒖 𝑨𝒑𝒂𝒓𝒆𝒍𝒉𝒐: ${deviceType}
-
❴⎋❵ Total registrados: ${infoUser.length}
❴⎋❵ Total de comandos: 25
❴⎋❵ Comandos executados: ${cmds}

  ×•-•-•⟮ 𝙷𝚁 𝚃𝚎𝚊𝚖 ⟯•-•-•×`
     conn.sendMessage(from, ready, MessageType.text, {quoted: sfake});
        break
        case 'cmd-list':
          let int = await filtro(idWa)
          getInfo(idWa, comando)
          reply(int)
          break
     /* ========================
       Comandos de administração
        ======================== */
        case 'grupo': // abrir/fechar grupos
        getInfo(idWa, comando)
          if (!isGroup) return reply('*_Comando exclusivo para grupos._*')
          if (!isAdminGrupo) return reply('*_Apenas administradores do grupo._*')
          if (!isBotAdmin) return reply('Como eu vou fazer isso sem adm?')
          if (space[0] == 'abrir') {
              conn.groupSettingChange(from, GroupSettingChange.messageSend, false)
              } else if (space[0] == 'fechar') {
                conn.groupSettingChange(from, GroupSettingChange.messageSend, true) 
                } else {
                  reply('Abrir ou fechar parça? escreve apos o comando')
                }
                break
   case 'ephemeral': // modo ephemeral on/off
   getInfo(idWa, comando)
      if (!isGroup) return reply('Só em grupos')
        if (!isAdminGrupo) return reply('Apenas _o admin do grupo_')
        if (!isBotAdmin) return reply('Preciso de admin pra isso')
            if (space[0] == 'on') {
              if (isEphemeral) return reply('_As mensagens temporárias *já estão ativas neste grupo*_')
            conn.toggleDisappearingMessages(from, WA_DEFAULT_EPHEMERAL)
			 reply('*DONE*\nMessagens temporárias ativadas.')
			      } else if (space[0] == 'off') {
			   if (!isEphemeral) return reply('_As mensagens temporárias *já estão desativadas neste grupo*_')
			    conn.toggleDisappearingMessages(from, 0)
			    reply('*DONE*\nMessagens temporárias desativadas.')
			          } else {
			            reply(`'on' para ativar, 'off' para desativar.`)
			          }
			          break
			   case 'add': // adicionar membros
			   getInfo(idWa, comando)
			    if (!isGroup) return reply('Apenas em grupos')
			     if (!isAdminGrupo) return reply('Apenas o admin do grupo')
			     if (!isBotAdmin) return reply('Preciso de admin pra isso')
			     if (isConversation && space.length < 1) return reply('Hummmmmm')
			     let ment = marcado || space[0] + '@s.whatsapp.net'
			     if (space.length < 1 && !ment) return reply('Hummmmmm')
			   let exi = await isWANumber(ment)
			   if (exi.exists !== true) return reply('🪀 Esse número nem existe. Coloca um válido pra eu adicionar.')
			     if (!ment) return reply('Coloque o número')
			     if (participants(from, groupMembers).includes(ment)) return reply('🪀 Esse número já esta aqui')
			    try {
			      conn.groupAdd(from, [ment])
			    } catch (e) {
			      reply(`Erro encontrado:\n=> ${e}`)
			      console.log(e)
			    }
			  getInfo(idWa, comando)
              break
              case 'ban': // banir membros
              getInfo(idWa, comando)
            if (!isGroup) return
            if (!isAdminGrupo) return
            if (!isBotAdmin) return reply('Preciso de admin pra isso')
            if (!men) return reply('Cite o usuário com @ ou marque a mensagem dele.')
        let superAdmin = await groupMembers.filter(v => v.isSuperAdmin === true)
     if (superAdmin.length != 0 && (men === superAdmin[0].jid)) return reply('SuperAdmin não pode levar ban 🪀')
          if (!participants(from, groupMembers).includes(men)) return reply('🪀 _Este usúario não está no grupo_')
          if (ownerNumber.includes(men)) return reply('_Meu criador *não pode ser removido*_.')
            if (men) {
              conn.groupRemove(from, [men])
            } else {
              reply('Cite ou marque a mensagem de um usuário')
            }
            break
        case 'setname': // atualizar o nome do grupo
         getInfo(idWa, comando)
         try {
            if (!isGroup) return reply('Apenas em grupos');
            if (!isAdminGrupo) return reply('Apenas o admin do grupo')
            if (!isBotAdmin) return reply('Preciso de admi pra isso')
            if (space.length < 1) return
            let newName = msg.slice(comando.length + 2)
            if (newName.length > 25) return reply('_O novo nome pode possuir *até 25 caracteres*_')
            conn.groupUpdateSubject(from, newName);
            } catch (e) {
              reply(String(e))
              console.log(e)
              }
            break
            case 'setdesc': // atualizar a descrição do grupo
             getInfo(idWa, comando)
            if (!isGroup) return reply('Apenas em grupos');
            if (!isAdminGrupo) return reply('Apenas o admin do grupo')
            if (!isBotAdmin) return reply('Preciso de admi pra isso')
            if (space.length < 1) return 
            conn.groupUpdateDescription(from, msg.slice(comando.length + 2));
          break
            case 'promote': // promover a adm
            getInfo(idWa, comando)
              if (!isGroup) return
              if (!isAdminGrupo) return
              if (!isBotAdmin) return
              if (!men) return reply('Cite alguem com @ ou marque a mensagem dele');
          conn.groupMakeAdmin(from, [men])
              break
               case 'demote': // Tira adm
              getInfo(idWa, comando)
              if (!isGroup) return
              if (!isAdminGrupo) return
              if (!isBotAdmin) return
              if (!men) return reply('Cite alguem com @ ou marque a mensagem dele');
          conn.groupDemoteAdmin(from, [men])
              break
            case 'leave':
              case 'sair':
                getInfo(idWa, comando)
                if (!isOwner) return
                if (!isGroup) return
                if (!men)
                conn.groupLeave(from)
                break
        case 'tagall':
          case 'aviso':
         if (!isGroup) return reply('Apenas em grupos')
        if (!isAdminGrupo) return reply('Apenas o admin do grupo')
        if (space.length < 1) return reply('Coloque seu aviso após o comando');
        let part = participants(from, groupMembers)
     tag = `📢 *AVISO DO ADMINISTRADOR* 📢\n📍 @${idWa.split('@')[0]}\n${msg.slice(comando.length + 2)}\n${'='.repeat(20)}\n${'\u200B'.repeat(2000)}`
     for (let i = 0; i < part.length; i++) {
          tag += `❧ @${part[i].split('@')[0]}\n`
             }
      conn.sendMessage(from, tag, MessageType.text, {quoted: sfake, contextInfo: {mentionedJid: part}})
                  break
                  case 'cita':
                  getInfo(idWa, comando)
							    try {
							if (!isGroup) return reply('Apenas em grupos')
							if (!isAdminGrupo) return reply('Apenas o admin do grupo');
							let mbr = await participants(from, groupMembers)
					if (isConversation) {
					  if (space.length < 1) return reply('Citar oq?')
					  conn.sendMessage(from, msg.slice(comando.length + 2), MessageType.text, {contextInfo: {mentionedJid: mbr}})
					} else {
				encme = JSON.parse(JSON.stringify(ack).replace('quotedM','m')).message.extendedTextMessage.contextInfo
						const hideSave = await conn.downloadAndSaveMediaMessage(encme)
							const hide = fs.readFileSync(hideSave)
					if (ack.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage) {
						conn.sendMessage(from, hide, MessageType.sticker, {contextInfo: {mentionedJid: mbr}})
						} else if (ack.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage) {
				  if (space.length < 1) return reply('Hummmmmmm')
		conn.sendMessage(from, hide, MessageType.document, {mimetype: 'application/pdf', filename: msg.slice(5), contextInfo: {mentionedJid: mbr}})
		} else if (ack.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage) {
						  conn.sendMessage(from, hide, MessageType.audio, {ptt: true, contextInfo: {mentionedJid: mbr}})
		} else if (type == 'imageMessage' || isQuotedImage) {
		  conn.sendMessage(from, hide, MessageType.image, {thumbnail: null, caption: msg.slice(5), contextInfo: {mentionedJid: mbr}})
						  } else {
			reply('_No momento apenas stickers, audios e docs são marcáveis. Mais opções em breve._')
						}
  	fs.unlinkSync(hideSave)
					}
		  } catch (e) {
		    console.log(e)
		  }
					break
					case 'delete':
					  try {
					  if (!isGroup) return
					  if (!isAdminGrupo) return
					 if (isConversation) return reply('Marque a mensagem para eu apagar');
					 let myMsg = ack.message.extendedTextMessage.contextInfo.stanzaId
					 if (myMsg.length != 12) return reply('Só posso apagar as minhas mensagens.')
					 conn.deleteMessage (from, {id: myMsg, remoteJid: from, fromMe: true})
					  } catch (e) {
					    reply('Erro, talvez eu já tenha apagado essa mensagem.')
					    console.log(e)
					  }
					  break
					  case 'welcome':
					    if (!isGroup) return
					    ativarButton(isWelcome, 'welcome', `「𝗦 𝗜 𝗦 𝗧 𝗘 𝗠 𝗔╷𝗕 𝗢 𝗔 𝗦╷ 𝗩 𝗜 𝗡 𝗗 𝗔 𝗦」\n-\n⎆╴𝑬𝒔𝒕𝒂 𝒇𝒖𝒏𝒄̧𝒂̃𝒐 𝒑𝒆𝒓𝒎𝒊𝒕𝒆 𝒂𝒐 𝒃𝒐𝒕 𝒔𝒆 𝒅𝒆𝒔𝒑𝒆𝒅𝒊𝒓 𝒆 𝒓𝒆𝒄𝒆𝒑𝒄𝒊𝒐𝒏𝒂𝒓 𝒅𝒆 𝒏𝒐𝒗𝒐𝒔 𝒎𝒆𝒎𝒃𝒓𝒐𝒔.\n-\n❴⎋❵ *O status atual da função é: ${status(isWelcome)}*`)
					    break
					    case 'welcome_':
					      if (!isGroup) return
					      if (!isAdminGrupo) return
					      if (isWelcome === true) {
					       groupInfo(from, 'welcome', {welcome: true}, false)
					      reply('_Boas vindas *desativadas* neste grupo._')
					      } else {
					       groupInfo(from, 'welcome', {welcome: true}, true)
					      reply('_Boas vindas foram *ativadas* neste grupo._')
					      }
					      break
					      case 'simi':
					    if (!isGroup) return
					    ativarButton(isSimi, 'simi', `「𝗔 𝗥 𝗧 𝗜 𝗙 𝗜 𝗖 𝗜 𝗔 𝗟╷𝗜 𝗡 𝗧 𝗘 𝗟 𝗜 𝗚 𝗘 𝗡 𝗖 𝗘」\n-\n⎆╴𝑬𝒔𝒕𝒂 𝒇𝒖𝒏𝒄̧𝒂̃𝒐 𝒑𝒆𝒓𝒎𝒊𝒕𝒆 𝒂𝒐 𝒃𝒐𝒕 𝒖𝒔𝒂𝒓 𝒊𝒏𝒕𝒆𝒍𝒊𝒈𝒆̂𝒏𝒄𝒊𝒂 𝒂𝒓𝒕𝒊𝒇𝒊𝒄𝒊𝒂𝒍 𝒑𝒂𝒓𝒂 𝒄𝒐𝒏𝒗𝒆𝒓𝒔𝒂𝒓 𝒄𝒐𝒎 𝒐𝒔 𝒎𝒆𝒎𝒃𝒓𝒐𝒔.\n-\n❴⎋❵ *O status atual da função é: ${status(isSimi)}*`)
					    break
					    case 'simi_':
					      if (!isGroup) return
					      if (!isAdminGrupo) return
					      if (isSimi === true) {
					       groupInfo(from, 'simi', {simi: true}, false)
					      reply('_Modo simi *desativado* neste grupo._')
					      } else {
					       groupInfo(from, 'simi', {simi: true}, true)
					      reply('_Modo simi *ativado* neste grupo._')
					      }
					      break
                case 'linkgp':
                   getInfo(idWa, comando)
                  if (!isGroup) return reply('Apenas em grupos')
                  if (!isAdminGrupo) return reply('Apenas o admin do grupo')
                  if (!isBotAdmin) return reply('Preciso de admin pra isso')
                  let code = await conn.groupInviteCode(from)
                  reply(`chat.whatsapp.com/${code}`)
                  break
                  case 'join':
                  getInfo(idWa, comando)
                    if (!isOwner) return reply("Quem é vc?")
                    if (space.length < 1) return reply("Hummmmmm")
                try {
               let uri = space[0].replace('https://chat.whatsapp.com/', '')
                      conn.acceptInvite(uri)
                    } catch (e) {
                     reply('Link inválido')
                     console.log(e)
                    }
                    getInfo(idWa, comando)
                    break
                    case 'resetlink':
                 if (!isGroup) return
                if (!isAdminGrupo) return
               if (!isBotAdmin) return
               conn.revokeInvite(from)
              break
              case 'ban-inativos':
                if (!isGroup) return reply(mess.grupo())
            if (!isBotAdmin) return reply("_*Preciso ser administrador* pra executar essa função_")
            if (space.length < 1) return reply(`_Especifique a quantidade de mensagens aceitas._\n_Faça da *seguinte forma:*_\nColoque o comando + a quantidade de mensagens. ex:\n${comando} ${Math.floor(Math.random() * 30)}`)
           let limit = parseInt(space[0])
          let getKick = await kickGhost(from, limit)
          let getMembers = await getKick.filter(w => !getAdmin(groupMembers).includes(w.jid))
           if (typeof limit != "number") return reply("_*Apenas números reais* são aceitos_")
           if (limit < 1) return reply("_Valor *mínimo é 1 mensagem*_.")
         if (getMembers.length < 1) return reply(`_Não existem membros *com menos de ${limit} mensagens neste grupo*_`)
       await banInativos(conn, groupMembers, getMembers, from, ack, isWelcome)
                break
            case 'criargp':
              getInfo(idWa, comando)
              if (!isOwner) return
              if (!space.length < 1) return reply('Escolha o nome do grupo')
              conn.groupCreate(msg.slice(comando.length + 2), idWa)
                        break
      case 'run': // Executar comando no chat
      getInfo(idWa, comando)
          if (!isOwner) return reply('Eca um macaco')
          if (space.length < 1) return reply('Sim')
          try {
        eval(msg.slice(comando.length + 2));
          } catch (e) {
            reply(String(e))
            console.log(e)
          }
          break
          case 'adivinha': //adivinha o sistema operacional do usuário (totalmente feito por Lucas Hora)
          getInfo(idWa, comando)
          if (!isGroup) return reply('Apenas em grupos ')
          if (!men) return reply('Cite o usuário com @ ou marque a mensagem dele 🪀')
 try {
            atr = []
          cta = await conn.chats.all().filter(v => v.jid == from)
          atr.push(cta)
      // todas as mensagens do chat
      var msgChat = atr[0][0].messages
      
      let android = await msgChat.all().filter(c => c.key.id.length > 21)
      
      let ios =  await msgChat.all().filter(d => d.key.id.substring(0, 2) == '3A')
      
      let wapp = await msgChat.all().filter(p => p.key.id.length < 21 && p.key.id.substring(0, 2) != '3A')
      
    // todas as mensagens da pessoa mencionada
    msg_mentioned = await msgChat.all().filter(a => a.participant == men)
    // posição da utima mensagem
    ultima = msg_mentioned.length - 1
  
	let typeDevice = msg_mentioned[ultima].key.id.length > 21 ? "Android" : msg_mentioned[ultima].key.id.substring(0,2) == "3A" ? "iOS" : "WhatsApp WEB"
	
	let messagesChat = android.length + ios.length + wapp.length
	
  tipoMsg = `🥷🏽 _Consigo adivinhar seu OS_
  
👨🏾‍💻 _De acordo com a sua última mensagem, seu aparelho é do tipo:_\n*${deviceType}*

🪀 _Analisando a ultima mensagem da pessoa que você marcou (@${men.split('@')[0]}), o aparelho dela é do tipo:_\n *${typeDevice}*

🛰️ _Visualizei as últimas ${messagesChat} mensagens deste grupo, e vi que os aparelhos são:_\n\n*_🪀 Android_*: ${android.length} mensagens\n*_📱 IOS_*: ${ios.length} mensagens\n*_🖥️ Whatsapp Web_*: ${wapp.length} mensagens`

	conn.sendMessage(from, tipoMsg, MessageType.text, {quoted: ack, contextInfo: {mentionedJid: [men]}})
          } catch (e) {
        reply('Não encontrei nenhuma mensagem dessa pessoa no chat')
            console.error(e)
          }
            break
            case 'mytags':
              try {
              if (!isGroup) return
              let groupChat = await conn.chats.all();
            let myChat = await groupChat.filter(v => v.jid == from)
            let myTags = await myChat[0].messages
            console.log(myTags)
            reply(JSON.stringify(myTags, null, 4)) 
              } catch (e) {
                conn.logger.error(e)
              }
              break
            case 'ping':
              var start = now();
              var end = now();
              var latensi = end - start
              var uptime = process.uptime();
                const laten = {
              contentText: `🏓 | *Latência*: ${latensi.toFixed(4)} segundos\n⏱️ | *Runtime*: ${kyun(uptime)}`,
            footerText: '🚀 Processing time...',
            headerType: 1
          }
          
      const SendPing = await conn.sendMessage(from, laten, MessageType.buttonsMessage, {quoted: ping, contextInfo: { forwardingScore: 9999999999, isForwarded: true}});
          
     conn.relayWAMessage(SendPing, {waitForAck: true});
            break
            case 'report':
            getInfo(idWa, comando)
              if (space.length < 1) return reply('_Para reportar um bug, descreva ele após o comando_.')
             conn.sendMessage('559284928452@s.whatsapp.net', `📢 *ERRO REPORTADO * 💻\n${'='.repeat(25)}\n⎆ wa.me/${idWa.split('@')[0]}\n${msg.slice(comando.length + 2)}`, MessageType.text, {quoted: sfake})
             reply('_Seu erro foi reportado e será analizado pela minha equipe. Obrigado._')
              break
              case 'about':
                getInfo(idWa, comando)
          conn.sendMessage(from, mess.about(), MessageType.text, {quoted: ack})
                break
          case 'exe':
          getInfo(idWa, comando)
            if (!isOwner) return reply(mess.owner())
         exec(msg.slice(comando.length + 2), function(stdout, erro) {
              if (stdout) return reply(`${stdout}`)
              if (erro) return reply(`${erro}`)
            })
            break
            case 'checar':
              getInfo(idWa, comando)
              if (!isOwner) return reply(mess.owner())
              if (!men) return reply('*Cite ou marque um usuário*.')
              try {
                let found = false
              Object.keys(infoUser).forEach(p => {
                if (infoUser[p].jid == men)
                found = p
              })
              if (found) {
                reply(JSON.stringify(infoUser[found], null, 4))
              } else {
                reply('_Este usuário ainda não se registrou_')
              }
         } catch (e) {
           reply(`_Erro_: ${e}`)
           console.log(e)
         }
         break
         case 'getnick':
           if (!isGroup) return reply(mess.grupo())
           if (!men) return reply('Cite alguem ou marque com @')
      let pu = conn.contacts[men] != undefined ? conn.contacts[men].vname || conn.contacts[men].notify: undefined
      let push = men == me.jid ? me.name : pu
        reply(push)
           break
           case 'addprefix':
             if (!isOwner) return reply(mess.owner())
             if (space.length < 1) return reply('_Escolha o prefixo que vai ser adicionado à lista_')
             if (space[0].length > 1) return reply('_Apenas *um* caractere por prefixo_.')
            let alreadyPrefix = await isPrefix(space[0])
            if (alreadyPrefix) return reply(`_Este prefixo já foi adicionado. *Total neste momento é de ${prefixos.length} prefixos*_`)
         prefixos.push(space[0])
         fs.writeFileSync('database/json/infoBot.json', JSON.stringify(infoBot, null, 4))
          conn.sendMessage(from, `Prefixo adicionado. Total agora é ${prefixos.length}`, MessageType.text, {quoted: ack})
             break
          case 'ack': 
            getInfo(idWa, comando)
            try {
            reply(JSON.stringify({quoted: ack}, null, 4));
            } catch (e) {
              reply(`${e}`)
              console.log(e)
            }
            break
            case 'rank': 
              getInfo(idWa, comando)
             if (!isGroup) return reply(mess.grupo()) 
             if (groupMembers.length < 5) return reply("_Precisa ter no mínimo 5 pessoas no grupo. *Os contadores são resetados a cada 10 dias.*_")
            let org = await getCounterMsg(from)
            let resulRank = ranking(org.counter, "total")
            if (resulRank.length < 5) return reply("_Mínimo de *5 pessoas no ranking de mensagens*_.")
           await responseRank(org, resulRank, conn, from)
              break
            case 'info':
              getInfo(idWa, comando)
              let runtime = kyun(process.uptime());
              conn.sendMessage(from, info(name, WAVersion, browser, ram, blocked.length, TotalCMD, runtime, me.jid.split('@')[0]), MessageType.text, {quoted: ping})
              break
            case 'take':
              getInfo(idWa, comando)
              if (!isQuotedSticker) return reply('_Marque stickers com *esse comando*_.')
              if (msg.length <= comando.length + 2) return reply('Coloque o texto *após o comando*.')
              if (!msg.includes('|')) return reply('Use *|* para separar os textos')
              const text = msg.slice(comando.length +2)
              const autor = text.split('|')[1]
              const pack = text.split('|')[0]
      const getbuff = JSON.parse(JSON.stringify(ack).replace('quotedM','m')).message.extendedTextMessage.contextInfo
      const dlfile = await conn.downloadMediaMessage(getbuff)
      const bas64 = `data:image/jpeg;base64,${dlfile.toString('base64')}`
      const mantap = await convertSticker(bas64, autor, pack)
      const imageBuffer = new Buffer.from(mantap, 'base64');
       conn.sendMessage(from, imageBuffer, MessageType.sticker, {quoted: ack})
       fs.unlinkSync(dlfile)
  break
  /* ========= Jogo do Anagrama feito 
  totalmente por Lucas Hora*/
  case 'anagrama':
    getInfo(idWa, comando)
    if (!isGroup) return reply(mess.grupo());
    if (isAna) return conn.sendMessage(from, `_O membro @${isAna.player.split('@')[0]} já está jogando no momento._\n_*Ele tem ${kyun(isAna.expired)} para terminar de jogar*_`, MessageType.text, {quoted: ack, contextInfo: {mentionedJid: [isAna.player]}});
    
    await ANA_Start(from, idWa, 120)
    
    let newAna = await ANA_check(from)
    reply(`_O jogo começou. *Sua dica é ${newAna.word.embaralhada.toLowerCase()}*, e vc tem 1 minuto_`)
    break
    case 'ativos':
      getInfo(idWa, comando)
      if (!isGroup) return reply(mess.grupo());
      let actives = `_Status das funções *neste grupo*_:\n\n${'='.repeat(20)}\n*=> função:* welcome\n*~> status:* ${status(isWelcome)}\n\n*=> função:* simi\n*~> status:* ${status(isSimi)}\n${'='.repeat(20)}`
      reply(actives)
      break
  case 'grupos':
    case 'grouplist':
      getInfo(idWa, comando)
      const gpr = await groupList(conn, getAdmin, me)
  reply(gpr)
    break
    case 'play':
      getInfo(idWa, comando)
      if (msg.length == comando.length + 1) return reply("_Coloque o nome da música *após o comando*_.")
      reply("_Procurando resultados através do *yt-search npm*..._")
      const busca = await yts(msg.slice(comando.length + 2))
      reply(JSON.stringify(busca.all[0], null, 4))
      ytdl.getInfo(busca.all[0].url).then(async(a) => {
        console.log("aaaaaa" + JSON.stringify(a, null, 4))
      })
      ytdl.downloadFromInfo(busca.all[0].url)
      console.log(busca.all)
      break
      case 'addwarn':
      if (!isGroup) return reply(mess.grupo())
      if (!men) return reply("Cite o membro *com @ ou marque uma mensagem dele.*_")
       if (msg.length < 1) return reply("_Coloque o aviso *após o comandos.*_")
       acessWarn.insertWarn(from, men, msg.slice(comando.length + 2))
      default:
} // fim do switch/case

    if (allChats.length > 15) {
      try {
      let chats = await allChats.filter(v => v.jid.endsWith('@s.whatsapp.net'))
      for (let i = 0; i < allChats.length; i++) {
        setTimeout( async() => {
      await conn.modifyChat(chats[i].jid, ChatModification.delete)
        }, i * 5000) // 5 segundos
      }
      console.log(chalk.hex('#32CD32').bold(`${chats.length} conversas deletadas`))
      } catch (err) {
        console.log(JSON.stringify(err, null, 4))
      }
    }
  } catch (e) {
    console.log(e)
  }
});

} // Fim da função iniciar
iniciar();
