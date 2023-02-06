// strips html off the given string as chart.js doesn't support html in labels,
// and breaks longer texts into multiple lines
export const makeLabelText = (text: string): string | string[] => {
	const processedText = text
		.replace(/(<([^>]+)>)/gi, "")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&");

	const MAX_LINE_LENGTH = 100;

	const LINE_LENGTH =
		processedText.length > MAX_LINE_LENGTH || processedText.length < MAX_LINE_LENGTH / 1.5
			? MAX_LINE_LENGTH
			: Math.ceil(processedText.length / 2);

	if (processedText.length < LINE_LENGTH) {
		return processedText;
	}
	// try to break at a point that makes the lines balanced in length
	// and break when encountering a space to avoid warping mid-word
	const breakPivot =
		processedText.length > MAX_LINE_LENGTH * 2
			? LINE_LENGTH
			: Math.floor(processedText.length / 2);
	const breakFirstLineAt = findNearestSpace(processedText, breakPivot);

	const remaining = processedText.slice(breakFirstLineAt);

	if (remaining.length <= LINE_LENGTH) {
		// two lines are enough, no need to break text into a third line
		return [processedText.slice(0, breakFirstLineAt), remaining];
	}

	const breakSecondLineAt = findNearestSpace(remaining, LINE_LENGTH);

	return [
		processedText.slice(0, breakFirstLineAt),
		remaining.slice(0, breakSecondLineAt),
		remaining.slice(breakSecondLineAt, LINE_LENGTH + breakSecondLineAt) +
			(remaining.slice(breakSecondLineAt).length > LINE_LENGTH ? "..." : ""),
	];
};

const findNearestSpace = (text: string, index: number): number => {
	let i = 0;
	while (i < text.length) {
		if (text.charAt(index - i) === " ") {
			return index - i;
		}
		if (text.charAt(index + i) === " ") {
			return index + i;
		}
		i++;
	}
	return -1;
};
