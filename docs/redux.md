

### Modules
Each module handles an independant data chunk of the application (ex: medias, users, rastertiles, etc).

A module exports :
* a reducer*
* a set of actions*
* a set of selectors*
* a map configuration object (optional)

Reducers, actions, selectors & mapConfigs are all merged and exposed in modules/index.js.

/!\ A module that has layers & sources as parts of its state must implement the methods getLayersState() & getSourcesState() in its selectors.
(this way, layers & sources will be exposed and added by map)


### Store organization


```html
{
	world: {
		lng: Number, // map longitude as given by mapbox
		lat: Number, // map latitude as given by mapbox
		zoom: Number, // map zoom as given by mapbox,
		bounds: [LngLat], // map bounds as given by mapbox (LngLat is a mapbox class)
		previewMode: Bool, // is map in preview mode (ie small)
	/!\	shouldMapResize: Bool // whether map should resize on next react render
	},
	medias: {
		sources: {Source}, // medias-related map sources 
		layers: {Layer}, // medias-related map layers 
		timeline: Number, // timeline value => to put into map state (not only relative to medias)
		selectFilterPending: Bool // whether a select filter is begin applied (useful to count medias)
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
		pending: Bool, // true if rastertiles are being fetched from server
		error: String, // server error
		layers: {Layer}, // rastertile layers
		sources: {Source} // rastertile sources
	}
}
```

### Layers

```html
Layer : {
	// cf mapbox layer definition : same attributes +
	metadata: {
		name: String, // layer display name
		priority: Number, // layer priority (equivalent to "z-index")
		isLocked: Bool, // if locked, user can't interact with this layer 
						// (ex: medias-layer is locked where there are too much medias)
		isShown: Bool, // whether layer is displayed on map
		wasShownBeforeLock: Bool // used on unlock to know if layer should be displayed again
		isInBounds: Bool // optional, whether layer is in map bounds (used for rastertilesets)
	/!\ didChange: { // used to update map layer on next react render
			paint: {paintProperties->paintValue} // paint properties (cf mapbox) that will change on next react render,
			layout: {layoutProperties-> layoutValue} // layout properties (cf mapbox) that will change on next react render,
			filter: Bool // whether map should update layer's filter on next react render,
			zoom: Bool // whether map should update layer's min/maxzoom on next react render
		}
	}
}
```

### Sources

```html
Source : {
	// cf mapbox source definition : same attributes +
	metadata: {
	/!\ didChange: Bool // true if source shall be reloaded on next react render
		loaded: Bool // true when source is added to map
		renderedFeatures: [Features] // optional, currently rendered features (used for medias)
		selectFilterPending: Bool // used only for selected-medias source, true if a select filter is being applied,
		stillFiltered: [Features] // used only for selected-medias source, features that are still filtered on medias-source
								  // (empty when no select filter is being applied)
	}
}
```

### ServerResource

```html
ServerResource: {
	pending: Bool // whether a server request is on going
	error: String // server error
	data: Object // returned server data
}
```

Example : 
```html
authUser: {
	pending // whether authenticated user is being retrieved
	error // if an error occured when retrieving authenticated user
	data // authenticated user
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

```html
click: [{
	layerIds: [String] // the layers to detect click on,
	action: Function // the action to be fired on click
}]
```

### Dragndrop

```html
dragndrop: [{
    layerId: String // the layer containing draggable features
    mousedown: Function, // the action to be fired on mousedown
    mousemove: Function, // the action to be fired on mousemove (if a feature is dragged)
    mouseup: Function 	// the action to be fired on mousedown (if a feature was dragged)
}]
```

### Moveend

```html
moveend: [Function] // array of actions to be fired on moveend
```

### Update currently rendered features

```html
renderedFeatures: [{
    layerIds: [String], // layers containing the features to count
    source: String, // associated source id
    				// (map will wait until source is loaded to count features)
    uniqueKey: String, // features unique key (to avoid duplicates)
    action: Function // action to be fired when rendered features are retrieved
}]
```