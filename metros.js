$(window).resize(function () {
	if (this.resizeTO) clearTimeout(this.resizeTO);
	this.resizeTO = setTimeout(function () {
		$(this).trigger("resizeEnd");
	}, 500);
});

$(window).on("resizeEnd", function () {
	drawStatesMap();
	drawCountryMap();
});

window.onload = () => {
	getStatesData();
	getCountryData();
	// getCountryHistoricalData();
	getWorldCoronaData();
	// getUSACoronaData();
};

google.charts.load("current", {
	packages: ["geochart"],
	mapsApiKey: "AIzaSyBS5A8Rf6-2dLWdmSLKZMaNeMWX__t98ZM",
});
google.charts.setOnLoadCallback(drawStatesMap);
google.charts.setOnLoadCallback(drawCountryMap);

// WorldMapData

const getCountryData = () => {
	fetch("https://corona.lmao.ninja/v2/countries")
		.then((Response) => {
			return Response.json();
		})
		.then((info_c) => {
			showCountryDataOnMap(info_c);
			showCountryDataInTable(info_c);
			drawCountryMap(info_c);
			// console.log(info_c);
		});
};

const showCountryDataOnMap = (info_c) => {
	var world = info_c.map(function (table) {
		return {
			Flag: table.countryInfo.flag,
			Country: table.country,
			Cases: table.cases,
			Deaths: table.deaths,
			Recovered: table.recovered,
		};
	});
	// console.log(world);
};

function addColumns(dataTable) {
	dataTable.addColumn("string", "Country");
	dataTable.addColumn("number", "Cases");
	// dataTable.addColumn("number", "Deaths");
	// dataTable.addColumn("number", "Recovered");
	return true;
}

function addRow(dataTable, row) {
	dataTable.addRow([
		row.country,
		Number(row.cases),
		// Number(row.deaths),
		// Number(row.recovered),
	]);
}

function drawCountryMap(world) {
	var data = new google.visualization.DataTable();
	addColumns(data);
	for (var i = 0; i < world.length; i++) {
		addRow(data, world[i]);
	}
	var options = {
		region: "world",
		displayMode: "regions",
		resolution: "countries",
		geochartVersion: 10,
		backgroundColor: "none",
		enableRegionInteractivity: "true",
		forceIFrame: "true",
		keepAspectRatio: "true",
		// width: "700px",
	};

	var chart = new google.visualization.GeoChart(
		document.getElementById("Country_div")
	);

	chart.draw(data, options);
}

const showCountryDataInTable = (info_c) => {
	var html = "";
	info_c.forEach((country) => {
		html += `
								<tr>
												<td><img src=${country.countryInfo.flag} height="20" width = "20"> ${country.country}</td>
												<td>${country.cases}</td>
												<td>${country.recovered}</td>
												<td>${country.deaths}</td>
        </tr>
        `;
	});
	document.getElementById("Country-table-data").innerHTML = html;
};

// USStatsData

const getStatesData = () => {
	fetch("https://disease.sh/v3/covid-19/states")
		.then((Response) => {
			return Response.json();
		})
		.then((info_s) => {
			showStatesDataOnMap(info_s);
			showStatesDataInTable(info_s);
			drawStatesMap(info_s);
			// console.log(info_s);
		});
};

const showStatesDataOnMap = (info_s) => {
	var state = info_s.map(function (table) {
		return {
			Stat: table.state,
			Cases: table.cases,
			// Deaths: table.deaths,
			// Recovered: table.stats.recovered,
		};
	});

	// console.log(state);
};

function addStatesColumns(dataTable) {
	dataTable.addColumn("string", "state");
	dataTable.addColumn("number", "cases");
	// dataTable.addColumn("number", "Deaths");
	// dataTable.addColumn("number", "Recovered");
	return true;
}

function addStatesRow(dataTable, row) {
	dataTable.addRow([
		row.state,
		Number(row.cases),
		// Number(row.deaths),
		// Number(row.recovered),
	]);
}

function drawStatesMap(state) {
	var x = state.length;
	// console.log(x);
	var data = new google.visualization.DataTable();
	addStatesColumns(data);
	for (var i = 0; i < x; i++) {
		addStatesRow(data, state[i]);
	}
	var options = {
		region: "US",
		displayMode: "regions",
		resolution: "provinces",
		backgroundColor: "none",
		geochartVersion: 10,
		enableRegionInteractivity: "true",
	};

	var State_chart = new google.visualization.GeoChart(
		document.getElementById("States_div")
	);

	State_chart.draw(data, options);
}

const showStatesDataInTable = (info_s) => {
	var html = "";
	info_s.forEach((state) => {
		html += `
								<tr>
            <td>${state.state}</td>
												<td>${state.cases}</td>
												<td>${state.deaths}</td>
        </tr>
        `;
	});
	document.getElementById("States-table-data").innerHTML = html;
};

// historcal charts
// const getCountryHistoricalData = () => {
// 	fetch("https://disease.sh/v3/covid-19/historical?lastdays=7")
// 		.then((Response) => {
// 			return Response.json();
// 		})
// 		.then((info_ch) => {
// 			showStatesDataOnMap(info_ch);
// 			showChartDataInTable(info_ch);
// 			console.log(info_ch);
// 		});
// };

// const showChartDataInTable(info_ch);
// const showChartDataInTable = (info_ch) => {
// 	var hchart = info_ch.map(function (table) {
// 		return {
// 			// Stat: table.state,
// 			Cases: table.timeline.cases,
// 			// Deaths: table.deaths,
// 			// Recovered: table.stats.recovered,
// 		};
// 	});
// 	console.log(hchart.length);
// 	var a = hchart[1];
// 	console.log(a);
// };

// const test = (hchart) => {
// 	hcchart.forEach((elt) => {
// 		const hchart = elt.split(":");

// 	});

// };
// const changeDataSelection = (casesType) => {
// 	setSelectedTab(casesType);
// 	changeMapTitle(casesType);
// 	clearTheMap();
// 	showDataOnMap(coronaGlobalData, casesType);
// }
const getWorldCoronaData = () => {
	fetch("https://disease.sh/v3/covid-19/all")
		.then((response) => {
			return response.json();
		})
		.then((dataPia) => {
			buildPieChart(dataPia);
		});
};
const buildPieChart = (dataPia) => {
	var ctx = document.getElementById("worldPieChart").getContext("2d");
	var myPieChart = new Chart(ctx, {
		type: "pie",
		data: {
			datasets: [
				{
					data: [dataPia.cases, dataPia.recovered, dataPia.deaths],
					backgroundColor: ["#e53e3e", "#38a169", "#718096"],
				},
			],
			labels: ["Active", "Recovered", "Deaths"],
		},
		options: { responsive: true, maintainAspectRatio: false },
	});
};

// const getUSACoronaData = () => {
// 	fetch("https://api.covid19api.com/stats")
// 		.then((response) => {
// 			return response.json();
// 		})
// 		.then((dataPiaUSA) => {
// 			buildUSAPieChart(dataPiaUSA);
// 		});
// };
// const buildUSAPieChart = (dataPiaUSA) => {
// 	var ctx = document.getElementById("USAPieChart").getContext("2d");
// 	var myUSAPieChart = new Chart(ctx, {
// 		type: "pie",
// 		data: {
// 			datasets: [
// 				{
// 					data: [dataPiaUSA.cases, dataPiaUSA.recovered, dataPiaUSA.deaths],
// 					backgroundColor: ["#e53e3e", "#38a169", "#718096"],
// 				},
// 			],
// 			labels: ["Active", "Recovered", "Deaths"],
// 		},
// 		options: { responsive: true, maintainAspectRatio: false },
// 	});
// };
