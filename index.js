// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token, storageLocation } = require(`${__dirname}/config.json`);
const Embeds = require(`${__dirname}/embedGenerator`)
const ytdl = require(`${__dirname}/yt-dl`)
const fs = require('fs')

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    require(`${__dirname}/commands`).init(client)
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        ytdl.processInteraction(interaction)
        return
    } else if (!interaction.isButton()) return;

    let data = interaction.customId.split('-')

    let pathContent = `${storageLocation}/${data[2]}.${data[1]}`
    let pathMeta = `${pathContent}.meta`

    let meta = {snippet: {title: data[1] == 'mp3' ? 'audio' : 'video'}}
    if (fs.existsSync(pathMeta))
        meta = JSON.parse(
            fs.readFileSync(
                pathMeta,
                {
                    encoding: 'utf-8'
                }
            )
        )

    interaction.deferUpdate()
        .then(() => {
            interaction.editReply(Embeds.action(`Deleting ${meta.snippet.title}`, ''))
                .then(() => {
                    fs.rmSync(pathMeta, { force: true })
                    fs.rmSync(pathContent, { force: true })

                    interaction.editReply(Embeds.action(`Removed ${meta.snippet.title}`, '', '', 0xff0000))
                        .then(() => {
                            setTimeout(
                                () => { interaction.deleteReply() },
                                5000
                            )
                        })
                })
        })
})



client.login(token);
