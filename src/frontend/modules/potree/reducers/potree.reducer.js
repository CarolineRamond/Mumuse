const potreeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'POINTCLOUD_CLICK': {
      let pointCloud;
      if (action.payload.features.length) {
        pointCloud = Object.assign({}, state, {
          metaData: action.payload.features.length ? action.payload.features[0].properties : null
        });
      } else {
        pointCloud = Object.assign({});
      }
      return pointCloud;
    }
    default:
      return state;
  }
};

export default potreeReducer;
