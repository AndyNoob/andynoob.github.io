var className = ".translate";
var replacementRegex = /\[(?<key>[^\s]+)\]/gm;

$(function () {
	changeLanguage();
});

function changeLanguage() {
	console.log("translating...");
	$.getJSON($("head").data("language-file"), (data) => {
		translate(data);
		console.log("translated!");
	});
}

function translate(data) {
	if (!data) {
		return;
	}

	$(className).text((index, text) => {
		let match;

		while ((match = replacementRegex.exec(text))) {
            let toReplace = data[match[1]];

            if (toReplace) {
                text = text.substr(match.index, text.length).replace(match[0], toReplace);
            }
		}

        return text;
	});
}
