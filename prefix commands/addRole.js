const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    command_name: "addRole",
    fn: async (values) => {
        let roleName = values.args.join(" ");
        if (!values.args.length)
        {
            values.message.reply("Please enter the role name");
            let filter = m => m.author.id === values.message.author.id
            let response = await values.message.channel.awaitMessages(filter, {
                max: 1, 
            });
            roleName = response.first().content;
        }
        let role = await values.message.guild.roles.create({
            data: {
                name: roleName
            },
        });
        let commandsList = Object.keys(values.prefixCommands);
        let permittedList = [];
        let embed = new Discord.MessageEmbed()
        .setTitle(roleName)
        .addFields(
            { name: "Commands", value: commandsList, inline: true},
        );
        
        values.message.reply("Which commands would you like to allow? Type 'done' when finished")
        let filter = m => m.author.id === values.message.author.id
        while (1)
        {   
            if (permittedList.length)
            {
                embed = new Discord.MessageEmbed()
                .setTitle(roleName)
                .addFields(
                    { name: "Commands", value: commandsList, inline: true},
                    { name: "Permitted Commands", value: permittedList, inline: true}
                );
            }
            values.message.reply(embed);
            let response = await values.message.channel.awaitMessages(filter, {
                max: 1, 
            })
            response = response.first().content;
            if (Object.keys(values.prefixCommands).includes(response))
            {
                commandsList = commandsList.filter(value => value !== response);
                permittedList.push(response);
            }
            if (response == "all")
            {
                permittedList = Object.keys(values.prefixCommands);
                commandsList = [];
                break;
            }
            if (response === "done")
            {
                if (!permittedList.length)
                {
                    values.message.reply("You must add at least one command");
                }
                else
                {
                    break;
                }
            }
            if (!commandsList.length) break;
        }
        
        embed = new Discord.MessageEmbed()
        .setTitle(roleName)
        .addFields(
            { name: "Permitted Commands", value: permittedList, inline: true}
        );
        values.message.reply(embed);
        values.message.reply("done");

        //add to json role.id and permitted commands
        values.roleInfo[role.id] = permittedList;
        console.log(values.roleInfo);
        fs.writeFileSync(`${path.resolve(__dirname, '..')}\\roles.json`, JSON.stringify(values.roleInfo));
        console.log('done');
    }
}