const fileSys = require('fs');
const Discord = require('discord.js');
const {YTSearcher} = require('ytsearcher');
const { pre, token, YTKey } = require('./config.json');
const searcher = new YTSearcher(YTKey);
const ytdl = require('ytdl-core');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const Commands = fileSys.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of Commands) 
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => 
{
  console.log(`Logged in as ${client.user.tag}!`);   
})

client.on("message", (msg) => {
    const message = msg.content.trim();
    const command = message.substring(pre.length).split(/[ \n]/)[0].trim();
    const suffix = message.substring(pre.length + command.length).trim();
    const args = message.slice(pre.length + command.length).trim().split(/ +/g);
})

client.on('message', msg => 
{
    if (!msg.content.startsWith(pre) || msg.author.bot) return
    const message = msg.content.trim();
    const command = message.substring(pre.length).split(/[ \n]/)[0].trim();
    const suffix = message.substring(pre.length + command.length).trim();
    const args = message.slice(pre.length + command.length).trim().split(/ +/g);
    let cmd = command;
    cmd = cmd.toLowerCase();

    if (!client.commands.has(cmd))return
    try {client.commands.get(command).execute(message, command, suffix, args); msg.delete({ timeout: 500 })} 
    catch (error) 
    {
        console.error(error);
        message.reply('comand could not be executed');
    }

})

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.login(token);