import { browser } from "webextension-polyfill-ts";

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
