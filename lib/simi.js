const fs = require('fs');
const simih = JSON.parse(fs.readFileSync('./database/json/simi.json'));


exports.insert = async(type, ack, isEphemeral) => { 
  try {
  const content = JSON.stringify(ack.message)
  const keyword = (type == 'conversation') ? ack.message.conversation : (type == 'extendedTextMessage' && !isEphemeral) ? ack.message.extendedTextMessage.contextInfo.quotedMessage.conversation : (type == 'extendedTextMessage' && isEphemeral && !content.includes('quotedMessage')) ? ack.message.extendedTextMessage.text : (type == 'extendedTextMessage' && isEphemeral && content.includes('quotedMessage')) ? ack.message.extendedTextMessage.contextInfo.quotedMessage.conversation : ''
  
  if (keyword.length > 40) return
  if (keyword == '') return
  
async function check(key) {
  let found = false
  Object.keys(simih).forEach(i => {
    if (simih[i].msg == key)
    found = i
  })
  return found ? simih[found] : false
  }
   
   const verify = await check(keyword.toLowerCase())
   if (type == 'conversation' || (type == 'extendedTextMessage' && isEphemeral && !content.includes('quotedMessage'))) {
     if (verify) return 
       simih.push({msg: ack.message.conversation.toLowerCase(), messages: []})
       fs.writeFileSync('./database/json/simi.json', JSON.stringify(simih, null, 4))
   } else if (type == 'extendedTextMessage') {
     if (verify) {
       verify.messages.push(ack.message.extendedTextMessage.text.toLowerCase())
       fs.writeFileSync('./database/json/simi.json', JSON.stringify(simih, null, 4))
     } else {
       if (type == 'extendedTextMessage' && !isEphemeral) return
       simih.push({msg: keyword.toLowerCase(), messages: [ack.message.extendedTextMessage.quotedMessage.toLowerCase()]})
       fs.writeFileSync('./database/json/simi.json', JSON.stringify(simih, null, 4))
     }
   }
  } catch (e) {
    console.log(e)
  }
}

exports.response = async(key) => {
  let position = false
  Object.keys(simih).forEach(i => {
    if (simih[i].msg == key.toLowerCase())
    position = i
  })
  return position ? simih[position].messages[Math.floor(Math.random() * simih[position].messages.length)] : false
}