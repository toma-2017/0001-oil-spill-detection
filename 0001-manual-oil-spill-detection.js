// Create region of interest
var coastal_roi = ee.Geometry.Polygon([
  [
    [-58.0, 6.0],  // Western boundary
    [-54.0, 6.0],  // Eastern boundary
    [-54.0, 4.8],  // Southeastern boundary
    [-58.0, 4.8]   // Southwestern boundary
  ]
]);

Map.centerObject(coastal_roi);

// Load Sentinel-1 data
var sen1 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .select('VV')
  .filterDate('2021-01-01', '2021-12-31')
  .filterBounds(coastal_roi)
  .filter(ee.Filter.calendarRange(10, 10, 'month'))
  .filter(ee.Filter.calendarRange(4, 4, 'day_of_month'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .mosaic();

Map.addLayer(sen1.clip(coastal_roi), {min: -30, max: 0}, 'Sentinel-1 VV', false);

// Histogram of original image
print(ui.Chart.image.histogram(sen1, coastal_roi, 100));

// Apply despeckling filter
var despeckel = sen1.focalMean(100, 'square', 'meters');
Map.addLayer(despeckel.clip(coastal_roi), {min: -30, max: 0}, 'Despeckled Image', false);

// Histogram of despeckled image
print(ui.Chart.image.histogram(despeckel, coastal_roi, 100));

// Thresholding for oil spill detection
var thr = despeckel.lt(-22);
Map.addLayer(thr.clip(coastal_roi), {}, 'Oil Spill Detection', false);

// Create mask and display contaminated areas in red
var mask = thr.updateMask(thr);
Map.addLayer(mask.clip(coastal_roi), {palette: ['red']}, 'Masked Oil Spill');

// Calculate contaminated area in square meters
var area = mask.multiply(ee.Image.pixelArea());

var oil_spill_area_m2 = ee.Number(area.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: coastal_roi,
  scale: 100,
  maxPixels: 1e13
}).values().get(0)).format('%.2f');

print('Estimated Oil Spill Area (m²):', oil_spill_area_m2);

// Convert the mask to vectors
var oil_spill_vector = mask.reduceToVectors({
  geometry: coastal_roi,
  scale: 100,
  geometryType: 'polygon',
  eightConnected: false
});

Map.addLayer(oil_spill_vector, {color: 'red'}, 'Oil Spill Vectors');

// Export results as shapefile
Export.table.toDrive({
  collection: oil_spill_vector,
  description: 'oil_spill_suriname_coastal_region',
  fileFormat: 'SHP',
  folder: 'oil_spill_data'
});

// Add a title and area label to the map
oil_spill_area_m2.evaluate(function(areaValue) {
  var areaInKm2 = (parseFloat(areaValue) / 1e6).toFixed(2);  // Convert from m² to km²

  var title = ui.Label('Oil Contamination of Corantijn River of Suriname in 2021', {
    fontWeight: 'bold',
    fontSize: '24px',
    textAlign: 'center',
    stretch: 'horizontal'
  });

  var areaLabel = ui.Label('Estimated Oil Spill Area (km²): ' + areaInKm2, {
    fontSize: '16px',
    textAlign: 'center',
    stretch: 'horizontal'
  });

  var titlePanel = ui.Panel({
    widgets: [title, areaLabel],
    layout: ui.Panel.Layout.flow('vertical'),
    style: {
      position: 'top-center',
      padding: '10px',
      backgroundColor: 'white'
    }
  });

  Map.add(titlePanel);

  // Add legend
  var legend = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px',
      backgroundColor: 'white'
    }
  });

  var legendTitle = ui.Label('Legend', {fontWeight: 'bold'});
  var redBox = ui.Label('■ ', {color: 'red', fontSize: '16px'});
  var redLabel = ui.Label('Contaminated Area');

  legend.add(legendTitle);
  legend.add(ui.Panel([redBox, redLabel], ui.Panel.Layout.Flow('horizontal')));

  Map.add(legend);
});

