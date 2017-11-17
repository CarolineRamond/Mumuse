import axios from "axios";
import EXIF from 'exif-parser';

export const clickMedias = ({ features, ctrlKey, isAdmin })=> {
	return { 
		type: 'MEDIAS_CLICK', 
		payload: { 
			features: features,
			ctrlKey: ctrlKey,
			isAdmin: isAdmin
		}
	};
};

export const selectMediaById = ({ mediaId, ctrlKey, isAdmin })=> {
	return { 
		type: 'MEDIAS_SELECT_BY_ID', 
		payload: { 
			mediaId: mediaId,
			ctrlKey: ctrlKey,
			isAdmin: isAdmin
		}
	};
};

export const startDragMapMedias = ({ event, isAdmin })=> {
	return {
		type: 'MEDIAS_MAP_START_DRAG',
		payload: {
			features: event.features,
			isAdmin: isAdmin
		}
	};
}

export const dragMapMedias = ({ event, isAdmin })=> {
	return {
		type: 'MEDIAS_MAP_DRAG',
		payload: {
			coords: event.lngLat,
			isAdmin: isAdmin
		}
	};
}

export const endDragMapMedias = ({ event, feature, isAdmin })=> {
	const mediaId = feature.properties._id;
	const newPosition = event.lngLat;
	const form = {
		loc: [newPosition.lng, newPosition.lat]
	}
	return {
		type: 'MEDIAS_MAP_END_DRAG',
		payload: axios.put('/userdrive/media/' + mediaId, form)
	};
}

export const updateFeaturesMedias = (features, zoom)=> {
	return {
		type: 'MEDIAS_UPDATE_FEATURES',
		payload: { features, zoom }
	};
}

export const updateFeaturesGridMedias = (features, zoom)=> {
	return {
		type: 'MEDIAS_GRID_UPDATE_FEATURES',
		payload: { features, zoom }
	};
}

export const updateTimelineMedias = (value)=> {
	return {
		type: 'MEDIAS_TIMELINE_UPDATE',
		payload: { value }
	};
}

export const initSelectedMedia = (mediaId) => {
	return {
		type: "MEDIAS_INIT_SELECTED",
		payload: axios.get('/userdrive/media/' + mediaId + '/?geojson=true')
	}
}

export const deleteMedias = (medias)=> {
	return (dispatch) => {
		var promise = medias.reduce((promise, media, index)=> {
			return promise.then(() => {
				dispatch({ 
					type: "MEDIAS_DELETE_PENDING", 
					payload: { index: index, length: medias.length } 
				});
				return _deleteMedia(media);
			})
		}, Promise.resolve());
		
		promise.then(()=> {
			dispatch({ 
				type: "MEDIAS_DELETE_FULFILLED", 
				payload: { length: medias.length }
			});
		});
	}
}

function _deleteMedia(media) {
    const mediaId = media.properties._id;
    return axios.delete('/userdrive/media/' + mediaId);
}

export const resetDeleteMediasState = ()=> {
	return {
		type: "RESET_MEDIAS_DELETE"
	}
}

export const uploadMedias = (files, position)=> {
	return (dispatch) => {
		const iter = new Array(files.length).fill(1);
		var promise = iter.reduce((promise, item, index)=> {
			return promise.then(() => {
				dispatch({ 
					type: "MEDIAS_UPLOAD_PENDING", 
					payload: { index: index, length: files.length } 
				});
				return _uploadMedia(files[index], position);
			})
		}, Promise.resolve());
		
		promise.then(()=> {
			dispatch({ 
				type: "MEDIAS_UPLOAD_FULFILLED", 
				payload: { length: files.length }
			});
		});
	}
}



function _uploadMedia(file, currentPosition) {
	return new Promise((resolve, reject) => {
	    //Should fail and warn the service an error occurer if not instane of blob
	    if (!file instanceof Blob){
	        console.warn("Error : file is not an instance of Blob");
	        return reject({type: 'File not and instance of Blob'});
	    }
	    if (!isFileSizeRespectLimit(file.size)) {
	        console.warn("Error : File size limit is not respected (" + file.size + ")");
	        return reject({type: 'File size out of bounds', value: {size: file.size}});
	    }
	    
	    var reader = new FileReader(), position = [];
	    reader.onloadend = e => {
	        var exifArrayBuffer = e.target.result,
	            exifData = getMediaPosition(exifArrayBuffer),
	            position = exifData.position || currentPosition,
	            form = new FormData();

            form.append("longitude", position.lng);
            form.append("latitude", position.lat);
            form.append("size", file.size);
            form.append("file", file);
            return axios.post('/userdrive/media', form)
            	.then((response)=> { 
            		return resolve(response) 
            	})
            	.catch((error)=> { return reject(error) });
	    };

	    reader.onerror = error => {
	        console.error(error);
	        return reject({type: 'Could not read file', value: error});
	    };

	    //extract the first 90kb of the media to parse its exif data
	    reader.readAsArrayBuffer(
	        file.slice(0, 90000, file.type)
	    );
	});
}

export const resetUploadMediasState = ()=> {
	return {
		type: "RESET_MEDIAS_UPLOAD"
	}
}

/**
 * get the media position if they exist.
 * @param arrayBuffer arrayBuffe of Exif Data
 * @return Object gps array position of an error
 *
 */
function getMediaPosition(arrayBuffer) {
    try {
        if (arrayBuffer) {
            var parser = EXIF.create(arrayBuffer), exifData;
            parser.enableTagNames(true);
            parser.enableImageSize(false);
            exifData = parser.parse();
            // get the array format of gps position
            return {
                position: getMediaPositionFromExif(exifData.tags)
            };
        }
    } catch (e) {
        console.warn("error while reading exif data");
        return {
            error: e,
        };
    }
}

function getMediaPositionFromExif(gpsExif) {
    var position = null;
    if (
        gpsExif &&
        typeof gpsExif.GPSLongitude === "number" &&
        typeof gpsExif.GPSLatitude === "number"
    ) {
        position = {
            lng: ConvertDMSToDD(gpsExif.GPSLongitude, gpsExif.GPSLongitudeRef),
            lat: ConvertDMSToDD(gpsExif.GPSLatitude, gpsExif.GPSGPSLatitudeRef)
        };
    }
    return position;
}

function ConvertDMSToDD(dd, direction) {
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return dd;
}

function isFileSizeRespectLimit(size) {
    return typeof size === "number" &&
        size < 50 * 1024 * 1024;
}
