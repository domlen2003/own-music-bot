# Musik Bot

This is as simple Discord-Bot based on discord.js to play music.



## Current Commands

Play Command: Plays a searched song.
```js
name: 'play',
    execute(discord, client, ytdl, searcher, msg, command, suffix, args) 
    {
        playFunction(msg, suffix, searcher, discord, client, ytdl)
    }
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
