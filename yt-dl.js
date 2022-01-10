const {storageLocation, contentHost} = require(`${__dirname}/config.json`)
const Embeds = require(`${__dirname}/embedGenerator.js`)
const Meta = require(`${__dirname}/yt-meta`)
const URL = require('url').URL
const dl = require('youtube-dl-exec')
const ms = require('ms')
const fs = require("fs");

String.prototype.trimEllip = function (length) {
    return this.length > length ? this.substring(0, length) + "..." : this;
}

const youtube_parser = (url) => {
    var regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|music\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
    var match = url.match(regExp);
    return (match && match[1].length==11)? match[1] : false;
}

const sendReject = (interaction, title, message, timeout = 5000) => {
    interaction.reply(Embeds.error(title, message))
        .then(() => {
            setTimeout(
                () => { interaction.deleteReply() },
                timeout
            )
        })
}
const editReject = (interaction, title, message, timeout = 5000) => {
    interaction.editReply(Embeds.error(title, message))
        .then(() => {
            setTimeout(
                () => { interaction.deleteReply() },
                timeout
            )
        })
}

const supportedCommands = [
    'mp3',
    'mp4'
]

const onInteraction = (interaction) => {
    let isSupported = false;
    supportedCommands.forEach(a => {
        if (interaction.commandName == a) {
            isSupported = true;
        }
    })

    if (!isSupported) {
        sendReject(interaction, 'Unknown command', `The requested command (${interaction.commandName}) is not supported by this module`)
        return
    }

    let url = interaction.options.get('url').value

    if (!youtube_parser(url)) {
        sendReject(interaction, 'Request rejected', 'Invalid URL')
        return
    }

    url = new URL(url)
    let id = url.searchParams.get('v')
    var extension = interaction.commandName === 'mp3' ? 'mp3' : 'mp4'

    if (fs.existsSync(`${storageLocation}/${id}.${extension}.meta`)) {
        let m = JSON.parse(
            fs.readFileSync(
                `${storageLocation}/${id}.${extension}.meta`,
                {
                    encoding: 'utf-8'
                }
            )
        )
        interaction.reply(
            Embeds.buttons(
                m.snippet.title,
                m.snippet.description,
                m.id,
                extension,
                m.snippet.thumbnails.standard === undefined
                    ? m.snippet.thumbnails.default.url
                    : m.snippet.thumbnails.standard.url,
                `${contentHost}/${id}.${extension}`
            )
        )
        return
    }

    interaction.reply(Embeds.action('Fetching meta data', ''))
        .then(() => {
            Meta.getVideoData(id)
                .then(res => {
                    let meta = JSON.parse(res)
                    if (meta.items.length === 0) {
                        editReject(interaction, 'Request rejected', 'Invalid video id')
                        return
                    }
                    if (meta.items.length !== 1) {
                        editReject(interaction, 'Request rejected', 'Too many responses')
                        return
                    }

                    meta = meta.items[0]

                    if (meta.status.uploadStatus !== 'processed') {
                        editReject(interaction, 'Request rejected', 'Video is still uploading')
                        return
                    }
                    if (
                        meta.status.privacyStatus !== 'public'
                        && meta.status.privacyStatus !== 'unlisted'
                    ) {
                        editReject(interaction, 'Request rejected', 'Video is neither public nor unlisted')
                        return
                    }
                    if (
                        // If the duration (PT3M52S) is greater than 25 minutes (1500000)
                        ms(
                            meta.contentDetails.duration
                                .slice(2)
                                .toLowerCase()
                        ) > 1500000
                    ) {
                        editReject(interaction, 'Request rejected', 'Too many responses')
                        return
                    }

                    meta.snippet.description = meta.snippet.description.trimEllip(100)

                    // Write meta file
                    fs.writeFileSync(
                        `${storageLocation}/${meta.id}.${extension}.meta`,
                        JSON.stringify(meta),
                        {
                            encoding: 'utf-8',
                        }
                    )

                    let options
                    if (interaction.commandName === 'mp3')
                        options = {
                            extractAudio: true,
                            audioFormat: 'mp3',
                            output: `${storageLocation}/${meta.id}.%(ext)s`
                        }
                    else
                        options = {
                            // format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
                            format: 'mp4',
                            output: `${storageLocation}/${meta.id}.%(ext)s`
                        }

                    interaction.editReply(
                        Embeds.action(
                            `Downloading ${meta.snippet.title}`,
                            '',
                            meta.snippet.thumbnails.standard === undefined
                                ? meta.snippet.thumbnails.default.url
                                : meta.snippet.thumbnails.standard.url
                        )
                    )
                        .then(() => {
                            dl(`https://youtube.com/watch?v=${meta.id}`, options)
                                .then(() => {
                                    interaction.editReply(
                                        Embeds.buttons(
                                            meta.snippet.title,
                                            meta.snippet.description,
                                            meta.id,
                                            extension,
                                            meta.snippet.thumbnails.standard === undefined
                                                ? meta.snippet.thumbnails.default.url
                                                : meta.snippet.thumbnails.standard.url,
                                            `${contentHost}/${id}.${extension}`
                                        )
                                    )
                                })
                                .catch(err => {
                                    editReject(interaction, 'Download failed', err.shortMessage)
                                    return
                                })
                        })
                })


        })
}

module.exports = {
    processInteraction: onInteraction
}
