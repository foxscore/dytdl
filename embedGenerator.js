const emojis = require(`${__dirname}/emojis.json`)

const action = (title, message, image= '', color= 0xE5AC1B) => {
    return {
        embeds: [
            {
                type: "rich",
                title: title,
                description: message,
                color: color,
                image: {
                    url: image
                }
            }
        ],
        components: [ ]
    }
}

const error = (title, message, color=0xff0000) => {
    return {
        embeds: [
            {
                type: "rich",
                title: title,
                description: message,
                color: color
            }
        ],
        components: [ ]
    }
}

const buttons = (title, message, id, extension, image='', link = '', color=0x7289DA) => {
    return {
        embeds: [
            {
                color: 0xF4F000,
                title: 'Please press the delete button when you\'re done'
            },
            {
                type: 'rich',
                title: title,
                description: message,
                color: color,
                image: {
                    url: image
                }
            }
        ],

        components: [
            {
                type: 1,
                components: [
                    {
                        style: 5,
                        label: 'Download',
                        url: link,
                        disabled: false,
                        type: 2
                    },
                    {
                        style: 4,
                        label: 'Delete',
                        custom_id: `delete-${extension}-${id}`,
                        disabled: false,
                        type: 2
                    }
                ]
            }
        ]
    }
}

module.exports = {
    action: action,
    error: error,
    buttons: buttons
}
