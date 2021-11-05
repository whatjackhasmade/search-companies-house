const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const faker = require("faker");

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function randomSecond(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Async function which scrapes the data
async function scrapeData() {
	const word = faker.random.word();

  try {
    // Fetch HTML of the page we want to scrape
    const res = await fetch(`https://find-and-update.company-information.service.gov.uk/search?q=${word}`);
		const body = await res.text();

    // Load HTML we fetched in the previous line
    const $ = cheerio.load(body);

    // Select all the list items in plainlist class
    const listItems = $(".type-company h3 a");

    // Stores data for all companies
    const companies = [];

    // Use .each method to loop through the li we selected
    listItems.each(async (idx, el) => {
			const title = el.children?.[0].data?.trim()?.replace(/^\s+|\s+$/g, '');
			const href = el.attribs.href;
			const companyId = /[^/]*$/.exec(href)?.[0];

      // Object holding data for each country/jurisdiction
      const data = { title, companyId };

      // Populate companies array with company data
			await prisma.company.create({
				data
			})
    });
  } catch (err) {
    console.error(err);
  }
}

// Invoke the above function
(async () => {
	const count = Array.from({ length: 20 });

	for (const item of count) {
		await scrapeData();

		const second = randomSecond(10, 120);
		const time = second * 1000;

		console.log(`Waiting for ${second} seconds`);

		await sleep(time);
	}

	await prisma.$disconnect()
})();
