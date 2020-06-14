module.exports = 
{
	name: 'play',
    execute(discord, client, ytdl, searcher, msg, command, suffix, args) 
    {
        playFunction(msg, suffix, searcher, discord, client, ytdl)
    }
};

function playFunction (msg, suffix, searcher, discord, client, ytdl) 
{
    if (msg.member.voice.channelID === null) 
    {
        return msg.channel.send("fail: You're not in a voice channel.");
    }
    if (!suffix) return msg.channel.send("fail: No video specified!");

    var searchstring = suffix.trim();
    if (searchstring.includes("https://youtu.be/") || searchstring.includes("https://www.youtube.com/") && searchstring.includes("&")) searchstring = searchstring.split("&")[0];


    msg.channel.send(`\`Searching: ${searchstring}\`~`);
    new Promise(async (resolve, reject) => {
        let result = await searcher.search(searchstring, { type: 'video' }).catch((err) => {
            var errorMsg = err.message;
            if (errorMsg.includes('\"reason\": \"dailyLimitExceeded\",')) 
            {
                errorMsg = errorMsg.slice(errorMsg.indexOf('Daily Limit Exceeded. '));
                errorMsg = errorMsg.slice(0, errorMsg.indexOf('\",'));
                msg.channel.send("fail: **Unable to complete playback:**\n" + errorMsg);
                return;
            } 
            else if (errorMsg.includes('\"reason\": \"quotaExceeded\",')) 
            {
                msg.channel.send("fail: Unable to complete playback! Google API quota exceeded!");
                return;
            } 
            else 
            {
                msg.channel.send("fail: Unknown error occurred! Playback could not be completed, check the logs for more details.");
                return console.log(err);
            }
        });
        if (result === undefined) return;
        resolve(result.first)
    }).then((res) => 
    {
        if (!res) return msg.channel.send("fail: Something went wrong. Try again!");
        res.requester = msg.author.id;
        if (searchstring.startsWith("https://www.youtube.com/") || searchstring.startsWith("https://youtu.be/")) res.url = searchstring;

        const embed = new discord.MessageEmbed();
        try {
            embed.setAuthor('Adding To Queue', client.user.avatarURL);
            var songTitle = res.title.replace(/\\/g, '\\\\')
            .replace(/\`/g, '\\`')
            .replace(/\*/g, '\\*')
            .replace(/_/g, '\\_')
            .replace(/~/g, '\\~')
            .replace(/`/g, '\\`');
            embed.addField(res.channelTitle, `[${songTitle}](${res.url})`);
            embed.setThumbnail(`https://img.youtube.com/vi/${res.id}/maxresdefault.jpg`);
            // .setImage
            // .setThumbnail
            embed.setFooter(`Requested by ${client.users.cache.get(res.requester).username}`, res.requesterAvatarURL);
            const resMem = client.users.cache.get(res.requester);
            msg.channel.send(
            {
                embed
            });
            const voiceChannel = msg.member.voice.channel;
    
            voiceChannel.join().then(connection => {
                const stream = ytdl(res.url, { filter: 'audioonly',quality: 'highestaudio'});
                const dispatcher = connection.play(stream);
    
                dispatcher.on('end', () => voiceChannel.leave());
            });
        } 
        catch (e) 
        {
            console.error(`[${msg.guild.name}] [playCmd] ` + e.stack);
        }
    })
};
