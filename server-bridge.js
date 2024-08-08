const { Client, Events, ComponentType, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, REST, Routes, EmbedBuilder } = require('discord.js');

var Filter = require('bad-words');
const badwords = require("indonesian-badwords");
var filter = new Filter({regex: /\*|\.|$/gi});

const monitoredChannels = {
    '643320097347207169': ['1270930331645644800'],
    '1261686963006865468': ['1270932131216101477'],
    '757100932885643355': ['1270972186857050217'], //heso
    '729166974420254824': ['1270985458565775504'], //chillin rafi
    '1234424310030930022': ['1271004304345534534'], //arcadia pii
    '1206167249304420362': ['1267390785725403238'], //shiro
  };

const serverbridge = async (client, message) => {
    if (message.author.bot) return;

    const { guild, channel, author, content } = message;
    const autor = message.member;
    const warnatai = autor.roles.cache.sort((a, b) => b.position - a.position).first().color;


    if (!author || !author.username || typeof author.username !== 'string') {
        console.error('Author name is invalid or missing.');
        return;
    }
    if (typeof content !== 'string') {
        console.error('Message content is invalid or missing.');
        return;
    }

    const sendMessagesPromises = [];

    sendMessagesPromises.push(
        (async () => {
            try {
                const sourceChannel = await client.channels.fetch(channel.id);
                if (sourceChannel) {
                    await sourceChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                                .setTitle(author.username)
                                .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                                .setDescription(badwords.censor(filter.clean(content)))
                                .setColor(warnatai)
                        ]
                    });
                    await message.delete();
                } else {
                    console.warn(`Source channel ${channel.id} not found.`);
                }
            } catch (error) {
                console.error(`Failed to send message to source channel ${channel.id}:`, error);
            }
        })()
    );

    for (const [serverId, channelIds] of Object.entries(monitoredChannels)) {
        if (serverId === guild.id && channelIds.includes(channel.id)) {
            for (const [targetServerId, targetChannelIds] of Object.entries(monitoredChannels)) {
                if (targetServerId !== serverId) {
                    targetChannelIds.forEach((targetChannelId) => {
                        sendMessagesPromises.push(
                            (async () => {
                                try {
                                    const targetChannel = await client.channels.fetch(targetChannelId);
                                    if (targetChannel) {
                                        await targetChannel.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                                                    .setTitle(author.username)
                                                    .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                                                    .setDescription(badwords.censor(filter.clean(content)))
                                                    .setColor(warnatai)
                                            ]
                                        });
                                    } else {
                                        console.warn(`Target channel ${targetChannelId} not found.`);
                                    }
                                } catch (error) {
                                    console.error(`Failed to send message to channel ${targetChannelId}:`, error);
                                }
                            })()
                        );
                    });
                }
            }
        }
    }

    // Wait for all messages to be sent
    try {
        await Promise.all(sendMessagesPromises);
        console.log('All messages sent successfully.');
    } catch (error) {
        console.error('Error sending messages:', error);
    }
};

module.exports = {
    serverbridge
}
