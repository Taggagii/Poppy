module.exports = {
    command_name: "hello",
    fn: (values) => {
        values.message.reply("world!");
    }
}