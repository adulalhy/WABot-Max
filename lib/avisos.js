const fs = require('fs');
const ms = require('ms');


const warnings = JSON.parse(fs.readFileSync('./database/json/warnings.json'));

class clientWarn {
  
  async insertWarn(groupId, jid, aviso) {
    
    /* a função abaixo verifica se existe
    * algum registro do grupo. Caso não tenha
    * ele cria um novo.
    */
    async function insertGroup(gid) {
      let found;
      Object.keys(warnings).forEach(r => {
        if (warnings[r].groupId == gid)
        found = r
      })
      return found ? warnings[found] : false
    }
    const isGroup = await insertGroup(groupId)
    if (isGroup) {
      
      /* a função insertWarnUser só é
      * executada quando existe um registro do
      * grupo em questão (ele só verifica se)
      * existe algum aviso daquele membro.
      */
      async function checkWarnUser(id) {
        let search = null;
        Object.keys(isGroup.warns).forEach(e => {
          if (isGroup.warns[e].jid == id)
       search = e
        })
        console.log(search)
      return search ? isGroup.warns[search] : false
      }
      
      // constante pra verificar o registro de avisos do membro
      const isUser = await checkWarnUser(jid)
      if (isUser) {
        isUser.warningsUser.push(aviso)
        fs.writeFileSync('./database/json/warnings.json', JSON.stringify(warnings, null, 4))
      } else {
        let ObjUser = {
          jid: jid,
          warningsUser: [aviso]
                      }
        isGroup.warns.push(ObjUser)
        fs.writeFileSync('./database/json/warnings.json', JSON.stringify(warnings, null, 4))
      }
    } else {
      let info = {
        groupId: groupId,
        expired: Date.now() + ms("7 days"),
        warns: [
          {
            jid: jid,
            warningsUser: [aviso]
          }
              ]
      }
      
      warnings.push(info)
      fs.writeFileSync('./database/json/warnings.json', JSON.stringify(warnings, null, 4))
    }
    
  } // fim da função insertWarn
  
} // fim da classe


exports.clientWarn = clientWarn