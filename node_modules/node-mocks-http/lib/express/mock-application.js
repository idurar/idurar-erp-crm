const methods = require('methods');
const deprecate = require('depd')('express');

const app = {};
const trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';

app.init = function init() {
    this.cache = {};
    this.settings = {};
    this.engines = {};
    this.defaultConfiguration();
};

app.defaultConfiguration = function defaultConfiguration() {
    this.enable('x-powered-by');
    this.set('etag', 'weak');
    const env = process.env.NODE_ENV || 'development';
    this.set('env', env);
    this.set('query parser', 'extended');
    this.set('subdomain offset', 2);
    this.set('trust proxy', false);
    Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
        configurable: true,
        value: true
    });

    this.locals = Object.create(null);
    this.mountpath = '/';
    this.locals.settings = this.settings;
    this.set('jsonp callback name', 'callback');

    if (env === 'production') {
        this.enable('view cache');
    }

    Object.defineProperty(this, 'router', {
        get() {
            throw new Error(
                "'app.router' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app."
            );
        }
    });
};

app.lazyrouter = () => {};
app.handle = () => {};
app.route = () => {};
app.render = () => {};
app.listen = () => {};

app.use = function use() {
    return this;
};

app.engine = function engine() {
    return this;
};

app.param = function param() {
    return this;
};

app.set = function set(setting, val) {
    if (arguments.length === 1) {
        return this.settings[setting];
    }

    this.settings[setting] = val;
    return this;
};

app.path = function path() {
    return '';
};

app.enabled = function enabled(setting) {
    return !!this.set(setting);
};

app.disabled = function disabled(setting) {
    return !this.set(setting);
};

app.enable = function enable(setting) {
    return this.set(setting, true);
};

app.disable = function disable(setting) {
    return this.set(setting, false);
};

methods.forEach((method) => {
    app[method] = function httpMethod() {
        return this;
    };
});

app.all = function all() {
    return this;
};

app.del = deprecate.function(app.delete, 'app.del: Use app.delete instead');

module.exports = app;
