# turf-boxaround

## BoxAround

Finds a box around any feature or feature collection.

**Parameters**

- Feature<Any> The shapes to get the box around.
- options.paddingMeters<Number> The meters of padding to add to the shape on all sides. *Defaults to 10,000 Meters*

**Examples**

```javascript

const polygon = turf.polygon([[
  [128, -26],
  [141, -26],
  [141, -21],
  [128, -21],
  [128, -26]
]]);

const boxPolygon = boxAround(polygon);

```