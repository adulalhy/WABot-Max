const fs = require('fs');
const cfonts = require('cfonts');

const users = JSON.parse(fs.readFileSync('./database/json/infoUser.json'));
const infoBot = JSON.parse(fs.readFileSync('database/json/infoBot.json'));

const { prefixos } = infoBot


// esta função retorna um array simples com todos os membros de um grupo
exports.participants = (groupId, groupMembers) => {
  array = []
  for (let i = 0; i < groupMembers.length; i++) {
    array.push(groupMembers[i].jid)
  }
  return array
}

exports.kyun = (seconds) => {
  const pad = (s) => {
    return (s < 10 ? '0' : '') + s;
  }
  var day = Math.floor(seconds / (60 * 60 * 24))
  var hours = Math.floor(seconds % (60*60*24) / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

 let d = `${pad(day)} Dias`
 let h = `${pad(hours)} Horas`
 let m = `${pad(minutes)} Minutos`
 let s = `${pad(seconds)} Segundos`
 
  let q = ((hours <= 0) && minutes <= 0) ? s : (hours <= 0) ? `${m} e ${s}` : (day <= 0) ? `${h} ${m} e ${s}` : `${d}, ${h} e ${m}`
  return q
  }

// Função pra consultar se o prefixo é válido
exports.isPrefix = async(prefix) => {
    let found = false
    Object.keys(prefixos).forEach(e => {
    if (prefixos[e] == prefix)
    found = true
    })
  return found
}

// gera/organiza em ordem decrescente um array
exports.ranking = (dir, subdir) => {
  dir.sort((a, b) => (a[subdir] < b[subdir]) ? 1 : -1)
  return dir
}

exports.init = () => {
cfonts.say('MAX|BOT 3.0', {
	font: "simple3d", // fonte do banner
	color: "candy",
	align: "center",
	gradient: ["red","green"],
	lineHeight: 3
});
}

exports.percent = (total, result) => {
   let calc = result * 100
   return calc / total
  }