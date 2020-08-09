module.exports = {
    name: 'clear',
    async execute(discord, client, ytdl, searcher, msg, command, suffix, args) 
    {
        const amount = args.join(' '); // Fügt das char Array zu einer Zahl zusammen

        if (!amount) return msg.reply('You haven\'t given an amount of messages which should be deleted!'); // Prüft ob eine Anzahl gegeben ist
        if (isNaN(amount)) return msg.reply('The amount parameter isn`t a number!'); //Überprüft ob die Anzahl eine Nummer ist
        
        
        if (amount > 100) return msg.reply('You can`t delete more than 100 messages at once!'); //Überprüft ob die Nazahl großer als 100 ist
        if (amount < 1) return msg.reply('You have to delete at least 1 msg!'); // Überprüft ob die Anzahl kleiner als 1 ist
        
        
        
        await msg.channel.messages.fetch({ limit: amount }).then(messages => { // Sammelt die Nachrichten
        
            msg.channel.bulkDelete(messages // Löscht alle Nachrichten innerhalb der Anzahl solange sie nicht älter als 14 Tage
        
        )});
	},
};
