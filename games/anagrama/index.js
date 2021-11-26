const fs = require('fs');
const words = JSON.parse(fs.readFileSync('./games/anagrama/json/words.json'));
const groups = JSON.parse(fs.readFileSync('./games/anagrama/json/groups.json'));

const { kyun } = require('../../lib/functions')

// Esta função secundária verifica se existe algum jogo em andamento  aquele grupo
  async function ANA_check(group) {
    let position = false;
    Object.keys(groups).forEach(i => {
      if (groups[i].groupId == group)
      position = i
    })
    return position ? groups[position] : false
  }
  
// Esta função cria um novo jogo no grupo
const ANA_Start = async(groupId, idWa, expired) => {

  const verify = await ANA_check(groupId)
  if (!verify) {
    
  let selectWord = words[Math.floor(Math.random() * words.length)]
  let infoGame = {groupId: groupId, player: idWa, expired: expired, word: selectWord}
 
  groups.push(infoGame)
  fs.writeFileSync('./games/anagrama/json/groups.json', JSON.stringify(groups, null, 4));
  }
}

const ANA_Options = async(groupId, idWa, expired, classWord) => {
  const found = await ANA_check(groupId)
  if (found.word.normal == classWord.toUpperCase()) {
    Object.keys(groups).forEach(q => {
      if (groups[q].groupId == groupId) {
        groups.splice(q, 1)
        fs.writeFileSync('./games/anagrama/json/groups.json', JSON.stringify(groups, null, 4));
      }
    })
    console.log('Jogo encerrado, reiniciando...')
    ANA_Start(groupId, idWa, 120)
    return `_Parabéns, a palavra era ${classWord.toLowerCase()}. *O jogo será reiniciado em 5 segundos...*_`
  } else {
    return false
  }
}

module.exports = { ANA_check, ANA_Start, ANA_Options }