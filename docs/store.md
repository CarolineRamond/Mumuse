

### Modules
Each module handles an independant data chunk of the application (ex: medias, users, rastertiles, etc).

A module exports :
* a reducer*
* a set of actions*
* a set of selectors*
* a map configuration object (optional)

Reducers, actions, selectors & mapConfigs are all merged and exposed in modules/index.js.

**/!\ A module that has layers & sources as parts of its state must implement the methods getLayersState() & getSourcesState() in its selectors /!\\**
(this way, layers & sources will be exposed and added by map)


### Store organization


```js static
{
	world: {
		lng: Number, // map longitude as given by mapbox
		lat: Number, // map latitude as given by mapbox
		zoom: Number, // map zoom as given by mapbox,
		bounds: [LngLat], // map bounds as given by mapbox (LngLat is a mapbox class)
		previewMode: Boolean // is map in preview mode (ie small)
	},
	medias: {
		sources: Object ({ sourceId => Source }), // medias-related map sources 
		layers: Object ({ layerId => Layer }), // medias-related map layers 
		timeline: Number, // timeline value => to put into map state (not only relative to medias)
		selectFilterPending: Boolean // whether a select filter is begin applied (useful to count medias)
	},
	potree: {
		layers: Object ({ layerId => Layer }), // pointcloud-related map layers ,
		sources: Object ({ sourceId => Source }), // pointcloud-related map sources 
	},
	auth: {
		authUser: ServerResource, // authenticated user data
		login: ServerResource // login data
		logout: ServerResource // logout data
		register: ServerResource // register data
		forgotPassword: ServerResource // forgotPassword data
		resetPassword: ServerResource // reset password data
	},
	users: {
		usersList: ServerResource, // users list data (for admin only)
		currentUser: ServerResource, // user data (admin only)
		createUser: ServerResource, // create user data (admin only)
		updateUser: ServerResource,	// update user data (admin only)
		deleteUsers: ServerResource // delete user data (admin only)
	},
	rastertiles: {
		pending: Boolean, // true if rastertiles are being fetched from server
		error: String, // server error
		layers: {Layer}, // rastertile layers
		sources: {Source} // rastertile sources
	}
}
```

### ServerResource

```js static
ServerResource: {
	pending: Boolean, // whether a server request is on going
	error: String, // server error
	data: Object // returned server data
}
```

Example : 
```js static
authUser: {
	pending // whether authenticated user is being retrieved
	error // if an error occured when retrieving authenticated user
	data // authenticated user
}
```

### Layers

```js static
Layer : {
	// cf mapbox layer definition : same attributes +
	metadata: {
		name: String, // layer display name
		priority: Number, // layer priority (equivalent to "z-index")
		isLocked: Boolean, // if locked, user can't interact with this layer 
						// (ex: medias-layer is locked where there are too much medias)
		isShown: Boolean, // whether layer is displayed on map
		wasShownBeforeLock: Boolean, // used on unlock to know if layer should be displayed again
		isInBounds: Boolean, // optional, whether layer is in map bounds (used for rastertilesets)
	/!\ didChange: { // used to update map layer on next react render
			paint: {paintProperties->paintValue} // paint properties (cf mapbox) that will change on next react render,
			layout: {layoutProperties-> layoutValue} // layout properties (cf mapbox) that will change on next react render,
			filter: Boolean, // whether map should update layer's filter on next react render,
			zoom: Boolean // whether map should update layer's min/maxzoom on next react render
		}
	}
}
```

### Sources

```js static
Source : {
	// cf mapbox source definition : same attributes +
	metadata: {
	/!\ didChange: Boolean, // true if source shall be reloaded on next react render
		loaded: Boolean, // true when source is added to map
		renderedFeatures: [Features] // optional, currently rendered features (used for medias)
		selectFilterPending: Boolean, // used only for selected-medias source, true if a select filter is being applied,
		stillFiltered: [Features] // used only for selected-medias source, features that are still filtered on medias-source
								  // (empty when no select filter is being applied)
	}
}
```

#### Special case : pointClouds-source

PointClouds source is a GeoJSON source containing all available pointclouds on map. Each feature is taken from the server and its properties are enriched with three additional attributes :
```js static
{
	_isShown: Boolean // whether pointcloud should be visible on map
	_isInBounds: Boolean // whether pointcloud is in current map bounds
	_isSelected: Boolean // whether pointcloud is currently selected
}
```

Example : this pointcloud feature is in map bounds, non visible on map, and selected (visible in preview)
```js static
feature = {
	type: 'Feature',
	geometry: { ... },
	properties: {
		...,
		_isShown: false
		_isInBounds: true
		_isSelected: true
	}
}
```


### Special fields (/!\\) 

When set to true or non-undefined, the fields marked with /!\ will induce a map change.

When an action should not trigger such a map change, the fields must be **explicitely** set to false or undefined 
(else, they are identical to previous state's fields, which might trigger the map change)


## Map configuration

Apart from layers and sources, map shall be given configuration to execute redux actions on user interactions.

As redux actions are functions, they are not serializable. Thus, they **should not** be put into the store.

### Clicks

```js static
click: [{
	layerIds: [String] // the layers to detect click on,
	action: Function // the action to be fired on click
}]
```

### Dragndrop

```js static
dragndrop: [{
    layerId: String // the layer containing draggable features
    mousedown: Function, // the action to be fired on mousedown
    mousemove: Function, // the action to be fired on mousemove (if a feature is dragged)
    mouseup: Function 	// the action to be fired on mousedown (if a feature was dragged)
}]
```

### Moveend

```js static
moveend: [Function] // array of actions to be fired on moveend
```

### Update currently rendered features

```js static
renderedFeatures: [{
    layerIds: [String], // layers containing the features to count
    source: String, // associated source id
    				// (map will wait until source is loaded to count features)
    uniqueKey: String, // features unique key (to avoid duplicates)
    action: Function // action to be fired when rendered features are retrieved
}]
```