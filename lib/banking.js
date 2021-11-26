const fs = require('fs');
const ms = require('ms');

const infoMoney = JSON.parse(fs.readFileSync('./database/json/bank.json'));

const checkInfoUser = async(groupId, userId) => {
  async function search(id) {
    let found = null;
    Object.keys(infoMoney).forEach(e => {
      if (infoMoney[e].groupId == id)
      found = e
    })
    return found ? infoMoney[found] : false
  }
}

module.exports = { checkInfoUser }