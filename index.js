"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nhentai_ts_1 = require("@shineiichijo/nhentai-ts");
var nhentai = new nhentai_ts_1.NHentai({ site: 'nhentai.to' }); //configuring a mirror site of the class (you can check the available sites here: https://github.com/LuckyYam/nhentai-ts/blob/master/src/lib/constants.ts#L1)

require('dotenv').config()
const { Client, Events, ComponentType, GatewayIntentBits, DMChannel,ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, REST, Routes, EmbedBuilder } = require('discord.js');
const axios = require("axios");
const { createCanvas, loadImage } = require('canvas');
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const util = require('./utils');
const bridge = require('./server-bridge');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

/**
 * server bridge
 */

client.on('messageCreate', async (message) => {
	if(message.author.bot) return;
	if(
		message.channel.id !== "1270932131216101477" && //1270932131216101477 Disorder
		message.channel.id !== "1270972186857050217" && //heso
		message.channel.id !== "1270930331645644800" &&//1270930331645644800 AWP
		message.channel.id !== "1270985458565775504" && //chillin
		message.channel.id !== "1271004304345534534" &&//pii
		message.channel.id !== "1267390785725403238" &&//shiro
		message.channel.id !== "1284484253408690228" &&//skibidj
		message.channel.id !== '1285971919082098760' //lize
	) return;
	if(
		message.author.id === "444052085927837720"
	) return message.reply("km dibanned");
	const regex = /\b(?:https?|ftp):\/\/(?:www\.)?[\w\-]+\.[\w\-]+(?:\.[\w\-]+)*(?:\/[\w\-.,@?^=%&:/~+#]*)?\b/;
	if(regex.test(message.content) === true) return message.reply('jangan ngirim link');
    console.log('Message received:', message.content); 
    await bridge.serverbridge(client, message); 
});

/**
 * BUAT NYOBA AI
 */

client.on(Events.MessageCreate, async message => {
	if(message.author.bot) return;
	if(
		message.channel.id !== '1268534290703061034' &&
		message.channel.id !== '1285977447438880910'
	) return;

	util.characterAI(message);
})

/**
 * WORKER
 */

client.once(Events.ClientReady, readyClient => {
	console.log(`${readyClient.user.tag} Login asuk`);
	client.user.setActivity('Community Discorder');
});

client.on(Events.MessageCreate, async message => {
	if(message.author.bot) return;

	let prefix = '##';
	const autor = message.member;
    const warnatai = autor.roles.cache.sort((a, b) => b.position - a.position).first().color;

	if(!message.content.startsWith(prefix)) return;
	if(message.channel instanceof DMChannel) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g); 
	const cmd = args.shift().toLowerCase();

	switch(cmd) {
		case "ping" :

			util.clientping(client, message);

			break;

		case 'ig' :
			
			util.igStalk(message, args);

			break;

		case "tiktok" :

			util.ttdl(message, args);

			break;

		case 'instagram' :
			
			util.instadl(message, args);

			break;

		case "avatar" :
			
			util.displayavatar(client, message, warnatai, args);

			break;

		case 'say' :

			util.botsay(message, args);
			
			break;

		case 'getdoujin' :

			util.doujindl(message, args);

			break;

		case 'nhentai' :

			util.getdoujin(message, args, warnatai);

			break;

	}
})

/**
 * BUAT LOGIN
 */
client.login(token);

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'views')));

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
