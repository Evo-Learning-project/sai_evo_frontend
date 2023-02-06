export const scoreChartOptions = {
	responsive: true,
	maintainAspectRatio: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		x: {
			display: true,
			grid: { display: false },
			title: {
				display: true,
				text: _("event_participation_headings.grade"),
			},
		},
		y: {
			display: true,
			grid: { display: true },
			ticks: { stepSize: 2, beginAtZero: true },
		},
	},
};

export const passedTestCasesBarChartOptions = {
	...scoreChartOptions,
	scales: {
		...scoreChartOptions.scales,
		x: {
			...scoreChartOptions.scales.x,
			title: {
				display: true,
				text: _("misc.passed_tests"),
			},
		},
	},
};

export const exerciseChoicesBarChartOptions = {
	indexAxis: "y",
	responsive: true,
	maintainAspectRatio: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		x: {
			display: true,
			grid: { display: false },
			ticks: { stepSize: 2, beginAtZero: true },
			title: {
				display: true,
				text: _("event_stats.selections"),
			},
		},
		y: {
			display: true,
			grid: { display: false },
			//ticks: { font: { size: 22 } },
		},
	},
};

export const scoreChartDatasetSettings = {
	backgroundColor: "#6a16f099",
	maxBarThickness: 100,
};

export const exerciseChoiceDatasetSettings = {
	backgroundColor: "#10B981b3",
	maxBarThickness: 40,
};
