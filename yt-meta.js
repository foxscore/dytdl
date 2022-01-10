const { apiKey } = require(`${__dirname}/config.json`)
const https = require('https')

function getVideoData(videoId) {
    return new Promise((resolve, reject) => {
        https.get(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails,status`,
            (response) => {
                response.setEncoding('utf-8')

                let data = ''

                response.on('data', (fragments) => {
                    data += fragments
                });

                response.on('end', () => {
                    resolve(data);
                });

                response.on('error', (error) => {
                    reject(error);
                });
            }
        );
    });
}

module.exports = {
    getVideoData: getVideoData
}
