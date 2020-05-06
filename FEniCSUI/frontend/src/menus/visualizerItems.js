// define the initial state of the visualizer
const visualizerItems = {
    geometryUpdated: false,
    cameraUpdated: false,
    camera: { position: { x: 1, y: 1, z: 1 }, lookAt: { x: 0, y: 0, z: 0 }, up: { x: 0, y: 0, z: 1 } },
    faces: { visibility: false, data: {} },
    edges: { visibility: true, data: {} },
    points: { visibility: false, data: {} },
    boundingBox: {
      visibility: false, data: {
        lowX: 0,
        lowY: 0,
        lowZ: 0,
        highX: 1,
        highY: 1,
        highZ: 1
      },
    },
    select: { enabled: false, type: null, data: {} }, // types: faces, edges
  }

  export default visualizerItems;