// Define a new component called wall_image
Vue.component('wall-image', {
    data: function () {
        return {
            "id": "24",
            "connection": "asdfa",
            "connection_id_string": "25",
            "created": "2018-04-17T18:25:43.511Z",
            "embed_content": "aContent",
            "embed_format": "email",
            "embed_thumbnail": "/iris.jpg",
            "embeded_format": "jpg",
            "identifier": "26",
            "mimetype": "text/plain",
            "owner": "me",
            "provider_name": "Google",
            "remote_id": "1",
            "tagMasks": {
                "added": ["adsfs", "ewaf"],
                "removed": ["adsfs", "ewaf"],
                "source": ["adsfs", "ewaf"]
            },
            "text": "words",
            "thumbnail": "thumb",
            "title": "aTitle",
            "type": "someType",
            "updated": "2018-04-17T18:25:43.511Z",
            "url": "https://duckduckgo.com/",
            "user_id": "345",
            "user_id_string": "234"
            }
    },
    template: '<div><a-assets> ' +
                '<img ' +
                ':key="id" ' +
                ':id="id" ' +
                'crossorigin="anonymous" ' +
                ':src="embed_thumbnail" ' +
                '> ' +
                '</a-assets> ' +
                '<a-entity ' +
                ':key="id"' +
                'geometry="primitive: plane; width: 3; height: 2"' +
                ':material="\'src: #\' + embed_thumbnail + \'; side: double;\'"' +
                'rotation="0 0 0">' +
                '</a-entity>' +
                '</div>'
  })