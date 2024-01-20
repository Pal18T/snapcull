import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice } from '../utils';
export async function scrapeAmazonProduct(url: string) {
    if (!url) return;

    //  curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_7b0ec108-zone-unblocker:xi9jx80ve0ai -k https://lumtest.com/myip.json

    //Brightdata
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,

        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
        
    }
    try {
        //fetching product page
        const response = await axios.get(url,options);
        const $ = cheerio.load(response.data);

        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price')
        );
        console.log(title, currentPrice);
    } catch (error) {
        throw new Error('Failed to scratch products: ${error.message}')
    }
}