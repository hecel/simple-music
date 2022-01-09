const { Client, Collection, MessageEmbed } = require("discord.js");
const bot = new Client({ disableMentions: "all" });
const ytdl = require("ytdl-core");
const choice = ["⏭️", "⏯️", "🔇", "🔉", "🔊", "🔁", "🔀",  "⏹️"];

bot.queue = new Collection();

function video_player(guild, song) {
    const song_queue = bot.queue.get(guild.id);

    if(!song) {
        song_queue.voice_channel.leave();
        bot.queue.delete(guild.id);
        song_queue.text_channel.send("Leave the voice channel...");
        if(bot.queue.loop === true) {
            !bot.queue.loop;
        } else return;
    }
    const stream = ytdl(song.url, { filter: "audioonly" });
    const dispatcher = song_queue.connection.play(stream, { seek: 0 }).on("finish", () => {
        // song_queue.songs.shift();
        // video_player(guild, song_queue.songs[0]);
        if(collector && !collector.ended) collector.stop();
        if(bot.queue.loop) {
            const lastSong = song_queue.songs.shift();
            song_queue.songs.push(lastSong);
            video_player(guild, song_queue.songs[0]);
        } else {
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0]);
        }
    });
    dispatcher.setVolumeLogarithmic(song_queue.volume / 100);
    const embed = new MessageEmbed()
    .setTitle("🎶 Now playing")
    .setColor("ffdd4d")
    .setDescription(`[${song.title}](${song.url})`)
    .setThumbnail(song.thumbnail)
    .setTimestamp();
    const m = await song_queue.text_channel.send(embed);

    for (const chot of choice) {
        await m.react(chot);
      }
        const filter = (rect, usr) => usr.id !== song_queue.bot.id;
        var collector = m.createReactionCollector(filter, { time: 600000, max: 1000 });
          collector.on("collect", (reaction, user) => {
          switch(reaction.emoji.name) {
            
            case "⏭️":
              reaction.users.remove(user).catch(console.error);
              if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
              if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");
              song_queue.connection.dispatcher.end();
              song_queue.text_channel.send("⏭️ Skipped the song.");
              break;

            case "⏯️":
              reaction.users.remove(user).catch(console.error);
              if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
              if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");

              if(song_queue.playing) {
                  song_queue.playing = false;
                  song_queue.connection.dispatcher.pause(true);
                  song_queue.text_channel.send(`${song_queue.author.author} ⏸️ Paused the music.`);
                } else {
                    song_queue.playing = true;
                    song_queue.connection.dispatcher.resume();
                    song_queue.text_channel.send(`${song_queue.author.author} ▶️ resumed the music.`);
                }
              break;

            case "🔇":
              reaction.users.remove(user).catch(console.error);
              if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
              if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");

              if(song_queue.volume <= 0) {
                  song_queue.volume = 100;
                  song_queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
                  song_queue.text_channel.send(`${song_queue.author.author} unmuted the music.`);
              } else {
                  song_queue.volume = 0;
                  song_queue.connection.dispatcher.setVolumeLogarithmic(0);
                  song_queue.text_channel.send(`${song_queue.author.author} muted the music.`);
              }
              break;

              case "🔉":
                reaction.users.remove(user).catch(console.error);
                if(song_queue.volume === 0) return;
                if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
                if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");
  
                if(song_queue.volume - 10 <= 0) song_queue.volume = 0;
                else song_queue.volume = song_queue.volume - 10;
                song_queue.connection.dispatcher.setVolumeLogarithmic(song_queue.volume / 100);
                song_queue.text_channel.send(`${song_queue.author.author} 🔉 decreased the volume, the volume is now ${song_queue.volume}`);
                break;

            case "🔊":
              reaction.users.remove(user).catch(console.error);
              if(song_queue.volume === 100) return;
              if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
              if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");
      
              if(song_queue.volume + 10 >= 100) song_queue.volume = 100;
              else song_queue.volume = song_queue.volume + 10;
              song_queue.connection.dispatcher.setVolumeLogarithmic(song_queue.volume / 100);
              song_queue.text_channel.send(`${song_queue.author.author} 🔊 increased the volume, the volume is now ${song_queue.volume}`);
              break;

            case "🔁":
              reaction.users.remove(user).catch(console.error);
              if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
              if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");
  
              bot.queue.loop = !bot.queue.loop;
  
              song_queue.text_channel.send(`Loop is now ${bot.queue.loop}`);
              break;

            // case "🔀":
            //   reaction.users.remove(user).catch(console.error);
            //   if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
            //   if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");

            //   let randomSongs = song_queue.songs[Math.floor(Math.random() * song_queue.songs.length)];
            //   song_queue.songs.push(randomSongs);

            //   song_queue.text_channel.send(`${song_queue.author.author} 🔀 shuffle is now on`);
            //   break;
            
            case "⏹️":
              reaction.users.remove(user).catch(console.error);
              if(!song_queue.voice_channel) return song_queue.text_channel.send("You must be in the same voice channel!");
              if(!song_queue) return song_queue.text_channel.send("There are no songs in queue.");
              song_queue.songs = [];
              song_queue.connection.dispatcher.end();
              song_queue.text_channel.send("⏹️ Stop the music and leave the voice channel.");
              break;
              
            default:
              reaction.users.remove(user).catch(console.error);
              break;
          }
        });
        collector.on("end", () => {
            m.reactions.removeAll().catch(console.error);
            if(m && !m.deleted) {
                m.delete({ timeout: 2000 }).catch(console.error);
            }
        });
}

function skip(message, server_queue) {
    if(!message.member.voice.channel) return message.channel.send("You must be in the same voice channel!");
    if(!server_queue) return message.channel.send("There are no songs in queue.");
    server_queue.connection.dispatcher.end();
    message.channel.send("⏭️ Skipped the song.");
}

function stop(message, server_queue) {
    if(!message.member.voice.channel) return message.channel.send("You must be in the same voice channel!");
    if(!server_queue) return message.channel.send("There are no songs in queue.");
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
    message.channel.send("⏹️ Stop the music and leave the voice channel.");
}

function loop(message, server_queue) {
    //const queue = bot.queue.get(message.guild.id);
    if(!server_queue.voice_channel) return message.channel.send("You must be in the same voice channel!");
    if(!server_queue) return message.channel.send("There are no songs in queue.");

    if(bot.queue.loop) {
        bot.queue.loop = false;
        message.channel.send("Loop now is **off**");
    } else {
        bot.queue.loop = true;
        message.channel.send("Loop now is **on**");
    }
}

module.exports = { video_player, skip, stop, loop };