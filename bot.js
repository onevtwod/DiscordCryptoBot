const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;

const getCoinPrice = async () => {
    try {
        const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const price = response.data.bpi.USD.rate;
        return `The current price of Bitcoin is $${price}`;
    } catch (error) {
        console.error('Error fetching the coin price:', error);
        return 'Error fetching the coin price.';
    }
};

client.once('ready', () => {
    console.log('Bot is online!');

    const sendCoinPrice = async () => {
        const message = await getCoinPrice();
        const channel = await client.channels.fetch(channelId);
        channel.send(message);
    };

    // Send the coin price immediately when the bot starts
    sendCoinPrice();

    // Set an interval to send the coin price every minute
    setInterval(sendCoinPrice, 60000);
});

client.login(token);
