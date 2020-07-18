window.onload = () => {
	getStatesData();
};

google.charts.load("current", {
	packages: ["geochart"],
	// mapsApiKey: "AIzaSyBS5A8Rf6-2dLWdmSLKZMaNeMWX__t98ZM",
});
google.charts.setOnLoadCallback(drawStatesMap);

const getStatesData = () => {
	fetch("https://disease.sh/v3/covid-19/states")
		.then((Response) => {
			return Response.json();
		})
		.then((info) => {
			showDataOnMap(info);
			showDataInTable(info);
			drawStatesMap(info);
			// console.log(info);
		});
	// console.log(typeof info);
};

const showDataOnMap = (info) => {
	var region = info.map(function (table) {
		return {
			Stat: table.state,
			Cases: table.cases,
			// Deaths: table.deaths,
			// Recovered: table.stats.recovered,
		};
	});

	console.log(region);
};

const showDataInTable = (info) => {
	var html = "";
	info.forEach((state) => {
		html += `
								<tr>
            <td>${state.state}</td>
												<td>${state.cases}</td>
												<td>${state.deaths}</td>
        </tr>
        `;
	});
	document.getElementById("table-data").innerHTML = html;
};

function addColumns(dataTable) {
	// Data columns
	dataTable.addColumn("string", "state");
	dataTable.addColumn("number", "cases"); // Name of the State or County to display
	// dataTable.addColumn("number", "Deaths");
	// dataTable.addColumn("number", "Recovered");
	// dataTable.addColumn("number", "Something per 100,000");

	return true;
}

// Populates states and counties data tables
function addRow(dataTable, row) {
	dataTable.addRow([
		row.state, // State/County code
		Number(row.cases), // State/County name
		// Number(row.deaths), // Population
		// Number(row.recovered), // Something
		// Number(row.e), // Something per 100,000
	]);
}
function drawStatesMap(region) {
	var x = 62;
	console.log(x);
	var data = new google.visualization.DataTable();
	addColumns(data);
	for (var i = 0; i < x; i++) {
		addRow(data, region[i]);
	}
	var options = {
		region: "US",
		displayMode: "regions",
		resolution: "provinces",
		backgroundColor: "none",
		enableRegionInteractivity: "true",
	};

	var chart = new google.visualization.GeoChart(
		document.getElementById("States_div")
	);

	chart.draw(data, options);
}

$(window).resize(function () {
	drawStatesMap();
});
