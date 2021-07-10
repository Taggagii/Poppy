module.exports = {
    command_name: "newChannel",
    fn: (values) => {
        values.client.guilds.cache.get("859202193483104296").channels.create(values.args.join("-"), {
            type: "text",

        });
    }
}