const { tikdown } = require("nayan-media-downloader")

async function ko() {
    let URL = await tikdown("https://vt.tiktok.com/ZSNvs6h6o/")
    console.log(URL.data.title)
}

ko();