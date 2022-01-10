# DYTDL - DiscordYouTubeDownload
A Discord bot for downloading YouTube videos as MP3/MP4 files



## Requirements
For this bot to work you will need the following
- A Google account _(for the Google Cloud API)_
- A Discord account _(for the application)_
- A server where you can both host your app and the content downloaded



## Setup

- Make sure that the following tools are installed on your target machine:
    - git
    - ffmpeg
    - nodeJs _(version >= 16.6.0)_

- Have a web-server ready _(Apache, NGINX, etc.)_ that disallows directory browsing, access to the `.htaccess` file, and access to all files ending with `.meta`, for the directory where you intent to store the downloaded audio/video files

### Google Cloud API
- Head to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Create a new application _(if necessary)_
- Create a new `API key` and write it down

### Discord
- Head over to your [Discord applications](https://discord.com/developers/applications/)
- Create a new application
- Write down your Application ID
- Head to the Bot section and click on the `Add Bot` button
- Copy your token and write it down as well
- Customize the name/icon to your liking

### Installation
- Open a terminal
- Run the following commands in order
    - `git clone https://github.com/foxscore/dytdl.git`
    - `cd dytdl`
    - `npm i`
- Create a config.json file with the following variables:
    Template: _[config.json](###config.json)_
    |                     |                                                          |
    |--------------------:|:---------------------------------------------------------|
    |          **apiKey** | Google Cloud Application API Key                         |
    | **storageLocation** | Where the files should be downloaded to                  |
    |     **contentHost** | The base URL from where to access the downloaded content |
    |        **clientId** | The ID of your Discord application                       |
    |           **token** | The token of your Discord bot                            |
    |      **inviteLink** | The invite URL for your bot _(unused)_                   |
- Run `node index.js` to start it up

### Invite it
Add your client id at the end of the following URL, open it in your browser, and add the app to whichever server you want.

`https://discord.com/oauth2/authorize?scope=applications.commands&permissions=0&client_id=`

## Templates
### config.json
```json
{
  "apiKey": "GOOGLE_CLOUD_API_KEY",

  "storageLocation": "STORAGE_LOCATION",
  "contentHost": "BASE_URL",

  "clientId": APP_ID,
  "token": "APP_TOKEN",
  "inviteLink": "INVITE_LINK"
}
```