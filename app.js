window.onload = () => {
	getCountryData();
};
google.charts.load("current", {
	packages: ["geochart"],
	// mapsApiKey: "AIzaSyBS5A8Rf6-2dLWdmSLKZMaNeMWX__t98ZM",
});
google.charts.setOnLoadCallback(drawWorldMap);

const getCountryData = () => {
	fetch("https://corona.lmao.ninja/v2/countries")
		.then((Response) => {
			return Response.json();
		})
		.then((info) => {
			showDataOnMap(info);
			showDataInTable(info);
			drawWorldMap(info);
			// console.log(typeof info);
		});
	// console.log(typeof info);
};

const showDataOnMap = (info) => {
	var region = info.map(function (table) {
		return {
			Flag: table.countryInfo.flag,
			Country: table.country,
			Cases: table.cases,
			Deaths: table.deaths,
			// Recovered: table.recovered,
		};
	});
	console.log(region);
};

const showDataInTable = (info) => {
	var html = "";
	info.forEach((country) => {
		html += `
								<tr>
												<td><img src=${country.countryInfo.flag} height="20" width = "20"></td>
            <td>${country.country}</td>
												<td>${country.cases}</td>
												<td>${country.recovered}</td>
												<td>${country.deaths}</td>
        </tr>
        `;
	});
	document.getElementById("table-data").innerHTML = html;
};

function addColumns(dataTable) {
	// Data columns
	dataTable.addColumn("string", "Country");
	dataTable.addColumn("number", "Cases"); // Name of the State or County to display
	// dataTable.addColumn("number", "Deaths");
	// dataTable.addColumn("number", "Recovered");
	// dataTable.addColumn("number", "Something per 100,000");

	return true;
}

// Populates states and counties data tables
function addRow(dataTable, row) {
	dataTable.addRow([
		row.country, // State/County code
		Number(row.cases), // State/County name
		// Number(row.deaths), // Population
		// Number(row.recovered), // Something
		// Number(row.e), // Something per 100,000
	]);
}
function drawWorldMap(region) {
	var data = new google.visualization.DataTable();
	addColumns(data);
	for (var i = 0; i < region.length; i++) {
		addRow(data, region[i]);
	}
	var options = {
		region: "world",
		displayMode: "regions",
		resolution: "countries",
		geochartVersion: 10,
		backgroundColor: "#81d4fa",
		enableRegionInteractivity: "true",
		// magnifyingGlass.zoomFactor: 7.5,
		// colorAxis: { colors: ["green", "blue"] },
	};

	var chart = new google.visualization.GeoChart(
		document.getElementById("regions_div")
	);

	chart.draw(data, options);
}
