import puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { getUrl } from './puppeteer.util';
import { json2csv } from 'src/utils';
import { IJSON } from 'src/utils/dto';
import { ScrapeDto } from './dto';

@Injectable()
export class PuppeteerService {
    private ipSel: string;
    private btnSel: string;
    private resSel: string;

    constructor() {
        this.ipSel = '#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > div.react-autosuggest__container > input';
        this.btnSel = '#rendered-content > div > header > div > div > div > div:nth-child(1) > div.rc-SearchBarContainer > div > form > div > div > div.rc-AutoComplete.horizontal-box.isLohpRebrand > button.nostyle.search-button > div';
        this.resSel = 'div [data-e2e="ProductCard"]';
    }

    async scrapeCoursera(dto: ScrapeDto) {
        try {
            const category = dto.query;
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setViewport({
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1,
            })
            page.setDefaultNavigationTimeout(0);
            // await page.setRequestInterception(true);
            // page.on('request', (req) => {
            //     if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            //         req.abort();
            //     }
            //     else {
            //         req.continue();
            //     }
            // });
            await page.goto(getUrl(category), { waitUntil: 'networkidle2', timeout: 300000 })
                .then(() => {
                    console.log("redir successful")
                }).catch(err => {
                    console.log("redir err:", err)
                });
            const courses: IJSON[] = [];
            let nextDisabled = false;
            while (!nextDisabled) {
                console.log("next")
                await page.waitForSelector(this.resSel, {
                    visible: true,
                });
                const data = await page.$$eval(this.resSel, d => {
                    return d.map(el => ({
                        name: el.querySelector(".css-bku0rr")?.textContent || 'N/A',
                        provider: el.querySelector(".css-2fzscr")?.textContent || 'N/A',
                        description: el.querySelector(".css-5or6ht")?.textContent || 'N/A',
                        rating: el.querySelector("div.css-ilhc4l > div:nth-child(2) > div > p.cds-33.css-14d8ngk.cds-35")?.textContent || "N/A",
                        duration: el.querySelector("div.css-ilhc4l > div:nth-child(2) > p")?.textContent.split("·")[2] || "N/A",
                    }))
                });
                courses.push(...data);
                // query the next disabled button
                await page.waitForSelector("aria/Next Page");
                nextDisabled = await page.evaluate(() => {
                    const nextButton = document.querySelector(`[aria-label="Next Page"]`) as HTMLButtonElement;
                    return nextButton.disabled;
                });
                if (nextDisabled) {
                    break;
                }
                await Promise.all([
                    page.click(`aria/Next Page`),
                    page.waitForNavigation(),
                ]);
            }
            await browser.close();
            json2csv(courses,category)
        } catch (err) {
            return new Error('Internal server error.');
        }

    }

    async searchCoursera(category: string) {
        const browser = await puppeteer.launch({
            headless: false,
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
        await Promise.all([
            page.click(this.btnSel),
            page.waitForNavigation(),
        ])
        return 1;
    }
}
