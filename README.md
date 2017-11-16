# test-react (draft)


To launch : ``npm run dev``

## Components

```
<App>
	<Admin (if url="/admin")>
		<Users (if url="/admin/users")/>
			<UsersTable/>
			<UsersCreate (if url="/admin/users/create")/>
			<UsersEdit (if url="/admin/users/edit/:userId")/>
		</Users>
	</Admin>
	<div (if url="/:loc")>
		<Auth (if url="/:loc/auth")>
			<Login (if url="/:loc/auth/login")/>
			<Register (if url="/:loc/auth/register")/>
			<ForgotPassword (if url="/:loc/auth/forgot")/>
		</Auth>
		<Main>
			<AuthButton/>
			<SplitPane>
				<MainPanel>
					<Map/>
					<Timeline/>
					<Previewer/>
				</MainPanel>
				<SidePanel>
					<Tabs>
						<Tab>
							<Carousel/>
							<MediasActions (if user is admin)/>
						</Tab>
						<Tab><Layers/></Tab>
					</Tabs>
				</SidePanel>
			</SplitPane>
		</Main>
	</div>
</App>
```

## Store

### General aspect

```
{
	world: { => rename to map ?
		lng: Number, // map longitude as given by mapbox
		lat: Number, // map latitude as given by mapbox
		zoom: Number, // map zoom as given by mapbox,
		bounds: [LngLat], // map bounds as given by mapbox (LngLat is a mapbox class)
		previewMode: Bool, // is map in preview mode (ie small)
	/!\	shouldMapResize: Bool // whether map should resize on next react render
	},
	medias: {
		sources: {Source}, // medias-related map sources 
			=> better in array form (can use combine reducers) ? should create Source class ?
		layers: {Layer}, // medias-related map layers 
			=> idem
		timeline: Number, // timeline value => to put into map state (not only relative to medias)
		selectFilterPending: Bool // whether a select filter is begin applied (useful to count medias)
	},
	auth: {
		authUser: ServerResource, // authenticated user data => should create ServerResource class ?
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
		layers: {Layer}, // rastertile layers => better in array form ?
		sources: {Source} // rastertile sources => idem
	}
}
```

### Layers

```
Layer : {
	// cf mapbox layer definition : same attributes +
	metadata: {
		name: String, // layer display name
		isLocked: Bool, // if locked, user can't interact with this layer 
						// (ex: medias-layer is locked where there are too much medias)
		isShown: Bool, // whether layer is displayed on map
		wasShownBeforeLock: Bool // used on unlock to know if layer should be displayed again
		renderedFeatures: [Features] // optional, currently rendered features (used for medias)
			=> useless (cf renderedFeatures action)
		featureKey: String // optional, unique feature key (used to compute rendered features),
			=> useless (cf renderedFeatures action)
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

* Shall we keep only metadata in store and layer definition in config ?
* => better store legibility & facilitates updates
* => drawback : access to current layer properties ? (needed ?)

### Sources

```
Source : {
	// cf mapbox source definition : same attributes +
	metadata: {
	/!\ didChange: Bool // true if source shall be reloaded on next react render
		selectFilterPending: Bool // used only for selected-medias source, true if a select filter is being applied,
		stillFiltered: [Features] // used only for selected-medias source, features that are still filtered on medias-source
								  // (empty when no select filter is being applied)
	}
}
```
* idem layers : shall we keep only metadata in store and source definition in config ?
* => better store legibility & facilitates updates
* => drawback : access to current layer properties ? (needed ?)


### ServerResource

```
ServerResource: {
	pending: Bool // whether a server request is on going
	error: String // server error
	data: Object // returned server data
}
```

Example : 
```
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

```
click: [{
	layerIds: [String] // the layers to detect click on,
	action: Function // the action to be fired on click
}]
```

### Dragndrop

```
dragndrop: [{
    layerId: String // the layer containing draggable features
    mousedown: Function, // the action to be fired on mousedown
    mousemove: Function, // the action to be fired on mousemove (if a feature is dragged)
    mouseup: Function 	// the action to be fired on mousedown (if a feature was dragged)
}]
```

### Moveend

```
moveend: [Function] // array of actions to be fired on moveend
```

### Update currently rendered features

```
renderedFeatures: [{
    layerIds: [String], // layers containing the features to count
    source: String, // associated source id
    				// (map will wait until source is loaded to count features)
    uniqueKey: String, // features unique key (to avoid duplicates)
    action: Function // action to be fired when rendered features are retrieved
}]
```
