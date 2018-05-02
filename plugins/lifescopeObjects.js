'use strict';

class LSObj {
  constructor(id) {
    this.id = id || 0;
  }
}

class Connection extends LSObj {
  constructor(id, obj) {
    super(id);
    this.auth = {
      status: {
        authorized: false,
        complete: false
      },
       redirectUrl: ''
      };
    this.enabled = false;
    this.endpoint_data = '';
    this.frequency = 0;
    this.last_run = Date.now();
    this.name = '';
    this.permissions = '';
    this.provider_id = '';
    this.provider_id_string = '';
    this.provider_name = '';
    this.remote_connection_id = '';
    this.remote_connection_id_string = '';
    this.status = '';
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
}

class AssociationSession extends LSObj {
  constructor(id, obj) {
    super(id);
    this.connection_id = '';
    this.connection_id_string = '';
    this.token = '';
    this.token_string = '';
    this.ttl = Date.now();
    
    Object.assign(obj, this);
  }
}

class Contacts extends LSObj {
  constructor(id, obj) {
    super(id)
    this.avatar_url = '';
    this.connection = new Connection();
    this.connectiong_id_string = '';
    this.created = Date.now();
    this.handle = '';
    this.identifier = '';
    this.name = '';
    this.provider_name = '';
    this.remote_id = '';
    this.tagMasks = {added: [],
                     removed: [],
                     source:[]}
    this.updated = Date.now();
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
}

class Content extends LSObj {
  constructor(id, obj) {
    super(id);
    this.connection = new Connection();
    this.connection_id_string = '';
    this.created = Date.now();
    this.embed_content = '';
    this.embed_format = '';
    this.embed_thumbnail = '';
    this.identifier = '';
    this.mimetype = '';
    this.owner = '';
    this.provider_name = '';
    this.remote_id = '';
    this.tagMasks = {
      added: [],
      removed: [],
      source:[]
    }
    this.text = '';
    this.title = '';
    this.type = '';
    this.updated = Date.now();
    this.url = '';
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
}

class Event extends LSObj {
  constructor(id, obj) {
    super(id);
    this.connection = new Connection();
    this.connection_id_string = '';
    this.contact_interaction_type = ''
    this.contacts = [];
    this.content = [];
    this.context = '';
    this.created = Date.now();
    this.datetime = Date.now();
    this.identifier = '';
    this.provider = new Provider();
    this.provider_name = '';
    this.source = '';
    this.tagMasks = {
      added: [],
      removed: [],
      source:[]
    }
    this.type = '';
    this.updated = Date.now();
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
  
  // get area() {
  //   return this.height * this.width;
  // }
  
  // set sideLength(newLength) {
  // }
}

class Location extends LSObj {
  constructor(id, obj) {
    super(id);
    this.connection = new Connection();
    this.connection_id_string = '';
    this.created = Date.now();
    this.datetime = Date.now();
    this.estimated = false;
    this.geo_format = '';
    this.geolocation = [];
    this.identifier = '';
    this.updated = Date.now();
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
}

class Provider extends LSObj {
  constructor(id, obj) {
    super(id);
    this.sources = {};
    this.remote_map_id = '';
    this.remote_map_id_string = '';
    
    Object.assign(obj, this);
  }
}

class Person extends LSObj {
  constructor(id, obj) {
    super(id);
    
    Object.assign(obj, this);
  }
}

class Place extends LSObj {
  constructor(id, obj) {
    super(id);
    
    Object.assign(obj, this);
  }
}

class Search extends LSObj {
  constructor(id, obj) {
    super(id);
    this.count = 0;
    this.favorited = false;
    this.filters = [{
      data: '',
      name: '',
      type: ''
    }]
    this.hash = '';
    this.icon = '';
    this.icon_color = '';
    this.last_run = Date.now();
    this.name = '';
    this.query = '';
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
}

class Session extends LSObj {
  constructor(id, obj) {
    super(id);
    this.created = Date.now();
    this.csrf_secret = '';
    this.expires = Date.now();
    this.ip = '';
    this.meta = {
      agent: '',
      browser: {
        family: '',
       version: ''
      },
      device: {
        family: '',
        version: ''
      },
      os: {
        family: '',
        version: ''},
    };
    this.persist = false;
    this.token = '';
    this.ttl = Date.now();
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
}

class Tag extends LSObj {
  constructor(id, obj) {
    super(id);
    this.created = Date.now();
    this.tag = '';
    this.update = Date.now();
    this.user_id = '';
    this.user_id_string = '';
    
    Object.assign(obj, this);
  }
}

class Thing extends LSObj {
  constructor(id, obj) {
    super(id);
    this.connection = '';
    this.connection_id_string = '';
    
    Object.assign(obj, this);
  }
}

class User extends LSObj {
  constructor(id, obj) {
    super(id);
    this.name = '';
    this.is_active = false;
    this.joined = Date.now();
    this.last_login = Date.now();
    this.settings = {
      explorer: {
        initial_searches: false
      }
    }
    this.social_accounts = [];
    this.subscriptions = [];
    this.age = 0;
    this.accountType = {}; //type: [AccountTypeSchema]
    this.contacts = {
      email: '',
      phones: []
    };
    this.address = {}; //type: AddressSchema
    this.otherData = {}; //type: mongoose.Schema.Types.Mixed
    
    Object.assign(obj, this);
  }
}

// TESTS
// var objT1 = new LSObj(2);

export default {
  LSObj,
  Connection,
  AssociationSession,
  Contacts,
  Content,
  Event,
  Location,
  Provider,
  Person,
  Place,
  Search,
  Session,
  Tag,
  Thing,
  User
}