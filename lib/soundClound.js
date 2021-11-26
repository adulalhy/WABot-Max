const SoundClound = require('soundcloud-scraper');
const fs = require('fs');

const client = new SoundClound.Client();

const getInfoSound = async(url) => {
  client.getSongInfo(url)
  .then(async(song) => {
    const getSong = await song.downloadProgressive();
    const writer = getSong.pipe(fs.createWriteStream(`./songs/${song.title}.mp3`))
  })
}

module.exports = { getInfoSound }