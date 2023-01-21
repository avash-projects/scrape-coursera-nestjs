import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { stringify } from 'querystring';

@Injectable()
export class PuppeteerService {
    ipSel: string;
    btnSel: string;
    resSel: string;

    constructor() {
        this.ipSel = '#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > div.react-autosuggest__container > input';
        this.btnSel = '#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > button.nostyle.search-button > div';
        this.resSel = ".css-ilhc4l";
    }

    async scrapeCoursera(category: string) {
        const {page,browser} = await this.searchCoursera(category);
    }

    async searchCoursera(category: string) {
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
            waitUntil: 'networkidle2'
        });
        // Type into search box.
        const inputEl = await page.waitForSelector(this.ipSel);
        await inputEl.type(category);
        const searchBtn = await page.waitForSelector(this.btnSel);
        await searchBtn.click({
            offset: {
                x: 5,
                y: 5
            }
        });
        await page.waitForNavigation();
        return { browser, page };
    }


}
