import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { stringify } from 'querystring';

@Injectable()
export class PuppeteerService {
    ipEl: string;
    btnEl: string;
    constructor(){
        this.ipEl='#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > div.react-autosuggest__container > input';
        this.btnEl='#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > button.nostyle.search-button > div';
    }
    async scrapeCoursera(category: string) {   
        const browser = await puppeteer.launch({
            headless: false,
            // defaultViewport: false,
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        })
        await page.goto('https://www.coursera.org/', {
            waitUntil: 'domcontentloaded'
        });
        // Type into search box.
        const inputEl = await page.waitForSelector(this.ipEl);
        await inputEl.type(category);
        const searchBtn = await page.waitForSelector(this.btnEl);
        await searchBtn.click({
            offset: {
                x: 5,
                y: 5
            }
        })
        // await browser.close();
    }
}
