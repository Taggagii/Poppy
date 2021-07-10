const requests = require("request-promise");
const cheerio = require("cheerio");
const Discord = require("discord.js");
// const puppeteer = require("puppeteer");


//https://www.google.com/search?q=${search term}&tbm=isch
// classes are dots
// ids are octothorps
//image class = 'rg_i Q4LuWd'


module.exports = {
    command_name: "i",
    fn: async (values) => {

        // const browser = await puppeteer.launch();

        let searchTerm = "nothing";
        if (values.args.length > 0)
            searchTerm = values.args.join(" ");
        var links = []
        await requests(`https://www.google.com/search?q=${searchTerm}&tbm=isch&start=100`)
        .then((html) => {
            const $ = cheerio.load(html);
            let imageLinks = $('.t0fcAb', html)
            for (var i = 0; i < imageLinks.length; i++)
            {
                //console.log(imageLinks[i])
                links.unshift(imageLinks.eq(i).attr('src'));
            }
        })
        .catch((err) => {
            console.log("There was an error: " + err);
        })
        let randomIndex = Math.floor(Math.random() * 10) % links.length;
        const embed = new Discord.MessageEmbed()
        .setImage(links[randomIndex]);

        values.message.reply(embed)
    }
}