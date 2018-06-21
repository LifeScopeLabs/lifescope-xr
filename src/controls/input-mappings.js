var mappings = {
    default: {
        'daydream-controls': {
            trackpaddown: 'teleportstart',
            trackpadup: 'teleportend'
        }
    }
};

 // To be exposed by the application
 var inputActions = {
     //task1: {
      teleportstart: { label: 'Start teleport' },
      teleportend: { label: 'End teleport' }
     //}
  };


export {mappings, inputActions};