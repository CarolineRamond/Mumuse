export default class MapResource {
	constructor(source, layers, events=[], dragndrop={}, viewportcount={}) {
		this.source = source;
		this.layers = layers;
		this.events = events;
		this.dragndrop = dragndrop;
		this.viewportcount = viewportcount;
		

		// this.insertNewSourceData = (newData) => {
		// 	return Object.assign({}, this.source, { data: newData, didChange: true });
		// }
	}
}

