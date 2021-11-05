// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const faker = require("faker");

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function randomMinute(min, max) { // min and max included
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
    listItems.each((idx, el) => {
			const href = el.attribs.href;
			const number = /[^/]*$/.exec(href)?.[0];

      // Object holding data for each country/jurisdiction
      const company = number;

      // Populate companies array with company data
      companies.push(company);
    });

		return companies;
  } catch (err) {
    console.error(err);
  }
}

// Invoke the above function
(async () => {
	const count = Array.from({ length: 20 });

	const all = count.map(() => {
		const minute = randomMinute(5, 20);
		const time = minute * 1000 * 60;

		console.log(`Waiting for ${minute} minutes`);

		return new Promise((resolve) => setTimeout(() => {
			resolve(scrapeData());
		}, time))
	});

	const resolved = await Promise.all(all);

	const latest = resolved.flat();

	fs.readFile('./list/found/all.json',  (err, data) => {
		const json = JSON.parse(data)
    json.push(...latest)

		const unique = [...new Set(json)];

		// Write companies array in companies.json file
		fs.writeFile("./list/found/all.json", JSON.stringify(unique, null, 2), (err) => {
				if (err) {
					console.error(err);
					return;
				}
				console.log("Successfully written data to file");
			})
		})
})();
