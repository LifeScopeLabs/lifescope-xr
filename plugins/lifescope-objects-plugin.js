import Vue from 'vue'
import lifescopeObjects from 'lifescope-objects';

Vue.use(lifescopeObjects);

export default ({ app }, inject) => {
    // Set `LSObj` instance on `app`
    // This way we can use it in middleware and pages `asyncData`/`fetch`
    lifescopeObjects.install(app);
}
