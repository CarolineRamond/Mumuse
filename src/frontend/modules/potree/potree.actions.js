import fetch from 'isomorphic-fetch'

function requestCamerasParameters() {
  return {
    type: 'POTREE_REQUEST_CAMERAS_PARAMETERS'
  }
}

function receiveCamerasParameters(json) {
  return {
    type: 'POTREE_RECEIVE_CAMERAS_PARAMETERS',
    data: json,
    receivedAt: Date.now()
  }
}

export function fetchCamerasParameters() {
  return function (dispatch) {
    dispatch(requestCamerasParameters())
    return fetch(`potreeviewer/potreedataset`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>{
        dispatch(receiveCamerasParameters(json))
      }
      )
  }
}