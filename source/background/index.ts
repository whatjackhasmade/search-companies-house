import { browser } from "webextension-polyfill-ts";

import numbers from "../../scrape/found/all.json";

function randomCompany(): void {
	const number = numbers[Math.floor(Math.random() * numbers.length)];

	browser.tabs.create({
		url: `https://find-and-update.company-information.service.gov.uk/company/${number}`,
	});
}

browser.contextMenus.create({
	title: "Random Company",
	onclick: randomCompany,
});

function searchOnCompaniesHouse(info: any): void {
	const txt = info.selectionText;

	browser.tabs.create({
		url: `https://find-and-update.company-information.service.gov.uk/search?q=${txt}`,
	});
}

browser.contextMenus.create({
	title: "Search on Companies House",
	contexts: ["selection"],
	onclick: searchOnCompaniesHouse,
});
