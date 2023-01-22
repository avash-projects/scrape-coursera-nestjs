import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from "fs";
import { stringify } from 'querystring';

@Injectable()
export class PuppeteerService {
    private ipSel: string;
    private btnSel: string;
    private resSel: string;
    private sel: string;

    constructor() {
        this.ipSel = '#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > div.react-autosuggest__container > input';
        this.btnSel = '#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > button.nostyle.search-button > div';
        this.resSel = 'div [data-e2e="ProductCard"]';
        this.sel = `.css-ilhc4l`;
    }

    async scrapeCoursera(category: string) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        })
        page.setDefaultNavigationTimeout(0);
        await page.goto(this.getUrl(category), { waitUntil: 'networkidle2', timeout: 300000 })
            .then(() => {
                console.log("redir successful")
            }).catch(err => {
                console.log("redir err:", err)
            });
        await page.waitForSelector(this.resSel, {
            visible: true,
        });
        // cds-33 css-2fzscr cds-35
        // name cds-33 css-bku0rr cds-35
        // desc css-5or6ht
        // duration css-14d8ngk
        const data = await page.$$eval(this.resSel, d => {
            return d.map(el => ({
                name: el.querySelector(".css-bku0rr").textContent,
                provider: el.querySelector(".css-2fzscr").textContent,
                description: el.querySelector(".css-5or6ht").textContent,
                // rating: el.querySelector("div > .css-pn23ng > .css-14d8ngk").textContent || "N/A"
                // duration: el.querySelector(".css-14d8ngk").textContent,
            }))
        });
        // console.log(data);
        // const elHandles = await page.$$(this.sel);
        // const courseInfo = [];
        // const data = await page.evaluate(() => {
        //     const card
        // })
        // // data.forEach(e => {

        // })
        // const data = await page.evaluate(() => {
        //     return Array.from(document.querySelectorAll(this.resSel), e =>({
        //         title: e.querySelector(".cds-33 .css-2fzscr .cds-35").textContent
        //     }));
        // });

        console.log([...data]);
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
        await page.type(this.ipSel, category);
        // Type into search box.
        // const inputEl = await page.waitForSelector(this.ipSel);
        // await inputEl.type(category);
        // const searchBtn = await page.waitForSelector(this.btnSel);
        await Promise.all([
            page.click(this.btnSel),
            page.waitForNavigation(),
            // await searchBtn.click({
            //     offset: {
            //         x: 5,
            //         y: 5
            //     }
            // })

        ])
        return { browser, page };
    }

    getUrl(category: string) {
        const input = category.replace(" ", "%20")
        const url = `https://www.coursera.org/search?query=${input}`
        return url
    }
}
