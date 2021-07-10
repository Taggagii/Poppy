module.exports = {
    command_name: "ban",
    fn: (values) => {
        message.mentions.members.forEach(member => {
            if (member)
            {
                if (message.member.hasPermission("BAN_MEMBERS"))
                {
                    member.ban()
                    .then((member) => message.channel.send(`${member} was banned`))
                    .catch((err) => message.channel.send("Bot does not have permissions to ban " + `${member}`));
                }
                else
                {
                    values.message.channel.send("You do not have permissions to ban this member");
                }
            }
            else
            {
                values.message.channel.send("The mentioned user does not exist");
            }
        });
    }
}