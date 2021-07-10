const Discord = require("discord.js");
const client = new Discord.Client({partials : ["REACTION", "MESSAGE"]});
const fs = require('fs');

PREFIX = "/";

//grabbing the commands from the commands files
const prefixCommands = {};
const files = fs.readdirSync("./prefix commands");
const jsFiles = files.filter(file => file.endsWith(".js"));
jsFiles.forEach(commandFile => {
    const command = require(`./prefix commands/${commandFile}`);
    if (command.command_name && command.fn){
        prefixCommands[command.command_name] = command.fn;
    }
});

//getting role info from json
try
{
    var roleInfo = JSON.parse(fs.readFileSync("roles.json"));
}
catch
{
    console.log("creating roles.json...");
    fs.writeFileSync("roles.json", "{}");
    console.log("created");
}

//initalizing the bot
client.on("ready", () => 
{
    console.log('\033[2J');
    console.log("Activated");
    console.log(prefixCommands);
    console.log(roleInfo);
    // Object.keys(roleInfo).forEach(id => {
    //     console.log(roleInfo[id].includes("i"));
    // })
});



client.on("message", (message) =>
{
    if (message.author.bot) 
    {
        return;
    }
    if (!message.content.startsWith(PREFIX))
    {
        return;
    }
    
    const [command_name, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
    
    let values = {args, command_name, PREFIX, roleInfo, client, message, prefixCommands}

    if (!Object.keys(prefixCommands).includes(command_name))
    {
        console.log("not a command");
        return;
    }

    //checking user permissions
    let permitted = false;
    message.member.roles.cache.forEach(role => {
        if (Object.keys(roleInfo).includes(role.id) && roleInfo[role.id].includes(command_name))
        {
            permitted = true;
        }
    });

    
    console.log("passing in '" + command_name + "'");
    console.log(`user is permitted: ${permitted}`);
    if (!permitted)
    {
        return;
    }
    //main commands with prefix
    try
    {
        prefixCommands[command_name](values);
    }
    catch(err)
    {
        console.log(command_name + " malfunctioned");
        console.log(err);
    }
});


client.login(fs.readFileSync(".key", "utf-8").replace(/\r?\n|\r/g, ""));