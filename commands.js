const urlCommandOption = {
    name: 'url',
    description: 'The URL of the youtube video',
    required: true,
    type: 3
}

module.exports = {
    init: (client) => {
        client.application.commands.create({
            name: 'mp3',
            description: 'Download a youtube video as an MP3',
            options: [ urlCommandOption ]
        })
            .then(() => { console.log('Registered MP3') })
            .catch(console.log)

        client.application.commands.create({
            name: 'mp4',
            description: 'Download a youtube video as an MP4',
            options: [ urlCommandOption ]
        })
            .then(() => { console.log('Registered MP4') })
            .catch(console.log)
    }
}
