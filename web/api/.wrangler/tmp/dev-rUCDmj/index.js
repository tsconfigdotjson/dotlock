var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// ../../node_modules/.bun/wrangler@4.77.0/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../node_modules/.bun/wrangler@4.77.0/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// ../../node_modules/.bun/cookie@1.1.1/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/.bun/cookie@1.1.1/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie2;
    exports.parse = parseCookie2;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = /* @__PURE__ */ __name(function() {
      }, "C");
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie2(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    __name(parseCookie2, "parseCookie");
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    __name(stringifyCookie, "stringifyCookie");
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    __name(stringifySetCookie, "stringifySetCookie");
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date2 = new Date(val);
            if (Number.isFinite(date2.valueOf()))
              setCookie.expires = date2;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    __name(parseSetCookie, "parseSetCookie");
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    __name(endIndex, "endIndex");
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    __name(eqIndex, "eqIndex");
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    __name(valueSlice, "valueSlice");
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    __name(decode, "decode");
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
    __name(isDate, "isDate");
  }
});

// .wrangler/tmp/bundle-t8piKW/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-t8piKW/middleware-insertion-facade.js
init_modules_watch_stub();

// src/index.ts
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/hono.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/hono-base.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/compose.js
init_modules_watch_stub();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i2) {
      if (i2 <= index) {
        throw new Error("next() called multiple times");
      }
      index = i2;
      let res;
      let isError = false;
      let handler;
      if (middleware[i2]) {
        handler = middleware[i2][0][0];
        context.req.routeIndex = i2;
      } else {
        handler = i2 === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i2 + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/context.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/request.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/http-exception.js
init_modules_watch_stub();
var HTTPException = class extends Error {
  static {
    __name(this, "HTTPException");
  }
  res;
  status;
  /**
   * Creates an instance of `HTTPException`.
   * @param status - HTTP status code for the exception. Defaults to 500.
   * @param options - Additional options for the exception.
   */
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  /**
   * Returns the response object associated with the exception.
   * If a response object is not provided, a new response is created with the error message and status code.
   * @returns The response object.
   */
  getResponse() {
    if (this.res) {
      const newResponse = new Response(this.res.body, {
        status: this.status,
        headers: this.res.headers
      });
      return newResponse;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/request/constants.js
init_modules_watch_stub();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/utils/body.js
init_modules_watch_stub();
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/utils/url.js
init_modules_watch_stub();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i2 = groups.length - 1; i2 >= 0; i2--) {
    const [mark] = groups[i2];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i2][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i2 = start;
  for (; i2 < url.length; i2++) {
    const charCode = url.charCodeAt(i2);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i2);
      const hashIndex = url.indexOf("#", i2);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i2);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i2, a) => a.indexOf(v) === i2);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/utils/html.js
init_modules_watch_stub();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init2) => new Response(body, init2), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router.js
init_modules_watch_stub();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/utils/constants.js
init_modules_watch_stub();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/router.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/matcher.js
init_modules_watch_stub();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/node.js
init_modules_watch_stub();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/trie.js
init_modules_watch_stub();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i2 = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i2}`;
        groups[i2] = [mark, m];
        i2++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i2 = groups.length - 1; i2 >= 0; i2--) {
      const [mark] = groups[i2];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i2][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i2 = 0, j = -1, len = routesWithStaticPathFlag.length; i2 < len; i2++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i2];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i2 = 0, len = handlerData.length; i2 < len; i2++) {
    for (let j = 0, len2 = handlerData[i2].length; j < len2; j++) {
      const map = handlerData[i2][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i2 in indexReplacementMap) {
    handlerMap[i2] = handlerData[indexReplacementMap[i2]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i2 = 0, len = paths.length; i2 < len; i2++) {
      const path2 = paths[i2];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i2 + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/smart-router/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/smart-router/router.js
init_modules_watch_stub();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init2) {
    this.#routers = init2.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i2 = 0;
    let res;
    for (; i2 < len; i2++) {
      const router = routers[i2];
      try {
        for (let i22 = 0, len2 = routes.length; i22 < len2; i22++) {
          router.add(...routes[i22]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i2 === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/trie-router/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/trie-router/router.js
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/trie-router/node.js
init_modules_watch_stub();
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i2 = 0, len = parts.length; i2 < len; i2++) {
      const p = parts[i2];
      const nextP = parts[i2 + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i2, a) => a.indexOf(v) === i2),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i2 = 0, len = node.#methods.length; i2 < len; i2++) {
      const m = node.#methods[i2];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i22 = 0, len2 = handlerSet.possibleKeys.length; i22 < len2; i22++) {
            const key = handlerSet.possibleKeys[i22];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i2 = 0; i2 < len; i2++) {
      const part = parts[i2];
      const isLast = i2 === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i2]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i2 = 0, len = results.length; i2 < len; i2++) {
        this.#node.insert(method, results[i2], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// src/context.ts
init_modules_watch_stub();

// ../../node_modules/.bun/hono@4.12.9/node_modules/hono/dist/helper/factory/index.js
init_modules_watch_stub();
var createMiddleware = /* @__PURE__ */ __name((middleware) => middleware, "createMiddleware");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/stripe.esm.worker.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/platform/WebPlatformFunctions.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/platform/PlatformFunctions.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/net/FetchHttpClient.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/utils.js
init_modules_watch_stub();
var OPTIONS_KEYS = [
  "apiKey",
  "idempotencyKey",
  "stripeAccount",
  "apiVersion",
  "maxNetworkRetries",
  "timeout",
  "host",
  "authenticator",
  "stripeContext",
  "headers",
  "additionalHeaders",
  "streaming"
];
function isOptionsHash(o) {
  return o && typeof o === "object" && OPTIONS_KEYS.some((prop) => Object.prototype.hasOwnProperty.call(o, prop));
}
__name(isOptionsHash, "isOptionsHash");
function queryStringifyRequestData(data, _apiMode) {
  return stringifyRequestData(data);
}
__name(queryStringifyRequestData, "queryStringifyRequestData");
function encodeQueryValue(value) {
  return encodeURIComponent(value).replace(/!/g, "%21").replace(/\*/g, "%2A").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/'/g, "%27").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
__name(encodeQueryValue, "encodeQueryValue");
function valueToString(value) {
  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1e3).toString();
  }
  if (value === null) {
    return "";
  }
  return String(value);
}
__name(valueToString, "valueToString");
function stringifyRequestData(data) {
  const pairs = [];
  function encode(key, value) {
    if (value === void 0) {
      return;
    }
    if (value === null || typeof value !== "object" || value instanceof Date) {
      pairs.push(encodeQueryValue(key) + "=" + encodeQueryValue(valueToString(value)));
      return;
    }
    if (Array.isArray(value)) {
      for (let i2 = 0; i2 < value.length; i2++) {
        if (value[i2] !== void 0) {
          encode(key + "[" + i2 + "]", value[i2]);
        }
      }
      return;
    }
    for (const k of Object.keys(value)) {
      encode(key + "[" + k + "]", value[k]);
    }
  }
  __name(encode, "encode");
  if (typeof data === "object" && data !== null) {
    for (const key of Object.keys(data)) {
      encode(key, data[key]);
    }
  }
  return pairs.join("&");
}
__name(stringifyRequestData, "stringifyRequestData");
var makeURLInterpolator = /* @__PURE__ */ (() => {
  const rc = {
    "\n": "\\n",
    '"': '\\"',
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  return (str) => {
    const cleanString = str.replace(/["\n\r\u2028\u2029]/g, ($0) => rc[$0]);
    return (outputs) => {
      return cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) => {
        const output = outputs[$1];
        if (isValidEncodeUriComponentType(output))
          return encodeURIComponent(output);
        return "";
      });
    };
  };
})();
function isValidEncodeUriComponentType(value) {
  return ["number", "string", "boolean"].includes(typeof value);
}
__name(isValidEncodeUriComponentType, "isValidEncodeUriComponentType");
function extractUrlParams(path) {
  const params = path.match(/\{\w+\}/g);
  if (!params) {
    return [];
  }
  return params.map((param) => param.replace(/[{}]/g, ""));
}
__name(extractUrlParams, "extractUrlParams");
function getDataFromArgs(args) {
  if (!Array.isArray(args) || !args[0] || typeof args[0] !== "object") {
    return {};
  }
  if (!isOptionsHash(args[0])) {
    return args.shift();
  }
  const argKeys = Object.keys(args[0]);
  const optionKeysInArgs = argKeys.filter((key) => OPTIONS_KEYS.includes(key));
  if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
    emitWarning(`Options found in arguments (${optionKeysInArgs.join(", ")}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`);
  }
  return {};
}
__name(getDataFromArgs, "getDataFromArgs");
function getOptionsFromArgs(args) {
  const opts = {
    host: null,
    headers: {},
    settings: {},
    streaming: false
  };
  if (args.length > 0) {
    const arg = args[args.length - 1];
    if (typeof arg === "string") {
      opts.authenticator = createApiKeyAuthenticator(args.pop());
    } else if (isOptionsHash(arg)) {
      const params = Object.assign({}, args.pop());
      const extraKeys = Object.keys(params).filter((key) => !OPTIONS_KEYS.includes(key));
      if (extraKeys.length) {
        emitWarning(`Invalid options found (${extraKeys.join(", ")}); ignoring.`);
      }
      if (params.apiKey) {
        opts.authenticator = createApiKeyAuthenticator(params.apiKey);
      }
      if (params.idempotencyKey) {
        opts.headers["Idempotency-Key"] = params.idempotencyKey;
      }
      if (params.stripeAccount) {
        opts.headers["Stripe-Account"] = params.stripeAccount;
      }
      if (params.stripeContext) {
        if (opts.headers["Stripe-Account"]) {
          throw new Error("Can't specify both stripeAccount and stripeContext.");
        }
        opts.headers["Stripe-Context"] = params.stripeContext;
      }
      if (params.apiVersion) {
        opts.headers["Stripe-Version"] = params.apiVersion;
      }
      if (Number.isInteger(params.maxNetworkRetries)) {
        opts.settings.maxNetworkRetries = params.maxNetworkRetries;
      }
      if (Number.isInteger(params.timeout)) {
        opts.settings.timeout = params.timeout;
      }
      if (params.host) {
        opts.host = params.host;
      }
      if (params.authenticator) {
        if (params.apiKey) {
          throw new Error("Can't specify both apiKey and authenticator.");
        }
        if (typeof params.authenticator !== "function") {
          throw new Error("The authenticator must be a function receiving a request as the first parameter.");
        }
        opts.authenticator = params.authenticator;
      }
      if (params.headers) {
        Object.assign(opts.headers, params.headers);
      }
      if (params.additionalHeaders) {
        Object.assign(opts.headers, params.additionalHeaders);
      }
      if (params.streaming) {
        opts.streaming = true;
      }
    }
  }
  return opts;
}
__name(getOptionsFromArgs, "getOptionsFromArgs");
function protoExtend(sub) {
  const Super = this;
  const Constructor = Object.prototype.hasOwnProperty.call(sub, "constructor") ? sub.constructor : function(...args) {
    Super.apply(this, args);
  };
  Object.assign(Constructor, Super);
  Constructor.prototype = Object.create(Super.prototype);
  Object.assign(Constructor.prototype, sub);
  return Constructor;
}
__name(protoExtend, "protoExtend");
function removeNullish(obj) {
  if (typeof obj !== "object") {
    throw new Error("Argument must be an object");
  }
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] != null) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
__name(removeNullish, "removeNullish");
function normalizeHeaders(obj) {
  if (!(obj && typeof obj === "object")) {
    return obj;
  }
  return Object.keys(obj).reduce((result, header) => {
    result[normalizeHeader(header)] = obj[header];
    return result;
  }, {});
}
__name(normalizeHeaders, "normalizeHeaders");
function normalizeHeader(header) {
  return header.split("-").map((text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()).join("-");
}
__name(normalizeHeader, "normalizeHeader");
function callbackifyPromiseWithTimeout(promise, callback) {
  if (callback) {
    return promise.then((res) => {
      setTimeout(() => {
        callback(null, res);
      }, 0);
    }, (err) => {
      setTimeout(() => {
        callback(err, null);
      }, 0);
    });
  }
  return promise;
}
__name(callbackifyPromiseWithTimeout, "callbackifyPromiseWithTimeout");
function pascalToCamelCase(name) {
  if (name === "OAuth") {
    return "oauth";
  } else {
    return name[0].toLowerCase() + name.substring(1);
  }
}
__name(pascalToCamelCase, "pascalToCamelCase");
function emitWarning(warning) {
  if (typeof process.emitWarning !== "function") {
    return console.warn(`Stripe: ${warning}`);
  }
  return process.emitWarning(warning, "Stripe");
}
__name(emitWarning, "emitWarning");
function isObject(obj) {
  const type = typeof obj;
  return (type === "function" || type === "object") && !!obj;
}
__name(isObject, "isObject");
function flattenAndStringify(data) {
  const result = {};
  const step = /* @__PURE__ */ __name((obj, prevKey) => {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prevKey ? `${prevKey}[${key}]` : key;
      if (isObject(value)) {
        if (!(value instanceof Uint8Array) && !Object.prototype.hasOwnProperty.call(value, "data")) {
          return step(value, newKey);
        } else {
          result[newKey] = value;
        }
      } else {
        result[newKey] = String(value);
      }
    });
  }, "step");
  step(data, null);
  return result;
}
__name(flattenAndStringify, "flattenAndStringify");
function validateInteger(name, n, defaultVal) {
  if (!Number.isInteger(n)) {
    if (defaultVal !== void 0) {
      return defaultVal;
    } else {
      throw new Error(`${name} must be an integer`);
    }
  }
  return n;
}
__name(validateInteger, "validateInteger");
function determineProcessUserAgentProperties() {
  return typeof process === "undefined" ? {} : {
    lang_version: process.version,
    platform: process.platform
  };
}
__name(determineProcessUserAgentProperties, "determineProcessUserAgentProperties");
var AI_AGENTS = [
  // The beginning of the section generated from our OpenAPI spec
  ["ANTIGRAVITY_CLI_ALIAS", "antigravity"],
  ["CLAUDECODE", "claude_code"],
  ["CLINE_ACTIVE", "cline"],
  ["CODEX_SANDBOX", "codex_cli"],
  ["CODEX_THREAD_ID", "codex_cli"],
  ["CODEX_SANDBOX_NETWORK_DISABLED", "codex_cli"],
  ["CODEX_CI", "codex_cli"],
  ["CURSOR_AGENT", "cursor"],
  ["GEMINI_CLI", "gemini_cli"],
  ["OPENCODE", "open_code"]
  // The end of the section generated from our OpenAPI spec
];
function detectAIAgent(env) {
  for (const [envVar, agentName] of AI_AGENTS) {
    if (env[envVar]) {
      return agentName;
    }
  }
  return "";
}
__name(detectAIAgent, "detectAIAgent");
function createApiKeyAuthenticator(apiKey) {
  const authenticator = /* @__PURE__ */ __name((request) => {
    request.headers.Authorization = "Bearer " + apiKey;
    return Promise.resolve();
  }, "authenticator");
  authenticator._apiKey = apiKey;
  return authenticator;
}
__name(createApiKeyAuthenticator, "createApiKeyAuthenticator");
function dateTimeReplacer(key, value) {
  if (this[key] instanceof Date) {
    return Math.floor(this[key].getTime() / 1e3).toString();
  }
  return value;
}
__name(dateTimeReplacer, "dateTimeReplacer");
function jsonStringifyRequestData(data) {
  return JSON.stringify(data, dateTimeReplacer);
}
__name(jsonStringifyRequestData, "jsonStringifyRequestData");
function getAPIMode(path) {
  if (!path) {
    return "v1";
  }
  return path.startsWith("/v2") ? "v2" : "v1";
}
__name(getAPIMode, "getAPIMode");
function parseHttpHeaderAsString(header) {
  if (Array.isArray(header)) {
    return header.join(", ");
  }
  return String(header);
}
__name(parseHttpHeaderAsString, "parseHttpHeaderAsString");
function parseHttpHeaderAsNumber(header) {
  const number2 = Array.isArray(header) ? header[0] : header;
  return Number(number2);
}
__name(parseHttpHeaderAsNumber, "parseHttpHeaderAsNumber");
function parseHeadersForFetch(headers) {
  return Object.entries(headers).map(([key, value]) => {
    return [key, parseHttpHeaderAsString(value)];
  });
}
__name(parseHeadersForFetch, "parseHeadersForFetch");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/net/HttpClient.js
init_modules_watch_stub();
var HttpClient = class _HttpClient {
  static {
    __name(this, "HttpClient");
  }
  /** The client name used for diagnostics. */
  getClientName() {
    throw new Error("getClientName not implemented.");
  }
  makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
    throw new Error("makeRequest not implemented.");
  }
  /** Helper to make a consistent timeout error across implementations. */
  static makeTimeoutError() {
    const timeoutErr = new TypeError(_HttpClient.TIMEOUT_ERROR_CODE);
    timeoutErr.code = _HttpClient.TIMEOUT_ERROR_CODE;
    return timeoutErr;
  }
};
HttpClient.CONNECTION_CLOSED_ERROR_CODES = ["ECONNRESET", "EPIPE"];
HttpClient.TIMEOUT_ERROR_CODE = "ETIMEDOUT";
var HttpClientResponse = class {
  static {
    __name(this, "HttpClientResponse");
  }
  constructor(statusCode, headers) {
    this._statusCode = statusCode;
    this._headers = headers;
  }
  getStatusCode() {
    return this._statusCode;
  }
  getHeaders() {
    return this._headers;
  }
  getRawResponse() {
    throw new Error("getRawResponse not implemented.");
  }
  toStream(streamCompleteCallback) {
    throw new Error("toStream not implemented.");
  }
  toJSON() {
    throw new Error("toJSON not implemented.");
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/net/FetchHttpClient.js
var FetchHttpClient = class _FetchHttpClient extends HttpClient {
  static {
    __name(this, "FetchHttpClient");
  }
  constructor(fetchFn) {
    super();
    if (!fetchFn) {
      if (!globalThis.fetch) {
        throw new Error("fetch() function not provided and is not defined in the global scope. You must provide a fetch implementation.");
      }
      fetchFn = globalThis.fetch;
    }
    if (globalThis.AbortController) {
      this._fetchFn = _FetchHttpClient.makeFetchWithAbortTimeout(fetchFn);
    } else {
      this._fetchFn = _FetchHttpClient.makeFetchWithRaceTimeout(fetchFn);
    }
  }
  static makeFetchWithRaceTimeout(fetchFn) {
    return (url, init2, timeout) => {
      let pendingTimeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        pendingTimeoutId = setTimeout(() => {
          pendingTimeoutId = null;
          reject(HttpClient.makeTimeoutError());
        }, timeout);
      });
      const fetchPromise = fetchFn(url, init2);
      return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
        if (pendingTimeoutId) {
          clearTimeout(pendingTimeoutId);
        }
      });
    };
  }
  static makeFetchWithAbortTimeout(fetchFn) {
    return async (url, init2, timeout) => {
      const abort = new AbortController();
      let timeoutId = setTimeout(() => {
        timeoutId = null;
        abort.abort(HttpClient.makeTimeoutError());
      }, timeout);
      try {
        return await fetchFn(url, Object.assign(Object.assign({}, init2), { signal: abort.signal }));
      } catch (err) {
        if (err.name === "AbortError") {
          throw HttpClient.makeTimeoutError();
        } else {
          throw err;
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };
  }
  /** @override. */
  getClientName() {
    return "fetch";
  }
  async makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
    const isInsecureConnection = protocol === "http";
    const url = new URL(path, `${isInsecureConnection ? "http" : "https"}://${host}`);
    url.port = port;
    const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
    const body = requestData || (methodHasPayload ? "" : void 0);
    const res = await this._fetchFn(url.toString(), {
      method,
      headers: parseHeadersForFetch(headers),
      body
    }, timeout);
    return new FetchHttpClientResponse(res);
  }
};
var FetchHttpClientResponse = class _FetchHttpClientResponse extends HttpClientResponse {
  static {
    __name(this, "FetchHttpClientResponse");
  }
  constructor(res) {
    super(res.status, _FetchHttpClientResponse._transformHeadersToObject(res.headers));
    this._res = res;
  }
  getRawResponse() {
    return this._res;
  }
  toStream(streamCompleteCallback) {
    streamCompleteCallback();
    return this._res.body;
  }
  toJSON() {
    return this._res.json();
  }
  static _transformHeadersToObject(headers) {
    const headersObj = {};
    for (const entry of headers) {
      if (!Array.isArray(entry) || entry.length != 2) {
        throw new Error("Response objects produced by the fetch function given to FetchHttpClient do not have an iterable headers map. Response#headers should be an iterable object.");
      }
      headersObj[entry[0]] = entry[1];
    }
    return headersObj;
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/crypto/CryptoProvider.js
init_modules_watch_stub();
var CryptoProvider = class {
  static {
    __name(this, "CryptoProvider");
  }
  /**
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignature(payload, secret) {
    throw new Error("computeHMACSignature not implemented.");
  }
  /**
   * Asynchronous version of `computeHMACSignature`. Some implementations may
   * only allow support async signature computation.
   *
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignatureAsync(payload, secret) {
    throw new Error("computeHMACSignatureAsync not implemented.");
  }
  /**
   * Computes a SHA-256 hash of the data.
   */
  computeSHA256Async(data) {
    throw new Error("computeSHA256 not implemented.");
  }
};
var CryptoProviderOnlySupportsAsyncError = class extends Error {
  static {
    __name(this, "CryptoProviderOnlySupportsAsyncError");
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
var SubtleCryptoProvider = class extends CryptoProvider {
  static {
    __name(this, "SubtleCryptoProvider");
  }
  constructor(subtleCrypto) {
    super();
    this.subtleCrypto = subtleCrypto || crypto.subtle;
  }
  /** @override */
  computeHMACSignature(payload, secret) {
    throw new CryptoProviderOnlySupportsAsyncError("SubtleCryptoProvider cannot be used in a synchronous context.");
  }
  /** @override */
  async computeHMACSignatureAsync(payload, secret) {
    const encoder = new TextEncoder();
    const key = await this.subtleCrypto.importKey("raw", encoder.encode(secret), {
      name: "HMAC",
      hash: { name: "SHA-256" }
    }, false, ["sign"]);
    const signatureBuffer = await this.subtleCrypto.sign("hmac", key, encoder.encode(payload));
    const signatureBytes = new Uint8Array(signatureBuffer);
    const signatureHexCodes = new Array(signatureBytes.length);
    for (let i2 = 0; i2 < signatureBytes.length; i2++) {
      signatureHexCodes[i2] = byteHexMapping[signatureBytes[i2]];
    }
    return signatureHexCodes.join("");
  }
  /** @override */
  async computeSHA256Async(data) {
    return new Uint8Array(await this.subtleCrypto.digest("SHA-256", data));
  }
};
var byteHexMapping = new Array(256);
for (let i2 = 0; i2 < byteHexMapping.length; i2++) {
  byteHexMapping[i2] = i2.toString(16).padStart(2, "0");
}

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/platform/PlatformFunctions.js
var PlatformFunctions = class {
  static {
    __name(this, "PlatformFunctions");
  }
  constructor() {
    this._fetchFn = null;
    this._agent = null;
  }
  /**
   * Gets uname with Node's built-in `exec` function, if available.
   */
  getUname() {
    throw new Error("getUname not implemented.");
  }
  /**
   * Generates a v4 UUID. See https://stackoverflow.com/a/2117523
   */
  uuid4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  /**
   * Compares strings in constant time.
   */
  secureCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    const len = a.length;
    let result = 0;
    for (let i2 = 0; i2 < len; ++i2) {
      result |= a.charCodeAt(i2) ^ b.charCodeAt(i2);
    }
    return result === 0;
  }
  /**
   * Creates an event emitter.
   */
  createEmitter() {
    throw new Error("createEmitter not implemented.");
  }
  /**
   * Checks if the request data is a stream. If so, read the entire stream
   * to a buffer and return the buffer.
   */
  tryBufferData(data) {
    throw new Error("tryBufferData not implemented.");
  }
  /**
   * Creates an HTTP client which uses the Node `http` and `https` packages
   * to issue requests.
   */
  createNodeHttpClient(agent) {
    throw new Error("createNodeHttpClient not implemented.");
  }
  /**
   * Creates an HTTP client for issuing Stripe API requests which uses the Web
   * Fetch API.
   *
   * A fetch function can optionally be passed in as a parameter. If none is
   * passed, will default to the default `fetch` function in the global scope.
   */
  createFetchHttpClient(fetchFn) {
    return new FetchHttpClient(fetchFn);
  }
  /**
   * Creates an HTTP client using runtime-specific APIs.
   */
  createDefaultHttpClient() {
    throw new Error("createDefaultHttpClient not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the Node `crypto` package for its computations.
   */
  createNodeCryptoProvider() {
    throw new Error("createNodeCryptoProvider not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the SubtleCrypto interface of the Web Crypto API.
   */
  createSubtleCryptoProvider(subtleCrypto) {
    return new SubtleCryptoProvider(subtleCrypto);
  }
  createDefaultCryptoProvider() {
    throw new Error("createDefaultCryptoProvider not implemented.");
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/StripeEmitter.js
init_modules_watch_stub();
var _StripeEvent = class extends Event {
  static {
    __name(this, "_StripeEvent");
  }
  constructor(eventName, data) {
    super(eventName);
    this.data = data;
  }
};
var StripeEmitter = class {
  static {
    __name(this, "StripeEmitter");
  }
  constructor() {
    this.eventTarget = new EventTarget();
    this.listenerMapping = /* @__PURE__ */ new Map();
  }
  on(eventName, listener) {
    const listenerWrapper = /* @__PURE__ */ __name((event) => {
      listener(event.data);
    }, "listenerWrapper");
    this.listenerMapping.set(listener, listenerWrapper);
    return this.eventTarget.addEventListener(eventName, listenerWrapper);
  }
  removeListener(eventName, listener) {
    const listenerWrapper = this.listenerMapping.get(listener);
    this.listenerMapping.delete(listener);
    return this.eventTarget.removeEventListener(eventName, listenerWrapper);
  }
  once(eventName, listener) {
    const listenerWrapper = /* @__PURE__ */ __name((event) => {
      listener(event.data);
    }, "listenerWrapper");
    this.listenerMapping.set(listener, listenerWrapper);
    return this.eventTarget.addEventListener(eventName, listenerWrapper, {
      once: true
    });
  }
  emit(eventName, data) {
    return this.eventTarget.dispatchEvent(new _StripeEvent(eventName, data));
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/platform/WebPlatformFunctions.js
var WebPlatformFunctions = class extends PlatformFunctions {
  static {
    __name(this, "WebPlatformFunctions");
  }
  /** @override */
  getUname() {
    return Promise.resolve(null);
  }
  /** @override */
  createEmitter() {
    return new StripeEmitter();
  }
  /** @override */
  tryBufferData(data) {
    if (data.file.data instanceof ReadableStream) {
      throw new Error("Uploading a file as a stream is not supported in non-Node environments. Please open or upvote an issue at github.com/stripe/stripe-node if you use this, detailing your use-case.");
    }
    return Promise.resolve(data);
  }
  /** @override */
  createNodeHttpClient() {
    throw new Error("Stripe: `createNodeHttpClient()` is not available in non-Node environments. Please use `createFetchHttpClient()` instead.");
  }
  /** @override */
  createDefaultHttpClient() {
    return super.createFetchHttpClient();
  }
  /** @override */
  createNodeCryptoProvider() {
    throw new Error("Stripe: `createNodeCryptoProvider()` is not available in non-Node environments. Please use `createSubtleCryptoProvider()` instead.");
  }
  /** @override */
  createDefaultCryptoProvider() {
    return this.createSubtleCryptoProvider();
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/stripe.core.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/Error.js
var Error_exports = {};
__export(Error_exports, {
  StripeAPIError: () => StripeAPIError,
  StripeAuthenticationError: () => StripeAuthenticationError,
  StripeCardError: () => StripeCardError,
  StripeConnectionError: () => StripeConnectionError,
  StripeError: () => StripeError,
  StripeIdempotencyError: () => StripeIdempotencyError,
  StripeInvalidGrantError: () => StripeInvalidGrantError,
  StripeInvalidRequestError: () => StripeInvalidRequestError,
  StripePermissionError: () => StripePermissionError,
  StripeRateLimitError: () => StripeRateLimitError,
  StripeSignatureVerificationError: () => StripeSignatureVerificationError,
  StripeUnknownError: () => StripeUnknownError,
  TemporarySessionExpiredError: () => TemporarySessionExpiredError,
  generateV1Error: () => generateV1Error,
  generateV2Error: () => generateV2Error
});
init_modules_watch_stub();
var generateV1Error = /* @__PURE__ */ __name((rawStripeError) => {
  switch (rawStripeError.type) {
    case "card_error":
      return new StripeCardError(rawStripeError);
    case "invalid_request_error":
      return new StripeInvalidRequestError(rawStripeError);
    case "api_error":
      return new StripeAPIError(rawStripeError);
    case "authentication_error":
      return new StripeAuthenticationError(rawStripeError);
    case "rate_limit_error":
      return new StripeRateLimitError(rawStripeError);
    case "idempotency_error":
      return new StripeIdempotencyError(rawStripeError);
    case "invalid_grant":
      return new StripeInvalidGrantError(rawStripeError);
    default:
      return new StripeUnknownError(rawStripeError);
  }
}, "generateV1Error");
var generateV2Error = /* @__PURE__ */ __name((rawStripeError) => {
  switch (rawStripeError.type) {
    // switchCases: The beginning of the section generated from our OpenAPI spec
    case "temporary_session_expired":
      return new TemporarySessionExpiredError(rawStripeError);
  }
  switch (rawStripeError.code) {
    case "invalid_fields":
      return new StripeInvalidRequestError(rawStripeError);
  }
  return generateV1Error(rawStripeError);
}, "generateV2Error");
var StripeError = class extends Error {
  static {
    __name(this, "StripeError");
  }
  constructor(raw2 = {}, type = null) {
    var _a;
    super(raw2.message);
    this.type = type || this.constructor.name;
    this.raw = raw2;
    this.rawType = raw2.type;
    this.code = raw2.code;
    this.doc_url = raw2.doc_url;
    this.param = raw2.param;
    this.detail = raw2.detail;
    this.headers = raw2.headers;
    this.requestId = raw2.requestId;
    this.statusCode = raw2.statusCode;
    this.message = (_a = raw2.message) !== null && _a !== void 0 ? _a : "";
    this.userMessage = raw2.user_message;
    this.charge = raw2.charge;
    this.decline_code = raw2.decline_code;
    this.payment_intent = raw2.payment_intent;
    this.payment_method = raw2.payment_method;
    this.payment_method_type = raw2.payment_method_type;
    this.setup_intent = raw2.setup_intent;
    this.source = raw2.source;
  }
};
StripeError.generate = generateV1Error;
var StripeCardError = class extends StripeError {
  static {
    __name(this, "StripeCardError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeCardError");
  }
};
var StripeInvalidRequestError = class extends StripeError {
  static {
    __name(this, "StripeInvalidRequestError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeInvalidRequestError");
  }
};
var StripeAPIError = class extends StripeError {
  static {
    __name(this, "StripeAPIError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeAPIError");
  }
};
var StripeAuthenticationError = class extends StripeError {
  static {
    __name(this, "StripeAuthenticationError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeAuthenticationError");
  }
};
var StripePermissionError = class extends StripeError {
  static {
    __name(this, "StripePermissionError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripePermissionError");
  }
};
var StripeRateLimitError = class extends StripeError {
  static {
    __name(this, "StripeRateLimitError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeRateLimitError");
  }
};
var StripeConnectionError = class extends StripeError {
  static {
    __name(this, "StripeConnectionError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeConnectionError");
  }
};
var StripeSignatureVerificationError = class extends StripeError {
  static {
    __name(this, "StripeSignatureVerificationError");
  }
  constructor(header, payload, raw2 = {}) {
    super(raw2, "StripeSignatureVerificationError");
    this.header = header;
    this.payload = payload;
  }
};
var StripeIdempotencyError = class extends StripeError {
  static {
    __name(this, "StripeIdempotencyError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeIdempotencyError");
  }
};
var StripeInvalidGrantError = class extends StripeError {
  static {
    __name(this, "StripeInvalidGrantError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeInvalidGrantError");
  }
};
var StripeUnknownError = class extends StripeError {
  static {
    __name(this, "StripeUnknownError");
  }
  constructor(raw2 = {}) {
    super(raw2, "StripeUnknownError");
  }
};
var TemporarySessionExpiredError = class extends StripeError {
  static {
    __name(this, "TemporarySessionExpiredError");
  }
  constructor(rawStripeError = {}) {
    super(rawStripeError, "TemporarySessionExpiredError");
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/RequestSender.js
init_modules_watch_stub();
var MAX_RETRY_AFTER_WAIT = 60;
var RequestSender = class _RequestSender {
  static {
    __name(this, "RequestSender");
  }
  constructor(stripe, maxBufferedRequestMetric) {
    this._stripe = stripe;
    this._maxBufferedRequestMetric = maxBufferedRequestMetric;
  }
  _normalizeStripeContext(optsContext, clientContext) {
    if (optsContext) {
      return optsContext.toString() || null;
    }
    return (clientContext === null || clientContext === void 0 ? void 0 : clientContext.toString()) || null;
  }
  _addHeadersDirectlyToObject(obj, headers) {
    obj.requestId = headers["request-id"];
    obj.stripeAccount = obj.stripeAccount || headers["stripe-account"];
    obj.apiVersion = obj.apiVersion || headers["stripe-version"];
    obj.idempotencyKey = obj.idempotencyKey || headers["idempotency-key"];
  }
  _makeResponseEvent(requestEvent, statusCode, headers) {
    const requestEndTime = Date.now();
    const requestDurationMs = requestEndTime - requestEvent.request_start_time;
    return removeNullish({
      api_version: headers["stripe-version"],
      account: headers["stripe-account"],
      idempotency_key: headers["idempotency-key"],
      method: requestEvent.method,
      path: requestEvent.path,
      status: statusCode,
      request_id: this._getRequestId(headers),
      elapsed: requestDurationMs,
      request_start_time: requestEvent.request_start_time,
      request_end_time: requestEndTime
    });
  }
  _getRequestId(headers) {
    return headers["request-id"];
  }
  /**
   * Used by methods with spec.streaming === true. For these methods, we do not
   * buffer successful responses into memory or do parse them into stripe
   * objects, we delegate that all of that to the user and pass back the raw
   * http.Response object to the callback.
   *
   * (Unsuccessful responses shouldn't make it here, they should
   * still be buffered/parsed and handled by _jsonResponseHandler -- see
   * makeRequest)
   */
  _streamingResponseHandler(requestEvent, usage, callback) {
    return (res) => {
      const headers = res.getHeaders();
      const streamCompleteCallback = /* @__PURE__ */ __name(() => {
        const responseEvent = this._makeResponseEvent(requestEvent, res.getStatusCode(), headers);
        this._stripe._emitter.emit("response", responseEvent);
        this._recordRequestMetrics(this._getRequestId(headers), responseEvent.elapsed, usage);
      }, "streamCompleteCallback");
      const stream = res.toStream(streamCompleteCallback);
      this._addHeadersDirectlyToObject(stream, headers);
      return callback(null, stream);
    };
  }
  /**
   * Default handler for Stripe responses. Buffers the response into memory,
   * parses the JSON and returns it (i.e. passes it to the callback) if there
   * is no "error" field. Otherwise constructs/passes an appropriate Error.
   */
  _jsonResponseHandler(requestEvent, apiMode, usage, callback) {
    return (res) => {
      const headers = res.getHeaders();
      const requestId = this._getRequestId(headers);
      const statusCode = res.getStatusCode();
      const responseEvent = this._makeResponseEvent(requestEvent, statusCode, headers);
      this._stripe._emitter.emit("response", responseEvent);
      res.toJSON().then((jsonResponse) => {
        if (jsonResponse.error) {
          let err;
          if (typeof jsonResponse.error === "string") {
            jsonResponse.error = {
              type: jsonResponse.error,
              message: jsonResponse.error_description
            };
          }
          jsonResponse.error.headers = headers;
          jsonResponse.error.statusCode = statusCode;
          jsonResponse.error.requestId = requestId;
          if (statusCode === 401) {
            err = new StripeAuthenticationError(jsonResponse.error);
          } else if (statusCode === 403) {
            err = new StripePermissionError(jsonResponse.error);
          } else if (statusCode === 429) {
            err = new StripeRateLimitError(jsonResponse.error);
          } else if (apiMode === "v2") {
            err = generateV2Error(jsonResponse.error);
          } else {
            err = generateV1Error(jsonResponse.error);
          }
          throw err;
        }
        return jsonResponse;
      }, (e) => {
        throw new StripeAPIError({
          message: "Invalid JSON received from the Stripe API",
          exception: e,
          requestId: headers["request-id"]
        });
      }).then((jsonResponse) => {
        this._recordRequestMetrics(requestId, responseEvent.elapsed, usage);
        const rawResponse = res.getRawResponse();
        this._addHeadersDirectlyToObject(rawResponse, headers);
        Object.defineProperty(jsonResponse, "lastResponse", {
          enumerable: false,
          writable: false,
          value: rawResponse
        });
        callback(null, jsonResponse);
      }, (e) => callback(e, null));
    };
  }
  static _generateConnectionErrorMessage(requestRetries) {
    return `An error occurred with our connection to Stripe.${requestRetries > 0 ? ` Request was retried ${requestRetries} times.` : ""}`;
  }
  // For more on when and how to retry API requests, see https://stripe.com/docs/error-handling#safely-retrying-requests-with-idempotency
  static _shouldRetry(res, numRetries, maxRetries, error) {
    if (error && numRetries === 0 && HttpClient.CONNECTION_CLOSED_ERROR_CODES.includes(error.code)) {
      return true;
    }
    if (numRetries >= maxRetries) {
      return false;
    }
    if (!res) {
      return true;
    }
    if (res.getHeaders()["stripe-should-retry"] === "false") {
      return false;
    }
    if (res.getHeaders()["stripe-should-retry"] === "true") {
      return true;
    }
    if (res.getStatusCode() === 409) {
      return true;
    }
    if (res.getStatusCode() >= 500) {
      return true;
    }
    return false;
  }
  _getSleepTimeInMS(numRetries, retryAfter = null) {
    const initialNetworkRetryDelay = this._stripe.getInitialNetworkRetryDelay();
    const maxNetworkRetryDelay = this._stripe.getMaxNetworkRetryDelay();
    let sleepSeconds = Math.min(initialNetworkRetryDelay * Math.pow(2, numRetries - 1), maxNetworkRetryDelay);
    sleepSeconds *= 0.5 * (1 + Math.random());
    sleepSeconds = Math.max(initialNetworkRetryDelay, sleepSeconds);
    if (Number.isInteger(retryAfter) && retryAfter <= MAX_RETRY_AFTER_WAIT) {
      sleepSeconds = Math.max(sleepSeconds, retryAfter);
    }
    return sleepSeconds * 1e3;
  }
  // Max retries can be set on a per request basis. Favor those over the global setting
  _getMaxNetworkRetries(settings = {}) {
    return settings.maxNetworkRetries !== void 0 && Number.isInteger(settings.maxNetworkRetries) ? settings.maxNetworkRetries : this._stripe.getMaxNetworkRetries();
  }
  _defaultIdempotencyKey(method, settings, apiMode) {
    const maxRetries = this._getMaxNetworkRetries(settings);
    const genKey = /* @__PURE__ */ __name(() => `stripe-node-retry-${this._stripe._platformFunctions.uuid4()}`, "genKey");
    if (apiMode === "v2") {
      if (method === "POST" || method === "DELETE") {
        return genKey();
      }
    } else if (apiMode === "v1") {
      if (method === "POST" && maxRetries > 0) {
        return genKey();
      }
    }
    return null;
  }
  _makeHeaders({ contentType, contentLength, apiVersion, clientUserAgent, method, userSuppliedHeaders, userSuppliedSettings, stripeAccount, stripeContext, apiMode }) {
    const defaultHeaders = {
      Accept: "application/json",
      "Content-Type": contentType,
      "User-Agent": this._getUserAgentString(apiMode),
      "X-Stripe-Client-User-Agent": clientUserAgent,
      "X-Stripe-Client-Telemetry": this._getTelemetryHeader(),
      "Stripe-Version": apiVersion,
      "Stripe-Account": stripeAccount,
      "Stripe-Context": stripeContext,
      "Idempotency-Key": this._defaultIdempotencyKey(method, userSuppliedSettings, apiMode)
    };
    const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
    if (methodHasPayload || contentLength) {
      if (!methodHasPayload) {
        emitWarning(`${method} method had non-zero contentLength but no payload is expected for this verb`);
      }
      defaultHeaders["Content-Length"] = contentLength;
    }
    return Object.assign(
      removeNullish(defaultHeaders),
      // If the user supplied, say 'idempotency-key', override instead of appending by ensuring caps are the same.
      normalizeHeaders(userSuppliedHeaders)
    );
  }
  _getUserAgentString(apiMode) {
    const packageVersion = this._stripe.getConstant("PACKAGE_VERSION");
    const appInfo = this._stripe._appInfo ? this._stripe.getAppInfoAsString() : "";
    const aiAgent = this._stripe.getConstant("AI_AGENT");
    let uaString = `Stripe/${apiMode} NodeBindings/${packageVersion}`;
    if (appInfo) {
      uaString += ` ${appInfo}`;
    }
    if (aiAgent) {
      uaString += ` AIAgent/${aiAgent}`;
    }
    return uaString;
  }
  _getTelemetryHeader() {
    if (this._stripe.getTelemetryEnabled() && this._stripe._prevRequestMetrics.length > 0) {
      const metrics = this._stripe._prevRequestMetrics.shift();
      return JSON.stringify({
        last_request_metrics: metrics
      });
    }
  }
  _recordRequestMetrics(requestId, requestDurationMs, usage) {
    if (this._stripe.getTelemetryEnabled() && requestId) {
      if (this._stripe._prevRequestMetrics.length > this._maxBufferedRequestMetric) {
        emitWarning("Request metrics buffer is full, dropping telemetry message.");
      } else {
        const m = {
          request_id: requestId,
          request_duration_ms: requestDurationMs
        };
        if (usage && usage.length > 0) {
          m.usage = usage;
        }
        this._stripe._prevRequestMetrics.push(m);
      }
    }
  }
  _rawRequest(method, path, params, options, usage) {
    const requestPromise = new Promise((resolve, reject) => {
      let opts;
      try {
        const requestMethod = method.toUpperCase();
        if (requestMethod !== "POST" && params && Object.keys(params).length !== 0) {
          throw new Error("rawRequest only supports params on POST requests. Please pass null and add your parameters to path.");
        }
        const args = [].slice.call([params, options]);
        const dataFromArgs = getDataFromArgs(args);
        const data = requestMethod === "POST" ? Object.assign({}, dataFromArgs) : null;
        const calculatedOptions = getOptionsFromArgs(args);
        const headers2 = calculatedOptions.headers;
        const authenticator2 = calculatedOptions.authenticator;
        opts = {
          requestMethod,
          requestPath: path,
          bodyData: data,
          queryData: {},
          authenticator: authenticator2,
          headers: headers2,
          host: calculatedOptions.host,
          streaming: !!calculatedOptions.streaming,
          settings: {},
          // We use this for thin event internals, so we should record the more specific `usage`, when available
          usage: usage || ["raw_request"]
        };
      } catch (err) {
        reject(err);
        return;
      }
      function requestCallback(err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
      __name(requestCallback, "requestCallback");
      const { headers, settings } = opts;
      const authenticator = opts.authenticator;
      this._request(opts.requestMethod, opts.host, path, opts.bodyData, authenticator, { headers, settings, streaming: opts.streaming }, opts.usage, requestCallback);
    });
    return requestPromise;
  }
  _getContentLength(data) {
    return typeof data === "string" ? new TextEncoder().encode(data).length : data.length;
  }
  _request(method, host, path, data, authenticator, options, usage = [], callback, requestDataProcessor = null) {
    var _a;
    let requestData;
    authenticator = (_a = authenticator !== null && authenticator !== void 0 ? authenticator : this._stripe._authenticator) !== null && _a !== void 0 ? _a : null;
    const apiMode = getAPIMode(path);
    const retryRequest = /* @__PURE__ */ __name((requestFn, apiVersion, headers, requestRetries, retryAfter) => {
      return setTimeout(requestFn, this._getSleepTimeInMS(requestRetries, retryAfter), apiVersion, headers, requestRetries + 1);
    }, "retryRequest");
    const makeRequest = /* @__PURE__ */ __name((apiVersion, headers, numRetries) => {
      const timeout = options.settings && options.settings.timeout && Number.isInteger(options.settings.timeout) && options.settings.timeout >= 0 ? options.settings.timeout : this._stripe.getApiField("timeout");
      const request = {
        host: host || this._stripe.getApiField("host"),
        port: this._stripe.getApiField("port"),
        path,
        method,
        headers: Object.assign({}, headers),
        body: requestData,
        protocol: this._stripe.getApiField("protocol")
      };
      authenticator(request).then(() => {
        const req = this._stripe.getApiField("httpClient").makeRequest(request.host, request.port, request.path, request.method, request.headers, request.body, request.protocol, timeout);
        const requestStartTime = Date.now();
        const requestEvent = removeNullish({
          api_version: apiVersion,
          account: parseHttpHeaderAsString(headers["Stripe-Account"]),
          idempotency_key: parseHttpHeaderAsString(headers["Idempotency-Key"]),
          method,
          path,
          request_start_time: requestStartTime
        });
        const requestRetries = numRetries || 0;
        const maxRetries = this._getMaxNetworkRetries(options.settings || {});
        this._stripe._emitter.emit("request", requestEvent);
        req.then((res) => {
          if (_RequestSender._shouldRetry(res, requestRetries, maxRetries)) {
            return retryRequest(makeRequest, apiVersion, headers, requestRetries, parseHttpHeaderAsNumber(res.getHeaders()["retry-after"]));
          } else if (options.streaming && res.getStatusCode() < 400) {
            return this._streamingResponseHandler(requestEvent, usage, callback)(res);
          } else {
            return this._jsonResponseHandler(requestEvent, apiMode, usage, callback)(res);
          }
        }).catch((error) => {
          if (_RequestSender._shouldRetry(null, requestRetries, maxRetries, error)) {
            return retryRequest(makeRequest, apiVersion, headers, requestRetries, null);
          } else {
            const isTimeoutError = error.code && error.code === HttpClient.TIMEOUT_ERROR_CODE;
            return callback(new StripeConnectionError({
              message: isTimeoutError ? `Request aborted due to timeout being reached (${timeout}ms)` : _RequestSender._generateConnectionErrorMessage(requestRetries),
              detail: error
            }));
          }
        });
      }).catch((e) => {
        throw new StripeError({
          message: "Unable to authenticate the request",
          exception: e
        });
      });
    }, "makeRequest");
    const prepareAndMakeRequest = /* @__PURE__ */ __name((error, data2) => {
      if (error) {
        return callback(error);
      }
      requestData = data2;
      this._stripe.getClientUserAgent((clientUserAgent) => {
        var _a2, _b, _c;
        const apiVersion = this._stripe.getApiField("version");
        const headers = this._makeHeaders({
          contentType: apiMode == "v2" ? "application/json" : "application/x-www-form-urlencoded",
          contentLength: this._getContentLength(data2),
          apiVersion,
          clientUserAgent,
          method,
          // other callers expect null, but .headers being optional means it's undefined if not supplied. So we normalize to null.
          userSuppliedHeaders: (_a2 = options.headers) !== null && _a2 !== void 0 ? _a2 : null,
          userSuppliedSettings: (_b = options.settings) !== null && _b !== void 0 ? _b : {},
          stripeAccount: (_c = options.stripeAccount) !== null && _c !== void 0 ? _c : this._stripe.getApiField("stripeAccount"),
          stripeContext: this._normalizeStripeContext(options.stripeContext, this._stripe.getApiField("stripeContext")),
          apiMode
        });
        makeRequest(apiVersion, headers, 0);
      });
    }, "prepareAndMakeRequest");
    if (requestDataProcessor) {
      requestDataProcessor(method, data, options.headers, prepareAndMakeRequest);
    } else {
      let stringifiedData;
      if (apiMode == "v2") {
        stringifiedData = data ? jsonStringifyRequestData(data) : "";
      } else {
        stringifiedData = queryStringifyRequestData(data || {});
      }
      prepareAndMakeRequest(null, stringifiedData);
    }
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/StripeResource.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/StripeMethod.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/autoPagination.js
init_modules_watch_stub();
var V1Iterator = class {
  static {
    __name(this, "V1Iterator");
  }
  constructor(firstPagePromise, requestArgs, spec, stripeResource) {
    this.index = 0;
    this.pagePromise = firstPagePromise;
    this.promiseCache = { currentPromise: null };
    this.requestArgs = requestArgs;
    this.spec = spec;
    this.stripeResource = stripeResource;
  }
  async iterate(pageResult) {
    if (!(pageResult && pageResult.data && typeof pageResult.data.length === "number")) {
      throw Error("Unexpected: Stripe API response does not have a well-formed `data` array.");
    }
    const reverseIteration = isReverseIteration(this.requestArgs);
    if (this.index < pageResult.data.length) {
      const idx = reverseIteration ? pageResult.data.length - 1 - this.index : this.index;
      const value = pageResult.data[idx];
      this.index += 1;
      return { value, done: false };
    } else if (pageResult.has_more) {
      this.index = 0;
      this.pagePromise = this.getNextPage(pageResult);
      const nextPageResult = await this.pagePromise;
      return this.iterate(nextPageResult);
    }
    return { done: true, value: void 0 };
  }
  /** @abstract */
  getNextPage(_pageResult) {
    throw new Error("Unimplemented");
  }
  async _next() {
    return this.iterate(await this.pagePromise);
  }
  next() {
    if (this.promiseCache.currentPromise) {
      return this.promiseCache.currentPromise;
    }
    const nextPromise = (async () => {
      const ret = await this._next();
      this.promiseCache.currentPromise = null;
      return ret;
    })();
    this.promiseCache.currentPromise = nextPromise;
    return nextPromise;
  }
};
var V1ListIterator = class extends V1Iterator {
  static {
    __name(this, "V1ListIterator");
  }
  getNextPage(pageResult) {
    const reverseIteration = isReverseIteration(this.requestArgs);
    const lastId = getLastId(pageResult, reverseIteration);
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      [reverseIteration ? "ending_before" : "starting_after"]: lastId
    });
  }
};
var V1SearchIterator = class extends V1Iterator {
  static {
    __name(this, "V1SearchIterator");
  }
  getNextPage(pageResult) {
    if (!pageResult.next_page) {
      throw Error("Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true.");
    }
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      page: pageResult.next_page
    });
  }
};
var V2ListIterator = class {
  static {
    __name(this, "V2ListIterator");
  }
  constructor(firstPagePromise, requestArgs, spec, stripeResource) {
    this.firstPagePromise = firstPagePromise;
    this.currentPageIterator = null;
    this.nextPageUrl = null;
    this.requestArgs = requestArgs;
    this.spec = spec;
    this.stripeResource = stripeResource;
  }
  async initFirstPage() {
    if (this.firstPagePromise) {
      const page = await this.firstPagePromise;
      this.firstPagePromise = null;
      this.currentPageIterator = page.data[Symbol.iterator]();
      this.nextPageUrl = page.next_page_url || null;
    }
  }
  async turnPage() {
    if (!this.nextPageUrl)
      return null;
    this.spec.fullPath = this.nextPageUrl;
    const page = await this.stripeResource._makeRequest([], this.spec, {});
    this.nextPageUrl = page.next_page_url || null;
    this.currentPageIterator = page.data[Symbol.iterator]();
    return this.currentPageIterator;
  }
  async next() {
    await this.initFirstPage();
    if (this.currentPageIterator) {
      const result2 = this.currentPageIterator.next();
      if (!result2.done)
        return { done: false, value: result2.value };
    }
    const nextPageIterator = await this.turnPage();
    if (!nextPageIterator) {
      return { done: true, value: void 0 };
    }
    const result = nextPageIterator.next();
    if (!result.done)
      return { done: false, value: result.value };
    return { done: true, value: void 0 };
  }
};
var makeAutoPaginationMethods = /* @__PURE__ */ __name((stripeResource, requestArgs, spec, firstPagePromise) => {
  const apiMode = getAPIMode(spec.fullPath || spec.path);
  if (apiMode !== "v2" && spec.methodType === "search") {
    return makeAutoPaginationMethodsFromIterator(new V1SearchIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  if (apiMode !== "v2" && spec.methodType === "list") {
    return makeAutoPaginationMethodsFromIterator(new V1ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  if (apiMode === "v2" && spec.methodType === "list") {
    return makeAutoPaginationMethodsFromIterator(new V2ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  return null;
}, "makeAutoPaginationMethods");
var makeAutoPaginationMethodsFromIterator = /* @__PURE__ */ __name((iterator) => {
  const autoPagingEach = makeAutoPagingEach((...args) => iterator.next(...args));
  const autoPagingToArray = makeAutoPagingToArray(autoPagingEach);
  const autoPaginationMethods = {
    autoPagingEach,
    autoPagingToArray,
    // Async iterator functions:
    next: /* @__PURE__ */ __name(() => iterator.next(), "next"),
    return: /* @__PURE__ */ __name(() => {
      return {};
    }, "return"),
    [getAsyncIteratorSymbol()]: () => {
      return autoPaginationMethods;
    }
  };
  return autoPaginationMethods;
}, "makeAutoPaginationMethodsFromIterator");
function getAsyncIteratorSymbol() {
  if (typeof Symbol !== "undefined" && Symbol.asyncIterator) {
    return Symbol.asyncIterator;
  }
  return "@@asyncIterator";
}
__name(getAsyncIteratorSymbol, "getAsyncIteratorSymbol");
function getDoneCallback(args) {
  if (args.length < 2) {
    return null;
  }
  const onDone = args[1];
  if (typeof onDone !== "function") {
    throw Error(`The second argument to autoPagingEach, if present, must be a callback function; received ${typeof onDone}`);
  }
  return onDone;
}
__name(getDoneCallback, "getDoneCallback");
function getItemCallback(args) {
  if (args.length === 0) {
    return void 0;
  }
  const onItem = args[0];
  if (typeof onItem !== "function") {
    throw Error(`The first argument to autoPagingEach, if present, must be a callback function; received ${typeof onItem}`);
  }
  if (onItem.length === 2) {
    return onItem;
  }
  if (onItem.length > 2) {
    throw Error(`The \`onItem\` callback function passed to autoPagingEach must accept at most two arguments; got ${onItem}`);
  }
  return /* @__PURE__ */ __name(function _onItem(item, next) {
    const shouldContinue = onItem(item);
    next(shouldContinue);
  }, "_onItem");
}
__name(getItemCallback, "getItemCallback");
function getLastId(listResult, reverseIteration) {
  const lastIdx = reverseIteration ? 0 : listResult.data.length - 1;
  const lastItem = listResult.data[lastIdx];
  const lastId = lastItem && lastItem.id;
  if (!lastId) {
    throw Error("Unexpected: No `id` found on the last item while auto-paging a list.");
  }
  return lastId;
}
__name(getLastId, "getLastId");
function makeAutoPagingEach(asyncIteratorNext) {
  return /* @__PURE__ */ __name(function autoPagingEach() {
    const args = [].slice.call(arguments);
    const onItem = getItemCallback(args);
    const onDone = getDoneCallback(args);
    if (args.length > 2) {
      throw Error(`autoPagingEach takes up to two arguments; received ${args}`);
    }
    const autoPagePromise = wrapAsyncIteratorWithCallback(
      asyncIteratorNext,
      // @ts-ignore we might need a null check
      onItem
    );
    return callbackifyPromiseWithTimeout(autoPagePromise, onDone);
  }, "autoPagingEach");
}
__name(makeAutoPagingEach, "makeAutoPagingEach");
function makeAutoPagingToArray(autoPagingEach) {
  return /* @__PURE__ */ __name(function autoPagingToArray(opts, onDone) {
    const limit = opts && opts.limit;
    if (!limit) {
      throw Error("You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`.");
    }
    if (limit > 1e4) {
      throw Error("You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.");
    }
    const promise = new Promise((resolve, reject) => {
      const items = [];
      autoPagingEach((item) => {
        items.push(item);
        if (items.length >= limit) {
          return false;
        }
      }).then(() => {
        resolve(items);
      }).catch(reject);
    });
    return callbackifyPromiseWithTimeout(promise, onDone);
  }, "autoPagingToArray");
}
__name(makeAutoPagingToArray, "makeAutoPagingToArray");
function wrapAsyncIteratorWithCallback(asyncIteratorNext, onItem) {
  return new Promise((resolve, reject) => {
    function handleIteration(iterResult) {
      if (iterResult.done) {
        resolve();
        return;
      }
      const item = iterResult.value;
      return new Promise((next) => {
        onItem(item, next);
      }).then((shouldContinue) => {
        if (shouldContinue === false) {
          return handleIteration({ done: true, value: void 0 });
        } else {
          return asyncIteratorNext().then(handleIteration);
        }
      });
    }
    __name(handleIteration, "handleIteration");
    asyncIteratorNext().then(handleIteration).catch(reject);
  });
}
__name(wrapAsyncIteratorWithCallback, "wrapAsyncIteratorWithCallback");
function isReverseIteration(requestArgs) {
  const args = [].slice.call(requestArgs);
  const dataFromArgs = getDataFromArgs(args);
  return !!dataFromArgs.ending_before;
}
__name(isReverseIteration, "isReverseIteration");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/StripeMethod.js
function stripeMethod(spec) {
  if (spec.path !== void 0 && spec.fullPath !== void 0) {
    throw new Error(`Method spec specified both a 'path' (${spec.path}) and a 'fullPath' (${spec.fullPath}).`);
  }
  return function(...args) {
    const callback = typeof args[args.length - 1] == "function" && args.pop();
    spec.urlParams = extractUrlParams(spec.fullPath || this.createResourcePathWithSymbols(spec.path || ""));
    const requestPromise = callbackifyPromiseWithTimeout(this._makeRequest(args, spec, {}), callback);
    Object.assign(requestPromise, makeAutoPaginationMethods(this, args, spec, requestPromise));
    return requestPromise;
  };
}
__name(stripeMethod, "stripeMethod");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/StripeResource.js
StripeResource.extend = protoExtend;
StripeResource.method = stripeMethod;
StripeResource.MAX_BUFFERED_REQUEST_METRICS = 100;
function StripeResource(stripe, deprecatedUrlData) {
  this._stripe = stripe;
  if (deprecatedUrlData) {
    throw new Error("Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.");
  }
  this.basePath = makeURLInterpolator(
    // @ts-ignore changing type of basePath
    this.basePath || stripe.getApiField("basePath")
  );
  this.resourcePath = this.path;
  this.path = makeURLInterpolator(this.path);
  this.initialize(...arguments);
}
__name(StripeResource, "StripeResource");
StripeResource.prototype = {
  _stripe: null,
  // @ts-ignore the type of path changes in ctor
  path: "",
  resourcePath: "",
  // Methods that don't use the API's default '/v1' path can override it with this setting.
  basePath: null,
  initialize() {
  },
  // Function to override the default data processor. This allows full control
  // over how a StripeResource's request data will get converted into an HTTP
  // body. This is useful for non-standard HTTP requests. The function should
  // take method name, data, and headers as arguments.
  requestDataProcessor: null,
  // Function to add a validation checks before sending the request, errors should
  // be thrown, and they will be passed to the callback/promise.
  validateRequest: null,
  createFullPath(commandPath, urlData) {
    const urlParts = [this.basePath(urlData), this.path(urlData)];
    if (typeof commandPath === "function") {
      const computedCommandPath = commandPath(urlData);
      if (computedCommandPath) {
        urlParts.push(computedCommandPath);
      }
    } else {
      urlParts.push(commandPath);
    }
    return this._joinUrlParts(urlParts);
  },
  // Creates a relative resource path with symbols left in (unlike
  // createFullPath which takes some data to replace them with). For example it
  // might produce: /invoices/{id}
  createResourcePathWithSymbols(pathWithSymbols) {
    if (pathWithSymbols) {
      return `/${this._joinUrlParts([this.resourcePath, pathWithSymbols])}`;
    } else {
      return `/${this.resourcePath}`;
    }
  },
  _joinUrlParts(parts) {
    return parts.join("/").replace(/\/{2,}/g, "/");
  },
  _getRequestOpts(requestArgs, spec, overrideData) {
    var _a;
    const requestMethod = (spec.method || "GET").toUpperCase();
    const usage = spec.usage || [];
    const urlParams = spec.urlParams || [];
    const encode = spec.encode || ((data2) => data2);
    const isUsingFullPath = !!spec.fullPath;
    const commandPath = makeURLInterpolator(isUsingFullPath ? spec.fullPath : spec.path || "");
    const path = isUsingFullPath ? spec.fullPath : this.createResourcePathWithSymbols(spec.path);
    const args = [].slice.call(requestArgs);
    const urlData = urlParams.reduce((urlData2, param) => {
      const arg = args.shift();
      if (typeof arg !== "string") {
        throw new Error(`Stripe: Argument "${param}" must be a string, but got: ${arg} (on API request to \`${requestMethod} ${path}\`)`);
      }
      urlData2[param] = arg;
      return urlData2;
    }, {});
    const dataFromArgs = getDataFromArgs(args);
    const data = encode(Object.assign({}, dataFromArgs, overrideData));
    const options = getOptionsFromArgs(args);
    const host = options.host || spec.host;
    const streaming = !!spec.streaming || !!options.streaming;
    if (args.filter((x) => x != null).length) {
      throw new Error(`Stripe: Unknown arguments (${args}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${requestMethod} \`${path}\`)`);
    }
    const requestPath = isUsingFullPath ? commandPath(urlData) : this.createFullPath(commandPath, urlData);
    const headers = Object.assign(options.headers, spec.headers);
    if (spec.validator) {
      spec.validator(data, { headers });
    }
    const dataInQuery = spec.method === "GET" || spec.method === "DELETE";
    const bodyData = dataInQuery ? null : data;
    const queryData = dataInQuery ? data : {};
    return {
      requestMethod,
      requestPath,
      bodyData,
      queryData,
      authenticator: (_a = options.authenticator) !== null && _a !== void 0 ? _a : null,
      headers,
      host: host !== null && host !== void 0 ? host : null,
      streaming,
      settings: options.settings,
      usage
    };
  },
  _makeRequest(requestArgs, spec, overrideData) {
    return new Promise((resolve, reject) => {
      var _a;
      let opts;
      try {
        opts = this._getRequestOpts(requestArgs, spec, overrideData);
      } catch (err) {
        reject(err);
        return;
      }
      function requestCallback(err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(spec.transformResponseData ? spec.transformResponseData(response) : response);
        }
      }
      __name(requestCallback, "requestCallback");
      const emptyQuery = Object.keys(opts.queryData).length === 0;
      const path = [
        opts.requestPath,
        emptyQuery ? "" : "?",
        queryStringifyRequestData(opts.queryData)
      ].join("");
      const { headers, settings } = opts;
      this._stripe._requestSender._request(opts.requestMethod, opts.host, path, opts.bodyData, opts.authenticator, {
        headers,
        settings,
        streaming: opts.streaming
      }, opts.usage, requestCallback, (_a = this.requestDataProcessor) === null || _a === void 0 ? void 0 : _a.bind(this));
    });
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/StripeContext.js
init_modules_watch_stub();
var StripeContext = class _StripeContext {
  static {
    __name(this, "StripeContext");
  }
  /**
   * Creates a new StripeContext with the given segments.
   */
  constructor(segments = []) {
    this._segments = [...segments];
  }
  /**
   * Gets a copy of the segments of this Context.
   */
  get segments() {
    return [...this._segments];
  }
  /**
   * Creates a new StripeContext with an additional segment appended.
   */
  push(segment) {
    if (!segment) {
      throw new Error("Segment cannot be null or undefined");
    }
    return new _StripeContext([...this._segments, segment]);
  }
  /**
   * Creates a new StripeContext with the last segment removed.
   * If there are no segments, throws an error.
   */
  pop() {
    if (this._segments.length === 0) {
      throw new Error("Cannot pop from an empty context");
    }
    return new _StripeContext(this._segments.slice(0, -1));
  }
  /**
   * Converts this context to its string representation.
   */
  toString() {
    return this._segments.join("/");
  }
  /**
   * Parses a context string into a StripeContext instance.
   */
  static parse(contextStr) {
    if (!contextStr) {
      return new _StripeContext([]);
    }
    return new _StripeContext(contextStr.split("/"));
  }
};

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/Webhooks.js
init_modules_watch_stub();
function createWebhooks(platformFunctions) {
  const Webhook = {
    DEFAULT_TOLERANCE: 300,
    signature: null,
    constructEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      try {
        if (!this.signature) {
          throw new Error("ERR: missing signature helper, unable to verify");
        }
        this.signature.verifyHeader(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      } catch (e) {
        if (e instanceof CryptoProviderOnlySupportsAsyncError) {
          e.message += "\nUse `await constructEventAsync(...)` instead of `constructEvent(...)`";
        }
        throw e;
      }
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    async constructEventAsync(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      if (!this.signature) {
        throw new Error("ERR: missing signature helper, unable to verify");
      }
      await this.signature.verifyHeaderAsync(payload, header, secret, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    /**
     * Generates a header to be used for webhook mocking
     *
     * @typedef {object} opts
     * @property {number} timestamp - Timestamp of the header. Defaults to Date.now()
     * @property {string} payload - JSON stringified payload object, containing the 'id' and 'object' parameters
     * @property {string} secret - Stripe webhook secret 'whsec_...'
     * @property {string} scheme - Version of API to hit. Defaults to 'v1'.
     * @property {string} signature - Computed webhook signature
     * @property {CryptoProvider} cryptoProvider - Crypto provider to use for computing the signature if none was provided. Defaults to NodeCryptoProvider.
     */
    generateTestHeaderString: /* @__PURE__ */ __name(function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || preparedOpts.cryptoProvider.computeHMACSignature(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    }, "generateTestHeaderString"),
    generateTestHeaderStringAsync: /* @__PURE__ */ __name(async function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || await preparedOpts.cryptoProvider.computeHMACSignatureAsync(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    }, "generateTestHeaderStringAsync")
  };
  const signature = {
    EXPECTED_SCHEME: "v1",
    verifyHeader(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = cryptoProvider.computeHMACSignature(makeHMACContent(payload, details), secret);
      validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
      return true;
    },
    async verifyHeaderAsync(encodedPayload, encodedHeader, secret, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = await cryptoProvider.computeHMACSignatureAsync(makeHMACContent(payload, details), secret);
      return validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
    }
  };
  function makeHMACContent(payload, details) {
    return `${details.timestamp}.${payload}`;
  }
  __name(makeHMACContent, "makeHMACContent");
  function parseEventDetails(encodedPayload, encodedHeader, expectedScheme) {
    if (!encodedPayload) {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No webhook payload was provided."
      });
    }
    const suspectPayloadType = typeof encodedPayload != "string" && !(encodedPayload instanceof Uint8Array);
    const textDecoder = new TextDecoder("utf8");
    const decodedPayload = encodedPayload instanceof Uint8Array ? textDecoder.decode(encodedPayload) : encodedPayload;
    if (Array.isArray(encodedHeader)) {
      throw new Error("Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header.");
    }
    if (encodedHeader == null || encodedHeader == "") {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No stripe-signature header value was provided."
      });
    }
    const decodedHeader = encodedHeader instanceof Uint8Array ? textDecoder.decode(encodedHeader) : encodedHeader;
    const details = parseHeader(decodedHeader, expectedScheme);
    if (!details || details.timestamp === -1) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "Unable to extract timestamp and signatures from header"
      });
    }
    if (!details.signatures.length) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "No signatures found with expected scheme"
      });
    }
    return {
      decodedPayload,
      decodedHeader,
      details,
      suspectPayloadType
    };
  }
  __name(parseEventDetails, "parseEventDetails");
  function validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt) {
    const signatureFound = !!details.signatures.filter(platformFunctions.secureCompare.bind(platformFunctions, expectedSignature)).length;
    const docsLocation = "\nLearn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature";
    const whitespaceMessage = secretContainsWhitespace ? "\n\nNote: The provided signing secret contains whitespace. This often indicates an extra newline or space is in the value" : "";
    if (!signatureFound) {
      if (suspectPayloadType) {
        throw new StripeSignatureVerificationError(header, payload, {
          message: "Webhook payload must be provided as a string or a Buffer (https://nodejs.org/api/buffer.html) instance representing the _raw_ request body.Payload was provided as a parsed JavaScript object instead. \nSignature verification is impossible without access to the original signed material. \n" + docsLocation + "\n" + whitespaceMessage
        });
      }
      throw new StripeSignatureVerificationError(header, payload, {
        message: "No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? \n If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.\n" + docsLocation + "\n" + whitespaceMessage
      });
    }
    const timestampAge = Math.floor((typeof receivedAt === "number" ? receivedAt : Date.now()) / 1e3) - details.timestamp;
    if (tolerance > 0 && timestampAge > tolerance) {
      throw new StripeSignatureVerificationError(header, payload, {
        message: "Timestamp outside the tolerance zone"
      });
    }
    return true;
  }
  __name(validateComputedSignature, "validateComputedSignature");
  function parseHeader(header, scheme) {
    if (typeof header !== "string") {
      return null;
    }
    return header.split(",").reduce((accum, item) => {
      const kv = item.split("=");
      if (kv[0] === "t") {
        accum.timestamp = parseInt(kv[1], 10);
      }
      if (kv[0] === scheme) {
        accum.signatures.push(kv[1]);
      }
      return accum;
    }, {
      timestamp: -1,
      signatures: []
    });
  }
  __name(parseHeader, "parseHeader");
  let webhooksCryptoProviderInstance = null;
  function getCryptoProvider() {
    if (!webhooksCryptoProviderInstance) {
      webhooksCryptoProviderInstance = platformFunctions.createDefaultCryptoProvider();
    }
    return webhooksCryptoProviderInstance;
  }
  __name(getCryptoProvider, "getCryptoProvider");
  function prepareOptions(opts) {
    if (!opts) {
      throw new StripeError({
        message: "Options are required"
      });
    }
    const timestamp = Math.floor(opts.timestamp) || Math.floor(Date.now() / 1e3);
    const scheme = opts.scheme || signature.EXPECTED_SCHEME;
    const cryptoProvider = opts.cryptoProvider || getCryptoProvider();
    const payloadString = `${timestamp}.${opts.payload}`;
    const generateHeaderString = /* @__PURE__ */ __name((signature2) => {
      return `t=${timestamp},${scheme}=${signature2}`;
    }, "generateHeaderString");
    return Object.assign(Object.assign({}, opts), {
      timestamp,
      scheme,
      cryptoProvider,
      payloadString,
      generateHeaderString
    });
  }
  __name(prepareOptions, "prepareOptions");
  Webhook.signature = signature;
  return Webhook;
}
__name(createWebhooks, "createWebhooks");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/apiVersion.js
init_modules_watch_stub();
var ApiVersion = "2026-02-25.clover";

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources.js
var resources_exports = {};
__export(resources_exports, {
  Account: () => Accounts3,
  AccountLinks: () => AccountLinks2,
  AccountSessions: () => AccountSessions,
  Accounts: () => Accounts3,
  ApplePayDomains: () => ApplePayDomains,
  ApplicationFees: () => ApplicationFees,
  Apps: () => Apps,
  Balance: () => Balance,
  BalanceSettings: () => BalanceSettings,
  BalanceTransactions: () => BalanceTransactions,
  Billing: () => Billing,
  BillingPortal: () => BillingPortal,
  Charges: () => Charges,
  Checkout: () => Checkout,
  Climate: () => Climate,
  ConfirmationTokens: () => ConfirmationTokens2,
  CountrySpecs: () => CountrySpecs,
  Coupons: () => Coupons,
  CreditNotes: () => CreditNotes,
  CustomerSessions: () => CustomerSessions,
  Customers: () => Customers2,
  Disputes: () => Disputes2,
  Entitlements: () => Entitlements,
  EphemeralKeys: () => EphemeralKeys,
  Events: () => Events2,
  ExchangeRates: () => ExchangeRates,
  FileLinks: () => FileLinks,
  Files: () => Files,
  FinancialConnections: () => FinancialConnections,
  Forwarding: () => Forwarding,
  Identity: () => Identity,
  InvoiceItems: () => InvoiceItems,
  InvoicePayments: () => InvoicePayments,
  InvoiceRenderingTemplates: () => InvoiceRenderingTemplates,
  Invoices: () => Invoices,
  Issuing: () => Issuing,
  Mandates: () => Mandates,
  OAuth: () => OAuth,
  PaymentAttemptRecords: () => PaymentAttemptRecords,
  PaymentIntents: () => PaymentIntents,
  PaymentLinks: () => PaymentLinks,
  PaymentMethodConfigurations: () => PaymentMethodConfigurations,
  PaymentMethodDomains: () => PaymentMethodDomains,
  PaymentMethods: () => PaymentMethods,
  PaymentRecords: () => PaymentRecords,
  Payouts: () => Payouts,
  Plans: () => Plans,
  Prices: () => Prices,
  Products: () => Products2,
  PromotionCodes: () => PromotionCodes,
  Quotes: () => Quotes,
  Radar: () => Radar,
  Refunds: () => Refunds2,
  Reporting: () => Reporting,
  Reviews: () => Reviews,
  SetupAttempts: () => SetupAttempts,
  SetupIntents: () => SetupIntents,
  ShippingRates: () => ShippingRates,
  Sigma: () => Sigma,
  Sources: () => Sources,
  SubscriptionItems: () => SubscriptionItems,
  SubscriptionSchedules: () => SubscriptionSchedules,
  Subscriptions: () => Subscriptions,
  Tax: () => Tax,
  TaxCodes: () => TaxCodes,
  TaxIds: () => TaxIds,
  TaxRates: () => TaxRates,
  Terminal: () => Terminal,
  TestHelpers: () => TestHelpers,
  Tokens: () => Tokens2,
  Topups: () => Topups,
  Transfers: () => Transfers,
  Treasury: () => Treasury,
  V2: () => V2,
  WebhookEndpoints: () => WebhookEndpoints
});
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/ResourceNamespace.js
init_modules_watch_stub();
function ResourceNamespace(stripe, resources) {
  for (const name in resources) {
    if (!Object.prototype.hasOwnProperty.call(resources, name)) {
      continue;
    }
    const camelCaseName = name[0].toLowerCase() + name.substring(1);
    const resource = new resources[name](stripe);
    this[camelCaseName] = resource;
  }
}
__name(ResourceNamespace, "ResourceNamespace");
function resourceNamespace(namespace, resources) {
  return function(stripe) {
    return new ResourceNamespace(stripe, resources);
  };
}
__name(resourceNamespace, "resourceNamespace");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/AccountLinks.js
init_modules_watch_stub();
var stripeMethod2 = StripeResource.method;
var AccountLinks = StripeResource.extend({
  create: stripeMethod2({ method: "POST", fullPath: "/v2/core/account_links" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/AccountTokens.js
init_modules_watch_stub();
var stripeMethod3 = StripeResource.method;
var AccountTokens = StripeResource.extend({
  create: stripeMethod3({ method: "POST", fullPath: "/v2/core/account_tokens" }),
  retrieve: stripeMethod3({
    method: "GET",
    fullPath: "/v2/core/account_tokens/{id}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/FinancialConnections/Accounts.js
init_modules_watch_stub();
var stripeMethod4 = StripeResource.method;
var Accounts = StripeResource.extend({
  retrieve: stripeMethod4({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}"
  }),
  list: stripeMethod4({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts",
    methodType: "list"
  }),
  disconnect: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/disconnect"
  }),
  listOwners: stripeMethod4({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}/owners",
    methodType: "list"
  }),
  refresh: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/refresh"
  }),
  subscribe: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/subscribe"
  }),
  unsubscribe: stripeMethod4({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/unsubscribe"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/Accounts.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/Accounts/Persons.js
init_modules_watch_stub();
var stripeMethod5 = StripeResource.method;
var Persons = StripeResource.extend({
  create: stripeMethod5({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/persons"
  }),
  retrieve: stripeMethod5({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  }),
  update: stripeMethod5({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  }),
  list: stripeMethod5({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/persons",
    methodType: "list"
  }),
  del: stripeMethod5({
    method: "DELETE",
    fullPath: "/v2/core/accounts/{account_id}/persons/{id}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/Accounts/PersonTokens.js
init_modules_watch_stub();
var stripeMethod6 = StripeResource.method;
var PersonTokens = StripeResource.extend({
  create: stripeMethod6({
    method: "POST",
    fullPath: "/v2/core/accounts/{account_id}/person_tokens"
  }),
  retrieve: stripeMethod6({
    method: "GET",
    fullPath: "/v2/core/accounts/{account_id}/person_tokens/{id}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/Accounts.js
var stripeMethod7 = StripeResource.method;
var Accounts2 = StripeResource.extend({
  constructor: /* @__PURE__ */ __name(function(...args) {
    StripeResource.apply(this, args);
    this.persons = new Persons(...args);
    this.personTokens = new PersonTokens(...args);
  }, "constructor"),
  create: stripeMethod7({ method: "POST", fullPath: "/v2/core/accounts" }),
  retrieve: stripeMethod7({ method: "GET", fullPath: "/v2/core/accounts/{id}" }),
  update: stripeMethod7({ method: "POST", fullPath: "/v2/core/accounts/{id}" }),
  list: stripeMethod7({
    method: "GET",
    fullPath: "/v2/core/accounts",
    methodType: "list"
  }),
  close: stripeMethod7({
    method: "POST",
    fullPath: "/v2/core/accounts/{id}/close"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Entitlements/ActiveEntitlements.js
init_modules_watch_stub();
var stripeMethod8 = StripeResource.method;
var ActiveEntitlements = StripeResource.extend({
  retrieve: stripeMethod8({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements/{id}"
  }),
  list: stripeMethod8({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Billing/Alerts.js
init_modules_watch_stub();
var stripeMethod9 = StripeResource.method;
var Alerts = StripeResource.extend({
  create: stripeMethod9({ method: "POST", fullPath: "/v1/billing/alerts" }),
  retrieve: stripeMethod9({ method: "GET", fullPath: "/v1/billing/alerts/{id}" }),
  list: stripeMethod9({
    method: "GET",
    fullPath: "/v1/billing/alerts",
    methodType: "list"
  }),
  activate: stripeMethod9({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/activate"
  }),
  archive: stripeMethod9({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/archive"
  }),
  deactivate: stripeMethod9({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/deactivate"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Tax/Associations.js
init_modules_watch_stub();
var stripeMethod10 = StripeResource.method;
var Associations = StripeResource.extend({
  find: stripeMethod10({ method: "GET", fullPath: "/v1/tax/associations/find" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/Authorizations.js
init_modules_watch_stub();
var stripeMethod11 = StripeResource.method;
var Authorizations = StripeResource.extend({
  retrieve: stripeMethod11({
    method: "GET",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  update: stripeMethod11({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  list: stripeMethod11({
    method: "GET",
    fullPath: "/v1/issuing/authorizations",
    methodType: "list"
  }),
  approve: stripeMethod11({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/approve"
  }),
  decline: stripeMethod11({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/decline"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Issuing/Authorizations.js
init_modules_watch_stub();
var stripeMethod12 = StripeResource.method;
var Authorizations2 = StripeResource.extend({
  create: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations"
  }),
  capture: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/capture"
  }),
  expire: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/expire"
  }),
  finalizeAmount: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/finalize_amount"
  }),
  increment: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/increment"
  }),
  respond: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/fraud_challenges/respond"
  }),
  reverse: stripeMethod12({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/reverse"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Tax/Calculations.js
init_modules_watch_stub();
var stripeMethod13 = StripeResource.method;
var Calculations = StripeResource.extend({
  create: stripeMethod13({ method: "POST", fullPath: "/v1/tax/calculations" }),
  retrieve: stripeMethod13({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}"
  }),
  listLineItems: stripeMethod13({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/Cardholders.js
init_modules_watch_stub();
var stripeMethod14 = StripeResource.method;
var Cardholders = StripeResource.extend({
  create: stripeMethod14({ method: "POST", fullPath: "/v1/issuing/cardholders" }),
  retrieve: stripeMethod14({
    method: "GET",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  update: stripeMethod14({
    method: "POST",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  list: stripeMethod14({
    method: "GET",
    fullPath: "/v1/issuing/cardholders",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/Cards.js
init_modules_watch_stub();
var stripeMethod15 = StripeResource.method;
var Cards = StripeResource.extend({
  create: stripeMethod15({ method: "POST", fullPath: "/v1/issuing/cards" }),
  retrieve: stripeMethod15({ method: "GET", fullPath: "/v1/issuing/cards/{card}" }),
  update: stripeMethod15({ method: "POST", fullPath: "/v1/issuing/cards/{card}" }),
  list: stripeMethod15({
    method: "GET",
    fullPath: "/v1/issuing/cards",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Issuing/Cards.js
init_modules_watch_stub();
var stripeMethod16 = StripeResource.method;
var Cards2 = StripeResource.extend({
  deliverCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/deliver"
  }),
  failCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/fail"
  }),
  returnCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/return"
  }),
  shipCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/ship"
  }),
  submitCard: stripeMethod16({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/submit"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/BillingPortal/Configurations.js
init_modules_watch_stub();
var stripeMethod17 = StripeResource.method;
var Configurations = StripeResource.extend({
  create: stripeMethod17({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations"
  }),
  retrieve: stripeMethod17({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  update: stripeMethod17({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  list: stripeMethod17({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Terminal/Configurations.js
init_modules_watch_stub();
var stripeMethod18 = StripeResource.method;
var Configurations2 = StripeResource.extend({
  create: stripeMethod18({
    method: "POST",
    fullPath: "/v1/terminal/configurations"
  }),
  retrieve: stripeMethod18({
    method: "GET",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  update: stripeMethod18({
    method: "POST",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  list: stripeMethod18({
    method: "GET",
    fullPath: "/v1/terminal/configurations",
    methodType: "list"
  }),
  del: stripeMethod18({
    method: "DELETE",
    fullPath: "/v1/terminal/configurations/{configuration}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/ConfirmationTokens.js
init_modules_watch_stub();
var stripeMethod19 = StripeResource.method;
var ConfirmationTokens = StripeResource.extend({
  create: stripeMethod19({
    method: "POST",
    fullPath: "/v1/test_helpers/confirmation_tokens"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Terminal/ConnectionTokens.js
init_modules_watch_stub();
var stripeMethod20 = StripeResource.method;
var ConnectionTokens = StripeResource.extend({
  create: stripeMethod20({
    method: "POST",
    fullPath: "/v1/terminal/connection_tokens"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Billing/CreditBalanceSummary.js
init_modules_watch_stub();
var stripeMethod21 = StripeResource.method;
var CreditBalanceSummary = StripeResource.extend({
  retrieve: stripeMethod21({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_summary"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Billing/CreditBalanceTransactions.js
init_modules_watch_stub();
var stripeMethod22 = StripeResource.method;
var CreditBalanceTransactions = StripeResource.extend({
  retrieve: stripeMethod22({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions/{id}"
  }),
  list: stripeMethod22({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Billing/CreditGrants.js
init_modules_watch_stub();
var stripeMethod23 = StripeResource.method;
var CreditGrants = StripeResource.extend({
  create: stripeMethod23({ method: "POST", fullPath: "/v1/billing/credit_grants" }),
  retrieve: stripeMethod23({
    method: "GET",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  update: stripeMethod23({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  list: stripeMethod23({
    method: "GET",
    fullPath: "/v1/billing/credit_grants",
    methodType: "list"
  }),
  expire: stripeMethod23({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/expire"
  }),
  voidGrant: stripeMethod23({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/void"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/CreditReversals.js
init_modules_watch_stub();
var stripeMethod24 = StripeResource.method;
var CreditReversals = StripeResource.extend({
  create: stripeMethod24({
    method: "POST",
    fullPath: "/v1/treasury/credit_reversals"
  }),
  retrieve: stripeMethod24({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals/{credit_reversal}"
  }),
  list: stripeMethod24({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Customers.js
init_modules_watch_stub();
var stripeMethod25 = StripeResource.method;
var Customers = StripeResource.extend({
  fundCashBalance: stripeMethod25({
    method: "POST",
    fullPath: "/v1/test_helpers/customers/{customer}/fund_cash_balance"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/DebitReversals.js
init_modules_watch_stub();
var stripeMethod26 = StripeResource.method;
var DebitReversals = StripeResource.extend({
  create: stripeMethod26({
    method: "POST",
    fullPath: "/v1/treasury/debit_reversals"
  }),
  retrieve: stripeMethod26({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals/{debit_reversal}"
  }),
  list: stripeMethod26({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/Disputes.js
init_modules_watch_stub();
var stripeMethod27 = StripeResource.method;
var Disputes = StripeResource.extend({
  create: stripeMethod27({ method: "POST", fullPath: "/v1/issuing/disputes" }),
  retrieve: stripeMethod27({
    method: "GET",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  update: stripeMethod27({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  list: stripeMethod27({
    method: "GET",
    fullPath: "/v1/issuing/disputes",
    methodType: "list"
  }),
  submit: stripeMethod27({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}/submit"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Radar/EarlyFraudWarnings.js
init_modules_watch_stub();
var stripeMethod28 = StripeResource.method;
var EarlyFraudWarnings = StripeResource.extend({
  retrieve: stripeMethod28({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings/{early_fraud_warning}"
  }),
  list: stripeMethod28({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/EventDestinations.js
init_modules_watch_stub();
var stripeMethod29 = StripeResource.method;
var EventDestinations = StripeResource.extend({
  create: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations"
  }),
  retrieve: stripeMethod29({
    method: "GET",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  update: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  list: stripeMethod29({
    method: "GET",
    fullPath: "/v2/core/event_destinations",
    methodType: "list"
  }),
  del: stripeMethod29({
    method: "DELETE",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  disable: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/disable"
  }),
  enable: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/enable"
  }),
  ping: stripeMethod29({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/ping"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Core/Events.js
init_modules_watch_stub();
var stripeMethod30 = StripeResource.method;
var Events = StripeResource.extend({
  retrieve(...args) {
    const transformResponseData = /* @__PURE__ */ __name((response) => {
      return this.addFetchRelatedObjectIfNeeded(response);
    }, "transformResponseData");
    return stripeMethod30({
      method: "GET",
      fullPath: "/v2/core/events/{id}",
      transformResponseData
    }).apply(this, args);
  },
  list(...args) {
    const transformResponseData = /* @__PURE__ */ __name((response) => {
      return Object.assign(Object.assign({}, response), { data: response.data.map(this.addFetchRelatedObjectIfNeeded.bind(this)) });
    }, "transformResponseData");
    return stripeMethod30({
      method: "GET",
      fullPath: "/v2/core/events",
      methodType: "list",
      transformResponseData
    }).apply(this, args);
  },
  /**
   * @private
   *
   * For internal use in stripe-node.
   *
   * @param pulledEvent The retrieved event object
   * @returns The retrieved event object with a fetchRelatedObject method,
   * if pulledEvent.related_object is valid (non-null and has a url)
   */
  addFetchRelatedObjectIfNeeded(pulledEvent) {
    if (!pulledEvent.related_object || !pulledEvent.related_object.url) {
      return pulledEvent;
    }
    return Object.assign(Object.assign({}, pulledEvent), { fetchRelatedObject: /* @__PURE__ */ __name(() => (
      // call stripeMethod with 'this' resource to fetch
      // the related object. 'this' is needed to construct
      // and send the request, but the method spec controls
      // the url endpoint and method, so it doesn't matter
      // that 'this' is an Events resource object here
      stripeMethod30({
        method: "GET",
        fullPath: pulledEvent.related_object.url
      }).apply(this, [
        {
          stripeContext: pulledEvent.context,
          headers: {
            "Stripe-Request-Trigger": `event=${pulledEvent.id}`
          }
        }
      ])
    ), "fetchRelatedObject") });
  }
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Entitlements/Features.js
init_modules_watch_stub();
var stripeMethod31 = StripeResource.method;
var Features = StripeResource.extend({
  create: stripeMethod31({ method: "POST", fullPath: "/v1/entitlements/features" }),
  retrieve: stripeMethod31({
    method: "GET",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  update: stripeMethod31({
    method: "POST",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  list: stripeMethod31({
    method: "GET",
    fullPath: "/v1/entitlements/features",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/FinancialAccounts.js
init_modules_watch_stub();
var stripeMethod32 = StripeResource.method;
var FinancialAccounts = StripeResource.extend({
  create: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts"
  }),
  retrieve: stripeMethod32({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  update: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  list: stripeMethod32({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts",
    methodType: "list"
  }),
  close: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/close"
  }),
  retrieveFeatures: stripeMethod32({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  }),
  updateFeatures: stripeMethod32({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Treasury/InboundTransfers.js
init_modules_watch_stub();
var stripeMethod33 = StripeResource.method;
var InboundTransfers = StripeResource.extend({
  fail: stripeMethod33({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/fail"
  }),
  returnInboundTransfer: stripeMethod33({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/return"
  }),
  succeed: stripeMethod33({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/succeed"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/InboundTransfers.js
init_modules_watch_stub();
var stripeMethod34 = StripeResource.method;
var InboundTransfers2 = StripeResource.extend({
  create: stripeMethod34({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers"
  }),
  retrieve: stripeMethod34({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers/{id}"
  }),
  list: stripeMethod34({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers",
    methodType: "list"
  }),
  cancel: stripeMethod34({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers/{inbound_transfer}/cancel"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Terminal/Locations.js
init_modules_watch_stub();
var stripeMethod35 = StripeResource.method;
var Locations = StripeResource.extend({
  create: stripeMethod35({ method: "POST", fullPath: "/v1/terminal/locations" }),
  retrieve: stripeMethod35({
    method: "GET",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  update: stripeMethod35({
    method: "POST",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  list: stripeMethod35({
    method: "GET",
    fullPath: "/v1/terminal/locations",
    methodType: "list"
  }),
  del: stripeMethod35({
    method: "DELETE",
    fullPath: "/v1/terminal/locations/{location}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Billing/MeterEventAdjustments.js
init_modules_watch_stub();
var stripeMethod36 = StripeResource.method;
var MeterEventAdjustments = StripeResource.extend({
  create: stripeMethod36({
    method: "POST",
    fullPath: "/v1/billing/meter_event_adjustments"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Billing/MeterEventAdjustments.js
init_modules_watch_stub();
var stripeMethod37 = StripeResource.method;
var MeterEventAdjustments2 = StripeResource.extend({
  create: stripeMethod37({
    method: "POST",
    fullPath: "/v2/billing/meter_event_adjustments"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Billing/MeterEventSession.js
init_modules_watch_stub();
var stripeMethod38 = StripeResource.method;
var MeterEventSession = StripeResource.extend({
  create: stripeMethod38({
    method: "POST",
    fullPath: "/v2/billing/meter_event_session"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Billing/MeterEventStream.js
init_modules_watch_stub();
var stripeMethod39 = StripeResource.method;
var MeterEventStream = StripeResource.extend({
  create: stripeMethod39({
    method: "POST",
    fullPath: "/v2/billing/meter_event_stream",
    host: "meter-events.stripe.com"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Billing/MeterEvents.js
init_modules_watch_stub();
var stripeMethod40 = StripeResource.method;
var MeterEvents = StripeResource.extend({
  create: stripeMethod40({ method: "POST", fullPath: "/v1/billing/meter_events" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/V2/Billing/MeterEvents.js
init_modules_watch_stub();
var stripeMethod41 = StripeResource.method;
var MeterEvents2 = StripeResource.extend({
  create: stripeMethod41({ method: "POST", fullPath: "/v2/billing/meter_events" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Billing/Meters.js
init_modules_watch_stub();
var stripeMethod42 = StripeResource.method;
var Meters = StripeResource.extend({
  create: stripeMethod42({ method: "POST", fullPath: "/v1/billing/meters" }),
  retrieve: stripeMethod42({ method: "GET", fullPath: "/v1/billing/meters/{id}" }),
  update: stripeMethod42({ method: "POST", fullPath: "/v1/billing/meters/{id}" }),
  list: stripeMethod42({
    method: "GET",
    fullPath: "/v1/billing/meters",
    methodType: "list"
  }),
  deactivate: stripeMethod42({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/deactivate"
  }),
  listEventSummaries: stripeMethod42({
    method: "GET",
    fullPath: "/v1/billing/meters/{id}/event_summaries",
    methodType: "list"
  }),
  reactivate: stripeMethod42({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/reactivate"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Terminal/OnboardingLinks.js
init_modules_watch_stub();
var stripeMethod43 = StripeResource.method;
var OnboardingLinks = StripeResource.extend({
  create: stripeMethod43({
    method: "POST",
    fullPath: "/v1/terminal/onboarding_links"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Climate/Orders.js
init_modules_watch_stub();
var stripeMethod44 = StripeResource.method;
var Orders = StripeResource.extend({
  create: stripeMethod44({ method: "POST", fullPath: "/v1/climate/orders" }),
  retrieve: stripeMethod44({
    method: "GET",
    fullPath: "/v1/climate/orders/{order}"
  }),
  update: stripeMethod44({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}"
  }),
  list: stripeMethod44({
    method: "GET",
    fullPath: "/v1/climate/orders",
    methodType: "list"
  }),
  cancel: stripeMethod44({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}/cancel"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundPayments.js
init_modules_watch_stub();
var stripeMethod45 = StripeResource.method;
var OutboundPayments = StripeResource.extend({
  update: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}"
  }),
  fail: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/fail"
  }),
  post: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/post"
  }),
  returnOutboundPayment: stripeMethod45({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/return"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/OutboundPayments.js
init_modules_watch_stub();
var stripeMethod46 = StripeResource.method;
var OutboundPayments2 = StripeResource.extend({
  create: stripeMethod46({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments"
  }),
  retrieve: stripeMethod46({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments/{id}"
  }),
  list: stripeMethod46({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments",
    methodType: "list"
  }),
  cancel: stripeMethod46({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments/{id}/cancel"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundTransfers.js
init_modules_watch_stub();
var stripeMethod47 = StripeResource.method;
var OutboundTransfers = StripeResource.extend({
  update: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}"
  }),
  fail: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/fail"
  }),
  post: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/post"
  }),
  returnOutboundTransfer: stripeMethod47({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/return"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/OutboundTransfers.js
init_modules_watch_stub();
var stripeMethod48 = StripeResource.method;
var OutboundTransfers2 = StripeResource.extend({
  create: stripeMethod48({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers"
  }),
  retrieve: stripeMethod48({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}"
  }),
  list: stripeMethod48({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers",
    methodType: "list"
  }),
  cancel: stripeMethod48({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}/cancel"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Radar/PaymentEvaluations.js
init_modules_watch_stub();
var stripeMethod49 = StripeResource.method;
var PaymentEvaluations = StripeResource.extend({
  create: stripeMethod49({
    method: "POST",
    fullPath: "/v1/radar/payment_evaluations"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/PersonalizationDesigns.js
init_modules_watch_stub();
var stripeMethod50 = StripeResource.method;
var PersonalizationDesigns = StripeResource.extend({
  create: stripeMethod50({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs"
  }),
  retrieve: stripeMethod50({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  update: stripeMethod50({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  list: stripeMethod50({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Issuing/PersonalizationDesigns.js
init_modules_watch_stub();
var stripeMethod51 = StripeResource.method;
var PersonalizationDesigns2 = StripeResource.extend({
  activate: stripeMethod51({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/activate"
  }),
  deactivate: stripeMethod51({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/deactivate"
  }),
  reject: stripeMethod51({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/reject"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/PhysicalBundles.js
init_modules_watch_stub();
var stripeMethod52 = StripeResource.method;
var PhysicalBundles = StripeResource.extend({
  retrieve: stripeMethod52({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles/{physical_bundle}"
  }),
  list: stripeMethod52({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Climate/Products.js
init_modules_watch_stub();
var stripeMethod53 = StripeResource.method;
var Products = StripeResource.extend({
  retrieve: stripeMethod53({
    method: "GET",
    fullPath: "/v1/climate/products/{product}"
  }),
  list: stripeMethod53({
    method: "GET",
    fullPath: "/v1/climate/products",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Terminal/Readers.js
init_modules_watch_stub();
var stripeMethod54 = StripeResource.method;
var Readers = StripeResource.extend({
  create: stripeMethod54({ method: "POST", fullPath: "/v1/terminal/readers" }),
  retrieve: stripeMethod54({
    method: "GET",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  update: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  list: stripeMethod54({
    method: "GET",
    fullPath: "/v1/terminal/readers",
    methodType: "list"
  }),
  del: stripeMethod54({
    method: "DELETE",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  cancelAction: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/cancel_action"
  }),
  collectInputs: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/collect_inputs"
  }),
  collectPaymentMethod: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/collect_payment_method"
  }),
  confirmPaymentIntent: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/confirm_payment_intent"
  }),
  processPaymentIntent: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_payment_intent"
  }),
  processSetupIntent: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_setup_intent"
  }),
  refundPayment: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/refund_payment"
  }),
  setReaderDisplay: stripeMethod54({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/set_reader_display"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Terminal/Readers.js
init_modules_watch_stub();
var stripeMethod55 = StripeResource.method;
var Readers2 = StripeResource.extend({
  presentPaymentMethod: stripeMethod55({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/present_payment_method"
  }),
  succeedInputCollection: stripeMethod55({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/succeed_input_collection"
  }),
  timeoutInputCollection: stripeMethod55({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/timeout_input_collection"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedCredits.js
init_modules_watch_stub();
var stripeMethod56 = StripeResource.method;
var ReceivedCredits = StripeResource.extend({
  create: stripeMethod56({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_credits"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/ReceivedCredits.js
init_modules_watch_stub();
var stripeMethod57 = StripeResource.method;
var ReceivedCredits2 = StripeResource.extend({
  retrieve: stripeMethod57({
    method: "GET",
    fullPath: "/v1/treasury/received_credits/{id}"
  }),
  list: stripeMethod57({
    method: "GET",
    fullPath: "/v1/treasury/received_credits",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedDebits.js
init_modules_watch_stub();
var stripeMethod58 = StripeResource.method;
var ReceivedDebits = StripeResource.extend({
  create: stripeMethod58({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_debits"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/ReceivedDebits.js
init_modules_watch_stub();
var stripeMethod59 = StripeResource.method;
var ReceivedDebits2 = StripeResource.extend({
  retrieve: stripeMethod59({
    method: "GET",
    fullPath: "/v1/treasury/received_debits/{id}"
  }),
  list: stripeMethod59({
    method: "GET",
    fullPath: "/v1/treasury/received_debits",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Refunds.js
init_modules_watch_stub();
var stripeMethod60 = StripeResource.method;
var Refunds = StripeResource.extend({
  expire: stripeMethod60({
    method: "POST",
    fullPath: "/v1/test_helpers/refunds/{refund}/expire"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Tax/Registrations.js
init_modules_watch_stub();
var stripeMethod61 = StripeResource.method;
var Registrations = StripeResource.extend({
  create: stripeMethod61({ method: "POST", fullPath: "/v1/tax/registrations" }),
  retrieve: stripeMethod61({
    method: "GET",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  update: stripeMethod61({
    method: "POST",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  list: stripeMethod61({
    method: "GET",
    fullPath: "/v1/tax/registrations",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Reporting/ReportRuns.js
init_modules_watch_stub();
var stripeMethod62 = StripeResource.method;
var ReportRuns = StripeResource.extend({
  create: stripeMethod62({ method: "POST", fullPath: "/v1/reporting/report_runs" }),
  retrieve: stripeMethod62({
    method: "GET",
    fullPath: "/v1/reporting/report_runs/{report_run}"
  }),
  list: stripeMethod62({
    method: "GET",
    fullPath: "/v1/reporting/report_runs",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Reporting/ReportTypes.js
init_modules_watch_stub();
var stripeMethod63 = StripeResource.method;
var ReportTypes = StripeResource.extend({
  retrieve: stripeMethod63({
    method: "GET",
    fullPath: "/v1/reporting/report_types/{report_type}"
  }),
  list: stripeMethod63({
    method: "GET",
    fullPath: "/v1/reporting/report_types",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Forwarding/Requests.js
init_modules_watch_stub();
var stripeMethod64 = StripeResource.method;
var Requests = StripeResource.extend({
  create: stripeMethod64({ method: "POST", fullPath: "/v1/forwarding/requests" }),
  retrieve: stripeMethod64({
    method: "GET",
    fullPath: "/v1/forwarding/requests/{id}"
  }),
  list: stripeMethod64({
    method: "GET",
    fullPath: "/v1/forwarding/requests",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Sigma/ScheduledQueryRuns.js
init_modules_watch_stub();
var stripeMethod65 = StripeResource.method;
var ScheduledQueryRuns = StripeResource.extend({
  retrieve: stripeMethod65({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs/{scheduled_query_run}"
  }),
  list: stripeMethod65({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Apps/Secrets.js
init_modules_watch_stub();
var stripeMethod66 = StripeResource.method;
var Secrets = StripeResource.extend({
  create: stripeMethod66({ method: "POST", fullPath: "/v1/apps/secrets" }),
  list: stripeMethod66({
    method: "GET",
    fullPath: "/v1/apps/secrets",
    methodType: "list"
  }),
  deleteWhere: stripeMethod66({
    method: "POST",
    fullPath: "/v1/apps/secrets/delete"
  }),
  find: stripeMethod66({ method: "GET", fullPath: "/v1/apps/secrets/find" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/BillingPortal/Sessions.js
init_modules_watch_stub();
var stripeMethod67 = StripeResource.method;
var Sessions = StripeResource.extend({
  create: stripeMethod67({
    method: "POST",
    fullPath: "/v1/billing_portal/sessions"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Checkout/Sessions.js
init_modules_watch_stub();
var stripeMethod68 = StripeResource.method;
var Sessions2 = StripeResource.extend({
  create: stripeMethod68({ method: "POST", fullPath: "/v1/checkout/sessions" }),
  retrieve: stripeMethod68({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  update: stripeMethod68({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  list: stripeMethod68({
    method: "GET",
    fullPath: "/v1/checkout/sessions",
    methodType: "list"
  }),
  expire: stripeMethod68({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}/expire"
  }),
  listLineItems: stripeMethod68({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/FinancialConnections/Sessions.js
init_modules_watch_stub();
var stripeMethod69 = StripeResource.method;
var Sessions3 = StripeResource.extend({
  create: stripeMethod69({
    method: "POST",
    fullPath: "/v1/financial_connections/sessions"
  }),
  retrieve: stripeMethod69({
    method: "GET",
    fullPath: "/v1/financial_connections/sessions/{session}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Tax/Settings.js
init_modules_watch_stub();
var stripeMethod70 = StripeResource.method;
var Settings = StripeResource.extend({
  retrieve: stripeMethod70({ method: "GET", fullPath: "/v1/tax/settings" }),
  update: stripeMethod70({ method: "POST", fullPath: "/v1/tax/settings" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Climate/Suppliers.js
init_modules_watch_stub();
var stripeMethod71 = StripeResource.method;
var Suppliers = StripeResource.extend({
  retrieve: stripeMethod71({
    method: "GET",
    fullPath: "/v1/climate/suppliers/{supplier}"
  }),
  list: stripeMethod71({
    method: "GET",
    fullPath: "/v1/climate/suppliers",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/TestClocks.js
init_modules_watch_stub();
var stripeMethod72 = StripeResource.method;
var TestClocks = StripeResource.extend({
  create: stripeMethod72({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks"
  }),
  retrieve: stripeMethod72({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  list: stripeMethod72({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks",
    methodType: "list"
  }),
  del: stripeMethod72({
    method: "DELETE",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  advance: stripeMethod72({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}/advance"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/Tokens.js
init_modules_watch_stub();
var stripeMethod73 = StripeResource.method;
var Tokens = StripeResource.extend({
  retrieve: stripeMethod73({
    method: "GET",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  update: stripeMethod73({
    method: "POST",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  list: stripeMethod73({
    method: "GET",
    fullPath: "/v1/issuing/tokens",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/TransactionEntries.js
init_modules_watch_stub();
var stripeMethod74 = StripeResource.method;
var TransactionEntries = StripeResource.extend({
  retrieve: stripeMethod74({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries/{id}"
  }),
  list: stripeMethod74({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/FinancialConnections/Transactions.js
init_modules_watch_stub();
var stripeMethod75 = StripeResource.method;
var Transactions = StripeResource.extend({
  retrieve: stripeMethod75({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions/{transaction}"
  }),
  list: stripeMethod75({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Issuing/Transactions.js
init_modules_watch_stub();
var stripeMethod76 = StripeResource.method;
var Transactions2 = StripeResource.extend({
  retrieve: stripeMethod76({
    method: "GET",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  update: stripeMethod76({
    method: "POST",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  list: stripeMethod76({
    method: "GET",
    fullPath: "/v1/issuing/transactions",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Tax/Transactions.js
init_modules_watch_stub();
var stripeMethod77 = StripeResource.method;
var Transactions3 = StripeResource.extend({
  retrieve: stripeMethod77({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}"
  }),
  createFromCalculation: stripeMethod77({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_from_calculation"
  }),
  createReversal: stripeMethod77({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_reversal"
  }),
  listLineItems: stripeMethod77({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TestHelpers/Issuing/Transactions.js
init_modules_watch_stub();
var stripeMethod78 = StripeResource.method;
var Transactions4 = StripeResource.extend({
  createForceCapture: stripeMethod78({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_force_capture"
  }),
  createUnlinkedRefund: stripeMethod78({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_unlinked_refund"
  }),
  refund: stripeMethod78({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/{transaction}/refund"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Treasury/Transactions.js
init_modules_watch_stub();
var stripeMethod79 = StripeResource.method;
var Transactions5 = StripeResource.extend({
  retrieve: stripeMethod79({
    method: "GET",
    fullPath: "/v1/treasury/transactions/{id}"
  }),
  list: stripeMethod79({
    method: "GET",
    fullPath: "/v1/treasury/transactions",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Radar/ValueListItems.js
init_modules_watch_stub();
var stripeMethod80 = StripeResource.method;
var ValueListItems = StripeResource.extend({
  create: stripeMethod80({
    method: "POST",
    fullPath: "/v1/radar/value_list_items"
  }),
  retrieve: stripeMethod80({
    method: "GET",
    fullPath: "/v1/radar/value_list_items/{item}"
  }),
  list: stripeMethod80({
    method: "GET",
    fullPath: "/v1/radar/value_list_items",
    methodType: "list"
  }),
  del: stripeMethod80({
    method: "DELETE",
    fullPath: "/v1/radar/value_list_items/{item}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Radar/ValueLists.js
init_modules_watch_stub();
var stripeMethod81 = StripeResource.method;
var ValueLists = StripeResource.extend({
  create: stripeMethod81({ method: "POST", fullPath: "/v1/radar/value_lists" }),
  retrieve: stripeMethod81({
    method: "GET",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  update: stripeMethod81({
    method: "POST",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  list: stripeMethod81({
    method: "GET",
    fullPath: "/v1/radar/value_lists",
    methodType: "list"
  }),
  del: stripeMethod81({
    method: "DELETE",
    fullPath: "/v1/radar/value_lists/{value_list}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Identity/VerificationReports.js
init_modules_watch_stub();
var stripeMethod82 = StripeResource.method;
var VerificationReports = StripeResource.extend({
  retrieve: stripeMethod82({
    method: "GET",
    fullPath: "/v1/identity/verification_reports/{report}"
  }),
  list: stripeMethod82({
    method: "GET",
    fullPath: "/v1/identity/verification_reports",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Identity/VerificationSessions.js
init_modules_watch_stub();
var stripeMethod83 = StripeResource.method;
var VerificationSessions = StripeResource.extend({
  create: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions"
  }),
  retrieve: stripeMethod83({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  update: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  list: stripeMethod83({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions",
    methodType: "list"
  }),
  cancel: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/cancel"
  }),
  redact: stripeMethod83({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/redact"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Accounts.js
init_modules_watch_stub();
var stripeMethod84 = StripeResource.method;
var Accounts3 = StripeResource.extend({
  create: stripeMethod84({ method: "POST", fullPath: "/v1/accounts" }),
  retrieve(id2, ...args) {
    if (typeof id2 === "string") {
      return stripeMethod84({
        method: "GET",
        fullPath: "/v1/accounts/{id}"
      }).apply(this, [id2, ...args]);
    } else {
      if (id2 === null || id2 === void 0) {
        [].shift.apply([id2, ...args]);
      }
      return stripeMethod84({
        method: "GET",
        fullPath: "/v1/account"
      }).apply(this, [id2, ...args]);
    }
  },
  update: stripeMethod84({ method: "POST", fullPath: "/v1/accounts/{account}" }),
  list: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts",
    methodType: "list"
  }),
  del: stripeMethod84({ method: "DELETE", fullPath: "/v1/accounts/{account}" }),
  createExternalAccount: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts"
  }),
  createLoginLink: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/login_links"
  }),
  createPerson: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons"
  }),
  deleteExternalAccount: stripeMethod84({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  deletePerson: stripeMethod84({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  listCapabilities: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities",
    methodType: "list"
  }),
  listExternalAccounts: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts",
    methodType: "list"
  }),
  listPersons: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons",
    methodType: "list"
  }),
  reject: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/reject"
  }),
  retrieveCurrent: stripeMethod84({ method: "GET", fullPath: "/v1/account" }),
  retrieveCapability: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  retrieveExternalAccount: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  retrievePerson: stripeMethod84({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  updateCapability: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  updateExternalAccount: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  updatePerson: stripeMethod84({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/AccountLinks.js
init_modules_watch_stub();
var stripeMethod85 = StripeResource.method;
var AccountLinks2 = StripeResource.extend({
  create: stripeMethod85({ method: "POST", fullPath: "/v1/account_links" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/AccountSessions.js
init_modules_watch_stub();
var stripeMethod86 = StripeResource.method;
var AccountSessions = StripeResource.extend({
  create: stripeMethod86({ method: "POST", fullPath: "/v1/account_sessions" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/ApplePayDomains.js
init_modules_watch_stub();
var stripeMethod87 = StripeResource.method;
var ApplePayDomains = StripeResource.extend({
  create: stripeMethod87({ method: "POST", fullPath: "/v1/apple_pay/domains" }),
  retrieve: stripeMethod87({
    method: "GET",
    fullPath: "/v1/apple_pay/domains/{domain}"
  }),
  list: stripeMethod87({
    method: "GET",
    fullPath: "/v1/apple_pay/domains",
    methodType: "list"
  }),
  del: stripeMethod87({
    method: "DELETE",
    fullPath: "/v1/apple_pay/domains/{domain}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/ApplicationFees.js
init_modules_watch_stub();
var stripeMethod88 = StripeResource.method;
var ApplicationFees = StripeResource.extend({
  retrieve: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees/{id}"
  }),
  list: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees",
    methodType: "list"
  }),
  createRefund: stripeMethod88({
    method: "POST",
    fullPath: "/v1/application_fees/{id}/refunds"
  }),
  listRefunds: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees/{id}/refunds",
    methodType: "list"
  }),
  retrieveRefund: stripeMethod88({
    method: "GET",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  }),
  updateRefund: stripeMethod88({
    method: "POST",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Balance.js
init_modules_watch_stub();
var stripeMethod89 = StripeResource.method;
var Balance = StripeResource.extend({
  retrieve: stripeMethod89({ method: "GET", fullPath: "/v1/balance" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/BalanceSettings.js
init_modules_watch_stub();
var stripeMethod90 = StripeResource.method;
var BalanceSettings = StripeResource.extend({
  retrieve: stripeMethod90({ method: "GET", fullPath: "/v1/balance_settings" }),
  update: stripeMethod90({ method: "POST", fullPath: "/v1/balance_settings" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/BalanceTransactions.js
init_modules_watch_stub();
var stripeMethod91 = StripeResource.method;
var BalanceTransactions = StripeResource.extend({
  retrieve: stripeMethod91({
    method: "GET",
    fullPath: "/v1/balance_transactions/{id}"
  }),
  list: stripeMethod91({
    method: "GET",
    fullPath: "/v1/balance_transactions",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Charges.js
init_modules_watch_stub();
var stripeMethod92 = StripeResource.method;
var Charges = StripeResource.extend({
  create: stripeMethod92({ method: "POST", fullPath: "/v1/charges" }),
  retrieve: stripeMethod92({ method: "GET", fullPath: "/v1/charges/{charge}" }),
  update: stripeMethod92({ method: "POST", fullPath: "/v1/charges/{charge}" }),
  list: stripeMethod92({
    method: "GET",
    fullPath: "/v1/charges",
    methodType: "list"
  }),
  capture: stripeMethod92({
    method: "POST",
    fullPath: "/v1/charges/{charge}/capture"
  }),
  search: stripeMethod92({
    method: "GET",
    fullPath: "/v1/charges/search",
    methodType: "search"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/ConfirmationTokens.js
init_modules_watch_stub();
var stripeMethod93 = StripeResource.method;
var ConfirmationTokens2 = StripeResource.extend({
  retrieve: stripeMethod93({
    method: "GET",
    fullPath: "/v1/confirmation_tokens/{confirmation_token}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/CountrySpecs.js
init_modules_watch_stub();
var stripeMethod94 = StripeResource.method;
var CountrySpecs = StripeResource.extend({
  retrieve: stripeMethod94({
    method: "GET",
    fullPath: "/v1/country_specs/{country}"
  }),
  list: stripeMethod94({
    method: "GET",
    fullPath: "/v1/country_specs",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Coupons.js
init_modules_watch_stub();
var stripeMethod95 = StripeResource.method;
var Coupons = StripeResource.extend({
  create: stripeMethod95({ method: "POST", fullPath: "/v1/coupons" }),
  retrieve: stripeMethod95({ method: "GET", fullPath: "/v1/coupons/{coupon}" }),
  update: stripeMethod95({ method: "POST", fullPath: "/v1/coupons/{coupon}" }),
  list: stripeMethod95({
    method: "GET",
    fullPath: "/v1/coupons",
    methodType: "list"
  }),
  del: stripeMethod95({ method: "DELETE", fullPath: "/v1/coupons/{coupon}" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/CreditNotes.js
init_modules_watch_stub();
var stripeMethod96 = StripeResource.method;
var CreditNotes = StripeResource.extend({
  create: stripeMethod96({ method: "POST", fullPath: "/v1/credit_notes" }),
  retrieve: stripeMethod96({ method: "GET", fullPath: "/v1/credit_notes/{id}" }),
  update: stripeMethod96({ method: "POST", fullPath: "/v1/credit_notes/{id}" }),
  list: stripeMethod96({
    method: "GET",
    fullPath: "/v1/credit_notes",
    methodType: "list"
  }),
  listLineItems: stripeMethod96({
    method: "GET",
    fullPath: "/v1/credit_notes/{credit_note}/lines",
    methodType: "list"
  }),
  listPreviewLineItems: stripeMethod96({
    method: "GET",
    fullPath: "/v1/credit_notes/preview/lines",
    methodType: "list"
  }),
  preview: stripeMethod96({ method: "GET", fullPath: "/v1/credit_notes/preview" }),
  voidCreditNote: stripeMethod96({
    method: "POST",
    fullPath: "/v1/credit_notes/{id}/void"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/CustomerSessions.js
init_modules_watch_stub();
var stripeMethod97 = StripeResource.method;
var CustomerSessions = StripeResource.extend({
  create: stripeMethod97({ method: "POST", fullPath: "/v1/customer_sessions" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Customers.js
init_modules_watch_stub();
var stripeMethod98 = StripeResource.method;
var Customers2 = StripeResource.extend({
  create: stripeMethod98({ method: "POST", fullPath: "/v1/customers" }),
  retrieve: stripeMethod98({ method: "GET", fullPath: "/v1/customers/{customer}" }),
  update: stripeMethod98({ method: "POST", fullPath: "/v1/customers/{customer}" }),
  list: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers",
    methodType: "list"
  }),
  del: stripeMethod98({ method: "DELETE", fullPath: "/v1/customers/{customer}" }),
  createBalanceTransaction: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions"
  }),
  createFundingInstructions: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/funding_instructions"
  }),
  createSource: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources"
  }),
  createTaxId: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/tax_ids"
  }),
  deleteDiscount: stripeMethod98({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/discount"
  }),
  deleteSource: stripeMethod98({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  deleteTaxId: stripeMethod98({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  listBalanceTransactions: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions",
    methodType: "list"
  }),
  listCashBalanceTransactions: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions",
    methodType: "list"
  }),
  listPaymentMethods: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods",
    methodType: "list"
  }),
  listSources: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources",
    methodType: "list"
  }),
  listTaxIds: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids",
    methodType: "list"
  }),
  retrieveBalanceTransaction: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  retrieveCashBalance: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  retrieveCashBalanceTransaction: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions/{transaction}"
  }),
  retrievePaymentMethod: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods/{payment_method}"
  }),
  retrieveSource: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  retrieveTaxId: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  search: stripeMethod98({
    method: "GET",
    fullPath: "/v1/customers/search",
    methodType: "search"
  }),
  updateBalanceTransaction: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  updateCashBalance: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  updateSource: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  verifySource: stripeMethod98({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}/verify"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Disputes.js
init_modules_watch_stub();
var stripeMethod99 = StripeResource.method;
var Disputes2 = StripeResource.extend({
  retrieve: stripeMethod99({ method: "GET", fullPath: "/v1/disputes/{dispute}" }),
  update: stripeMethod99({ method: "POST", fullPath: "/v1/disputes/{dispute}" }),
  list: stripeMethod99({
    method: "GET",
    fullPath: "/v1/disputes",
    methodType: "list"
  }),
  close: stripeMethod99({
    method: "POST",
    fullPath: "/v1/disputes/{dispute}/close"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/EphemeralKeys.js
init_modules_watch_stub();
var stripeMethod100 = StripeResource.method;
var EphemeralKeys = StripeResource.extend({
  create: stripeMethod100({
    method: "POST",
    fullPath: "/v1/ephemeral_keys",
    validator: /* @__PURE__ */ __name((data, options) => {
      if (!options.headers || !options.headers["Stripe-Version"]) {
        throw new Error("Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node");
      }
    }, "validator")
  }),
  del: stripeMethod100({ method: "DELETE", fullPath: "/v1/ephemeral_keys/{key}" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Events.js
init_modules_watch_stub();
var stripeMethod101 = StripeResource.method;
var Events2 = StripeResource.extend({
  retrieve: stripeMethod101({ method: "GET", fullPath: "/v1/events/{id}" }),
  list: stripeMethod101({
    method: "GET",
    fullPath: "/v1/events",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/ExchangeRates.js
init_modules_watch_stub();
var stripeMethod102 = StripeResource.method;
var ExchangeRates = StripeResource.extend({
  retrieve: stripeMethod102({
    method: "GET",
    fullPath: "/v1/exchange_rates/{rate_id}"
  }),
  list: stripeMethod102({
    method: "GET",
    fullPath: "/v1/exchange_rates",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/FileLinks.js
init_modules_watch_stub();
var stripeMethod103 = StripeResource.method;
var FileLinks = StripeResource.extend({
  create: stripeMethod103({ method: "POST", fullPath: "/v1/file_links" }),
  retrieve: stripeMethod103({ method: "GET", fullPath: "/v1/file_links/{link}" }),
  update: stripeMethod103({ method: "POST", fullPath: "/v1/file_links/{link}" }),
  list: stripeMethod103({
    method: "GET",
    fullPath: "/v1/file_links",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Files.js
init_modules_watch_stub();

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/multipart.js
init_modules_watch_stub();
var multipartDataGenerator = /* @__PURE__ */ __name((method, data, headers) => {
  const segno = (Math.round(Math.random() * 1e16) + Math.round(Math.random() * 1e16)).toString();
  headers["Content-Type"] = `multipart/form-data; boundary=${segno}`;
  const textEncoder = new TextEncoder();
  let buffer = new Uint8Array(0);
  const endBuffer = textEncoder.encode("\r\n");
  function push(l) {
    const prevBuffer = buffer;
    const newBuffer = l instanceof Uint8Array ? l : new Uint8Array(textEncoder.encode(l));
    buffer = new Uint8Array(prevBuffer.length + newBuffer.length + 2);
    buffer.set(prevBuffer);
    buffer.set(newBuffer, prevBuffer.length);
    buffer.set(endBuffer, buffer.length - 2);
  }
  __name(push, "push");
  function q(s) {
    return `"${s.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
  }
  __name(q, "q");
  const flattenedData = flattenAndStringify(data);
  for (const k in flattenedData) {
    if (!Object.prototype.hasOwnProperty.call(flattenedData, k)) {
      continue;
    }
    const v = flattenedData[k];
    push(`--${segno}`);
    if (Object.prototype.hasOwnProperty.call(v, "data")) {
      const typedEntry = v;
      push(`Content-Disposition: form-data; name=${q(k)}; filename=${q(typedEntry.name || "blob")}`);
      push(`Content-Type: ${typedEntry.type || "application/octet-stream"}`);
      push("");
      push(typedEntry.data);
    } else {
      push(`Content-Disposition: form-data; name=${q(k)}`);
      push("");
      push(v);
    }
  }
  push(`--${segno}--`);
  return buffer;
}, "multipartDataGenerator");
function multipartRequestDataProcessor(method, data, headers, callback) {
  data = data || {};
  if (method !== "POST") {
    return callback(null, queryStringifyRequestData(data));
  }
  this._stripe._platformFunctions.tryBufferData(data).then((bufferedData) => {
    const buffer = multipartDataGenerator(method, bufferedData, headers);
    return callback(null, buffer);
  }).catch((err) => callback(err, null));
}
__name(multipartRequestDataProcessor, "multipartRequestDataProcessor");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Files.js
var stripeMethod104 = StripeResource.method;
var Files = StripeResource.extend({
  create: stripeMethod104({
    method: "POST",
    fullPath: "/v1/files",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    host: "files.stripe.com"
  }),
  retrieve: stripeMethod104({ method: "GET", fullPath: "/v1/files/{file}" }),
  list: stripeMethod104({
    method: "GET",
    fullPath: "/v1/files",
    methodType: "list"
  }),
  requestDataProcessor: multipartRequestDataProcessor
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/InvoiceItems.js
init_modules_watch_stub();
var stripeMethod105 = StripeResource.method;
var InvoiceItems = StripeResource.extend({
  create: stripeMethod105({ method: "POST", fullPath: "/v1/invoiceitems" }),
  retrieve: stripeMethod105({
    method: "GET",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  update: stripeMethod105({
    method: "POST",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  list: stripeMethod105({
    method: "GET",
    fullPath: "/v1/invoiceitems",
    methodType: "list"
  }),
  del: stripeMethod105({
    method: "DELETE",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/InvoicePayments.js
init_modules_watch_stub();
var stripeMethod106 = StripeResource.method;
var InvoicePayments = StripeResource.extend({
  retrieve: stripeMethod106({
    method: "GET",
    fullPath: "/v1/invoice_payments/{invoice_payment}"
  }),
  list: stripeMethod106({
    method: "GET",
    fullPath: "/v1/invoice_payments",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/InvoiceRenderingTemplates.js
init_modules_watch_stub();
var stripeMethod107 = StripeResource.method;
var InvoiceRenderingTemplates = StripeResource.extend({
  retrieve: stripeMethod107({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates/{template}"
  }),
  list: stripeMethod107({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates",
    methodType: "list"
  }),
  archive: stripeMethod107({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/archive"
  }),
  unarchive: stripeMethod107({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/unarchive"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Invoices.js
init_modules_watch_stub();
var stripeMethod108 = StripeResource.method;
var Invoices = StripeResource.extend({
  create: stripeMethod108({ method: "POST", fullPath: "/v1/invoices" }),
  retrieve: stripeMethod108({ method: "GET", fullPath: "/v1/invoices/{invoice}" }),
  update: stripeMethod108({ method: "POST", fullPath: "/v1/invoices/{invoice}" }),
  list: stripeMethod108({
    method: "GET",
    fullPath: "/v1/invoices",
    methodType: "list"
  }),
  del: stripeMethod108({ method: "DELETE", fullPath: "/v1/invoices/{invoice}" }),
  addLines: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/add_lines"
  }),
  attachPayment: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/attach_payment"
  }),
  createPreview: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/create_preview"
  }),
  finalizeInvoice: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/finalize"
  }),
  listLineItems: stripeMethod108({
    method: "GET",
    fullPath: "/v1/invoices/{invoice}/lines",
    methodType: "list"
  }),
  markUncollectible: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/mark_uncollectible"
  }),
  pay: stripeMethod108({ method: "POST", fullPath: "/v1/invoices/{invoice}/pay" }),
  removeLines: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/remove_lines"
  }),
  search: stripeMethod108({
    method: "GET",
    fullPath: "/v1/invoices/search",
    methodType: "search"
  }),
  sendInvoice: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/send"
  }),
  updateLines: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/update_lines"
  }),
  updateLineItem: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/lines/{line_item_id}"
  }),
  voidInvoice: stripeMethod108({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/void"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Mandates.js
init_modules_watch_stub();
var stripeMethod109 = StripeResource.method;
var Mandates = StripeResource.extend({
  retrieve: stripeMethod109({ method: "GET", fullPath: "/v1/mandates/{mandate}" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/OAuth.js
init_modules_watch_stub();
var stripeMethod110 = StripeResource.method;
var oAuthHost = "connect.stripe.com";
var OAuth = StripeResource.extend({
  basePath: "/",
  authorizeUrl(params, options) {
    params = params || {};
    options = options || {};
    let path = "oauth/authorize";
    if (options.express) {
      path = `express/${path}`;
    }
    if (!params.response_type) {
      params.response_type = "code";
    }
    if (!params.client_id) {
      params.client_id = this._stripe.getClientId();
    }
    if (!params.scope) {
      params.scope = "read_write";
    }
    return `https://${oAuthHost}/${path}?${queryStringifyRequestData(params)}`;
  },
  token: stripeMethod110({
    method: "POST",
    path: "oauth/token",
    host: oAuthHost
  }),
  deauthorize(spec, ...args) {
    if (!spec.client_id) {
      spec.client_id = this._stripe.getClientId();
    }
    return stripeMethod110({
      method: "POST",
      path: "oauth/deauthorize",
      host: oAuthHost
    }).apply(this, [spec, ...args]);
  }
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PaymentAttemptRecords.js
init_modules_watch_stub();
var stripeMethod111 = StripeResource.method;
var PaymentAttemptRecords = StripeResource.extend({
  retrieve: stripeMethod111({
    method: "GET",
    fullPath: "/v1/payment_attempt_records/{id}"
  }),
  list: stripeMethod111({
    method: "GET",
    fullPath: "/v1/payment_attempt_records",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PaymentIntents.js
init_modules_watch_stub();
var stripeMethod112 = StripeResource.method;
var PaymentIntents = StripeResource.extend({
  create: stripeMethod112({ method: "POST", fullPath: "/v1/payment_intents" }),
  retrieve: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  update: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  list: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents",
    methodType: "list"
  }),
  applyCustomerBalance: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/apply_customer_balance"
  }),
  cancel: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/cancel"
  }),
  capture: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/capture"
  }),
  confirm: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/confirm"
  }),
  incrementAuthorization: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/increment_authorization"
  }),
  listAmountDetailsLineItems: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents/{intent}/amount_details_line_items",
    methodType: "list"
  }),
  search: stripeMethod112({
    method: "GET",
    fullPath: "/v1/payment_intents/search",
    methodType: "search"
  }),
  verifyMicrodeposits: stripeMethod112({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/verify_microdeposits"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PaymentLinks.js
init_modules_watch_stub();
var stripeMethod113 = StripeResource.method;
var PaymentLinks = StripeResource.extend({
  create: stripeMethod113({ method: "POST", fullPath: "/v1/payment_links" }),
  retrieve: stripeMethod113({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  update: stripeMethod113({
    method: "POST",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  list: stripeMethod113({
    method: "GET",
    fullPath: "/v1/payment_links",
    methodType: "list"
  }),
  listLineItems: stripeMethod113({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PaymentMethodConfigurations.js
init_modules_watch_stub();
var stripeMethod114 = StripeResource.method;
var PaymentMethodConfigurations = StripeResource.extend({
  create: stripeMethod114({
    method: "POST",
    fullPath: "/v1/payment_method_configurations"
  }),
  retrieve: stripeMethod114({
    method: "GET",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  update: stripeMethod114({
    method: "POST",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  list: stripeMethod114({
    method: "GET",
    fullPath: "/v1/payment_method_configurations",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PaymentMethodDomains.js
init_modules_watch_stub();
var stripeMethod115 = StripeResource.method;
var PaymentMethodDomains = StripeResource.extend({
  create: stripeMethod115({
    method: "POST",
    fullPath: "/v1/payment_method_domains"
  }),
  retrieve: stripeMethod115({
    method: "GET",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  update: stripeMethod115({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  list: stripeMethod115({
    method: "GET",
    fullPath: "/v1/payment_method_domains",
    methodType: "list"
  }),
  validate: stripeMethod115({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}/validate"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PaymentMethods.js
init_modules_watch_stub();
var stripeMethod116 = StripeResource.method;
var PaymentMethods = StripeResource.extend({
  create: stripeMethod116({ method: "POST", fullPath: "/v1/payment_methods" }),
  retrieve: stripeMethod116({
    method: "GET",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  update: stripeMethod116({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  list: stripeMethod116({
    method: "GET",
    fullPath: "/v1/payment_methods",
    methodType: "list"
  }),
  attach: stripeMethod116({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/attach"
  }),
  detach: stripeMethod116({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/detach"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PaymentRecords.js
init_modules_watch_stub();
var stripeMethod117 = StripeResource.method;
var PaymentRecords = StripeResource.extend({
  retrieve: stripeMethod117({ method: "GET", fullPath: "/v1/payment_records/{id}" }),
  reportPayment: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/report_payment"
  }),
  reportPaymentAttempt: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt"
  }),
  reportPaymentAttemptCanceled: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_canceled"
  }),
  reportPaymentAttemptFailed: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_failed"
  }),
  reportPaymentAttemptGuaranteed: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_guaranteed"
  }),
  reportPaymentAttemptInformational: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_payment_attempt_informational"
  }),
  reportRefund: stripeMethod117({
    method: "POST",
    fullPath: "/v1/payment_records/{id}/report_refund"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Payouts.js
init_modules_watch_stub();
var stripeMethod118 = StripeResource.method;
var Payouts = StripeResource.extend({
  create: stripeMethod118({ method: "POST", fullPath: "/v1/payouts" }),
  retrieve: stripeMethod118({ method: "GET", fullPath: "/v1/payouts/{payout}" }),
  update: stripeMethod118({ method: "POST", fullPath: "/v1/payouts/{payout}" }),
  list: stripeMethod118({
    method: "GET",
    fullPath: "/v1/payouts",
    methodType: "list"
  }),
  cancel: stripeMethod118({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/cancel"
  }),
  reverse: stripeMethod118({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/reverse"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Plans.js
init_modules_watch_stub();
var stripeMethod119 = StripeResource.method;
var Plans = StripeResource.extend({
  create: stripeMethod119({ method: "POST", fullPath: "/v1/plans" }),
  retrieve: stripeMethod119({ method: "GET", fullPath: "/v1/plans/{plan}" }),
  update: stripeMethod119({ method: "POST", fullPath: "/v1/plans/{plan}" }),
  list: stripeMethod119({
    method: "GET",
    fullPath: "/v1/plans",
    methodType: "list"
  }),
  del: stripeMethod119({ method: "DELETE", fullPath: "/v1/plans/{plan}" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Prices.js
init_modules_watch_stub();
var stripeMethod120 = StripeResource.method;
var Prices = StripeResource.extend({
  create: stripeMethod120({ method: "POST", fullPath: "/v1/prices" }),
  retrieve: stripeMethod120({ method: "GET", fullPath: "/v1/prices/{price}" }),
  update: stripeMethod120({ method: "POST", fullPath: "/v1/prices/{price}" }),
  list: stripeMethod120({
    method: "GET",
    fullPath: "/v1/prices",
    methodType: "list"
  }),
  search: stripeMethod120({
    method: "GET",
    fullPath: "/v1/prices/search",
    methodType: "search"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Products.js
init_modules_watch_stub();
var stripeMethod121 = StripeResource.method;
var Products2 = StripeResource.extend({
  create: stripeMethod121({ method: "POST", fullPath: "/v1/products" }),
  retrieve: stripeMethod121({ method: "GET", fullPath: "/v1/products/{id}" }),
  update: stripeMethod121({ method: "POST", fullPath: "/v1/products/{id}" }),
  list: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products",
    methodType: "list"
  }),
  del: stripeMethod121({ method: "DELETE", fullPath: "/v1/products/{id}" }),
  createFeature: stripeMethod121({
    method: "POST",
    fullPath: "/v1/products/{product}/features"
  }),
  deleteFeature: stripeMethod121({
    method: "DELETE",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  listFeatures: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products/{product}/features",
    methodType: "list"
  }),
  retrieveFeature: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  search: stripeMethod121({
    method: "GET",
    fullPath: "/v1/products/search",
    methodType: "search"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/PromotionCodes.js
init_modules_watch_stub();
var stripeMethod122 = StripeResource.method;
var PromotionCodes = StripeResource.extend({
  create: stripeMethod122({ method: "POST", fullPath: "/v1/promotion_codes" }),
  retrieve: stripeMethod122({
    method: "GET",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  update: stripeMethod122({
    method: "POST",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  list: stripeMethod122({
    method: "GET",
    fullPath: "/v1/promotion_codes",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Quotes.js
init_modules_watch_stub();
var stripeMethod123 = StripeResource.method;
var Quotes = StripeResource.extend({
  create: stripeMethod123({ method: "POST", fullPath: "/v1/quotes" }),
  retrieve: stripeMethod123({ method: "GET", fullPath: "/v1/quotes/{quote}" }),
  update: stripeMethod123({ method: "POST", fullPath: "/v1/quotes/{quote}" }),
  list: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes",
    methodType: "list"
  }),
  accept: stripeMethod123({ method: "POST", fullPath: "/v1/quotes/{quote}/accept" }),
  cancel: stripeMethod123({ method: "POST", fullPath: "/v1/quotes/{quote}/cancel" }),
  finalizeQuote: stripeMethod123({
    method: "POST",
    fullPath: "/v1/quotes/{quote}/finalize"
  }),
  listComputedUpfrontLineItems: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/computed_upfront_line_items",
    methodType: "list"
  }),
  listLineItems: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/line_items",
    methodType: "list"
  }),
  pdf: stripeMethod123({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/pdf",
    host: "files.stripe.com",
    streaming: true
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Refunds.js
init_modules_watch_stub();
var stripeMethod124 = StripeResource.method;
var Refunds2 = StripeResource.extend({
  create: stripeMethod124({ method: "POST", fullPath: "/v1/refunds" }),
  retrieve: stripeMethod124({ method: "GET", fullPath: "/v1/refunds/{refund}" }),
  update: stripeMethod124({ method: "POST", fullPath: "/v1/refunds/{refund}" }),
  list: stripeMethod124({
    method: "GET",
    fullPath: "/v1/refunds",
    methodType: "list"
  }),
  cancel: stripeMethod124({
    method: "POST",
    fullPath: "/v1/refunds/{refund}/cancel"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Reviews.js
init_modules_watch_stub();
var stripeMethod125 = StripeResource.method;
var Reviews = StripeResource.extend({
  retrieve: stripeMethod125({ method: "GET", fullPath: "/v1/reviews/{review}" }),
  list: stripeMethod125({
    method: "GET",
    fullPath: "/v1/reviews",
    methodType: "list"
  }),
  approve: stripeMethod125({
    method: "POST",
    fullPath: "/v1/reviews/{review}/approve"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/SetupAttempts.js
init_modules_watch_stub();
var stripeMethod126 = StripeResource.method;
var SetupAttempts = StripeResource.extend({
  list: stripeMethod126({
    method: "GET",
    fullPath: "/v1/setup_attempts",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/SetupIntents.js
init_modules_watch_stub();
var stripeMethod127 = StripeResource.method;
var SetupIntents = StripeResource.extend({
  create: stripeMethod127({ method: "POST", fullPath: "/v1/setup_intents" }),
  retrieve: stripeMethod127({
    method: "GET",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  update: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  list: stripeMethod127({
    method: "GET",
    fullPath: "/v1/setup_intents",
    methodType: "list"
  }),
  cancel: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/cancel"
  }),
  confirm: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/confirm"
  }),
  verifyMicrodeposits: stripeMethod127({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/verify_microdeposits"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/ShippingRates.js
init_modules_watch_stub();
var stripeMethod128 = StripeResource.method;
var ShippingRates = StripeResource.extend({
  create: stripeMethod128({ method: "POST", fullPath: "/v1/shipping_rates" }),
  retrieve: stripeMethod128({
    method: "GET",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  update: stripeMethod128({
    method: "POST",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  list: stripeMethod128({
    method: "GET",
    fullPath: "/v1/shipping_rates",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Sources.js
init_modules_watch_stub();
var stripeMethod129 = StripeResource.method;
var Sources = StripeResource.extend({
  create: stripeMethod129({ method: "POST", fullPath: "/v1/sources" }),
  retrieve: stripeMethod129({ method: "GET", fullPath: "/v1/sources/{source}" }),
  update: stripeMethod129({ method: "POST", fullPath: "/v1/sources/{source}" }),
  listSourceTransactions: stripeMethod129({
    method: "GET",
    fullPath: "/v1/sources/{source}/source_transactions",
    methodType: "list"
  }),
  verify: stripeMethod129({
    method: "POST",
    fullPath: "/v1/sources/{source}/verify"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/SubscriptionItems.js
init_modules_watch_stub();
var stripeMethod130 = StripeResource.method;
var SubscriptionItems = StripeResource.extend({
  create: stripeMethod130({ method: "POST", fullPath: "/v1/subscription_items" }),
  retrieve: stripeMethod130({
    method: "GET",
    fullPath: "/v1/subscription_items/{item}"
  }),
  update: stripeMethod130({
    method: "POST",
    fullPath: "/v1/subscription_items/{item}"
  }),
  list: stripeMethod130({
    method: "GET",
    fullPath: "/v1/subscription_items",
    methodType: "list"
  }),
  del: stripeMethod130({
    method: "DELETE",
    fullPath: "/v1/subscription_items/{item}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/SubscriptionSchedules.js
init_modules_watch_stub();
var stripeMethod131 = StripeResource.method;
var SubscriptionSchedules = StripeResource.extend({
  create: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules"
  }),
  retrieve: stripeMethod131({
    method: "GET",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  update: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  list: stripeMethod131({
    method: "GET",
    fullPath: "/v1/subscription_schedules",
    methodType: "list"
  }),
  cancel: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/cancel"
  }),
  release: stripeMethod131({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/release"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Subscriptions.js
init_modules_watch_stub();
var stripeMethod132 = StripeResource.method;
var Subscriptions = StripeResource.extend({
  create: stripeMethod132({ method: "POST", fullPath: "/v1/subscriptions" }),
  retrieve: stripeMethod132({
    method: "GET",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  update: stripeMethod132({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  list: stripeMethod132({
    method: "GET",
    fullPath: "/v1/subscriptions",
    methodType: "list"
  }),
  cancel: stripeMethod132({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  deleteDiscount: stripeMethod132({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}/discount"
  }),
  migrate: stripeMethod132({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription}/migrate"
  }),
  resume: stripeMethod132({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription}/resume"
  }),
  search: stripeMethod132({
    method: "GET",
    fullPath: "/v1/subscriptions/search",
    methodType: "search"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TaxCodes.js
init_modules_watch_stub();
var stripeMethod133 = StripeResource.method;
var TaxCodes = StripeResource.extend({
  retrieve: stripeMethod133({ method: "GET", fullPath: "/v1/tax_codes/{id}" }),
  list: stripeMethod133({
    method: "GET",
    fullPath: "/v1/tax_codes",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TaxIds.js
init_modules_watch_stub();
var stripeMethod134 = StripeResource.method;
var TaxIds = StripeResource.extend({
  create: stripeMethod134({ method: "POST", fullPath: "/v1/tax_ids" }),
  retrieve: stripeMethod134({ method: "GET", fullPath: "/v1/tax_ids/{id}" }),
  list: stripeMethod134({
    method: "GET",
    fullPath: "/v1/tax_ids",
    methodType: "list"
  }),
  del: stripeMethod134({ method: "DELETE", fullPath: "/v1/tax_ids/{id}" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/TaxRates.js
init_modules_watch_stub();
var stripeMethod135 = StripeResource.method;
var TaxRates = StripeResource.extend({
  create: stripeMethod135({ method: "POST", fullPath: "/v1/tax_rates" }),
  retrieve: stripeMethod135({ method: "GET", fullPath: "/v1/tax_rates/{tax_rate}" }),
  update: stripeMethod135({ method: "POST", fullPath: "/v1/tax_rates/{tax_rate}" }),
  list: stripeMethod135({
    method: "GET",
    fullPath: "/v1/tax_rates",
    methodType: "list"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Tokens.js
init_modules_watch_stub();
var stripeMethod136 = StripeResource.method;
var Tokens2 = StripeResource.extend({
  create: stripeMethod136({ method: "POST", fullPath: "/v1/tokens" }),
  retrieve: stripeMethod136({ method: "GET", fullPath: "/v1/tokens/{token}" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Topups.js
init_modules_watch_stub();
var stripeMethod137 = StripeResource.method;
var Topups = StripeResource.extend({
  create: stripeMethod137({ method: "POST", fullPath: "/v1/topups" }),
  retrieve: stripeMethod137({ method: "GET", fullPath: "/v1/topups/{topup}" }),
  update: stripeMethod137({ method: "POST", fullPath: "/v1/topups/{topup}" }),
  list: stripeMethod137({
    method: "GET",
    fullPath: "/v1/topups",
    methodType: "list"
  }),
  cancel: stripeMethod137({ method: "POST", fullPath: "/v1/topups/{topup}/cancel" })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/Transfers.js
init_modules_watch_stub();
var stripeMethod138 = StripeResource.method;
var Transfers = StripeResource.extend({
  create: stripeMethod138({ method: "POST", fullPath: "/v1/transfers" }),
  retrieve: stripeMethod138({ method: "GET", fullPath: "/v1/transfers/{transfer}" }),
  update: stripeMethod138({ method: "POST", fullPath: "/v1/transfers/{transfer}" }),
  list: stripeMethod138({
    method: "GET",
    fullPath: "/v1/transfers",
    methodType: "list"
  }),
  createReversal: stripeMethod138({
    method: "POST",
    fullPath: "/v1/transfers/{id}/reversals"
  }),
  listReversals: stripeMethod138({
    method: "GET",
    fullPath: "/v1/transfers/{id}/reversals",
    methodType: "list"
  }),
  retrieveReversal: stripeMethod138({
    method: "GET",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  }),
  updateReversal: stripeMethod138({
    method: "POST",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources/WebhookEndpoints.js
init_modules_watch_stub();
var stripeMethod139 = StripeResource.method;
var WebhookEndpoints = StripeResource.extend({
  create: stripeMethod139({ method: "POST", fullPath: "/v1/webhook_endpoints" }),
  retrieve: stripeMethod139({
    method: "GET",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  update: stripeMethod139({
    method: "POST",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  list: stripeMethod139({
    method: "GET",
    fullPath: "/v1/webhook_endpoints",
    methodType: "list"
  }),
  del: stripeMethod139({
    method: "DELETE",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/resources.js
var Apps = resourceNamespace("apps", { Secrets });
var Billing = resourceNamespace("billing", {
  Alerts,
  CreditBalanceSummary,
  CreditBalanceTransactions,
  CreditGrants,
  MeterEventAdjustments,
  MeterEvents,
  Meters
});
var BillingPortal = resourceNamespace("billingPortal", {
  Configurations,
  Sessions
});
var Checkout = resourceNamespace("checkout", {
  Sessions: Sessions2
});
var Climate = resourceNamespace("climate", {
  Orders,
  Products,
  Suppliers
});
var Entitlements = resourceNamespace("entitlements", {
  ActiveEntitlements,
  Features
});
var FinancialConnections = resourceNamespace("financialConnections", {
  Accounts,
  Sessions: Sessions3,
  Transactions
});
var Forwarding = resourceNamespace("forwarding", {
  Requests
});
var Identity = resourceNamespace("identity", {
  VerificationReports,
  VerificationSessions
});
var Issuing = resourceNamespace("issuing", {
  Authorizations,
  Cardholders,
  Cards,
  Disputes,
  PersonalizationDesigns,
  PhysicalBundles,
  Tokens,
  Transactions: Transactions2
});
var Radar = resourceNamespace("radar", {
  EarlyFraudWarnings,
  PaymentEvaluations,
  ValueListItems,
  ValueLists
});
var Reporting = resourceNamespace("reporting", {
  ReportRuns,
  ReportTypes
});
var Sigma = resourceNamespace("sigma", {
  ScheduledQueryRuns
});
var Tax = resourceNamespace("tax", {
  Associations,
  Calculations,
  Registrations,
  Settings,
  Transactions: Transactions3
});
var Terminal = resourceNamespace("terminal", {
  Configurations: Configurations2,
  ConnectionTokens,
  Locations,
  OnboardingLinks,
  Readers
});
var TestHelpers = resourceNamespace("testHelpers", {
  ConfirmationTokens,
  Customers,
  Refunds,
  TestClocks,
  Issuing: resourceNamespace("issuing", {
    Authorizations: Authorizations2,
    Cards: Cards2,
    PersonalizationDesigns: PersonalizationDesigns2,
    Transactions: Transactions4
  }),
  Terminal: resourceNamespace("terminal", {
    Readers: Readers2
  }),
  Treasury: resourceNamespace("treasury", {
    InboundTransfers,
    OutboundPayments,
    OutboundTransfers,
    ReceivedCredits,
    ReceivedDebits
  })
});
var Treasury = resourceNamespace("treasury", {
  CreditReversals,
  DebitReversals,
  FinancialAccounts,
  InboundTransfers: InboundTransfers2,
  OutboundPayments: OutboundPayments2,
  OutboundTransfers: OutboundTransfers2,
  ReceivedCredits: ReceivedCredits2,
  ReceivedDebits: ReceivedDebits2,
  TransactionEntries,
  Transactions: Transactions5
});
var V2 = resourceNamespace("v2", {
  Billing: resourceNamespace("billing", {
    MeterEventAdjustments: MeterEventAdjustments2,
    MeterEventSession,
    MeterEventStream,
    MeterEvents: MeterEvents2
  }),
  Core: resourceNamespace("core", {
    AccountLinks,
    AccountTokens,
    Accounts: Accounts2,
    EventDestinations,
    Events
  })
});

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/stripe.core.js
var DEFAULT_HOST = "api.stripe.com";
var DEFAULT_PORT = "443";
var DEFAULT_BASE_PATH = "/v1/";
var DEFAULT_API_VERSION = ApiVersion;
var DEFAULT_TIMEOUT = 8e4;
var MAX_NETWORK_RETRY_DELAY_SEC = 5;
var INITIAL_NETWORK_RETRY_DELAY_SEC = 0.5;
var APP_INFO_PROPERTIES = ["name", "version", "url", "partner_id"];
var ALLOWED_CONFIG_PROPERTIES = [
  "authenticator",
  "apiVersion",
  "typescript",
  "maxNetworkRetries",
  "httpAgent",
  "httpClient",
  "timeout",
  "host",
  "port",
  "protocol",
  "telemetry",
  "appInfo",
  "stripeAccount",
  "stripeContext"
];
var defaultRequestSenderFactory = /* @__PURE__ */ __name((stripe) => new RequestSender(stripe, StripeResource.MAX_BUFFERED_REQUEST_METRICS), "defaultRequestSenderFactory");
function createStripe(platformFunctions, requestSender = defaultRequestSenderFactory) {
  Stripe2.PACKAGE_VERSION = "20.4.1";
  Stripe2.API_VERSION = ApiVersion;
  const aiAgent = typeof process !== "undefined" && process.env ? detectAIAgent(process.env) : "";
  Stripe2.AI_AGENT = aiAgent;
  Stripe2.USER_AGENT = Object.assign(Object.assign({ bindings_version: Stripe2.PACKAGE_VERSION, lang: "node", publisher: "stripe", uname: null, typescript: false }, determineProcessUserAgentProperties()), aiAgent ? { ai_agent: aiAgent } : {});
  Stripe2.StripeResource = StripeResource;
  Stripe2.StripeContext = StripeContext;
  Stripe2.resources = resources_exports;
  Stripe2.HttpClient = HttpClient;
  Stripe2.HttpClientResponse = HttpClientResponse;
  Stripe2.CryptoProvider = CryptoProvider;
  Stripe2.webhooks = createWebhooks(platformFunctions);
  function Stripe2(key, config = {}) {
    if (!(this instanceof Stripe2)) {
      return new Stripe2(key, config);
    }
    const props = this._getPropsFromConfig(config);
    this._platformFunctions = platformFunctions;
    Object.defineProperty(this, "_emitter", {
      value: this._platformFunctions.createEmitter(),
      enumerable: false,
      configurable: false,
      writable: false
    });
    this.VERSION = Stripe2.PACKAGE_VERSION;
    this.on = this._emitter.on.bind(this._emitter);
    this.once = this._emitter.once.bind(this._emitter);
    this.off = this._emitter.removeListener.bind(this._emitter);
    const agent = props.httpAgent || null;
    this._api = {
      host: props.host || DEFAULT_HOST,
      port: props.port || DEFAULT_PORT,
      protocol: props.protocol || "https",
      basePath: DEFAULT_BASE_PATH,
      version: props.apiVersion || DEFAULT_API_VERSION,
      timeout: validateInteger("timeout", props.timeout, DEFAULT_TIMEOUT),
      maxNetworkRetries: validateInteger("maxNetworkRetries", props.maxNetworkRetries, 2),
      agent,
      httpClient: props.httpClient || (agent ? this._platformFunctions.createNodeHttpClient(agent) : this._platformFunctions.createDefaultHttpClient()),
      dev: false,
      stripeAccount: props.stripeAccount || null,
      stripeContext: props.stripeContext || null
    };
    const typescript = props.typescript || false;
    if (typescript !== Stripe2.USER_AGENT.typescript) {
      Stripe2.USER_AGENT.typescript = typescript;
    }
    if (props.appInfo) {
      this._setAppInfo(props.appInfo);
    }
    this._prepResources();
    this._setAuthenticator(key, props.authenticator);
    this.errors = Error_exports;
    this.webhooks = Stripe2.webhooks;
    this._prevRequestMetrics = [];
    this._enableTelemetry = props.telemetry !== false;
    this._requestSender = requestSender(this);
    this.StripeResource = Stripe2.StripeResource;
  }
  __name(Stripe2, "Stripe");
  Stripe2.errors = Error_exports;
  Stripe2.createNodeHttpClient = platformFunctions.createNodeHttpClient;
  Stripe2.createFetchHttpClient = platformFunctions.createFetchHttpClient;
  Stripe2.createNodeCryptoProvider = platformFunctions.createNodeCryptoProvider;
  Stripe2.createSubtleCryptoProvider = platformFunctions.createSubtleCryptoProvider;
  Stripe2.prototype = {
    // Properties are set in the constructor above
    _appInfo: void 0,
    on: null,
    off: null,
    once: null,
    VERSION: null,
    StripeResource: null,
    webhooks: null,
    errors: null,
    _api: null,
    _prevRequestMetrics: null,
    _emitter: null,
    _enableTelemetry: null,
    _requestSender: null,
    _platformFunctions: null,
    rawRequest(method, path, params, options) {
      return this._requestSender._rawRequest(method, path, params, options);
    },
    /**
     * @private
     */
    _setAuthenticator(key, authenticator) {
      if (key && authenticator) {
        throw new Error("Can't specify both apiKey and authenticator");
      }
      if (!key && !authenticator) {
        throw new Error("Neither apiKey nor config.authenticator provided");
      }
      this._authenticator = key ? createApiKeyAuthenticator(key) : authenticator;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setAppInfo(info) {
      if (info && typeof info !== "object") {
        throw new Error("AppInfo must be an object.");
      }
      if (info && !info.name) {
        throw new Error("AppInfo.name is required");
      }
      info = info || {};
      this._appInfo = APP_INFO_PROPERTIES.reduce((accum, prop) => {
        if (typeof info[prop] == "string") {
          accum = accum || {};
          accum[prop] = info[prop];
        }
        return accum;
      }, {});
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiField(key, value) {
      this._api[key] = value;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getApiField(key) {
      return this._api[key];
    },
    setClientId(clientId) {
      this._clientId = clientId;
    },
    getClientId() {
      return this._clientId;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getConstant: /* @__PURE__ */ __name((c) => {
      switch (c) {
        case "DEFAULT_HOST":
          return DEFAULT_HOST;
        case "DEFAULT_PORT":
          return DEFAULT_PORT;
        case "DEFAULT_BASE_PATH":
          return DEFAULT_BASE_PATH;
        case "DEFAULT_API_VERSION":
          return DEFAULT_API_VERSION;
        case "DEFAULT_TIMEOUT":
          return DEFAULT_TIMEOUT;
        case "MAX_NETWORK_RETRY_DELAY_SEC":
          return MAX_NETWORK_RETRY_DELAY_SEC;
        case "INITIAL_NETWORK_RETRY_DELAY_SEC":
          return INITIAL_NETWORK_RETRY_DELAY_SEC;
      }
      return Stripe2[c];
    }, "getConstant"),
    getMaxNetworkRetries() {
      return this.getApiField("maxNetworkRetries");
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiNumberField(prop, n, defaultVal) {
      const val = validateInteger(prop, n, defaultVal);
      this._setApiField(prop, val);
    },
    getMaxNetworkRetryDelay() {
      return MAX_NETWORK_RETRY_DELAY_SEC;
    },
    getInitialNetworkRetryDelay() {
      return INITIAL_NETWORK_RETRY_DELAY_SEC;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent and uses a cached version for a slight
     * speed advantage.
     */
    getClientUserAgent(cb) {
      return this.getClientUserAgentSeeded(Stripe2.USER_AGENT, cb);
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent by encoding a seeded object and
     * fetching a uname from the system.
     */
    getClientUserAgentSeeded(seed, cb) {
      this._platformFunctions.getUname().then((uname) => {
        var _a;
        const userAgent = {};
        for (const field in seed) {
          if (!Object.prototype.hasOwnProperty.call(seed, field)) {
            continue;
          }
          userAgent[field] = encodeURIComponent((_a = seed[field]) !== null && _a !== void 0 ? _a : "null");
        }
        userAgent.uname = encodeURIComponent(uname || "UNKNOWN");
        const client = this.getApiField("httpClient");
        if (client) {
          userAgent.httplib = encodeURIComponent(client.getClientName());
        }
        if (this._appInfo) {
          userAgent.application = this._appInfo;
        }
        cb(JSON.stringify(userAgent));
      });
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getAppInfoAsString() {
      if (!this._appInfo) {
        return "";
      }
      let formatted = this._appInfo.name;
      if (this._appInfo.version) {
        formatted += `/${this._appInfo.version}`;
      }
      if (this._appInfo.url) {
        formatted += ` (${this._appInfo.url})`;
      }
      return formatted;
    },
    getTelemetryEnabled() {
      return this._enableTelemetry;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _prepResources() {
      for (const name in resources_exports) {
        if (!Object.prototype.hasOwnProperty.call(resources_exports, name)) {
          continue;
        }
        this[pascalToCamelCase(name)] = new resources_exports[name](this);
      }
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _getPropsFromConfig(config) {
      if (!config) {
        return {};
      }
      const isString = typeof config === "string";
      const isObject2 = config === Object(config) && !Array.isArray(config);
      if (!isObject2 && !isString) {
        throw new Error("Config must either be an object or a string");
      }
      if (isString) {
        return {
          apiVersion: config
        };
      }
      const values = Object.keys(config).filter((value) => !ALLOWED_CONFIG_PROPERTIES.includes(value));
      if (values.length > 0) {
        throw new Error(`Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(", ")}`);
      }
      return config;
    },
    parseEventNotification(payload, header, secret, tolerance, cryptoProvider, receivedAt) {
      const eventNotification = this.webhooks.constructEvent(payload, header, secret, tolerance, cryptoProvider, receivedAt);
      if (eventNotification.context) {
        eventNotification.context = StripeContext.parse(eventNotification.context);
      }
      eventNotification.fetchEvent = () => {
        return this._requestSender._rawRequest("GET", `/v2/core/events/${eventNotification.id}`, void 0, {
          stripeContext: eventNotification.context,
          headers: {
            "Stripe-Request-Trigger": `event=${eventNotification.id}`
          }
        }, ["fetch_event"]);
      };
      eventNotification.fetchRelatedObject = () => {
        if (!eventNotification.related_object) {
          return Promise.resolve(null);
        }
        return this._requestSender._rawRequest("GET", eventNotification.related_object.url, void 0, {
          stripeContext: eventNotification.context,
          headers: {
            "Stripe-Request-Trigger": `event=${eventNotification.id}`
          }
        }, ["fetch_related_object"]);
      };
      return eventNotification;
    }
  };
  return Stripe2;
}
__name(createStripe, "createStripe");

// ../../node_modules/.bun/stripe@20.4.1+aab3160543ca59a9/node_modules/stripe/esm/stripe.esm.worker.js
var Stripe = createStripe(new WebPlatformFunctions());
var stripe_esm_worker_default = Stripe;

// src/utils/instant-admin.ts
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+admin@0.22.171/node_modules/@instantdb/admin/dist/esm/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/validate.js
init_modules_watch_stub();

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/regex.js
init_modules_watch_stub();
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
__name(validate, "validate");
var validate_default = validate;

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/stringify.js
init_modules_watch_stub();
var byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
__name(unsafeStringify, "unsafeStringify");

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/rng.js
init_modules_watch_stub();
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/v4.js
init_modules_watch_stub();

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/native.js
init_modules_watch_stub();
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = { randomUUID };

// ../../node_modules/.bun/uuid@11.1.0/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/Reactor.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/weakHash.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/instaql.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/datalog.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/store.js
init_modules_watch_stub();

// ../../node_modules/.bun/mutative@1.3.0/node_modules/mutative/dist/mutative.esm.mjs
init_modules_watch_stub();
var Operation = {
  Remove: "remove",
  Replace: "replace",
  Add: "add"
};
var PROXY_DRAFT = /* @__PURE__ */ Symbol.for("__MUTATIVE_PROXY_DRAFT__");
var RAW_RETURN_SYMBOL = /* @__PURE__ */ Symbol("__MUTATIVE_RAW_RETURN_SYMBOL__");
var iteratorSymbol = Symbol.iterator;
var dataTypes = {
  mutable: "mutable",
  immutable: "immutable"
};
var internal = {};
function has(target, key) {
  return target instanceof Map ? target.has(key) : Object.prototype.hasOwnProperty.call(target, key);
}
__name(has, "has");
function getDescriptor(target, key) {
  if (key in target) {
    let prototype = Reflect.getPrototypeOf(target);
    while (prototype) {
      const descriptor = Reflect.getOwnPropertyDescriptor(prototype, key);
      if (descriptor)
        return descriptor;
      prototype = Reflect.getPrototypeOf(prototype);
    }
  }
  return;
}
__name(getDescriptor, "getDescriptor");
function isBaseSetInstance(obj) {
  return Object.getPrototypeOf(obj) === Set.prototype;
}
__name(isBaseSetInstance, "isBaseSetInstance");
function isBaseMapInstance(obj) {
  return Object.getPrototypeOf(obj) === Map.prototype;
}
__name(isBaseMapInstance, "isBaseMapInstance");
function latest(proxyDraft) {
  var _a;
  return (_a = proxyDraft.copy) !== null && _a !== void 0 ? _a : proxyDraft.original;
}
__name(latest, "latest");
function isDraft(target) {
  return !!getProxyDraft(target);
}
__name(isDraft, "isDraft");
function getProxyDraft(value) {
  if (typeof value !== "object")
    return null;
  return value === null || value === void 0 ? void 0 : value[PROXY_DRAFT];
}
__name(getProxyDraft, "getProxyDraft");
function getValue(value) {
  var _a;
  const proxyDraft = getProxyDraft(value);
  return proxyDraft ? (_a = proxyDraft.copy) !== null && _a !== void 0 ? _a : proxyDraft.original : value;
}
__name(getValue, "getValue");
function isDraftable(value, options) {
  if (!value || typeof value !== "object")
    return false;
  let markResult;
  return Object.getPrototypeOf(value) === Object.prototype || Array.isArray(value) || value instanceof Map || value instanceof Set || !!(options === null || options === void 0 ? void 0 : options.mark) && ((markResult = options.mark(value, dataTypes)) === dataTypes.immutable || typeof markResult === "function");
}
__name(isDraftable, "isDraftable");
function getPath2(target, path = []) {
  if (Object.hasOwnProperty.call(target, "key")) {
    const parentCopy = target.parent.copy;
    const proxyDraft = getProxyDraft(get(parentCopy, target.key));
    if (proxyDraft !== null && (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== target.original) {
      return null;
    }
    const isSet = target.parent.type === 3;
    const key = isSet ? Array.from(target.parent.setMap.keys()).indexOf(target.key) : target.key;
    if (!(isSet && parentCopy.size > key || has(parentCopy, key)))
      return null;
    path.push(key);
  }
  if (target.parent) {
    return getPath2(target.parent, path);
  }
  path.reverse();
  try {
    resolvePath(target.copy, path);
  } catch (e) {
    return null;
  }
  return path;
}
__name(getPath2, "getPath");
function getType(target) {
  if (Array.isArray(target))
    return 1;
  if (target instanceof Map)
    return 2;
  if (target instanceof Set)
    return 3;
  return 0;
}
__name(getType, "getType");
function get(target, key) {
  return getType(target) === 2 ? target.get(key) : target[key];
}
__name(get, "get");
function set(target, key, value) {
  const type = getType(target);
  if (type === 2) {
    target.set(key, value);
  } else {
    target[key] = value;
  }
}
__name(set, "set");
function peek(target, key) {
  const state = getProxyDraft(target);
  const source = state ? latest(state) : target;
  return source[key];
}
__name(peek, "peek");
function isEqual(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
__name(isEqual, "isEqual");
function revokeProxy(proxyDraft) {
  if (!proxyDraft)
    return;
  while (proxyDraft.finalities.revoke.length > 0) {
    const revoke = proxyDraft.finalities.revoke.pop();
    revoke();
  }
}
__name(revokeProxy, "revokeProxy");
function escapePath(path, pathAsArray) {
  return pathAsArray ? path : [""].concat(path).map((_item) => {
    const item = `${_item}`;
    if (item.indexOf("/") === -1 && item.indexOf("~") === -1)
      return item;
    return item.replace(/~/g, "~0").replace(/\//g, "~1");
  }).join("/");
}
__name(escapePath, "escapePath");
function resolvePath(base, path) {
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    base = get(getType(base) === 3 ? Array.from(base) : base, key);
    if (typeof base !== "object") {
      throw new Error(`Cannot resolve patch at '${path.join("/")}'.`);
    }
  }
  return base;
}
__name(resolvePath, "resolvePath");
function strictCopy(target) {
  const copy = Object.create(Object.getPrototypeOf(target));
  Reflect.ownKeys(target).forEach((key) => {
    let desc = Reflect.getOwnPropertyDescriptor(target, key);
    if (desc.enumerable && desc.configurable && desc.writable) {
      copy[key] = target[key];
      return;
    }
    if (!desc.writable) {
      desc.writable = true;
      desc.configurable = true;
    }
    if (desc.get || desc.set)
      desc = {
        configurable: true,
        writable: true,
        enumerable: desc.enumerable,
        value: target[key]
      };
    Reflect.defineProperty(copy, key, desc);
  });
  return copy;
}
__name(strictCopy, "strictCopy");
var propIsEnum = Object.prototype.propertyIsEnumerable;
function shallowCopy(original, options) {
  let markResult;
  if (Array.isArray(original)) {
    return Array.prototype.concat.call(original);
  } else if (original instanceof Set) {
    if (!isBaseSetInstance(original)) {
      const SubClass = Object.getPrototypeOf(original).constructor;
      return new SubClass(original.values());
    }
    return Set.prototype.difference ? Set.prototype.difference.call(original, /* @__PURE__ */ new Set()) : new Set(original.values());
  } else if (original instanceof Map) {
    if (!isBaseMapInstance(original)) {
      const SubClass = Object.getPrototypeOf(original).constructor;
      return new SubClass(original);
    }
    return new Map(original);
  } else if ((options === null || options === void 0 ? void 0 : options.mark) && (markResult = options.mark(original, dataTypes), markResult !== void 0) && markResult !== dataTypes.mutable) {
    if (markResult === dataTypes.immutable) {
      return strictCopy(original);
    } else if (typeof markResult === "function") {
      if (options.enablePatches || options.enableAutoFreeze) {
        throw new Error(`You can't use mark and patches or auto freeze together.`);
      }
      return markResult();
    }
    throw new Error(`Unsupported mark result: ${markResult}`);
  } else if (typeof original === "object" && Object.getPrototypeOf(original) === Object.prototype) {
    const copy = {};
    Object.keys(original).forEach((key) => {
      copy[key] = original[key];
    });
    Object.getOwnPropertySymbols(original).forEach((key) => {
      if (propIsEnum.call(original, key)) {
        copy[key] = original[key];
      }
    });
    return copy;
  } else {
    throw new Error(`Please check mark() to ensure that it is a stable marker draftable function.`);
  }
}
__name(shallowCopy, "shallowCopy");
function ensureShallowCopy(target) {
  if (target.copy)
    return;
  target.copy = shallowCopy(target.original, target.options);
}
__name(ensureShallowCopy, "ensureShallowCopy");
function deepClone(target) {
  if (!isDraftable(target))
    return getValue(target);
  if (Array.isArray(target))
    return target.map(deepClone);
  if (target instanceof Map) {
    const iterable = Array.from(target.entries()).map(([k, v]) => [
      k,
      deepClone(v)
    ]);
    if (!isBaseMapInstance(target)) {
      const SubClass = Object.getPrototypeOf(target).constructor;
      return new SubClass(iterable);
    }
    return new Map(iterable);
  }
  if (target instanceof Set) {
    const iterable = Array.from(target).map(deepClone);
    if (!isBaseSetInstance(target)) {
      const SubClass = Object.getPrototypeOf(target).constructor;
      return new SubClass(iterable);
    }
    return new Set(iterable);
  }
  const copy = Object.create(Object.getPrototypeOf(target));
  for (const key in target)
    copy[key] = deepClone(target[key]);
  return copy;
}
__name(deepClone, "deepClone");
function cloneIfNeeded(target) {
  return isDraft(target) ? deepClone(target) : target;
}
__name(cloneIfNeeded, "cloneIfNeeded");
function markChanged(proxyDraft) {
  var _a;
  proxyDraft.assignedMap = (_a = proxyDraft.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
  if (!proxyDraft.operated) {
    proxyDraft.operated = true;
    if (proxyDraft.parent) {
      markChanged(proxyDraft.parent);
    }
  }
}
__name(markChanged, "markChanged");
function throwFrozenError() {
  throw new Error("Cannot modify frozen object");
}
__name(throwFrozenError, "throwFrozenError");
function deepFreeze(target, subKey, updatedValues, stack, keys) {
  {
    updatedValues = updatedValues !== null && updatedValues !== void 0 ? updatedValues : /* @__PURE__ */ new WeakMap();
    stack = stack !== null && stack !== void 0 ? stack : [];
    keys = keys !== null && keys !== void 0 ? keys : [];
    const value = updatedValues.has(target) ? updatedValues.get(target) : target;
    if (stack.length > 0) {
      const index = stack.indexOf(value);
      if (value && typeof value === "object" && index !== -1) {
        if (stack[0] === value) {
          throw new Error(`Forbids circular reference`);
        }
        throw new Error(`Forbids circular reference: ~/${keys.slice(0, index).map((key, index2) => {
          if (typeof key === "symbol")
            return `[${key.toString()}]`;
          const parent = stack[index2];
          if (typeof key === "object" && (parent instanceof Map || parent instanceof Set))
            return Array.from(parent.keys()).indexOf(key);
          return key;
        }).join("/")}`);
      }
      stack.push(value);
      keys.push(subKey);
    } else {
      stack.push(value);
    }
  }
  if (Object.isFrozen(target) || isDraft(target)) {
    {
      stack.pop();
      keys.pop();
    }
    return;
  }
  const type = getType(target);
  switch (type) {
    case 2:
      for (const [key, value] of target) {
        deepFreeze(key, key, updatedValues, stack, keys);
        deepFreeze(value, key, updatedValues, stack, keys);
      }
      target.set = target.clear = target.delete = throwFrozenError;
      break;
    case 3:
      for (const value of target) {
        deepFreeze(value, value, updatedValues, stack, keys);
      }
      target.add = target.clear = target.delete = throwFrozenError;
      break;
    case 1:
      Object.freeze(target);
      let index = 0;
      for (const value of target) {
        deepFreeze(value, index, updatedValues, stack, keys);
        index += 1;
      }
      break;
    default:
      Object.freeze(target);
      Object.keys(target).forEach((name) => {
        const value = target[name];
        deepFreeze(value, name, updatedValues, stack, keys);
      });
  }
  {
    stack.pop();
    keys.pop();
  }
}
__name(deepFreeze, "deepFreeze");
function forEach(target, iter) {
  const type = getType(target);
  if (type === 0) {
    Reflect.ownKeys(target).forEach((key) => {
      iter(key, target[key], target);
    });
  } else if (type === 1) {
    let index = 0;
    for (const entry of target) {
      iter(index, entry, target);
      index += 1;
    }
  } else {
    target.forEach((entry, index) => iter(index, entry, target));
  }
}
__name(forEach, "forEach");
function handleValue(target, handledSet, options) {
  if (isDraft(target) || !isDraftable(target, options) || handledSet.has(target) || Object.isFrozen(target))
    return;
  const isSet = target instanceof Set;
  const setMap = isSet ? /* @__PURE__ */ new Map() : void 0;
  handledSet.add(target);
  forEach(target, (key, value) => {
    var _a;
    if (isDraft(value)) {
      const proxyDraft = getProxyDraft(value);
      ensureShallowCopy(proxyDraft);
      const updatedValue = ((_a = proxyDraft.assignedMap) === null || _a === void 0 ? void 0 : _a.size) || proxyDraft.operated ? proxyDraft.copy : proxyDraft.original;
      set(isSet ? setMap : target, key, updatedValue);
    } else {
      handleValue(value, handledSet, options);
    }
  });
  if (setMap) {
    const set2 = target;
    const values = Array.from(set2);
    set2.clear();
    values.forEach((value) => {
      set2.add(setMap.has(value) ? setMap.get(value) : value);
    });
  }
}
__name(handleValue, "handleValue");
function finalizeAssigned(proxyDraft, key) {
  const copy = proxyDraft.type === 3 ? proxyDraft.setMap : proxyDraft.copy;
  if (proxyDraft.finalities.revoke.length > 1 && proxyDraft.assignedMap.get(key) && copy) {
    handleValue(get(copy, key), proxyDraft.finalities.handledSet, proxyDraft.options);
  }
}
__name(finalizeAssigned, "finalizeAssigned");
function finalizeSetValue(target) {
  if (target.type === 3 && target.copy) {
    target.copy.clear();
    target.setMap.forEach((value) => {
      target.copy.add(getValue(value));
    });
  }
}
__name(finalizeSetValue, "finalizeSetValue");
function finalizePatches(target, generatePatches2, patches, inversePatches) {
  const shouldFinalize = target.operated && target.assignedMap && target.assignedMap.size > 0 && !target.finalized;
  if (shouldFinalize) {
    if (patches && inversePatches) {
      const basePath = getPath2(target);
      if (basePath) {
        generatePatches2(target, basePath, patches, inversePatches);
      }
    }
    target.finalized = true;
  }
}
__name(finalizePatches, "finalizePatches");
function markFinalization(target, key, value, generatePatches2) {
  const proxyDraft = getProxyDraft(value);
  if (proxyDraft) {
    if (!proxyDraft.callbacks) {
      proxyDraft.callbacks = [];
    }
    proxyDraft.callbacks.push((patches, inversePatches) => {
      var _a;
      const copy = target.type === 3 ? target.setMap : target.copy;
      if (isEqual(get(copy, key), value)) {
        let updatedValue = proxyDraft.original;
        if (proxyDraft.copy) {
          updatedValue = proxyDraft.copy;
        }
        finalizeSetValue(target);
        finalizePatches(target, generatePatches2, patches, inversePatches);
        if (target.options.enableAutoFreeze) {
          target.options.updatedValues = (_a = target.options.updatedValues) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new WeakMap();
          target.options.updatedValues.set(updatedValue, proxyDraft.original);
        }
        set(copy, key, updatedValue);
      }
    });
    if (target.options.enableAutoFreeze) {
      if (proxyDraft.finalities !== target.finalities) {
        target.options.enableAutoFreeze = false;
      }
    }
  }
  if (isDraftable(value, target.options)) {
    target.finalities.draft.push(() => {
      const copy = target.type === 3 ? target.setMap : target.copy;
      if (isEqual(get(copy, key), value)) {
        finalizeAssigned(target, key);
      }
    });
  }
}
__name(markFinalization, "markFinalization");
function generateArrayPatches(proxyState, basePath, patches, inversePatches, pathAsArray) {
  let { original, assignedMap, options } = proxyState;
  let copy = proxyState.copy;
  if (copy.length < original.length) {
    [original, copy] = [copy, original];
    [patches, inversePatches] = [inversePatches, patches];
  }
  for (let index = 0; index < original.length; index += 1) {
    if (assignedMap.get(index.toString()) && copy[index] !== original[index]) {
      const _path = basePath.concat([index]);
      const path = escapePath(_path, pathAsArray);
      patches.push({
        op: Operation.Replace,
        path,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: cloneIfNeeded(copy[index])
      });
      inversePatches.push({
        op: Operation.Replace,
        path,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: cloneIfNeeded(original[index])
      });
    }
  }
  for (let index = original.length; index < copy.length; index += 1) {
    const _path = basePath.concat([index]);
    const path = escapePath(_path, pathAsArray);
    patches.push({
      op: Operation.Add,
      path,
      // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
      value: cloneIfNeeded(copy[index])
    });
  }
  if (original.length < copy.length) {
    const { arrayLengthAssignment = true } = options.enablePatches;
    if (arrayLengthAssignment) {
      const _path = basePath.concat(["length"]);
      const path = escapePath(_path, pathAsArray);
      inversePatches.push({
        op: Operation.Replace,
        path,
        value: original.length
      });
    } else {
      for (let index = copy.length; original.length < index; index -= 1) {
        const _path = basePath.concat([index - 1]);
        const path = escapePath(_path, pathAsArray);
        inversePatches.push({
          op: Operation.Remove,
          path
        });
      }
    }
  }
}
__name(generateArrayPatches, "generateArrayPatches");
function generatePatchesFromAssigned({ original, copy, assignedMap }, basePath, patches, inversePatches, pathAsArray) {
  assignedMap.forEach((assignedValue, key) => {
    const originalValue = get(original, key);
    const value = cloneIfNeeded(get(copy, key));
    const op = !assignedValue ? Operation.Remove : has(original, key) ? Operation.Replace : Operation.Add;
    if (isEqual(originalValue, value) && op === Operation.Replace)
      return;
    const _path = basePath.concat(key);
    const path = escapePath(_path, pathAsArray);
    patches.push(op === Operation.Remove ? { op, path } : { op, path, value });
    inversePatches.push(op === Operation.Add ? { op: Operation.Remove, path } : op === Operation.Remove ? { op: Operation.Add, path, value: originalValue } : { op: Operation.Replace, path, value: originalValue });
  });
}
__name(generatePatchesFromAssigned, "generatePatchesFromAssigned");
function generateSetPatches({ original, copy }, basePath, patches, inversePatches, pathAsArray) {
  let index = 0;
  original.forEach((value) => {
    if (!copy.has(value)) {
      const _path = basePath.concat([index]);
      const path = escapePath(_path, pathAsArray);
      patches.push({
        op: Operation.Remove,
        path,
        value
      });
      inversePatches.unshift({
        op: Operation.Add,
        path,
        value
      });
    }
    index += 1;
  });
  index = 0;
  copy.forEach((value) => {
    if (!original.has(value)) {
      const _path = basePath.concat([index]);
      const path = escapePath(_path, pathAsArray);
      patches.push({
        op: Operation.Add,
        path,
        value
      });
      inversePatches.unshift({
        op: Operation.Remove,
        path,
        value
      });
    }
    index += 1;
  });
}
__name(generateSetPatches, "generateSetPatches");
function generatePatches(proxyState, basePath, patches, inversePatches) {
  const { pathAsArray = true } = proxyState.options.enablePatches;
  switch (proxyState.type) {
    case 0:
    case 2:
      return generatePatchesFromAssigned(proxyState, basePath, patches, inversePatches, pathAsArray);
    case 1:
      return generateArrayPatches(proxyState, basePath, patches, inversePatches, pathAsArray);
    case 3:
      return generateSetPatches(proxyState, basePath, patches, inversePatches, pathAsArray);
  }
}
__name(generatePatches, "generatePatches");
var readable = false;
var checkReadable = /* @__PURE__ */ __name((value, options, ignoreCheckDraftable = false) => {
  if (typeof value === "object" && value !== null && (!isDraftable(value, options) || ignoreCheckDraftable) && !readable) {
    throw new Error(`Strict mode: Mutable data cannot be accessed directly, please use 'unsafe(callback)' wrap.`);
  }
}, "checkReadable");
var mapHandler = {
  get size() {
    const current2 = latest(getProxyDraft(this));
    return current2.size;
  },
  has(key) {
    return latest(getProxyDraft(this)).has(key);
  },
  set(key, value) {
    const target = getProxyDraft(this);
    const source = latest(target);
    if (!source.has(key) || !isEqual(source.get(key), value)) {
      ensureShallowCopy(target);
      markChanged(target);
      target.assignedMap.set(key, true);
      target.copy.set(key, value);
      markFinalization(target, key, value, generatePatches);
    }
    return this;
  },
  delete(key) {
    if (!this.has(key)) {
      return false;
    }
    const target = getProxyDraft(this);
    ensureShallowCopy(target);
    markChanged(target);
    if (target.original.has(key)) {
      target.assignedMap.set(key, false);
    } else {
      target.assignedMap.delete(key);
    }
    target.copy.delete(key);
    return true;
  },
  clear() {
    const target = getProxyDraft(this);
    if (!this.size)
      return;
    ensureShallowCopy(target);
    markChanged(target);
    target.assignedMap = /* @__PURE__ */ new Map();
    for (const [key] of target.original) {
      target.assignedMap.set(key, false);
    }
    target.copy.clear();
  },
  forEach(callback, thisArg) {
    const target = getProxyDraft(this);
    latest(target).forEach((_value, _key) => {
      callback.call(thisArg, this.get(_key), _key, this);
    });
  },
  get(key) {
    var _a, _b;
    const target = getProxyDraft(this);
    const value = latest(target).get(key);
    const mutable = ((_b = (_a = target.options).mark) === null || _b === void 0 ? void 0 : _b.call(_a, value, dataTypes)) === dataTypes.mutable;
    if (target.options.strict) {
      checkReadable(value, target.options, mutable);
    }
    if (mutable) {
      return value;
    }
    if (target.finalized || !isDraftable(value, target.options)) {
      return value;
    }
    if (value !== target.original.get(key)) {
      return value;
    }
    const draft = internal.createDraft({
      original: value,
      parentDraft: target,
      key,
      finalities: target.finalities,
      options: target.options
    });
    ensureShallowCopy(target);
    target.copy.set(key, draft);
    return draft;
  },
  keys() {
    return latest(getProxyDraft(this)).keys();
  },
  values() {
    const iterator = this.keys();
    return {
      [iteratorSymbol]: () => this.values(),
      next: /* @__PURE__ */ __name(() => {
        const result = iterator.next();
        if (result.done)
          return result;
        const value = this.get(result.value);
        return {
          done: false,
          value
        };
      }, "next")
    };
  },
  entries() {
    const iterator = this.keys();
    return {
      [iteratorSymbol]: () => this.entries(),
      next: /* @__PURE__ */ __name(() => {
        const result = iterator.next();
        if (result.done)
          return result;
        const value = this.get(result.value);
        return {
          done: false,
          value: [result.value, value]
        };
      }, "next")
    };
  },
  [iteratorSymbol]() {
    return this.entries();
  }
};
var mapHandlerKeys = Reflect.ownKeys(mapHandler);
var getNextIterator = /* @__PURE__ */ __name((target, iterator, { isValuesIterator }) => () => {
  var _a, _b;
  const result = iterator.next();
  if (result.done)
    return result;
  const key = result.value;
  let value = target.setMap.get(key);
  const currentDraft = getProxyDraft(value);
  const mutable = ((_b = (_a = target.options).mark) === null || _b === void 0 ? void 0 : _b.call(_a, value, dataTypes)) === dataTypes.mutable;
  if (target.options.strict) {
    checkReadable(key, target.options, mutable);
  }
  if (!mutable && !currentDraft && isDraftable(key, target.options) && !target.finalized && target.original.has(key)) {
    const proxy = internal.createDraft({
      original: key,
      parentDraft: target,
      key,
      finalities: target.finalities,
      options: target.options
    });
    target.setMap.set(key, proxy);
    value = proxy;
  } else if (currentDraft) {
    value = currentDraft.proxy;
  }
  return {
    done: false,
    value: isValuesIterator ? value : [value, value]
  };
}, "getNextIterator");
var setHandler = {
  get size() {
    const target = getProxyDraft(this);
    return target.setMap.size;
  },
  has(value) {
    const target = getProxyDraft(this);
    if (target.setMap.has(value))
      return true;
    ensureShallowCopy(target);
    const valueProxyDraft = getProxyDraft(value);
    if (valueProxyDraft && target.setMap.has(valueProxyDraft.original))
      return true;
    return false;
  },
  add(value) {
    const target = getProxyDraft(this);
    if (!this.has(value)) {
      ensureShallowCopy(target);
      markChanged(target);
      target.assignedMap.set(value, true);
      target.setMap.set(value, value);
      markFinalization(target, value, value, generatePatches);
    }
    return this;
  },
  delete(value) {
    if (!this.has(value)) {
      return false;
    }
    const target = getProxyDraft(this);
    ensureShallowCopy(target);
    markChanged(target);
    const valueProxyDraft = getProxyDraft(value);
    if (valueProxyDraft && target.setMap.has(valueProxyDraft.original)) {
      target.assignedMap.set(valueProxyDraft.original, false);
      return target.setMap.delete(valueProxyDraft.original);
    }
    if (!valueProxyDraft && target.setMap.has(value)) {
      target.assignedMap.set(value, false);
    } else {
      target.assignedMap.delete(value);
    }
    return target.setMap.delete(value);
  },
  clear() {
    if (!this.size)
      return;
    const target = getProxyDraft(this);
    ensureShallowCopy(target);
    markChanged(target);
    for (const value of target.original) {
      target.assignedMap.set(value, false);
    }
    target.setMap.clear();
  },
  values() {
    const target = getProxyDraft(this);
    ensureShallowCopy(target);
    const iterator = target.setMap.keys();
    return {
      [Symbol.iterator]: () => this.values(),
      next: getNextIterator(target, iterator, { isValuesIterator: true })
    };
  },
  entries() {
    const target = getProxyDraft(this);
    ensureShallowCopy(target);
    const iterator = target.setMap.keys();
    return {
      [Symbol.iterator]: () => this.entries(),
      next: getNextIterator(target, iterator, {
        isValuesIterator: false
      })
    };
  },
  keys() {
    return this.values();
  },
  [iteratorSymbol]() {
    return this.values();
  },
  forEach(callback, thisArg) {
    const iterator = this.values();
    let result = iterator.next();
    while (!result.done) {
      callback.call(thisArg, result.value, result.value, this);
      result = iterator.next();
    }
  }
};
if (Set.prototype.difference) {
  Object.assign(setHandler, {
    intersection(other) {
      return Set.prototype.intersection.call(new Set(this.values()), other);
    },
    union(other) {
      return Set.prototype.union.call(new Set(this.values()), other);
    },
    difference(other) {
      return Set.prototype.difference.call(new Set(this.values()), other);
    },
    symmetricDifference(other) {
      return Set.prototype.symmetricDifference.call(new Set(this.values()), other);
    },
    isSubsetOf(other) {
      return Set.prototype.isSubsetOf.call(new Set(this.values()), other);
    },
    isSupersetOf(other) {
      return Set.prototype.isSupersetOf.call(new Set(this.values()), other);
    },
    isDisjointFrom(other) {
      return Set.prototype.isDisjointFrom.call(new Set(this.values()), other);
    }
  });
}
var setHandlerKeys = Reflect.ownKeys(setHandler);
var proxyHandler = {
  get(target, key, receiver) {
    var _a, _b;
    const copy = (_a = target.copy) === null || _a === void 0 ? void 0 : _a[key];
    if (copy && target.finalities.draftsCache.has(copy)) {
      return copy;
    }
    if (key === PROXY_DRAFT)
      return target;
    let markResult;
    if (target.options.mark) {
      const value2 = key === "size" && (target.original instanceof Map || target.original instanceof Set) ? Reflect.get(target.original, key) : Reflect.get(target.original, key, receiver);
      markResult = target.options.mark(value2, dataTypes);
      if (markResult === dataTypes.mutable) {
        if (target.options.strict) {
          checkReadable(value2, target.options, true);
        }
        return value2;
      }
    }
    const source = latest(target);
    if (source instanceof Map && mapHandlerKeys.includes(key)) {
      if (key === "size") {
        return Object.getOwnPropertyDescriptor(mapHandler, "size").get.call(target.proxy);
      }
      const handle = mapHandler[key];
      return handle.bind(target.proxy);
    }
    if (source instanceof Set && setHandlerKeys.includes(key)) {
      if (key === "size") {
        return Object.getOwnPropertyDescriptor(setHandler, "size").get.call(target.proxy);
      }
      const handle = setHandler[key];
      return handle.bind(target.proxy);
    }
    if (!has(source, key)) {
      const desc = getDescriptor(source, key);
      return desc ? `value` in desc ? desc.value : (
        // !case: support for getter
        (_b = desc.get) === null || _b === void 0 ? void 0 : _b.call(target.proxy)
      ) : void 0;
    }
    const value = source[key];
    if (target.options.strict) {
      checkReadable(value, target.options);
    }
    if (target.finalized || !isDraftable(value, target.options)) {
      return value;
    }
    if (value === peek(target.original, key)) {
      ensureShallowCopy(target);
      target.copy[key] = createDraft({
        original: target.original[key],
        parentDraft: target,
        key: target.type === 1 ? Number(key) : key,
        finalities: target.finalities,
        options: target.options
      });
      if (typeof markResult === "function") {
        const subProxyDraft = getProxyDraft(target.copy[key]);
        ensureShallowCopy(subProxyDraft);
        markChanged(subProxyDraft);
        return subProxyDraft.copy;
      }
      return target.copy[key];
    }
    if (isDraft(value)) {
      target.finalities.draftsCache.add(value);
    }
    return value;
  },
  set(target, key, value) {
    var _a;
    if (target.type === 3 || target.type === 2) {
      throw new Error(`Map/Set draft does not support any property assignment.`);
    }
    let _key;
    if (target.type === 1 && key !== "length" && !(Number.isInteger(_key = Number(key)) && _key >= 0 && (key === 0 || _key === 0 || String(_key) === String(key)))) {
      throw new Error(`Only supports setting array indices and the 'length' property.`);
    }
    const desc = getDescriptor(latest(target), key);
    if (desc === null || desc === void 0 ? void 0 : desc.set) {
      desc.set.call(target.proxy, value);
      return true;
    }
    const current2 = peek(latest(target), key);
    const currentProxyDraft = getProxyDraft(current2);
    if (currentProxyDraft && isEqual(currentProxyDraft.original, value)) {
      target.copy[key] = value;
      target.assignedMap = (_a = target.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
      target.assignedMap.set(key, false);
      return true;
    }
    if (isEqual(value, current2) && (value !== void 0 || has(target.original, key)))
      return true;
    ensureShallowCopy(target);
    markChanged(target);
    if (has(target.original, key) && isEqual(value, target.original[key])) {
      target.assignedMap.delete(key);
    } else {
      target.assignedMap.set(key, true);
    }
    target.copy[key] = value;
    markFinalization(target, key, value, generatePatches);
    return true;
  },
  has(target, key) {
    return key in latest(target);
  },
  ownKeys(target) {
    return Reflect.ownKeys(latest(target));
  },
  getOwnPropertyDescriptor(target, key) {
    const source = latest(target);
    const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
    if (!descriptor)
      return descriptor;
    return {
      writable: true,
      configurable: target.type !== 1 || key !== "length",
      enumerable: descriptor.enumerable,
      value: source[key]
    };
  },
  getPrototypeOf(target) {
    return Reflect.getPrototypeOf(target.original);
  },
  setPrototypeOf() {
    throw new Error(`Cannot call 'setPrototypeOf()' on drafts`);
  },
  defineProperty() {
    throw new Error(`Cannot call 'defineProperty()' on drafts`);
  },
  deleteProperty(target, key) {
    var _a;
    if (target.type === 1) {
      return proxyHandler.set.call(this, target, key, void 0, target.proxy);
    }
    if (peek(target.original, key) !== void 0 || key in target.original) {
      ensureShallowCopy(target);
      markChanged(target);
      target.assignedMap.set(key, false);
    } else {
      target.assignedMap = (_a = target.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
      target.assignedMap.delete(key);
    }
    if (target.copy)
      delete target.copy[key];
    return true;
  }
};
function createDraft(createDraftOptions) {
  const { original, parentDraft, key, finalities, options } = createDraftOptions;
  const type = getType(original);
  const proxyDraft = {
    type,
    finalized: false,
    parent: parentDraft,
    original,
    copy: null,
    proxy: null,
    finalities,
    options,
    // Mapping of draft Set items to their corresponding draft values.
    setMap: type === 3 ? new Map(original.entries()) : void 0
  };
  if (key || "key" in createDraftOptions) {
    proxyDraft.key = key;
  }
  const { proxy, revoke } = Proxy.revocable(type === 1 ? Object.assign([], proxyDraft) : proxyDraft, proxyHandler);
  finalities.revoke.push(revoke);
  proxyDraft.proxy = proxy;
  if (parentDraft) {
    const target = parentDraft;
    target.finalities.draft.push((patches, inversePatches) => {
      var _a, _b;
      const oldProxyDraft = getProxyDraft(proxy);
      let copy = target.type === 3 ? target.setMap : target.copy;
      const draft = get(copy, key);
      const proxyDraft2 = getProxyDraft(draft);
      if (proxyDraft2) {
        let updatedValue = proxyDraft2.original;
        if (proxyDraft2.operated) {
          updatedValue = getValue(draft);
        }
        finalizeSetValue(proxyDraft2);
        finalizePatches(proxyDraft2, generatePatches, patches, inversePatches);
        if (target.options.enableAutoFreeze) {
          target.options.updatedValues = (_a = target.options.updatedValues) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new WeakMap();
          target.options.updatedValues.set(updatedValue, proxyDraft2.original);
        }
        set(copy, key, updatedValue);
      }
      (_b = oldProxyDraft.callbacks) === null || _b === void 0 ? void 0 : _b.forEach((callback) => {
        callback(patches, inversePatches);
      });
    });
  } else {
    const target = getProxyDraft(proxy);
    target.finalities.draft.push((patches, inversePatches) => {
      finalizeSetValue(target);
      finalizePatches(target, generatePatches, patches, inversePatches);
    });
  }
  return proxy;
}
__name(createDraft, "createDraft");
internal.createDraft = createDraft;
function finalizeDraft(result, returnedValue, patches, inversePatches, enableAutoFreeze) {
  var _a;
  const proxyDraft = getProxyDraft(result);
  const original = (_a = proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== null && _a !== void 0 ? _a : result;
  const hasReturnedValue = !!returnedValue.length;
  if (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.operated) {
    while (proxyDraft.finalities.draft.length > 0) {
      const finalize = proxyDraft.finalities.draft.pop();
      finalize(patches, inversePatches);
    }
  }
  const state = hasReturnedValue ? returnedValue[0] : proxyDraft ? proxyDraft.operated ? proxyDraft.copy : proxyDraft.original : result;
  if (proxyDraft)
    revokeProxy(proxyDraft);
  if (enableAutoFreeze) {
    deepFreeze(state, state, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options.updatedValues);
  }
  return [
    state,
    patches && hasReturnedValue ? [{ op: Operation.Replace, path: [], value: returnedValue[0] }] : patches,
    inversePatches && hasReturnedValue ? [{ op: Operation.Replace, path: [], value: original }] : inversePatches
  ];
}
__name(finalizeDraft, "finalizeDraft");
function draftify(baseState, options) {
  var _a;
  const finalities = {
    draft: [],
    revoke: [],
    handledSet: /* @__PURE__ */ new WeakSet(),
    draftsCache: /* @__PURE__ */ new WeakSet()
  };
  let patches;
  let inversePatches;
  if (options.enablePatches) {
    patches = [];
    inversePatches = [];
  }
  const isMutable = ((_a = options.mark) === null || _a === void 0 ? void 0 : _a.call(options, baseState, dataTypes)) === dataTypes.mutable || !isDraftable(baseState, options);
  const draft = isMutable ? baseState : createDraft({
    original: baseState,
    parentDraft: null,
    finalities,
    options
  });
  return [
    draft,
    (returnedValue = []) => {
      const [finalizedState, finalizedPatches, finalizedInversePatches] = finalizeDraft(draft, returnedValue, patches, inversePatches, options.enableAutoFreeze);
      return options.enablePatches ? [finalizedState, finalizedPatches, finalizedInversePatches] : finalizedState;
    }
  ];
}
__name(draftify, "draftify");
function handleReturnValue(options) {
  const { rootDraft, value, useRawReturn = false, isRoot = true } = options;
  forEach(value, (key, item, source) => {
    const proxyDraft = getProxyDraft(item);
    if (proxyDraft && rootDraft && proxyDraft.finalities === rootDraft.finalities) {
      options.isContainDraft = true;
      const currentValue = proxyDraft.original;
      if (source instanceof Set) {
        const arr = Array.from(source);
        source.clear();
        arr.forEach((_item) => source.add(key === _item ? currentValue : _item));
      } else {
        set(source, key, currentValue);
      }
    } else if (typeof item === "object" && item !== null) {
      options.value = item;
      options.isRoot = false;
      handleReturnValue(options);
    }
  });
  if (isRoot) {
    if (!options.isContainDraft)
      console.warn(`The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance.`);
    if (useRawReturn) {
      console.warn(`The return value contains drafts, please don't use 'rawReturn()' to wrap the return value.`);
    }
  }
}
__name(handleReturnValue, "handleReturnValue");
function getCurrent(target) {
  var _a;
  const proxyDraft = getProxyDraft(target);
  if (!isDraftable(target, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options))
    return target;
  const type = getType(target);
  if (proxyDraft && !proxyDraft.operated)
    return proxyDraft.original;
  let currentValue;
  function ensureShallowCopy2() {
    currentValue = type === 2 ? !isBaseMapInstance(target) ? new (Object.getPrototypeOf(target)).constructor(target) : new Map(target) : type === 3 ? Array.from(proxyDraft.setMap.values()) : shallowCopy(target, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options);
  }
  __name(ensureShallowCopy2, "ensureShallowCopy");
  if (proxyDraft) {
    proxyDraft.finalized = true;
    try {
      ensureShallowCopy2();
    } finally {
      proxyDraft.finalized = false;
    }
  } else {
    currentValue = target;
  }
  forEach(currentValue, (key, value) => {
    if (proxyDraft && isEqual(get(proxyDraft.original, key), value))
      return;
    const newValue = getCurrent(value);
    if (newValue !== value) {
      if (currentValue === target)
        ensureShallowCopy2();
      set(currentValue, key, newValue);
    }
  });
  if (type === 3) {
    const value = (_a = proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== null && _a !== void 0 ? _a : currentValue;
    return !isBaseSetInstance(value) ? new (Object.getPrototypeOf(value)).constructor(currentValue) : new Set(currentValue);
  }
  return currentValue;
}
__name(getCurrent, "getCurrent");
function current(target) {
  if (!isDraft(target)) {
    throw new Error(`current() is only used for Draft, parameter: ${target}`);
  }
  return getCurrent(target);
}
__name(current, "current");
var makeCreator = /* @__PURE__ */ __name((arg) => {
  if (arg !== void 0 && Object.prototype.toString.call(arg) !== "[object Object]") {
    throw new Error(`Invalid options: ${String(arg)}, 'options' should be an object.`);
  }
  return /* @__PURE__ */ __name(function create2(arg0, arg1, arg2) {
    var _a, _b, _c;
    if (typeof arg0 === "function" && typeof arg1 !== "function") {
      return function(base2, ...args) {
        return create2(base2, (draft2) => arg0.call(this, draft2, ...args), arg1);
      };
    }
    const base = arg0;
    const mutate = arg1;
    let options = arg2;
    if (typeof arg1 !== "function") {
      options = arg1;
    }
    if (options !== void 0 && Object.prototype.toString.call(options) !== "[object Object]") {
      throw new Error(`Invalid options: ${options}, 'options' should be an object.`);
    }
    options = Object.assign(Object.assign({}, arg), options);
    const state = isDraft(base) ? current(base) : base;
    const mark = Array.isArray(options.mark) ? ((value, types) => {
      for (const mark2 of options.mark) {
        if (typeof mark2 !== "function") {
          throw new Error(`Invalid mark: ${mark2}, 'mark' should be a function.`);
        }
        const result2 = mark2(value, types);
        if (result2) {
          return result2;
        }
      }
      return;
    }) : options.mark;
    const enablePatches = (_a = options.enablePatches) !== null && _a !== void 0 ? _a : false;
    const strict = (_b = options.strict) !== null && _b !== void 0 ? _b : false;
    const enableAutoFreeze = (_c = options.enableAutoFreeze) !== null && _c !== void 0 ? _c : false;
    const _options = {
      enableAutoFreeze,
      mark,
      strict,
      enablePatches
    };
    if (!isDraftable(state, _options) && typeof state === "object" && state !== null) {
      throw new Error(`Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.`);
    }
    const [draft, finalize] = draftify(state, _options);
    if (typeof arg1 !== "function") {
      if (!isDraftable(state, _options)) {
        throw new Error(`Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.`);
      }
      return [draft, finalize];
    }
    let result;
    try {
      result = mutate(draft);
    } catch (error) {
      revokeProxy(getProxyDraft(draft));
      throw error;
    }
    const returnValue = /* @__PURE__ */ __name((value) => {
      const proxyDraft = getProxyDraft(draft);
      if (!isDraft(value)) {
        if (value !== void 0 && !isEqual(value, draft) && (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.operated)) {
          throw new Error(`Either the value is returned as a new non-draft value, or only the draft is modified without returning any value.`);
        }
        const rawReturnValue = value === null || value === void 0 ? void 0 : value[RAW_RETURN_SYMBOL];
        if (rawReturnValue) {
          const _value = rawReturnValue[0];
          if (_options.strict && typeof value === "object" && value !== null) {
            handleReturnValue({
              rootDraft: proxyDraft,
              value,
              useRawReturn: true
            });
          }
          return finalize([_value]);
        }
        if (value !== void 0) {
          if (typeof value === "object" && value !== null) {
            handleReturnValue({ rootDraft: proxyDraft, value });
          }
          return finalize([value]);
        }
      }
      if (value === draft || value === void 0) {
        return finalize([]);
      }
      const returnedProxyDraft = getProxyDraft(value);
      if (_options === returnedProxyDraft.options) {
        if (returnedProxyDraft.operated) {
          throw new Error(`Cannot return a modified child draft.`);
        }
        return finalize([current(value)]);
      }
      return finalize([value]);
    }, "returnValue");
    if (result instanceof Promise) {
      return result.then(returnValue, (error) => {
        revokeProxy(getProxyDraft(draft));
        throw error;
      });
    }
    return returnValue(result);
  }, "create");
}, "makeCreator");
var create = makeCreator();
var constructorString = Object.prototype.constructor.toString();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/object.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/dates.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/pgtime.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/id.js
init_modules_watch_stub();
function id() {
  return v4_default();
}
__name(id, "id");
var id_default = id;

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/strings.js
init_modules_watch_stub();
function fallbackCompareStrings(a, b) {
  return a.localeCompare(b);
}
__name(fallbackCompareStrings, "fallbackCompareStrings");
function makeCompareStringsFn() {
  let compareStrings = fallbackCompareStrings;
  if (typeof Intl === "object" && Intl.hasOwnProperty("Collator")) {
    try {
      const collator = Intl.Collator("en-US");
      compareStrings = collator.compare;
    } catch (_e) {
    }
  }
  return compareStrings;
}
__name(makeCompareStringsFn, "makeCompareStringsFn");
var stringCompare = makeCompareStringsFn();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/warningToggle.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/instaml.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/instatx.js
init_modules_watch_stub();
function getAllTransactionChunkKeys() {
  const v = 1;
  const _dummy = {
    __etype: v,
    __ops: v,
    create: v,
    update: v,
    link: v,
    unlink: v,
    delete: v,
    merge: v,
    ruleParams: v
  };
  return new Set(Object.keys(_dummy));
}
__name(getAllTransactionChunkKeys, "getAllTransactionChunkKeys");
var allTransactionChunkKeys = getAllTransactionChunkKeys();
function transactionChunk(etype, id2, prevOps) {
  const target = {
    __etype: etype,
    __ops: prevOps
  };
  return new Proxy(target, {
    get: /* @__PURE__ */ __name((_target, cmd) => {
      if (cmd === "__ops")
        return prevOps;
      if (cmd === "__etype")
        return etype;
      if (!allTransactionChunkKeys.has(cmd)) {
        return void 0;
      }
      return (args, opts) => {
        return transactionChunk(etype, id2, [
          ...prevOps,
          opts ? [cmd, etype, id2, args, opts] : [cmd, etype, id2, args]
        ]);
      };
    }, "get")
  });
}
__name(transactionChunk, "transactionChunk");
function lookup(attribute, value) {
  return `lookup__${attribute}__${JSON.stringify(value)}`;
}
__name(lookup, "lookup");
function isLookup(k) {
  return k.startsWith("lookup__");
}
__name(isLookup, "isLookup");
function parseLookup(k) {
  const [_, attribute, ...vJSON] = k.split("__");
  return [attribute, JSON.parse(vJSON.join("__"))];
}
__name(parseLookup, "parseLookup");
function etypeChunk(etype) {
  return new Proxy({
    __etype: etype
  }, {
    get(_target, cmd) {
      if (cmd === "lookup") {
        return (attrName, value) => transactionChunk(etype, parseLookup(lookup(attrName, value)), []);
      }
      if (cmd === "__etype")
        return etype;
      const id2 = cmd;
      if (isLookup(id2)) {
        return transactionChunk(etype, parseLookup(id2), []);
      }
      return transactionChunk(etype, id2, []);
    }
  });
}
__name(etypeChunk, "etypeChunk");
function txInit() {
  return new Proxy({}, {
    get(_target, ns) {
      return etypeChunk(ns);
    }
  });
}
__name(txInit, "txInit");
var tx = txInit();
function getOps(x) {
  return x.__ops;
}
__name(getOps, "getOps");

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/instaml.js
var lookupProps = { "unique?": true, "index?": true };
var refLookupProps = {
  ...lookupProps,
  cardinality: "one"
};

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/IndexedDBStorage.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/WindowNetworkListener.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/authAPI.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/fetch.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/InstantError.js
init_modules_watch_stub();
var InstantError = class _InstantError extends Error {
  static {
    __name(this, "InstantError");
  }
  hint;
  traceId;
  constructor(message, hint, traceId) {
    super(message);
    this.hint = hint;
    if (traceId) {
      this.traceId = traceId;
    }
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _InstantError);
    }
    this.name = "InstantError";
  }
  get [Symbol.toStringTag]() {
    return "InstantError";
  }
};

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/fetch.js
var InstantAPIError = class _InstantAPIError extends InstantError {
  static {
    __name(this, "InstantAPIError");
  }
  body;
  status;
  constructor(error) {
    const message = error.body?.message || `API Error (${error.status})`;
    super(message, error.body.hint, error.body["trace-id"]);
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _InstantAPIError);
    }
    this.name = "InstantAPIError";
    this.status = error.status;
    this.body = error.body;
  }
  get [Symbol.toStringTag]() {
    return "InstantAPIError";
  }
};

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/StorageAPI.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/flags.js
init_modules_watch_stub();
var devBackend = false;
var instantLogs = false;
var devtoolLocalDashboard = false;
if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
  devBackend = !!window.localStorage.getItem("devBackend");
  instantLogs = !!window.localStorage.getItem("__instantLogging");
  devtoolLocalDashboard = !!window.localStorage.getItem("__devtoolLocalDash");
}

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/presence.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/pick.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/Deferred.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/model/instaqlResult.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/linkIndex.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/version.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+version@0.22.171/node_modules/@instantdb/version/dist/esm/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+version@0.22.171/node_modules/@instantdb/version/dist/esm/version.js
init_modules_watch_stub();
var version = "v0.22.171";

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/version.js
var version_default = version;

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/log.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/queryValidation.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/schemaTypes.js
init_modules_watch_stub();
var DataAttrDef = class _DataAttrDef {
  static {
    __name(this, "DataAttrDef");
  }
  valueType;
  required;
  isIndexed;
  config;
  metadata = {};
  constructor(valueType, required, isIndexed, config = { indexed: false, unique: false }) {
    this.valueType = valueType;
    this.required = required;
    this.isIndexed = isIndexed;
    this.config = config;
  }
  /**
   * @deprecated Only use this temporarily for attributes that you want
   * to treat as required in frontend code but can’t yet mark as required
   * and enforced for backend
   */
  clientRequired() {
    return new _DataAttrDef(this.valueType, false, this.isIndexed, this.config);
  }
  optional() {
    return new _DataAttrDef(this.valueType, false, this.isIndexed, this.config);
  }
  unique() {
    return new _DataAttrDef(this.valueType, this.required, this.isIndexed, {
      ...this.config,
      unique: true
    });
  }
  indexed() {
    return new _DataAttrDef(this.valueType, this.required, true, {
      ...this.config,
      indexed: true
    });
  }
};
var EntityDef = class _EntityDef {
  static {
    __name(this, "EntityDef");
  }
  attrs;
  links;
  constructor(attrs, links) {
    this.attrs = attrs;
    this.links = links;
  }
  asType() {
    return new _EntityDef(this.attrs, this.links);
  }
};
var InstantSchemaDef = class _InstantSchemaDef {
  static {
    __name(this, "InstantSchemaDef");
  }
  entities;
  links;
  rooms;
  constructor(entities, links, rooms) {
    this.entities = entities;
    this.links = links;
    this.rooms = rooms;
  }
  /**
   * @deprecated
   * `withRoomSchema` is deprecated. Define your schema in `rooms` directly:
   *
   * @example
   * // Before:
   * const schema = i.schema({
   *   // ...
   * }).withRoomSchema<RoomSchema>()
   *
   * // After
   * const schema = i.schema({
   *  rooms: {
   *    // ...
   *  }
   * })
   *
   * @see https://instantdb.com/docs/presence-and-topics#typesafety
   */
  withRoomSchema() {
    return new _InstantSchemaDef(this.entities, this.links, {});
  }
};

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/queryValidation.js
var QueryValidationError = class extends Error {
  static {
    __name(this, "QueryValidationError");
  }
  constructor(message, path) {
    const fullMessage = path ? `At path '${path}': ${message}` : message;
    super(fullMessage);
    this.name = "QueryValidationError";
  }
};
var dollarSignKeys = [
  "where",
  "order",
  "limit",
  "last",
  "first",
  "offset",
  "after",
  "afterInclusive",
  "before",
  "beforeInclusive",
  "fields",
  "aggregate"
];
var getAttrType = /* @__PURE__ */ __name((attrDef) => {
  return attrDef.valueType || "unknown";
}, "getAttrType");
var isValidValueForType = /* @__PURE__ */ __name((value, expectedType, isAnyType = false) => {
  if (isAnyType)
    return true;
  if (value === null || value === void 0)
    return true;
  switch (expectedType) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "boolean":
      return typeof value === "boolean";
    case "date":
      return value instanceof Date || typeof value === "string" || typeof value === "number";
    default:
      return true;
  }
}, "isValidValueForType");
var validateOperator = /* @__PURE__ */ __name((op, opValue, expectedType, attrName, entityName, attrDef, path) => {
  const isAnyType = attrDef.valueType === "json";
  const assertValidValue = /* @__PURE__ */ __name((op2, expectedType2, opValue2) => {
    if (!isValidValueForType(opValue2, expectedType2, isAnyType)) {
      throw new QueryValidationError(`Invalid value for operator '${op2}' on attribute '${attrName}' in entity '${entityName}'. Expected ${expectedType2}, but received: ${typeof opValue2}`, path);
    }
  }, "assertValidValue");
  switch (op) {
    case "in":
    case "$in":
      if (!Array.isArray(opValue)) {
        throw new QueryValidationError(`Operator '${op}' for attribute '${attrName}' in entity '${entityName}' must be an array, but received: ${typeof opValue}`, path);
      }
      for (const item of opValue) {
        assertValidValue(op, expectedType, item);
      }
      break;
    case "$not":
    case "$ne":
    case "$gt":
    case "$lt":
    case "$gte":
    case "$lte":
      assertValidValue(op, expectedType, opValue);
      break;
    case "$like":
    case "$ilike":
      assertValidValue(op, "string", opValue);
      if (op === "$ilike") {
        if (!attrDef.isIndexed) {
          throw new QueryValidationError(`Operator '${op}' can only be used with indexed attributes, but '${attrName}' in entity '${entityName}' is not indexed`, path);
        }
      }
      break;
    case "$isNull":
      assertValidValue(op, "boolean", opValue);
      break;
    default:
      throw new QueryValidationError(`Unknown operator '${op}' for attribute '${attrName}' in entity '${entityName}'`, path);
  }
}, "validateOperator");
var validateWhereClauseValue = /* @__PURE__ */ __name((value, attrName, attrDef, entityName, path) => {
  const expectedType = getAttrType(attrDef);
  const isAnyType = attrDef.valueType === "json";
  const isComplexObject = typeof value === "object" && value !== null && !Array.isArray(value);
  if (isComplexObject) {
    if (isAnyType) {
      return;
    }
    const operators = value;
    for (const [op, opValue] of Object.entries(operators)) {
      validateOperator(op, opValue, expectedType, attrName, entityName, attrDef, `${path}.${op}`);
    }
  } else {
    if (!isValidValueForType(value, expectedType, isAnyType)) {
      throw new QueryValidationError(`Invalid value for attribute '${attrName}' in entity '${entityName}'. Expected ${expectedType}, but received: ${typeof value}`, path);
    }
  }
}, "validateWhereClauseValue");
var validateDotNotationAttribute = /* @__PURE__ */ __name((dotPath, value, startEntityName, schema2, path) => {
  const pathParts = dotPath.split(".");
  if (pathParts.length < 2) {
    throw new QueryValidationError(`Invalid dot notation path '${dotPath}'. Must contain at least one dot.`, path);
  }
  let currentEntityName = startEntityName;
  for (let i2 = 0; i2 < pathParts.length - 1; i2++) {
    const linkName = pathParts[i2];
    const currentEntity = schema2.entities[currentEntityName];
    if (!currentEntity) {
      throw new QueryValidationError(`Entity '${currentEntityName}' does not exist in schema while traversing dot notation path '${dotPath}'.`, path);
    }
    const link = currentEntity.links[linkName];
    if (!link) {
      const availableLinks = Object.keys(currentEntity.links);
      throw new QueryValidationError(`Link '${linkName}' does not exist on entity '${currentEntityName}' in dot notation path '${dotPath}'. Available links: ${availableLinks.length > 0 ? availableLinks.join(", ") : "none"}`, path);
    }
    currentEntityName = link.entityName;
  }
  const finalAttrName = pathParts[pathParts.length - 1];
  const finalEntity = schema2.entities[currentEntityName];
  if (!finalEntity) {
    throw new QueryValidationError(`Target entity '${currentEntityName}' does not exist in schema for dot notation path '${dotPath}'.`, path);
  }
  if (finalAttrName === "id") {
    if (typeof value == "string" && !validate_default(value)) {
      throw new QueryValidationError(`Invalid value for id field in entity '${currentEntityName}'. Expected a UUID, but received: ${value}`, path);
    }
    validateWhereClauseValue(value, dotPath, new DataAttrDef("string", false, true), startEntityName, path);
    return;
  }
  const attrDef = finalEntity.attrs[finalAttrName];
  if (Object.keys(finalEntity.links).includes(finalAttrName)) {
    if (typeof value === "string" && !validate_default(value)) {
      throw new QueryValidationError(`Invalid value for link '${finalAttrName}' in entity '${currentEntityName}'. Expected a UUID, but received: ${value}`, path);
    }
    validateWhereClauseValue(value, dotPath, new DataAttrDef("string", false, true), startEntityName, path);
    return;
  }
  if (!attrDef) {
    const availableAttrs = Object.keys(finalEntity.attrs);
    throw new QueryValidationError(`Attribute '${finalAttrName}' does not exist on entity '${currentEntityName}' in dot notation path '${dotPath}'. Available attributes: ${availableAttrs.length > 0 ? availableAttrs.join(", ") + ", id" : "id"}`, path);
  }
  validateWhereClauseValue(value, dotPath, attrDef, startEntityName, path);
}, "validateDotNotationAttribute");
var validateWhereClause = /* @__PURE__ */ __name((whereClause, entityName, schema2, path) => {
  for (const [key, value] of Object.entries(whereClause)) {
    if (key === "or" || key === "and") {
      if (Array.isArray(value)) {
        for (const clause of value) {
          if (typeof clause === "object" && clause !== null) {
            validateWhereClause(clause, entityName, schema2, `${path}.${key}[${clause}]`);
          }
        }
      }
      continue;
    }
    if (key === "id") {
      validateWhereClauseValue(value, "id", new DataAttrDef("string", false, true), entityName, `${path}.id`);
      continue;
    }
    if (key.includes(".")) {
      validateDotNotationAttribute(key, value, entityName, schema2, `${path}.${key}`);
      continue;
    }
    const entityDef = schema2.entities[entityName];
    if (!entityDef)
      continue;
    const attrDef = entityDef.attrs[key];
    const linkDef = entityDef.links[key];
    if (!attrDef && !linkDef) {
      const availableAttrs = Object.keys(entityDef.attrs);
      const availableLinks = Object.keys(entityDef.links);
      throw new QueryValidationError(`Attribute or link '${key}' does not exist on entity '${entityName}'. Available attributes: ${availableAttrs.length > 0 ? availableAttrs.join(", ") : "none"}. Available links: ${availableLinks.length > 0 ? availableLinks.join(", ") : "none"}`, `${path}.${key}`);
    }
    if (attrDef) {
      validateWhereClauseValue(value, key, attrDef, entityName, `${path}.${key}`);
    } else if (linkDef) {
      if (typeof value === "string" && !validate_default(value)) {
        throw new QueryValidationError(`Invalid value for link '${key}' in entity '${entityName}'. Expected a UUID, but received: ${value}`, `${path}.${key}`);
      }
      const syntheticAttrDef = new DataAttrDef("string", false, true);
      validateWhereClauseValue(value, key, syntheticAttrDef, entityName, `${path}.${key}`);
    }
  }
}, "validateWhereClause");
var validateDollarObject = /* @__PURE__ */ __name((dollarObj, entityName, schema2, path, depth = 0) => {
  for (const key of Object.keys(dollarObj)) {
    if (!dollarSignKeys.includes(key)) {
      throw new QueryValidationError(`Invalid query parameter '${key}' in $ object. Valid parameters are: ${dollarSignKeys.join(", ")}. Found: ${key}`, path);
    }
  }
  const paginationParams = [
    // 'limit', // only supported client side
    "offset",
    "before",
    "beforeInclusive",
    "after",
    "afterInclusive",
    "first",
    "last"
  ];
  for (const param of paginationParams) {
    if (dollarObj[param] !== void 0 && depth > 0) {
      throw new QueryValidationError(`'${param}' can only be used on top-level namespaces. It cannot be used in nested queries.`, path);
    }
  }
  if (dollarObj.where && schema2) {
    if (typeof dollarObj.where !== "object" || dollarObj.where === null) {
      throw new QueryValidationError(`'where' clause must be an object in entity '${entityName}', but received: ${typeof dollarObj.where}`, path ? `${path}.where` : void 0);
    }
    validateWhereClause(dollarObj.where, entityName, schema2, path ? `${path}.where` : "where");
  }
}, "validateDollarObject");
var validateEntityInQuery = /* @__PURE__ */ __name((queryPart, entityName, schema2, path, depth = 0) => {
  if (!queryPart || typeof queryPart !== "object") {
    throw new QueryValidationError(`Query part for entity '${entityName}' must be an object, but received: ${typeof queryPart}`, path);
  }
  for (const key of Object.keys(queryPart)) {
    if (key !== "$") {
      if (schema2 && !(key in schema2.entities[entityName].links)) {
        const availableLinks = Object.keys(schema2.entities[entityName].links);
        throw new QueryValidationError(`Link '${key}' does not exist on entity '${entityName}'. Available links: ${availableLinks.length > 0 ? availableLinks.join(", ") : "none"}`, `${path}.${key}`);
      }
      const nestedQuery = queryPart[key];
      if (typeof nestedQuery === "object" && nestedQuery !== null) {
        const linkedEntityName = schema2?.entities[entityName].links[key]?.entityName;
        if (linkedEntityName) {
          validateEntityInQuery(nestedQuery, linkedEntityName, schema2, `${path}.${key}`, depth + 1);
        }
      }
    } else {
      const dollarObj = queryPart[key];
      if (typeof dollarObj !== "object" || dollarObj === null) {
        throw new QueryValidationError(`Query parameter '$' must be an object in entity '${entityName}', but received: ${typeof dollarObj}`, `${path}.$`);
      }
      validateDollarObject(dollarObj, entityName, schema2, `${path}.$`, depth);
    }
  }
}, "validateEntityInQuery");
var validateQuery = /* @__PURE__ */ __name((q, schema2) => {
  if (typeof q !== "object" || q === null) {
    throw new QueryValidationError(`Query must be an object, but received: ${typeof q}${q === null ? " (null)" : ""}`);
  }
  if (Array.isArray(q)) {
    throw new QueryValidationError(`Query must be an object, but received: ${typeof q}`);
  }
  const queryObj = q;
  for (const topLevelKey of Object.keys(queryObj)) {
    if (Array.isArray(q[topLevelKey])) {
      throw new QueryValidationError(`Query keys must be strings, but found key of type: ${typeof topLevelKey}`, topLevelKey);
    }
    if (typeof topLevelKey !== "string") {
      throw new QueryValidationError(`Query keys must be strings, but found key of type: ${typeof topLevelKey}`, topLevelKey);
    }
    if (topLevelKey === "$$ruleParams") {
      continue;
    }
    if (schema2) {
      if (!schema2.entities[topLevelKey]) {
        const availableEntities = Object.keys(schema2.entities);
        throw new QueryValidationError(`Entity '${topLevelKey}' does not exist in schema. Available entities: ${availableEntities.length > 0 ? availableEntities.join(", ") : "none"}`, topLevelKey);
      }
    }
    validateEntityInQuery(queryObj[topLevelKey], topLevelKey, schema2, topLevelKey, 0);
  }
}, "validateQuery");

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/transactionValidation.js
init_modules_watch_stub();
var isValidEntityId = /* @__PURE__ */ __name((value) => {
  if (typeof value !== "string") {
    return false;
  }
  if (isLookup(value)) {
    return true;
  }
  return validate_default(value);
}, "isValidEntityId");
var TransactionValidationError = class extends Error {
  static {
    __name(this, "TransactionValidationError");
  }
  constructor(message) {
    super(message);
    this.name = "TransactionValidationError";
  }
};
var formatAvailableOptions = /* @__PURE__ */ __name((items) => items.length > 0 ? items.join(", ") : "none", "formatAvailableOptions");
var createEntityNotFoundError = /* @__PURE__ */ __name((entityName, availableEntities) => new TransactionValidationError(`Entity '${entityName}' does not exist in schema. Available entities: ${formatAvailableOptions(availableEntities)}`), "createEntityNotFoundError");
var TYPE_VALIDATORS = {
  string: /* @__PURE__ */ __name((value) => typeof value === "string", "string"),
  number: /* @__PURE__ */ __name((value) => typeof value === "number" && !isNaN(value), "number"),
  boolean: /* @__PURE__ */ __name((value) => typeof value === "boolean", "boolean"),
  date: /* @__PURE__ */ __name((value) => value instanceof Date || typeof value === "string" || typeof value === "number", "date"),
  json: /* @__PURE__ */ __name(() => true, "json")
};
var isValidValueForAttr = /* @__PURE__ */ __name((value, attrDef) => {
  if (value === null || value === void 0)
    return true;
  return TYPE_VALIDATORS[attrDef.valueType]?.(value) ?? false;
}, "isValidValueForAttr");
var validateEntityExists = /* @__PURE__ */ __name((entityName, schema2) => {
  const entityDef = schema2.entities[entityName];
  if (!entityDef) {
    throw createEntityNotFoundError(entityName, Object.keys(schema2.entities));
  }
  return entityDef;
}, "validateEntityExists");
var validateDataOperation = /* @__PURE__ */ __name((entityName, data, schema2) => {
  const entityDef = validateEntityExists(entityName, schema2);
  if (typeof data !== "object" || data === null) {
    throw new TransactionValidationError(`Arguments for data operation on entity '${entityName}' must be an object, but received: ${typeof data}`);
  }
  for (const [attrName, value] of Object.entries(data)) {
    if (attrName === "id")
      continue;
    const attrDef = entityDef.attrs[attrName];
    if (attrDef) {
      if (!isValidValueForAttr(value, attrDef)) {
        throw new TransactionValidationError(`Invalid value for attribute '${attrName}' in entity '${entityName}'. Expected ${attrDef.valueType}, but received: ${typeof value}`);
      }
    }
  }
}, "validateDataOperation");
var validateLinkOperation = /* @__PURE__ */ __name((entityName, links, schema2) => {
  const entityDef = validateEntityExists(entityName, schema2);
  if (typeof links !== "object" || links === null) {
    throw new TransactionValidationError(`Arguments for link operation on entity '${entityName}' must be an object, but received: ${typeof links}`);
  }
  for (const [linkName, linkValue] of Object.entries(links)) {
    const link = entityDef.links[linkName];
    if (!link) {
      const availableLinks = Object.keys(entityDef.links);
      throw new TransactionValidationError(`Link '${linkName}' does not exist on entity '${entityName}'. Available links: ${formatAvailableOptions(availableLinks)}`);
    }
    if (linkValue !== null && linkValue !== void 0) {
      if (Array.isArray(linkValue)) {
        for (const linkReference of linkValue) {
          if (!isValidEntityId(linkReference)) {
            throw new TransactionValidationError(`Invalid entity ID in link '${linkName}' for entity '${entityName}'. Expected a UUID or a lookup, but received: ${linkReference}`);
          }
        }
      } else {
        if (!isValidEntityId(linkValue)) {
          throw new TransactionValidationError(`Invalid UUID in link '${linkName}' for entity '${entityName}'. Expected a UUID, but received: ${linkValue}`);
        }
      }
    }
  }
}, "validateLinkOperation");
var VALIDATION_STRATEGIES = {
  create: validateDataOperation,
  update: validateDataOperation,
  merge: validateDataOperation,
  link: validateLinkOperation,
  unlink: validateLinkOperation,
  delete: /* @__PURE__ */ __name(() => {
  }, "delete")
};
var validateOp = /* @__PURE__ */ __name((op, schema2) => {
  if (!schema2)
    return;
  const [action, entityName, _id, args] = op;
  if (!Array.isArray(_id)) {
    const isUuid = validate_default(_id);
    if (!isUuid) {
      throw new TransactionValidationError(`Invalid id for entity '${entityName}'. Expected a UUID, but received: ${_id}`);
    }
  }
  if (typeof entityName !== "string") {
    throw new TransactionValidationError(`Entity name must be a string, but received: ${typeof entityName}`);
  }
  const validator = VALIDATION_STRATEGIES[action];
  if (validator && args !== void 0) {
    validator(entityName, args, schema2);
  }
}, "validateOp");
var validateTransactions = /* @__PURE__ */ __name((inputChunks, schema2) => {
  const chunks = Array.isArray(inputChunks) ? inputChunks : [inputChunks];
  for (const txStep of chunks) {
    if (!txStep || typeof txStep !== "object") {
      throw new TransactionValidationError(`Transaction chunk must be an object, but received: ${typeof txStep}`);
    }
    if (!Array.isArray(txStep.__ops)) {
      throw new TransactionValidationError(`Transaction chunk must have __ops array, but received: ${typeof txStep.__ops}`);
    }
    for (const op of txStep.__ops) {
      if (!Array.isArray(op)) {
        throw new TransactionValidationError(`Transaction operation must be an array, but received: ${typeof op}`);
      }
      validateOp(op, schema2);
    }
  }
}, "validateTransactions");

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/Connection.js
init_modules_watch_stub();
var _connId = 0;
var SSEConnection = class {
  static {
    __name(this, "SSEConnection");
  }
  type = "sse";
  initParams = null;
  sendQueue = [];
  sendPromise;
  closeFired = false;
  sseInitTimeout = void 0;
  ES;
  messageUrl;
  conn;
  url;
  id;
  onopen;
  onmessage;
  onclose;
  onerror;
  constructor(ES, url, messageUrl) {
    this.id = `${this.type}_${_connId++}`;
    this.url = url;
    this.messageUrl = messageUrl || this.url;
    this.ES = ES;
    this.conn = new ES(url);
    this.sseInitTimeout = setTimeout(() => {
      if (!this.initParams) {
        this.handleError();
      }
    }, 1e4);
    this.conn.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (Array.isArray(message)) {
        for (const msg of message) {
          this.handleMessage(msg);
        }
      } else {
        this.handleMessage(message);
      }
    };
    this.conn.onerror = (e) => {
      this.handleError();
    };
  }
  handleMessage(msg) {
    if (msg.op === "sse-init") {
      this.initParams = {
        machineId: msg["machine-id"],
        sessionId: msg["session-id"],
        sseToken: msg["sse-token"]
      };
      if (this.onopen) {
        this.onopen({ target: this });
      }
      clearTimeout(this.sseInitTimeout);
      return;
    }
    if (this.onmessage) {
      this.onmessage({
        target: this,
        message: msg
      });
    }
  }
  // Runs the onerror and closes the connection
  handleError() {
    try {
      if (this.onerror) {
        this.onerror({ target: this });
      }
    } finally {
      this.handleClose();
    }
  }
  handleClose() {
    this.conn.close();
    if (this.onclose && !this.closeFired) {
      this.closeFired = true;
      this.onclose({ target: this });
    }
  }
  async postMessages(messages) {
    try {
      const resp = await fetch(this.messageUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machine_id: this.initParams?.machineId,
          session_id: this.initParams?.sessionId,
          sse_token: this.initParams?.sseToken,
          messages
        })
      });
      if (!resp.ok) {
        this.handleError();
      }
    } catch (e) {
      this.handleError();
    }
  }
  async flushQueue() {
    if (this.sendPromise || !this.sendQueue.length)
      return;
    const messages = this.sendQueue;
    this.sendQueue = [];
    const sendPromise = this.postMessages(messages);
    this.sendPromise = sendPromise;
    sendPromise.then(() => {
      this.sendPromise = null;
      this.flushQueue();
    });
  }
  send(msg) {
    if (!this.isOpen() || !this.initParams) {
      if (this.isConnecting()) {
        throw new Error(`Failed to execute 'send' on 'EventSource': Still in CONNECTING state.`);
      }
      if (this.conn.readyState === this.ES.CLOSED) {
        throw new Error(`EventSource is already in CLOSING or CLOSED state.`);
      }
      throw new Error(`EventSource is in invalid state.`);
    }
    this.sendQueue.push(msg);
    this.flushQueue();
  }
  isOpen() {
    return this.conn.readyState === this.ES.OPEN && this.initParams !== null;
  }
  isConnecting() {
    return this.conn.readyState === this.ES.CONNECTING || this.conn.readyState === this.ES.OPEN && this.initParams === null;
  }
  close() {
    this.handleClose();
  }
};

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/SyncTable.js
init_modules_watch_stub();
var CallbackEventType;
(function(CallbackEventType2) {
  CallbackEventType2["InitialSyncBatch"] = "InitialSyncBatch";
  CallbackEventType2["InitialSyncComplete"] = "InitialSyncComplete";
  CallbackEventType2["LoadFromStorage"] = "LoadFromStorage";
  CallbackEventType2["SyncTransaction"] = "SyncTransaction";
  CallbackEventType2["Error"] = "Error";
})(CallbackEventType || (CallbackEventType = {}));

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/Stream.js
init_modules_watch_stub();
function createWriteStream({ WStream, opts, startStream, appendStream, registerStream }) {
  const clientId = opts.clientId;
  let streamId_ = null;
  let error_ = null;
  let controller_ = null;
  const reconnectToken = id_default();
  let isDone = false;
  let closed = false;
  const closeCbs = [];
  const streamIdCbs = [];
  const completeCbs = [];
  let disconnected = false;
  let bufferOffset = 0;
  let bufferByteSize = 0;
  const buffer = [];
  const encoder = new TextEncoder();
  function markClosed() {
    closed = true;
    for (const cb of closeCbs) {
      cb(error_ ?? void 0);
    }
  }
  __name(markClosed, "markClosed");
  function addCloseCb(cb) {
    closeCbs.push(cb);
    if (closed) {
      cb(error_ ?? void 0);
    }
    return () => {
      const i2 = closeCbs.indexOf(cb);
      if (i2 !== -1) {
        closeCbs.splice(i2, 1);
      }
    };
  }
  __name(addCloseCb, "addCloseCb");
  function addCompleteCb(cb) {
    completeCbs.push(cb);
    return () => {
      const i2 = completeCbs.indexOf(cb);
      if (i2 !== -1) {
        completeCbs.splice(i2, 1);
      }
    };
  }
  __name(addCompleteCb, "addCompleteCb");
  if (opts.waitUntil) {
    opts.waitUntil(new Promise((resolve) => {
      completeCbs.push(resolve);
    }));
  }
  function runCompleteCbs() {
    for (const cb of completeCbs) {
      try {
        cb();
      } catch (_e) {
      }
    }
  }
  __name(runCompleteCbs, "runCompleteCbs");
  function addStreamIdCb(cb) {
    streamIdCbs.push(cb);
    if (streamId_) {
      cb(streamId_);
    }
    return () => {
      const i2 = streamIdCbs.indexOf(cb);
      if (i2 !== -1) {
        streamIdCbs.splice(i2, 1);
      }
    };
  }
  __name(addStreamIdCb, "addStreamIdCb");
  function setStreamId(streamId) {
    streamId_ = streamId;
    for (const cb of streamIdCbs) {
      cb(streamId_);
    }
  }
  __name(setStreamId, "setStreamId");
  function onDisconnect() {
    disconnected = true;
  }
  __name(onDisconnect, "onDisconnect");
  function discardFlushed(offset) {
    let chunkOffset = bufferOffset;
    let segmentsToDrop = 0;
    let droppedSegmentsByteLen = 0;
    for (const { byteLen } of buffer) {
      const nextChunkOffset = chunkOffset + byteLen;
      if (nextChunkOffset > offset) {
        break;
      }
      chunkOffset = nextChunkOffset;
      segmentsToDrop++;
      droppedSegmentsByteLen += byteLen;
    }
    if (segmentsToDrop > 0) {
      bufferOffset += droppedSegmentsByteLen;
      bufferByteSize -= droppedSegmentsByteLen;
      buffer.splice(0, segmentsToDrop);
    }
  }
  __name(discardFlushed, "discardFlushed");
  function error(controller, e) {
    error_ = e;
    markClosed();
    controller.error(e);
    runCompleteCbs();
  }
  __name(error, "error");
  async function onConnectionReconnect() {
    const result = await startStream({
      clientId,
      reconnectToken,
      ruleParams: opts.ruleParams
    });
    switch (result.type) {
      case "ok": {
        const { streamId, offset } = result;
        streamId_ = streamId;
        discardFlushed(offset);
        if (buffer.length) {
          appendStream({
            streamId,
            chunks: buffer.map((b) => b.chunk),
            offset: bufferOffset
          });
        }
        disconnected = false;
        break;
      }
      case "disconnect": {
        onDisconnect();
        break;
      }
      case "error": {
        if (controller_) {
          error(controller_, result.error);
        }
        break;
      }
    }
  }
  __name(onConnectionReconnect, "onConnectionReconnect");
  function onAppendFailed() {
    onDisconnect();
    onConnectionReconnect();
  }
  __name(onAppendFailed, "onAppendFailed");
  function onFlush({ offset, done }) {
    discardFlushed(offset);
    if (done) {
      isDone = true;
      runCompleteCbs();
    }
  }
  __name(onFlush, "onFlush");
  function ensureSetup(controller) {
    if (isDone) {
      error(controller, new InstantError("Stream has been closed."));
      return null;
    }
    if (!streamId_) {
      error(controller, new InstantError("Stream has not been initialized."));
      return null;
    }
    return streamId_;
  }
  __name(ensureSetup, "ensureSetup");
  async function start(controller) {
    controller_ = controller;
    let tryAgain = true;
    let attempts = 0;
    while (tryAgain) {
      let nextAttempt = Date.now() + Math.min(15e3, 500 * (attempts - 1));
      tryAgain = false;
      const result = await startStream({
        clientId: opts.clientId,
        reconnectToken,
        ruleParams: opts.ruleParams
      });
      switch (result.type) {
        case "ok": {
          const { streamId, offset } = result;
          if (offset !== 0) {
            const e = new InstantError("Write stream is corrupted");
            error(controller, e);
            return;
          }
          setStreamId(streamId);
          registerStream(streamId, {
            onDisconnect,
            onFlush,
            onConnectionReconnect,
            onAppendFailed
          });
          disconnected = false;
          return;
        }
        case "disconnect": {
          tryAgain = true;
          onDisconnect();
          attempts++;
          await new Promise((resolve) => {
            setTimeout(resolve, Math.max(0, nextAttempt - Date.now()));
          });
          break;
        }
        case "error": {
          error(controller, result.error);
          return;
        }
      }
    }
  }
  __name(start, "start");
  class WStreamEnhanced extends WStream {
    static {
      __name(this, "WStreamEnhanced");
    }
    constructor(sink, strategy) {
      super(sink, strategy);
    }
    async streamId() {
      if (streamId_) {
        return streamId_;
      }
      return new Promise((resolve, reject) => {
        const cleanupFns = [];
        const cleanup = /* @__PURE__ */ __name(() => {
          for (const f of cleanupFns) {
            f();
          }
        }, "cleanup");
        const resolveCb = /* @__PURE__ */ __name((streamId) => {
          resolve(streamId);
          cleanup();
        }, "resolveCb");
        const rejectCb = /* @__PURE__ */ __name((e) => {
          reject(e || new InstantError("Stream is closed."));
          cleanup();
        }, "rejectCb");
        cleanupFns.push(addStreamIdCb(resolveCb));
        cleanupFns.push(addCloseCb(rejectCb));
      });
    }
  }
  const stream = new WStreamEnhanced({
    // TODO(dww): accept a storage so that write streams can survive across
    //            browser restarts
    async start(controller) {
      try {
        await start(controller);
      } catch (e) {
        error(controller, e);
      }
    },
    write(chunk, controller) {
      const streamId = ensureSetup(controller);
      if (streamId) {
        const byteLen = encoder.encode(chunk).length;
        buffer.push({ chunk, byteLen });
        const offset = bufferOffset + bufferByteSize;
        bufferByteSize += byteLen;
        if (!disconnected) {
          appendStream({ streamId, chunks: [chunk], offset });
        }
      }
    },
    close() {
      if (streamId_) {
        appendStream({
          streamId: streamId_,
          chunks: [],
          offset: bufferOffset + bufferByteSize,
          isDone: true
        });
      } else {
        runCompleteCbs();
      }
      markClosed();
    },
    abort(reason) {
      if (streamId_) {
        appendStream({
          streamId: streamId_,
          chunks: [],
          offset: bufferOffset + bufferByteSize,
          isDone: true,
          abortReason: reason
        });
      } else {
        runCompleteCbs();
      }
      markClosed();
    }
  });
  return {
    stream,
    addCompleteCb,
    closed() {
      return closed;
    }
  };
}
__name(createWriteStream, "createWriteStream");
var StreamIterator = class {
  static {
    __name(this, "StreamIterator");
  }
  items = [];
  resolvers = [];
  isClosed = false;
  constructor() {
  }
  push(item) {
    if (this.isClosed)
      return;
    const resolve = this.resolvers.shift();
    if (resolve) {
      resolve({ value: item, done: false });
    } else {
      this.items.push(item);
    }
  }
  close() {
    this.isClosed = true;
    while (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve({ value: void 0, done: true });
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      if (this.items.length > 0) {
        yield this.items.shift();
      } else if (this.isClosed) {
        return;
      } else {
        const { value, done } = await new Promise((resolve) => {
          this.resolvers.push(resolve);
        });
        if (done || !value) {
          return;
        }
        yield value;
      }
    }
  }
};
function createReadStream({ RStream, opts, startStream, cancelStream }) {
  let seenOffset = opts.byteOffset || 0;
  let canceled = false;
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();
  let eventId;
  let closed = false;
  const closeCbs = [];
  function markClosed() {
    closed = true;
    for (const cb of closeCbs) {
      cb();
    }
  }
  __name(markClosed, "markClosed");
  function addCloseCb(cb) {
    closeCbs.push(cb);
    return () => {
      const i2 = closeCbs.indexOf(cb);
      if (i2 !== -1) {
        closeCbs.splice(i2, 1);
      }
    };
  }
  __name(addCloseCb, "addCloseCb");
  function error(controller, e) {
    controller.error(e);
    markClosed();
  }
  __name(error, "error");
  let fetchFailures = 0;
  async function runStartStream(opts2, controller) {
    eventId = id_default();
    const streamOpts = { ...opts2 || {}, eventId };
    for await (const item of startStream(streamOpts)) {
      if (canceled) {
        return;
      }
      if (item.type === "reconnect") {
        return { retry: true };
      }
      if (item.type === "error") {
        error(controller, item.error);
        return;
      }
      if (item.offset > seenOffset) {
        error(controller, new InstantError("Stream is corrupted."));
        canceled = true;
        return;
      }
      let discardLen = seenOffset - item.offset;
      if (item.files && item.files.length) {
        const fetchAbort = new AbortController();
        let nextFetch = fetch(item.files[0].url, {
          signal: fetchAbort.signal
        });
        for (let i2 = 0; i2 < item.files.length; i2++) {
          const nextFile = item.files[i2 + 1];
          const thisFetch = nextFetch;
          const res = await thisFetch;
          if (nextFile) {
            nextFetch = fetch(nextFile.url, { signal: fetchAbort.signal });
          }
          if (!res.ok) {
            fetchFailures++;
            if (fetchFailures > 10) {
              error(controller, new InstantError("Unable to process stream."));
              return;
            }
            return { retry: true };
          }
          if (res.body) {
            const reader = res.body.getReader();
            try {
              while (true) {
                const { done, value: bodyChunk } = await reader.read();
                if (done) {
                  break;
                }
                if (canceled) {
                  fetchAbort.abort();
                  return;
                }
                let chunk = bodyChunk;
                if (discardLen > 0) {
                  chunk = bodyChunk.subarray(discardLen);
                  discardLen -= bodyChunk.length - chunk.length;
                }
                if (!chunk.length) {
                  continue;
                }
                seenOffset += chunk.length;
                const s = decoder.decode(chunk);
                controller.enqueue(s);
              }
            } finally {
              reader.releaseLock();
            }
          } else {
            const bodyChunk = await res.arrayBuffer();
            let chunk = bodyChunk;
            if (canceled) {
              fetchAbort.abort();
              return;
            }
            if (discardLen > 0) {
              chunk = new Uint8Array(bodyChunk).subarray(discardLen);
              discardLen -= bodyChunk.byteLength - chunk.length;
            }
            if (!chunk.byteLength) {
              continue;
            }
            seenOffset += chunk.byteLength;
            const s = decoder.decode(chunk);
            controller.enqueue(s);
          }
        }
      }
      fetchFailures = 0;
      if (item.content) {
        let content = item.content;
        let encoded = encoder.encode(item.content);
        if (discardLen > 0) {
          const remaining = encoded.subarray(discardLen);
          discardLen -= encoded.length - remaining.length;
          if (!remaining.length) {
            continue;
          }
          encoded = remaining;
          content = decoder.decode(remaining);
        }
        seenOffset += encoded.length;
        controller.enqueue(content);
      }
    }
  }
  __name(runStartStream, "runStartStream");
  async function start(controller) {
    let retry = true;
    let attempts = 0;
    while (retry) {
      retry = false;
      let nextAttempt = Date.now() + Math.min(15e3, 500 * (attempts - 1));
      const res = await runStartStream({ ...opts, offset: seenOffset }, controller);
      if (res?.retry) {
        retry = true;
        attempts++;
        if (nextAttempt < Date.now() - 3e5) {
          attempts = 0;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, Math.max(0, nextAttempt - Date.now()));
        });
      }
    }
    if (!canceled && !closed) {
      controller.close();
      markClosed();
    }
  }
  __name(start, "start");
  const stream = new RStream({
    start(controller) {
      start(controller);
    },
    cancel(_reason) {
      canceled = true;
      if (eventId) {
        cancelStream({ eventId });
      }
      markClosed();
    }
  });
  return {
    stream,
    addCloseCb,
    closed() {
      return closed;
    }
  };
}
__name(createReadStream, "createReadStream");
var InstantStream = class {
  static {
    __name(this, "InstantStream");
  }
  trySend;
  WStream;
  RStream;
  writeStreams = {};
  startWriteStreamCbs = {};
  readStreamIterators = {};
  log;
  activeStreams = /* @__PURE__ */ new Set();
  constructor({ WStream, RStream, trySend, log }) {
    this.WStream = WStream;
    this.RStream = RStream;
    this.trySend = trySend;
    this.log = log;
  }
  createWriteStream(opts) {
    const { stream, addCompleteCb } = createWriteStream({
      WStream: this.WStream,
      startStream: this.startWriteStream.bind(this),
      appendStream: this.appendStream.bind(this),
      registerStream: this.registerWriteStream.bind(this),
      opts
    });
    this.activeStreams.add(stream);
    addCompleteCb(() => {
      this.activeStreams.delete(stream);
    });
    return stream;
  }
  createReadStream(opts) {
    const { stream, addCloseCb } = createReadStream({
      RStream: this.RStream,
      opts,
      startStream: this.startReadStream.bind(this),
      cancelStream: this.cancelReadStream.bind(this)
    });
    this.activeStreams.add(stream);
    addCloseCb(() => {
      this.activeStreams.delete(stream);
    });
    return stream;
  }
  startWriteStream(opts) {
    const eventId = id_default();
    let resolve = null;
    const promise = new Promise((r) => {
      resolve = r;
    });
    this.startWriteStreamCbs[eventId] = resolve;
    const msg = {
      op: "start-stream",
      "client-id": opts.clientId,
      "reconnect-token": opts.reconnectToken
    };
    if (opts.ruleParams) {
      msg["rule-params"] = opts.ruleParams;
    }
    this.trySend(eventId, msg);
    return promise;
  }
  registerWriteStream(streamId, cbs) {
    this.writeStreams[streamId] = cbs;
  }
  appendStream({ streamId, chunks, isDone, offset, abortReason }) {
    const msg = {
      op: "append-stream",
      "stream-id": streamId,
      chunks,
      offset,
      done: !!isDone
    };
    if (abortReason) {
      msg["abort-reason"] = abortReason;
    }
    this.trySend(id_default(), msg);
  }
  onAppendFailed(msg) {
    const cbs = this.writeStreams[msg["stream-id"]];
    if (cbs) {
      cbs.onAppendFailed();
    }
  }
  onStartStreamOk(msg) {
    const cb = this.startWriteStreamCbs[msg["client-event-id"]];
    if (!cb) {
      this.log.info("No stream for start-stream-ok", msg);
      return;
    }
    cb({ type: "ok", streamId: msg["stream-id"], offset: msg.offset });
    delete this.startWriteStreamCbs[msg["client-event-id"]];
  }
  onStreamFlushed(msg) {
    const streamId = msg["stream-id"];
    const cbs = this.writeStreams[streamId];
    if (!cbs) {
      this.log.info("No stream cbs for stream-flushed", msg);
      return;
    }
    cbs.onFlush({ offset: msg.offset, done: msg.done });
    if (msg.done) {
      delete this.writeStreams[streamId];
    }
  }
  startReadStream({ eventId, clientId, streamId, offset, ruleParams }) {
    const msg = { op: "subscribe-stream" };
    if (!streamId && !clientId) {
      throw new Error("Must provide one of streamId or clientId to subscribe to the stream.");
    }
    if (streamId) {
      msg["stream-id"] = streamId;
    }
    if (clientId) {
      msg["client-id"] = clientId;
    }
    if (offset) {
      msg["offset"] = offset;
    }
    if (ruleParams) {
      msg["rule-params"] = ruleParams;
    }
    const iterator = new StreamIterator();
    this.readStreamIterators[eventId] = iterator;
    this.trySend(eventId, msg);
    return iterator;
  }
  cancelReadStream({ eventId }) {
    const msg = {
      op: "unsubscribe-stream",
      "subscribe-event-id": eventId
    };
    this.trySend(id_default(), msg);
    delete this.readStreamIterators[eventId];
  }
  onStreamAppend(msg) {
    const eventId = msg["client-event-id"];
    const iterator = this.readStreamIterators[eventId];
    if (!iterator) {
      this.log.info("No iterator for read stream", msg);
      return;
    }
    if (msg.error) {
      if (msg.retry) {
        iterator.push({ type: "reconnect" });
      } else {
        iterator.push({
          type: "error",
          error: new InstantError(msg.error)
        });
      }
      iterator.close();
      delete this.readStreamIterators[eventId];
      return;
    }
    if (msg.files?.length || msg.content) {
      iterator.push({
        type: "append",
        offset: msg.offset,
        files: msg.files,
        content: msg.content
      });
    }
    if (msg.done) {
      iterator.close();
      delete this.readStreamIterators[eventId];
    }
  }
  onConnectionStatusChange(status) {
    for (const cb of Object.values(this.startWriteStreamCbs)) {
      cb({ type: "disconnect" });
    }
    this.startWriteStreamCbs = {};
    if (status !== STATUS.AUTHENTICATED) {
      for (const { onDisconnect } of Object.values(this.writeStreams)) {
        onDisconnect();
      }
    } else {
      for (const { onConnectionReconnect } of Object.values(this.writeStreams)) {
        onConnectionReconnect();
      }
      for (const iterator of Object.values(this.readStreamIterators)) {
        iterator.push({ type: "reconnect" });
        iterator.close();
      }
      this.readStreamIterators = {};
    }
  }
  onRecieveError(msg) {
    const ev = msg["original-event"];
    switch (ev.op) {
      case "append-stream": {
        const streamId = ev["stream-id"];
        const cbs = this.writeStreams[streamId];
        cbs?.onAppendFailed();
        break;
      }
      case "start-stream": {
        const eventId = msg["client-event-id"];
        const cb = this.startWriteStreamCbs[eventId];
        if (cb) {
          cb({
            type: "error",
            error: new InstantError(msg.message || "Unknown error", msg.hint)
          });
          delete this.startWriteStreamCbs[eventId];
        }
        break;
      }
      case "subscribe-stream": {
        const eventId = msg["client-event-id"];
        const iterator = this.readStreamIterators[eventId];
        if (iterator) {
          iterator.push({
            type: "error",
            error: new InstantError(msg.message || "Unknown error", msg.hint)
          });
          iterator.close();
          delete this.readStreamIterators[eventId];
        }
        break;
      }
      case "unsubscribe-stream": {
        break;
      }
    }
  }
  hasActiveStreams() {
    return this.activeStreams.size > 0;
  }
};

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/Reactor.js
var STATUS = {
  CONNECTING: "connecting",
  OPENED: "opened",
  AUTHENTICATED: "authenticated",
  CLOSED: "closed",
  ERRORED: "errored"
};
var ONE_MIN_MS = 1e3 * 60;

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/schema.js
init_modules_watch_stub();
function graph(entities, links) {
  return new InstantSchemaDef(
    enrichEntitiesWithLinks(entities, links),
    // (XXX): LinksDef<any> stems from TypeScript’s inability to reconcile the
    // type EntitiesWithLinks<EntitiesWithoutLinks, Links> with
    // EntitiesWithoutLinks. TypeScript is strict about ensuring that types are
    // correctly aligned and does not allow for substituting a type that might
    // be broader or have additional properties.
    links,
    void 0
  );
}
__name(graph, "graph");
function entity(attrs) {
  return new EntityDef(attrs, {});
}
__name(entity, "entity");
function string() {
  return new DataAttrDef("string", true, false);
}
__name(string, "string");
function number() {
  return new DataAttrDef("number", true, false);
}
__name(number, "number");
function boolean() {
  return new DataAttrDef("boolean", true, false);
}
__name(boolean, "boolean");
function date() {
  return new DataAttrDef("date", true, false);
}
__name(date, "date");
function json() {
  return new DataAttrDef("json", true, false);
}
__name(json, "json");
function any() {
  return new DataAttrDef("json", true, false);
}
__name(any, "any");
function enrichEntitiesWithLinks(entities, links) {
  const linksIndex = { fwd: {}, rev: {} };
  for (const linkDef of Object.values(links)) {
    linksIndex.fwd[linkDef.forward.on] ||= {};
    linksIndex.rev[linkDef.reverse.on] ||= {};
    linksIndex.fwd[linkDef.forward.on][linkDef.forward.label] = {
      entityName: linkDef.reverse.on,
      cardinality: linkDef.forward.has
    };
    linksIndex.rev[linkDef.reverse.on][linkDef.reverse.label] = {
      entityName: linkDef.forward.on,
      cardinality: linkDef.reverse.has
    };
  }
  const enrichedEntities = Object.fromEntries(Object.entries(entities).map(([name, def]) => [
    name,
    new EntityDef(def.attrs, {
      ...linksIndex.fwd[name],
      ...linksIndex.rev[name]
    })
  ]));
  return enrichedEntities;
}
__name(enrichEntitiesWithLinks, "enrichEntitiesWithLinks");
function schema({ entities, links, rooms }) {
  const linksDef = links ?? {};
  const roomsDef = rooms ?? {};
  return new InstantSchemaDef(
    enrichEntitiesWithLinks(entities, linksDef),
    // (XXX): LinksDef<any> stems from TypeScript's inability to reconcile the
    // type EntitiesWithLinks<EntitiesWithoutLinks, Links> with
    // EntitiesWithoutLinks. TypeScript is strict about ensuring that types are
    // correctly aligned and does not allow for substituting a type that might
    // be broader or have additional properties.
    linksDef,
    roomsDef
  );
}
__name(schema, "schema");
var i = {
  // constructs
  graph,
  schema,
  entity,
  // value types
  string,
  number,
  boolean,
  date,
  json,
  any
};

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/devtool.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/createRouteHandler.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/parseSchemaFromJSON.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/framework.js
init_modules_watch_stub();
var isServer = typeof window === "undefined" || "Deno" in globalThis;

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/infiniteQuery.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/utils/error.js
init_modules_watch_stub();

// ../../node_modules/.bun/@instantdb+core@0.22.171/node_modules/@instantdb/core/dist/esm/index.js
function initSchemaHashStore() {
  globalThis.__instantDbSchemaHashStore = globalThis.__instantDbSchemaHashStore ?? /* @__PURE__ */ new WeakMap();
  return globalThis.__instantDbSchemaHashStore;
}
__name(initSchemaHashStore, "initSchemaHashStore");
function initGlobalInstantCoreStore() {
  globalThis.__instantDbStore = globalThis.__instantDbStore ?? {};
  return globalThis.__instantDbStore;
}
__name(initGlobalInstantCoreStore, "initGlobalInstantCoreStore");
var globalInstantCoreStore = initGlobalInstantCoreStore();
var schemaHashStore = initSchemaHashStore();

// ../../node_modules/.bun/@instantdb+admin@0.22.171/node_modules/@instantdb/admin/dist/esm/version.js
init_modules_watch_stub();
var version_default2 = version;

// ../../node_modules/.bun/@instantdb+admin@0.22.171/node_modules/@instantdb/admin/dist/esm/subscribe.js
init_modules_watch_stub();

// ../../node_modules/.bun/eventsource@4.1.0/node_modules/eventsource/dist/index.js
init_modules_watch_stub();

// ../../node_modules/.bun/eventsource-parser@3.0.6/node_modules/eventsource-parser/dist/index.js
init_modules_watch_stub();
var ParseError = class extends Error {
  static {
    __name(this, "ParseError");
  }
  constructor(message, options) {
    super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
};
function noop(_arg) {
}
__name(noop, "noop");
function createParser(callbacks) {
  if (typeof callbacks == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent = noop, onError = noop, onRetry = noop, onComment } = callbacks;
  let incompleteLine = "", isFirstChunk = true, id2, data = "", eventType = "";
  function feed(newChunk) {
    const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk, [complete, incomplete] = splitLines(`${incompleteLine}${chunk}`);
    for (const line of complete)
      parseLine(line);
    incompleteLine = incomplete, isFirstChunk = false;
  }
  __name(feed, "feed");
  function parseLine(line) {
    if (line === "") {
      dispatchEvent();
      return;
    }
    if (line.startsWith(":")) {
      onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
      return;
    }
    const fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex !== -1) {
      const field = line.slice(0, fieldSeparatorIndex), offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
      processField(field, value, line);
      return;
    }
    processField(line, "", line);
  }
  __name(parseLine, "parseLine");
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data = `${data}${value}
`;
        break;
      case "id":
        id2 = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(
          new ParseError(`Invalid \`retry\` value: "${value}"`, {
            type: "invalid-retry",
            value,
            line
          })
        );
        break;
      default:
        onError(
          new ParseError(
            `Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`,
            { type: "unknown-field", field, value, line }
          )
        );
        break;
    }
  }
  __name(processField, "processField");
  function dispatchEvent() {
    data.length > 0 && onEvent({
      id: id2,
      event: eventType || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: data.endsWith(`
`) ? data.slice(0, -1) : data
    }), id2 = void 0, data = "", eventType = "";
  }
  __name(dispatchEvent, "dispatchEvent");
  function reset(options = {}) {
    incompleteLine && options.consume && parseLine(incompleteLine), isFirstChunk = true, id2 = void 0, data = "", eventType = "", incompleteLine = "";
  }
  __name(reset, "reset");
  return { feed, reset };
}
__name(createParser, "createParser");
function splitLines(chunk) {
  const lines = [];
  let incompleteLine = "", searchIndex = 0;
  for (; searchIndex < chunk.length; ) {
    const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
    let lineEnd = -1;
    if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = Math.min(crIndex, lfIndex) : crIndex !== -1 ? crIndex === chunk.length - 1 ? lineEnd = -1 : lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) {
      incompleteLine = chunk.slice(searchIndex);
      break;
    } else {
      const line = chunk.slice(searchIndex, lineEnd);
      lines.push(line), searchIndex = lineEnd + 1, chunk[searchIndex - 1] === "\r" && chunk[searchIndex] === `
` && searchIndex++;
    }
  }
  return [lines, incompleteLine];
}
__name(splitLines, "splitLines");

// ../../node_modules/.bun/eventsource@4.1.0/node_modules/eventsource/dist/index.js
var ErrorEvent = class extends Event {
  static {
    __name(this, "ErrorEvent");
  }
  /**
   * Constructs a new `ErrorEvent` instance. This is typically not called directly,
   * but rather emitted by the `EventSource` object when an error occurs.
   *
   * @param type - The type of the event (should be "error")
   * @param errorEventInitDict - Optional properties to include in the error event
   */
  constructor(type, errorEventInitDict) {
    var _a, _b;
    super(type), this.code = (_a = errorEventInitDict == null ? void 0 : errorEventInitDict.code) != null ? _a : void 0, this.message = (_b = errorEventInitDict == null ? void 0 : errorEventInitDict.message) != null ? _b : void 0;
  }
  /**
   * Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Node.js when you `console.log` an instance of this class.
   *
   * @param _depth - The current depth
   * @param options - The options passed to `util.inspect`
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @returns A string representation of the error
   */
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](_depth, options, inspect) {
    return inspect(inspectableError(this), options);
  }
  /**
   * Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Deno when you `console.log` an instance of this class.
   *
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @param options - The options passed to `Deno.inspect`
   * @returns A string representation of the error
   */
  [/* @__PURE__ */ Symbol.for("Deno.customInspect")](inspect, options) {
    return inspect(inspectableError(this), options);
  }
};
function syntaxError(message) {
  const DomException = globalThis.DOMException;
  return typeof DomException == "function" ? new DomException(message, "SyntaxError") : new SyntaxError(message);
}
__name(syntaxError, "syntaxError");
function flattenError(err) {
  return err instanceof Error ? "errors" in err && Array.isArray(err.errors) ? err.errors.map(flattenError).join(", ") : "cause" in err && err.cause instanceof Error ? `${err}: ${flattenError(err.cause)}` : err.message : `${err}`;
}
__name(flattenError, "flattenError");
function inspectableError(err) {
  return {
    type: err.type,
    message: err.message,
    code: err.code,
    defaultPrevented: err.defaultPrevented,
    cancelable: err.cancelable,
    timeStamp: err.timeStamp
  };
}
__name(inspectableError, "inspectableError");
var __typeError = /* @__PURE__ */ __name((msg) => {
  throw TypeError(msg);
}, "__typeError");
var __accessCheck = /* @__PURE__ */ __name((obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg), "__accessCheck");
var __privateGet = /* @__PURE__ */ __name((obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj)), "__privateGet");
var __privateAdd = /* @__PURE__ */ __name((obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value), "__privateAdd");
var __privateSet = /* @__PURE__ */ __name((obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value), "__privateSet");
var __privateMethod = /* @__PURE__ */ __name((obj, member, method) => (__accessCheck(obj, member, "access private method"), method), "__privateMethod");
var _readyState;
var _url;
var _redirectUrl;
var _withCredentials;
var _fetch;
var _reconnectInterval;
var _reconnectTimer;
var _lastEventId;
var _controller;
var _parser;
var _onError;
var _onMessage;
var _onOpen;
var _EventSource_instances;
var connect_fn;
var _onFetchResponse;
var _onFetchError;
var getRequestOptions_fn;
var _onEvent;
var _onRetryChange;
var failConnection_fn;
var scheduleReconnect_fn;
var _reconnect;
var EventSource = class extends EventTarget {
  static {
    __name(this, "EventSource");
  }
  constructor(url, eventSourceInitDict) {
    var _a, _b;
    super(), __privateAdd(this, _EventSource_instances), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, __privateAdd(this, _readyState), __privateAdd(this, _url), __privateAdd(this, _redirectUrl), __privateAdd(this, _withCredentials), __privateAdd(this, _fetch), __privateAdd(this, _reconnectInterval), __privateAdd(this, _reconnectTimer), __privateAdd(this, _lastEventId, null), __privateAdd(this, _controller), __privateAdd(this, _parser), __privateAdd(this, _onError, null), __privateAdd(this, _onMessage, null), __privateAdd(this, _onOpen, null), __privateAdd(this, _onFetchResponse, async (response) => {
      var _a2;
      __privateGet(this, _parser).reset();
      const { body, redirected, status, headers } = response;
      if (status === 204) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
        return;
      }
      if (redirected ? __privateSet(this, _redirectUrl, new URL(response.url)) : __privateSet(this, _redirectUrl, void 0), status !== 200) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, `Non-200 status code (${status})`, status);
        return;
      }
      if (!(headers.get("content-type") || "").startsWith("text/event-stream")) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, 'Invalid content type, expected "text/event-stream"', status);
        return;
      }
      if (__privateGet(this, _readyState) === this.CLOSED)
        return;
      __privateSet(this, _readyState, this.OPEN);
      const openEvent = new Event("open");
      if ((_a2 = __privateGet(this, _onOpen)) == null || _a2.call(this, openEvent), this.dispatchEvent(openEvent), typeof body != "object" || !body || !("getReader" in body)) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Invalid response body, expected a web ReadableStream", status), this.close();
        return;
      }
      const decoder = new TextDecoder(), reader = body.getReader();
      let open = true;
      do {
        const { done, value } = await reader.read();
        value && __privateGet(this, _parser).feed(decoder.decode(value, { stream: !done })), done && (open = false, __privateGet(this, _parser).reset(), __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this));
      } while (open);
    }), __privateAdd(this, _onFetchError, (err) => {
      __privateSet(this, _controller, void 0), !(err.name === "AbortError" || err.type === "aborted") && __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this, flattenError(err));
    }), __privateAdd(this, _onEvent, (event) => {
      typeof event.id == "string" && __privateSet(this, _lastEventId, event.id);
      const messageEvent = new MessageEvent(event.event || "message", {
        data: event.data,
        origin: __privateGet(this, _redirectUrl) ? __privateGet(this, _redirectUrl).origin : __privateGet(this, _url).origin,
        lastEventId: event.id || ""
      });
      __privateGet(this, _onMessage) && (!event.event || event.event === "message") && __privateGet(this, _onMessage).call(this, messageEvent), this.dispatchEvent(messageEvent);
    }), __privateAdd(this, _onRetryChange, (value) => {
      __privateSet(this, _reconnectInterval, value);
    }), __privateAdd(this, _reconnect, () => {
      __privateSet(this, _reconnectTimer, void 0), __privateGet(this, _readyState) === this.CONNECTING && __privateMethod(this, _EventSource_instances, connect_fn).call(this);
    });
    try {
      if (url instanceof URL)
        __privateSet(this, _url, url);
      else if (typeof url == "string")
        __privateSet(this, _url, new URL(url, getBaseURL()));
      else
        throw new Error("Invalid URL");
    } catch {
      throw syntaxError("An invalid or illegal string was specified");
    }
    __privateSet(this, _parser, createParser({
      onEvent: __privateGet(this, _onEvent),
      onRetry: __privateGet(this, _onRetryChange)
    })), __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _reconnectInterval, 3e3), __privateSet(this, _fetch, (_a = eventSourceInitDict == null ? void 0 : eventSourceInitDict.fetch) != null ? _a : globalThis.fetch), __privateSet(this, _withCredentials, (_b = eventSourceInitDict == null ? void 0 : eventSourceInitDict.withCredentials) != null ? _b : false), __privateMethod(this, _EventSource_instances, connect_fn).call(this);
  }
  /**
   * Returns the state of this EventSource object's connection. It can have the values described below.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/readyState)
   *
   * Note: typed as `number` instead of `0 | 1 | 2` for compatibility with the `EventSource` interface,
   * defined in the TypeScript `dom` library.
   *
   * @public
   */
  get readyState() {
    return __privateGet(this, _readyState);
  }
  /**
   * Returns the URL providing the event stream.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/url)
   *
   * @public
   */
  get url() {
    return __privateGet(this, _url).href;
  }
  /**
   * Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/withCredentials)
   */
  get withCredentials() {
    return __privateGet(this, _withCredentials);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/error_event) */
  get onerror() {
    return __privateGet(this, _onError);
  }
  set onerror(value) {
    __privateSet(this, _onError, value);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/message_event) */
  get onmessage() {
    return __privateGet(this, _onMessage);
  }
  set onmessage(value) {
    __privateSet(this, _onMessage, value);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/open_event) */
  get onopen() {
    return __privateGet(this, _onOpen);
  }
  set onopen(value) {
    __privateSet(this, _onOpen, value);
  }
  addEventListener(type, listener, options) {
    const listen = listener;
    super.addEventListener(type, listen, options);
  }
  removeEventListener(type, listener, options) {
    const listen = listener;
    super.removeEventListener(type, listen, options);
  }
  /**
   * Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/close)
   *
   * @public
   */
  close() {
    __privateGet(this, _reconnectTimer) && clearTimeout(__privateGet(this, _reconnectTimer)), __privateGet(this, _readyState) !== this.CLOSED && (__privateGet(this, _controller) && __privateGet(this, _controller).abort(), __privateSet(this, _readyState, this.CLOSED), __privateSet(this, _controller, void 0));
  }
};
_readyState = /* @__PURE__ */ new WeakMap(), _url = /* @__PURE__ */ new WeakMap(), _redirectUrl = /* @__PURE__ */ new WeakMap(), _withCredentials = /* @__PURE__ */ new WeakMap(), _fetch = /* @__PURE__ */ new WeakMap(), _reconnectInterval = /* @__PURE__ */ new WeakMap(), _reconnectTimer = /* @__PURE__ */ new WeakMap(), _lastEventId = /* @__PURE__ */ new WeakMap(), _controller = /* @__PURE__ */ new WeakMap(), _parser = /* @__PURE__ */ new WeakMap(), _onError = /* @__PURE__ */ new WeakMap(), _onMessage = /* @__PURE__ */ new WeakMap(), _onOpen = /* @__PURE__ */ new WeakMap(), _EventSource_instances = /* @__PURE__ */ new WeakSet(), /**
* Connect to the given URL and start receiving events
*
* @internal
*/
connect_fn = /* @__PURE__ */ __name(function() {
  __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _controller, new AbortController()), __privateGet(this, _fetch)(__privateGet(this, _url), __privateMethod(this, _EventSource_instances, getRequestOptions_fn).call(this)).then(__privateGet(this, _onFetchResponse)).catch(__privateGet(this, _onFetchError));
}, "connect_fn"), _onFetchResponse = /* @__PURE__ */ new WeakMap(), _onFetchError = /* @__PURE__ */ new WeakMap(), /**
* Get request options for the `fetch()` request
*
* @returns The request options
* @internal
*/
getRequestOptions_fn = /* @__PURE__ */ __name(function() {
  var _a;
  const init2 = {
    // [spec] Let `corsAttributeState` be `Anonymous`…
    // [spec] …will have their mode set to "cors"…
    mode: "cors",
    redirect: "follow",
    headers: { Accept: "text/event-stream", ...__privateGet(this, _lastEventId) ? { "Last-Event-ID": __privateGet(this, _lastEventId) } : void 0 },
    cache: "no-store",
    signal: (_a = __privateGet(this, _controller)) == null ? void 0 : _a.signal
  };
  return "window" in globalThis && (init2.credentials = this.withCredentials ? "include" : "same-origin"), init2;
}, "getRequestOptions_fn"), _onEvent = /* @__PURE__ */ new WeakMap(), _onRetryChange = /* @__PURE__ */ new WeakMap(), /**
* Handles the process referred to in the EventSource specification as "failing a connection".
*
* @param error - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
failConnection_fn = /* @__PURE__ */ __name(function(message, code) {
  var _a;
  __privateGet(this, _readyState) !== this.CLOSED && __privateSet(this, _readyState, this.CLOSED);
  const errorEvent = new ErrorEvent("error", { code, message });
  (_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent);
}, "failConnection_fn"), /**
* Schedules a reconnection attempt against the EventSource endpoint.
*
* @param message - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
scheduleReconnect_fn = /* @__PURE__ */ __name(function(message, code) {
  var _a;
  if (__privateGet(this, _readyState) === this.CLOSED)
    return;
  __privateSet(this, _readyState, this.CONNECTING);
  const errorEvent = new ErrorEvent("error", { code, message });
  (_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent), __privateSet(this, _reconnectTimer, setTimeout(__privateGet(this, _reconnect), __privateGet(this, _reconnectInterval)));
}, "scheduleReconnect_fn"), _reconnect = /* @__PURE__ */ new WeakMap(), /**
* ReadyState representing an EventSource currently trying to connect
*
* @public
*/
EventSource.CONNECTING = 0, /**
* ReadyState representing an EventSource connection that is open (eg connected)
*
* @public
*/
EventSource.OPEN = 1, /**
* ReadyState representing an EventSource connection that is closed (eg disconnected)
*
* @public
*/
EventSource.CLOSED = 2;
Object.defineProperty(EventSource, /* @__PURE__ */ Symbol.for("eventsource.supports-fetch-override"), {
  value: true,
  writable: false,
  configurable: false,
  enumerable: false
});
function getBaseURL() {
  const doc = "document" in globalThis ? globalThis.document : void 0;
  return doc && typeof doc == "object" && "baseURI" in doc && typeof doc.baseURI == "string" ? doc.baseURI : void 0;
}
__name(getBaseURL, "getBaseURL");

// ../../node_modules/.bun/@instantdb+admin@0.22.171/node_modules/@instantdb/admin/dist/esm/subscribe.js
function makeAsyncIterator(subscribe2, subscribeOnClose, unsubscribe, readyState) {
  let wakeup = null;
  let closed = false;
  const backlog = [];
  const handler = /* @__PURE__ */ __name((data) => {
    backlog.push(data);
    if (backlog.length > 100) {
      backlog.shift();
    }
    if (wakeup) {
      wakeup();
      wakeup = null;
    }
  }, "handler");
  subscribe2(handler);
  const done = /* @__PURE__ */ __name(() => {
    unsubscribe(handler);
    return Promise.resolve({ done: true, value: void 0 });
  }, "done");
  const onClose = /* @__PURE__ */ __name(() => {
    closed = true;
    if (wakeup) {
      wakeup();
    }
    done();
  }, "onClose");
  subscribeOnClose(onClose);
  const next = /* @__PURE__ */ __name(async () => {
    while (true) {
      if (readyState() === "closed" || closed) {
        return done();
      }
      const nextValue = backlog.shift();
      if (nextValue) {
        return { value: nextValue, done: false };
      }
      const p = new Promise((resolve) => {
        wakeup = resolve;
      });
      await p;
    }
  }, "next");
  return {
    next,
    return: done,
    throw(error) {
      unsubscribe(handler);
      return Promise.reject(error);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
__name(makeAsyncIterator, "makeAsyncIterator");
function esReadyState(es) {
  switch (es.readyState) {
    case es.CLOSED: {
      return "closed";
    }
    case es.CONNECTING: {
      return "connecting";
    }
    case es.OPEN: {
      return "open";
    }
    default:
      return "connecting";
  }
}
__name(esReadyState, "esReadyState");
function multiReadFetchResponse(r) {
  let p = null;
  return {
    ...r,
    text() {
      if (!p) {
        p = r.text();
      }
      return p;
    },
    json() {
      if (!p) {
        p = r.text();
      }
      return p.then((x) => JSON.parse(x));
    }
  };
}
__name(multiReadFetchResponse, "multiReadFetchResponse");
function formatPageInfo(pageInfo) {
  if (!pageInfo) {
    return void 0;
  }
  const res = {};
  for (const [k, v] of Object.entries(pageInfo)) {
    res[k] = {
      startCursor: v["start-cursor"],
      endCursor: v["end-cursor"],
      hasNextPage: v["has-next-page?"],
      hasPreviousPage: v["has-previous-page?"]
    };
  }
  return res;
}
__name(formatPageInfo, "formatPageInfo");
function subscribe(query3, cb, opts) {
  let fetchErrorResponse;
  let closed = false;
  const localConnectionId = id_default();
  const es = new EventSource(`${opts.apiURI}/admin/subscribe-query?local_connection_id=${localConnectionId}`, {
    fetch(input, init2) {
      fetchErrorResponse = null;
      return fetch(input, {
        ...init2,
        method: "POST",
        headers: opts.headers,
        body: JSON.stringify({
          query: query3,
          "inference?": opts.inference,
          versions: {
            "@instantdb/admin": version_default2,
            "@instantdb/core": version_default
          }
        })
      }).then((r) => {
        if (!r.ok) {
          fetchErrorResponse = multiReadFetchResponse(r);
        }
        return r;
      });
    }
  });
  const subscribers = [];
  const onCloseSubscribers = [];
  const subscribe2 = /* @__PURE__ */ __name((cb2) => {
    subscribers.push(cb2);
  }, "subscribe");
  const unsubscribe = /* @__PURE__ */ __name((cb2) => {
    subscribers.splice(subscribers.indexOf(cb2), 1);
  }, "unsubscribe");
  const subscribeOnClose = /* @__PURE__ */ __name((cb2) => {
    onCloseSubscribers.push(cb2);
  }, "subscribeOnClose");
  if (cb) {
    subscribe2(cb);
  }
  let sessionParams = null;
  function deliver(result) {
    if (closed) {
      return;
    }
    for (const sub of subscribers) {
      try {
        sub(result);
      } catch (e) {
        console.error("Error in subscribeQuery callback", e);
      }
    }
  }
  __name(deliver, "deliver");
  function handleMessage(msg) {
    switch (msg.op) {
      case "sse-init": {
        const machineId = msg["machine-id"];
        const sessionId = msg["session-id"];
        sessionParams = { machineId, sessionId };
        break;
      }
      case "add-query-ok": {
        deliver({
          type: "ok",
          data: msg.result,
          pageInfo: formatPageInfo(msg["result-meta"]?.["page-info"]),
          sessionInfo: sessionParams
        });
        break;
      }
      case "refresh-ok": {
        if (msg.computations.length) {
          deliver({
            type: "ok",
            data: msg.computations[0]["instaql-result"],
            pageInfo: formatPageInfo(msg.computations[0]["result-meta"]?.["page-info"]),
            sessionInfo: sessionParams
          });
        }
        break;
      }
      case "error": {
        deliver({
          type: "error",
          error: new InstantAPIError({ body: msg, status: msg.status }),
          get readyState() {
            return esReadyState(es);
          },
          get isClosed() {
            return esReadyState(es) === "closed";
          },
          sessionInfo: sessionParams
        });
        break;
      }
    }
  }
  __name(handleMessage, "handleMessage");
  es.onerror = (e) => {
    if (fetchErrorResponse) {
      fetchErrorResponse.text().then((t) => {
        let body = { type: void 0, message: t };
        try {
          body = JSON.parse(t);
        } catch (_e) {
        }
        deliver({
          type: "error",
          error: new InstantAPIError({
            status: fetchErrorResponse.status,
            body
          }),
          get readyState() {
            return esReadyState(es);
          },
          get isClosed() {
            return esReadyState(es) === "closed";
          },
          sessionInfo: sessionParams
        });
      });
    } else {
      const deliverError = /* @__PURE__ */ __name(() => {
        deliver({
          type: "error",
          error: new InstantAPIError({
            status: e.code || 500,
            body: {
              type: void 0,
              message: e.message || "Unknown error in subscribe query."
            }
          }),
          get readyState() {
            return esReadyState(es);
          },
          get isClosed() {
            return esReadyState(es) === "closed";
          },
          sessionInfo: sessionParams
        });
      }, "deliverError");
      if (es.readyState === EventSource.CLOSED) {
        deliverError();
        return;
      }
      setTimeout(() => {
        if (es.readyState !== EventSource.OPEN) {
          deliverError();
        }
      }, 5e3);
    }
  };
  es.onmessage = (e) => {
    handleMessage(JSON.parse(e.data));
  };
  const close = /* @__PURE__ */ __name(() => {
    closed = true;
    for (const sub of onCloseSubscribers) {
      try {
        sub();
      } catch (e) {
        console.error("Error in onClose callback", e);
      }
    }
    es.close();
  }, "close");
  return {
    close,
    [Symbol.iterator]: () => {
      throw new Error("subscribeQuery does not support synchronous iteration. Use `for await` instead.");
    },
    get sessionInfo() {
      return sessionParams;
    },
    get readyState() {
      return esReadyState(es);
    },
    get isClosed() {
      return esReadyState(es) === "closed";
    },
    [Symbol.asyncIterator]: makeAsyncIterator.bind(this, subscribe2, subscribeOnClose, unsubscribe, () => 1)
  };
}
__name(subscribe, "subscribe");

// ../../node_modules/.bun/@instantdb+admin@0.22.171/node_modules/@instantdb/admin/dist/esm/index.js
var import_cookie = __toESM(require_dist(), 1);
function instantConfigWithDefaults(config) {
  const defaultConfig = {
    apiURI: "https://api.instantdb.com"
  };
  const r = { ...defaultConfig, ...config };
  return r;
}
__name(instantConfigWithDefaults, "instantConfigWithDefaults");
function withImpersonation(headers, opts) {
  if ("email" in opts) {
    headers["as-email"] = opts.email;
  } else if ("token" in opts) {
    headers["as-token"] = opts.token;
  } else if ("guest" in opts) {
    headers["as-guest"] = "true";
  }
  return headers;
}
__name(withImpersonation, "withImpersonation");
function validateConfigAndImpersonation(config, impersonationOpts) {
  if (impersonationOpts && ("token" in impersonationOpts || "guest" in impersonationOpts)) {
    return;
  }
  if (config.adminToken) {
    return;
  }
  if (impersonationOpts && "email" in impersonationOpts) {
    throw new Error("Admin token required. To impersonate users with an email you must pass `adminToken` to `init`.");
  }
  throw new Error("Admin token required. To run this operation pass `adminToken` to `init`, or use `db.asUser`.");
}
__name(validateConfigAndImpersonation, "validateConfigAndImpersonation");
function authorizedHeaders(config, impersonationOpts) {
  validateConfigAndImpersonation(config, impersonationOpts);
  const { adminToken, appId } = config;
  const headers = {
    "content-type": "application/json",
    "app-id": appId
  };
  if (adminToken) {
    headers.authorization = `Bearer ${adminToken}`;
  }
  return impersonationOpts ? withImpersonation(headers, impersonationOpts) : headers;
}
__name(authorizedHeaders, "authorizedHeaders");
function isNextJSVersionThatCachesFetchByDefault() {
  return (
    // NextJS 13 onwards added a `__nextPatched` property to the fetch function
    fetch["__nextPatched"] && // NextJS 15 onwards _also_ added a global `next-patch` symbol.
    !globalThis[/* @__PURE__ */ Symbol.for("next-patch")]
  );
}
__name(isNextJSVersionThatCachesFetchByDefault, "isNextJSVersionThatCachesFetchByDefault");
function getDefaultFetchOpts() {
  return isNextJSVersionThatCachesFetchByDefault() ? { cache: "no-store" } : {};
}
__name(getDefaultFetchOpts, "getDefaultFetchOpts");
async function jsonReject(rejectFn, res) {
  const body = await res.text();
  try {
    const json2 = JSON.parse(body);
    return rejectFn(new InstantAPIError({ status: res.status, body: json2 }));
  } catch (_e) {
    return rejectFn(new InstantAPIError({
      status: res.status,
      body: { type: void 0, message: body }
    }));
  }
}
__name(jsonReject, "jsonReject");
async function jsonFetch2(input, init2) {
  const defaultFetchOpts = getDefaultFetchOpts();
  const headers = {
    ...init2?.headers || {},
    "Instant-Admin-Version": version_default2,
    "Instant-Core-Version": version_default
  };
  const res = await fetch(input, { ...defaultFetchOpts, ...init2, headers });
  if (res.status === 200) {
    const json2 = await res.json();
    return Promise.resolve(json2);
  }
  return jsonReject((x) => Promise.reject(x), res);
}
__name(jsonFetch2, "jsonFetch");
function makeEventSourceWrapper(opts) {
  return class EventSourceWrapper {
    static {
      __name(this, "EventSourceWrapper");
    }
    source;
    static OPEN = EventSource.OPEN;
    static CONNECTING = EventSource.CONNECTING;
    static CLOSED = EventSource.CLOSED;
    url;
    constructor(url) {
      this.url = url;
      this.source = this.#createEventSource(url);
    }
    get onopen() {
      return this.source.onopen;
    }
    set onopen(fn) {
      this.source.onopen = fn;
    }
    get onmessage() {
      return this.source.onmessage;
    }
    set onmessage(fn) {
      this.source.onmessage = fn;
    }
    get onerror() {
      return this.source.onerror;
    }
    set onerror(fn) {
      this.source.onerror = fn;
    }
    get readyState() {
      return this.source.readyState;
    }
    close() {
      this.source.close();
    }
    #createEventSource(url) {
      const es = new EventSource(url, {
        fetch(input, init2) {
          return fetch(input, {
            ...init2,
            method: "POST",
            headers: opts.headers,
            body: JSON.stringify({
              "inference?": opts.inference,
              versions: {
                "@instantdb/admin": version_default2,
                "@instantdb/core": version_default
              }
            })
          });
        }
      });
      return es;
    }
  };
}
__name(makeEventSourceWrapper, "makeEventSourceWrapper");
function init(config) {
  if (!config.appId || !validate_default(config.appId)) {
    console.warn("warning: Instant Admin DB must be initialized with a valid appId. Received: " + JSON.stringify(config.appId));
  }
  const configStrict = {
    ...config,
    appId: config.appId?.trim(),
    adminToken: config.adminToken?.trim(),
    useDateObjects: config.useDateObjects ?? false
  };
  return new InstantAdminDatabase(configStrict);
}
__name(init, "init");
function steps(inputChunks) {
  const chunks = Array.isArray(inputChunks) ? inputChunks : [inputChunks];
  return chunks.flatMap(getOps);
}
__name(steps, "steps");
var Rooms = class {
  static {
    __name(this, "Rooms");
  }
  config;
  constructor(config) {
    this.config = config;
  }
  async getPresence(roomType, roomId) {
    const res = await jsonFetch2(`${this.config.apiURI}/admin/rooms/presence?app_id=${this.config.appId}&room-type=${String(roomType)}&room-id=${roomId}`, {
      method: "GET",
      headers: authorizedHeaders(this.config)
    });
    return res.sessions || {};
  }
};
var Auth = class {
  static {
    __name(this, "Auth");
  }
  config;
  constructor(config) {
    this.config = config;
    this.createToken = this.createToken.bind(this);
  }
  /**
   * Generates a magic code for the user with the given email.
   * This is useful if you want to use your own email provider
   * to send magic codes.
   *
   * @example
   *   // Generate a magic code
   *   const { code } = await db.auth.generateMagicCode({ email })
   *   // Send the magic code to the user with your own email provider
   *   await customEmailProvider.sendMagicCode(email, code)
   *
   * @see https://instantdb.com/docs/backend#custom-magic-codes
   */
  generateMagicCode = /* @__PURE__ */ __name(async (email) => {
    return jsonFetch2(`${this.config.apiURI}/admin/magic_code?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config),
      body: JSON.stringify({ email })
    });
  }, "generateMagicCode");
  /**
   * Sends a magic code to the user with the given email.
   * This uses Instant's built-in email provider.
   *
   * @example
   *   // Send an email to user with magic code
   *   await db.auth.sendMagicCode({ email })
   *
   * @see https://instantdb.com/docs/backend#custom-magic-codes
   */
  sendMagicCode = /* @__PURE__ */ __name(async (email) => {
    return jsonFetch2(`${this.config.apiURI}/admin/send_magic_code?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config),
      body: JSON.stringify({ email })
    });
  }, "sendMagicCode");
  /**
   * @deprecated Use {@link checkMagicCode} instead to get the `created` field
   * and support `extraFields`.
   *
   * @see https://instantdb.com/docs/backend#custom-magic-codes
   */
  verifyMagicCode = /* @__PURE__ */ __name(async (email, code) => {
    const { user } = await jsonFetch2(`${this.config.apiURI}/admin/verify_magic_code?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config),
      body: JSON.stringify({ email, code })
    });
    return user;
  }, "verifyMagicCode");
  /**
   * Verifies a magic code and returns the user along with whether
   * the user was newly created. Supports `extraFields` to set custom
   * `$users` properties at signup.
   *
   * @example
   *   const { user, created } = await db.auth.checkMagicCode(
   *     email,
   *     code,
   *     { extraFields: { nickname: 'ari' } },
   *   );
   *
   * @see https://instantdb.com/docs/backend#custom-magic-codes
   */
  checkMagicCode = /* @__PURE__ */ __name(async (email, code, options) => {
    const res = await jsonFetch2(`${this.config.apiURI}/admin/verify_magic_code?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config),
      body: JSON.stringify({
        email,
        code,
        ...options?.extraFields ? { "extra-fields": options.extraFields } : {}
      })
    });
    return { user: res.user, created: res.created };
  }, "checkMagicCode");
  async createToken(input) {
    const body = typeof input === "string" ? { email: input } : input;
    const ret = await jsonFetch2(`${this.config.apiURI}/admin/refresh_tokens?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config),
      body: JSON.stringify(body)
    });
    return ret.user.refresh_token;
  }
  /**
   * Verifies a given token and returns the associated user.
   *
   * This is often useful for writing custom endpoints, where you need
   * to authenticate users.
   *
   * @example
   *   app.post('/custom_endpoint', async (req, res) => {
   *     const user = await db.auth.verifyToken(req.headers['token'])
   *     if (!user) {
   *       return res.status(401).send('Uh oh, you are not authenticated')
   *     }
   *     // ...
   *   })
   * @see https://instantdb.com/docs/backend#custom-endpoints
   */
  verifyToken = /* @__PURE__ */ __name(async (token) => {
    const res = await jsonFetch2(`${this.config.apiURI}/runtime/auth/verify_refresh_token?app_id=${this.config.appId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        "app-id": this.config.appId,
        "refresh-token": token
      })
    });
    return res.user;
  }, "verifyToken");
  /**
   * Retrieves an app user by id, email, or refresh token.
   *
   * @example
   *   try {
   *     const user = await db.auth.getUser({ email })
   *     console.log("Found user:", user)
   *   } catch (err) {
   *     console.error("Failed to retrieve user:", err.message);
   *   }
   *
   * @see https://instantdb.com/docs/backend#retrieve-a-user
   */
  getUser = /* @__PURE__ */ __name(async (params) => {
    const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    const response = await jsonFetch2(`${this.config.apiURI}/admin/users?app_id=${this.config.appId}&${qs}`, {
      method: "GET",
      headers: authorizedHeaders(this.config)
    });
    return response.user;
  }, "getUser");
  /**
   * Deletes an app user by id, email, or refresh token.
   *
   * NB: This _only_ deletes the user; it does not delete all user data.
   * You will need to handle this manually.
   *
   * @example
   *   try {
   *     const deletedUser = await db.auth.deleteUser({ email })
   *     console.log("Deleted user:", deletedUser)
   *   } catch (err) {
   *     console.error("Failed to delete user:", err.message);
   *   }
   *
   * @see https://instantdb.com/docs/backend#delete-a-user
   */
  deleteUser = /* @__PURE__ */ __name(async (params) => {
    const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`);
    const response = await jsonFetch2(`${this.config.apiURI}/admin/users?app_id=${this.config.appId}&${qs}`, {
      method: "DELETE",
      headers: authorizedHeaders(this.config)
    });
    return response.deleted;
  }, "deleteUser");
  async signOut(input) {
    const params = typeof input === "string" ? { email: input } : input;
    const config = this.config;
    await jsonFetch2(`${config.apiURI}/admin/sign_out?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(config),
      body: JSON.stringify(params)
    });
  }
  /**
   * Get instant user from Request
   *
   * Reads cookies and gets a validated user
   * @param req The request containing a cookie synced with createInstantRouteHandler
   * @param opts Allow disabling validation of refresh token
   */
  getUserFromRequest = /* @__PURE__ */ __name(async (req, opts) => {
    const cookieHeader = req.headers.get("cookie") || "";
    const parsedCookie = (0, import_cookie.parseCookie)(cookieHeader);
    const cookieName = "instant_user_" + this.config.appId;
    if (!parsedCookie[cookieName]) {
      return null;
    }
    const value = parsedCookie[cookieName];
    const user = JSON.parse(value);
    if (!user?.refresh_token) {
      return null;
    }
    if (opts?.disableValidation) {
      return user;
    }
    const verified = await this.verifyToken(user.refresh_token);
    return verified;
  }, "getUserFromRequest");
};
var isNodeReadable = /* @__PURE__ */ __name((v) => v && typeof v === "object" && typeof v.pipe === "function" && typeof v.read === "function", "isNodeReadable");
var isWebReadable = /* @__PURE__ */ __name((v) => v && typeof v.getReader === "function", "isWebReadable");
var Storage = class {
  static {
    __name(this, "Storage");
  }
  config;
  impersonationOpts;
  constructor(config, impersonationOpts) {
    this.config = config;
    this.impersonationOpts = impersonationOpts;
  }
  /**
   * Uploads file at the provided path. Accepts a Buffer or a Readable stream.
   *
   * @see https://instantdb.com/docs/storage
   * @example
   *   const buffer = fs.readFileSync('demo.png');
   *   const isSuccess = await db.storage.uploadFile('photos/demo.png', buffer);
   */
  uploadFile = /* @__PURE__ */ __name(async (path, file, metadata = {}) => {
    const headers = {
      ...authorizedHeaders(this.config, this.impersonationOpts),
      path
    };
    if (metadata.contentDisposition) {
      headers["content-disposition"] = metadata.contentDisposition;
    }
    delete headers["content-type"];
    if (metadata.contentType) {
      headers["content-type"] = metadata.contentType;
    }
    let duplex;
    if (isNodeReadable(file)) {
      duplex = "half";
    }
    if (isNodeReadable(file) || isWebReadable(file)) {
      if (!metadata.fileSize) {
        throw new Error("fileSize is required in metadata when uploading streams");
      }
      headers["content-length"] = metadata.fileSize.toString();
    }
    let options = {
      method: "PUT",
      headers,
      body: file,
      ...duplex && { duplex }
    };
    return jsonFetch2(`${this.config.apiURI}/admin/storage/upload?app_id=${this.config.appId}`, options);
  }, "uploadFile");
  /**
   * Deletes a file by its path name (e.g. "photos/demo.png").
   *
   * @deprecated Use `db.transact` to delete files instead:
   * @example
   *   // Delete by id
   *   await db.transact(db.tx.$files[fileId].delete());
   *
   *   // Delete by path
   *   await db.transact(db.tx.$files[lookup('path', 'photos/demo.png')].delete());
   *
   * @see https://instantdb.com/docs/storage
   */
  delete = /* @__PURE__ */ __name(async (pathname) => {
    return jsonFetch2(`${this.config.apiURI}/admin/storage/files?app_id=${this.config.appId}&filename=${encodeURIComponent(pathname)}`, {
      method: "DELETE",
      headers: authorizedHeaders(this.config, this.impersonationOpts)
    });
  }, "delete");
  /**
   * Deletes multiple files by their path names.
   *
   * @deprecated Use `db.transact` to delete files instead:
   * @example
   *   // Delete multiple files by path
   *   const paths = ['images/1.png', 'images/2.png', 'images/3.png'];
   *   await db.transact(paths.map(p => db.tx.$files[lookup('path', p)].delete()));
   *
   * @see https://instantdb.com/docs/storage
   */
  deleteMany = /* @__PURE__ */ __name(async (pathnames) => {
    return jsonFetch2(`${this.config.apiURI}/admin/storage/files/delete?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config, this.impersonationOpts),
      body: JSON.stringify({ filenames: pathnames })
    });
  }, "deleteMany");
  /**
   * @deprecated. This method will be removed in the future. Use `uploadFile`
   * instead
   */
  upload = /* @__PURE__ */ __name(async (pathname, file, metadata = {}) => {
    const { data: presignedUrl } = await jsonFetch2(`${this.config.apiURI}/admin/storage/signed-upload-url?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config),
      body: JSON.stringify({
        app_id: this.config.appId,
        filename: pathname
      })
    });
    const headers = {};
    const contentType = metadata.contentType;
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    const { ok } = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers
    });
    return ok;
  }, "upload");
  /**
   * @deprecated. This method will be removed in the future. Use `query` instead
   * @example
   * const files = await db.query({ $files: {}})
   */
  list = /* @__PURE__ */ __name(async () => {
    const { data } = await jsonFetch2(`${this.config.apiURI}/admin/storage/files?app_id=${this.config.appId}`, {
      method: "GET",
      headers: authorizedHeaders(this.config)
    });
    return data;
  }, "list");
  /**
   * @deprecated. getDownloadUrl will be removed in the future.
   * Use `query` instead to query and fetch for valid urls
   *
   * db.useQuery({
   *   $files: {
   *     $: {
   *       where: {
   *         path: "moop.png"
   *       }
   *     }
   *   }
   * })
   */
  getDownloadUrl = /* @__PURE__ */ __name(async (pathname) => {
    const { data } = await jsonFetch2(`${this.config.apiURI}/admin/storage/signed-download-url?app_id=${this.config.appId}&filename=${encodeURIComponent(pathname)}`, {
      method: "GET",
      headers: authorizedHeaders(this.config)
    });
    return data;
  }, "getDownloadUrl");
};
var Streams = class {
  static {
    __name(this, "Streams");
  }
  #ensureInstantStream;
  constructor(ensureInstantStream) {
    this.#ensureInstantStream = ensureInstantStream;
  }
  /**
   * Creates a new ReadableStream for the given clientId.
   *
   * @example
   *   const stream = db.streams.createReadStream({clientId: clientId})
   *   for await (const chunk of stream) {
   *     console.log(chunk);
   *   }
   */
  createReadStream = /* @__PURE__ */ __name((opts) => {
    return this.#ensureInstantStream().createReadStream(opts);
  }, "createReadStream");
  /**
   * Creates a new WritableStream for the given clientId.
   *
   * @example
   *   const writeStream = db.streams.createWriteStream({clientId: clientId})
   *   const writer = writeStream.getWriter();
   *   writer.write('Hello world');
   *   writer.close();
   */
  createWriteStream = /* @__PURE__ */ __name((opts) => {
    return this.#ensureInstantStream().createWriteStream(opts);
  }, "createWriteStream");
};
function createLogger2(isEnabled) {
  return {
    info: isEnabled ? (...args) => console.info(...args) : () => {
    },
    debug: isEnabled ? (...args) => console.debug(...args) : () => {
    },
    error: isEnabled ? (...args) => console.error(...args) : () => {
    }
  };
}
__name(createLogger2, "createLogger");
var InstantAdminDatabase = class _InstantAdminDatabase {
  static {
    __name(this, "InstantAdminDatabase");
  }
  config;
  auth;
  storage;
  streams;
  rooms;
  impersonationOpts;
  #sseConnection = null;
  #sseBackoff = 0;
  #instantStream = null;
  #log;
  tx = txInit();
  constructor(_config) {
    this.config = instantConfigWithDefaults(_config);
    this.auth = new Auth(this.config);
    this.storage = new Storage(this.config, this.impersonationOpts);
    this.streams = new Streams(this.#ensureInstantStream.bind(this));
    this.rooms = new Rooms(this.config);
    this.#log = createLogger2(!!this.config.verbose);
  }
  /**
   * Sometimes you want to scope queries to a specific user.
   *
   * You can provide a user's auth token, email, or impersonate a guest.
   *
   * @see https://instantdb.com/docs/backend#impersonating-users
   * @example
   *  await db.asUser({email: "stopa@instantdb.com"}).query({ goals: {} })
   */
  asUser = /* @__PURE__ */ __name((opts) => {
    const newClient = new _InstantAdminDatabase({
      ...this.config
    });
    newClient.impersonationOpts = opts;
    newClient.storage = new Storage(this.config, opts);
    return newClient;
  }, "asUser");
  /**
   * Use this to query your data!
   *
   * @see https://instantdb.com/docs/instaql
   *
   * @example
   *  // fetch all goals
   *  await db.query({ goals: {} })
   *
   *  // goals where the title is "Get Fit"
   *  await db.query({ goals: { $: { where: { title: "Get Fit" } } } })
   *
   *  // all goals, _alongside_ their todos
   *  await db.query({ goals: { todos: {} } })
   */
  query = /* @__PURE__ */ __name((query3, opts = {}) => {
    if (query3 && opts && "ruleParams" in opts) {
      query3 = { $$ruleParams: opts["ruleParams"], ...query3 };
    }
    if (!this.config.disableValidation) {
      validateQuery(query3, this.config.schema);
    }
    const fetchOpts = opts.fetchOpts || {};
    const fetchOptsHeaders = fetchOpts["headers"] || {};
    return jsonFetch2(`${this.config.apiURI}/admin/query?app_id=${this.config.appId}`, {
      ...fetchOpts,
      method: "POST",
      headers: {
        ...fetchOptsHeaders,
        ...authorizedHeaders(this.config, this.impersonationOpts)
      },
      body: JSON.stringify({
        query: query3,
        "inference?": !!this.config.schema
      })
    });
  }, "query");
  /**
   * Use this to to get a live view of your data!
   *
   * @see https://www.instantdb.com/docs/backend
   *
   * @example
   *  // create a subscription to a query
   *  const query = { goals: { $: { where: { title: "Get Fit" } } } }
   *  const sub = db.subscribeQuery(query);
   *
   *  // iterate through the results with an async iterator
   *  for await (const payload of sub) {
   *    if (payload.error) {
   *      console.log(payload.error);
   *      // Stop the subscription
   *      sub.close();
   *    } else {
   *      console.log(payload.data);
   *    }
   *  }
   *
   *  // Stop the subscription
   *  sub.close();
   *
   *  // Create a subscription with a callback
   *  const sub = db.subscribeQuery(query, (payload) => {
   *    if (payload.error) {
   *      console.log(payload.error);
   *      // Stop the subscription
   *      sub.close();
   *    } else {
   *      console.log(payload.data);
   *    }
   *  });
   */
  subscribeQuery(query3, cb, opts = {}) {
    if (query3 && opts && "ruleParams" in opts) {
      query3 = { $$ruleParams: opts["ruleParams"], ...query3 };
    }
    if (!this.config.disableValidation) {
      validateQuery(query3, this.config.schema);
    }
    const fetchOpts = opts.fetchOpts || {};
    const fetchOptsHeaders = fetchOpts["headers"] || {};
    const headers = {
      ...fetchOptsHeaders,
      ...authorizedHeaders(this.config, this.impersonationOpts)
    };
    const inference = !!this.config.schema;
    return subscribe(query3, cb, {
      headers,
      inference,
      apiURI: this.config.apiURI
    });
  }
  /**
   * Use this to write data! You can create, update, delete, and link objects
   *
   * @see https://instantdb.com/docs/instaml
   *
   * @example
   *   // Create a new object in the `goals` namespace
   *   const goalId = id();
   *   db.transact(db.tx.goals[goalId].update({title: "Get fit"}))
   *
   *   // Update the title
   *   db.transact(db.tx.goals[goalId].update({title: "Get super fit"}))
   *
   *   // Delete it
   *   db.transact(db.tx.goals[goalId].delete())
   *
   *   // Or create an association:
   *   todoId = id();
   *   db.transact([
   *    db.tx.todos[todoId].update({ title: 'Go on a run' }),
   *    db.tx.goals[goalId].link({todos: todoId}),
   *  ])
   */
  transact = /* @__PURE__ */ __name((inputChunks) => {
    if (!this.config.disableValidation) {
      validateTransactions(inputChunks, this.config.schema);
    }
    return jsonFetch2(`${this.config.apiURI}/admin/transact?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config, this.impersonationOpts),
      body: JSON.stringify({
        steps: steps(inputChunks),
        "throw-on-missing-attrs?": !!this.config.schema
      })
    });
  }, "transact");
  /**
   * Like `query`, but returns debugging information
   * for permissions checks along with the result.
   * Useful for inspecting the values returned by the permissions checks.
   * Note, this will return debug information for *all* entities
   * that match the query's `where` clauses.
   *
   * Requires a user/guest context to be set with `asUser`,
   * since permissions checks are user-specific.
   *
   * Accepts an optional configuration object with a `rules` key.
   * The provided rules will override the rules in the database for the query.
   *
   * @see https://instantdb.com/docs/instaql
   *
   * @example
   *  await db.asUser({ guest: true }).debugQuery(
   *    { goals: {} },
   *    { rules: { goals: { allow: { read: "auth.id != null" } } }
   *  )
   */
  debugQuery = /* @__PURE__ */ __name(async (query3, opts) => {
    if (query3 && opts && "ruleParams" in opts) {
      query3 = { $$ruleParams: opts["ruleParams"], ...query3 };
    }
    const body = { query: query3, "rules-override": opts?.rules };
    if (opts?.ip) {
      body["ip-override"] = opts.ip;
    }
    if (opts?.origin) {
      body["origin-override"] = opts.origin;
    }
    const response = await jsonFetch2(`${this.config.apiURI}/admin/query_perms_check?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config, this.impersonationOpts),
      body: JSON.stringify(body)
    });
    return {
      result: response.result,
      checkResults: response["check-results"]
    };
  }, "debugQuery");
  /**
   * Like `transact`, but does not write to the database.
   * Returns debugging information for permissions checks.
   * Useful for inspecting the values returned by the permissions checks.
   *
   * Requires a user/guest context to be set with `asUser`,
   * since permissions checks are user-specific.
   *
   * Accepts an optional configuration object with a `rules` key.
   * The provided rules will override the rules in the database for the duration of the transaction.
   *
   * @example
   *   const goalId = id();
   *   db.asUser({ guest: true }).debugTransact(
   *      [db.tx.goals[goalId].update({title: "Get fit"})],
   *      { rules: { goals: { allow: { update: "auth.id != null" } } }
   *   )
   */
  debugTransact = /* @__PURE__ */ __name((inputChunks, opts) => {
    const body = {
      steps: steps(inputChunks),
      "rules-override": opts?.rules,
      // @ts-expect-error because we're using a private API (for now)
      "dangerously-commit-tx": opts?.__dangerouslyCommit
    };
    if (opts?.ip) {
      body["ip-override"] = opts.ip;
    }
    if (opts?.origin) {
      body["origin-override"] = opts.origin;
    }
    return jsonFetch2(`${this.config.apiURI}/admin/transact_perms_check?app_id=${this.config.appId}`, {
      method: "POST",
      headers: authorizedHeaders(this.config, this.impersonationOpts),
      body: JSON.stringify(body)
    });
  }, "debugTransact");
  #setupSSEConnection() {
    if (this.#sseConnection) {
      this.#sseConnection.close();
    }
    const headers = {
      ...authorizedHeaders(this.config, this.impersonationOpts)
    };
    const inference = !!this.config.schema;
    const ES = makeEventSourceWrapper({ headers, inference });
    const conn = new SSEConnection(ES, `${this.config.apiURI}/admin/sse?app_id=${this.config.appId}`, `${this.config.apiURI}/admin/sse/push?app_id=${this.config.appId}`);
    conn.onopen = this.#onopen;
    conn.onmessage = this.#onmessage;
    conn.onclose = this.#onclose;
    conn.onerror = this.#onerror;
    this.#sseConnection = conn;
    return conn;
  }
  #ensureSSEConnection() {
    return this.#sseConnection || this.#setupSSEConnection();
  }
  #trySend(eventId, msg) {
    const sseConnection = this.#ensureSSEConnection();
    this.#log.info("[send]", eventId, msg, {
      isOpen: sseConnection.isOpen()
    });
    if (sseConnection.isOpen()) {
      sseConnection.send({ "client-event-id": eventId, ...msg });
    }
  }
  #setupInstantStream() {
    this.#ensureSSEConnection();
    const instantStream = new InstantStream({
      WStream: this.config.WritableStream || WritableStream,
      RStream: this.config.ReadableStream || ReadableStream,
      trySend: /* @__PURE__ */ __name((eventId, msg) => {
        this.#trySend(eventId, msg);
      }, "trySend"),
      log: this.#log
    });
    this.#instantStream = instantStream;
    return instantStream;
  }
  #ensureInstantStream() {
    return this.#instantStream || this.#setupInstantStream();
  }
  #onopen = /* @__PURE__ */ __name((e) => {
    if (e.target !== this.#sseConnection) {
      this.#log.info("[socket][open]", e.target.id, "skip; this is no longer the current transport");
      return;
    }
    this.#log.info("[socket][open]", e.target.id);
    this.#sseBackoff = 0;
    this.#instantStream?.onConnectionStatusChange("authenticated");
  }, "#onopen");
  #onclose = /* @__PURE__ */ __name((e) => {
    if (e.target !== this.#sseConnection) {
      this.#log.info("[socket][close]", e.target.id, "skip; this is no longer the current transport");
      return;
    }
    this.#log.info("[socket][close]", e.target.id);
    this.#instantStream?.onConnectionStatusChange("closed");
    if (this.#sseConnection) {
      this.#sseConnection = null;
      if (!this.#connectionIsIdle()) {
        setTimeout(() => this.#ensureSSEConnection(), this.#sseBackoff);
        this.#sseBackoff = Math.min(15e3, Math.max(this.#sseBackoff, 500) * 2);
      }
    }
  }, "#onclose");
  #onerror = /* @__PURE__ */ __name((e) => {
    if (e.target !== this.#sseConnection) {
      this.#log.info("[socket][error]", e.target.id, "skip; this is no longer the current transport");
      return;
    }
    this.#log.info("[socket][error]", e.target.id);
    this.#instantStream?.onConnectionStatusChange("closed");
  }, "#onerror");
  #connectionIsIdle() {
    return !this.#instantStream || !this.#instantStream.hasActiveStreams();
  }
  #maybeShutdownConnection() {
    if (this.#sseConnection && this.#connectionIsIdle()) {
      const conn = this.#sseConnection;
      this.#log.info("cleaning up unused socket", conn.id);
      this.#sseConnection = null;
      conn.close();
    }
  }
  #onmessage = /* @__PURE__ */ __name((e) => {
    if (e.target !== this.#sseConnection) {
      this.#log.info("[socket][message]", e.target.id, "skip; this is no longer the current transport");
      return;
    }
    const msg = e.message;
    this.#log.info("[receive]", msg);
    switch (msg.op) {
      case "start-stream-ok": {
        this.#instantStream?.onStartStreamOk(msg);
        break;
      }
      case "stream-flushed": {
        this.#instantStream?.onStreamFlushed(msg);
        break;
      }
      case "append-failed": {
        this.#instantStream?.onAppendFailed(msg);
        break;
      }
      case "stream-append": {
        this.#instantStream?.onStreamAppend(msg);
        break;
      }
      case "error": {
        switch (msg["original-event"]?.op) {
          case "start-stream":
          case "append-stream":
          case "subscribe-stream":
          case "unsubscribe-stream": {
            this.#instantStream?.onRecieveError(msg);
            break;
          }
        }
        break;
      }
    }
    this.#maybeShutdownConnection();
  }, "#onmessage");
};

// ../instant.schema.ts
init_modules_watch_stub();
var instant_schema_default = i.schema({
  entities: {
    $users: i.entity({}),
    licenses: i.entity({
      userId: i.string().indexed(),
      licenseKey: i.string(),
      serial: i.number(),
      createdAt: i.number()
    })
  },
  links: {
    licensesUser: {
      forward: {
        on: "licenses",
        has: "one",
        label: "user",
        onDelete: "cascade"
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "license"
      }
    }
  }
});

// src/utils/instant-admin.ts
function getAdminDb(env) {
  const APP_ID = env.VITE_INSTANTDB_APP_ID;
  const ADMIN_TOKEN = env.INSTANTDB_ADMIN_TOKEN;
  if (!APP_ID) {
    throw new Error("Missing VITE_INSTANTDB_APP_ID");
  }
  return init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
    schema: instant_schema_default
  });
}
__name(getAdminDb, "getAdminDb");

// src/context.ts
var requestContextMiddleware = createMiddleware(
  (c, next) => {
    c.set("adminDb", getAdminDb(c.env));
    const stripeSecretKey = c.env.STRIPE_SECRET_KEY;
    if (stripeSecretKey) {
      c.set("stripe", new stripe_esm_worker_default(stripeSecretKey));
    }
    return next();
  }
);
function requireStripe(c) {
  const stripe = c.get("stripe");
  if (!stripe) {
    throw new HTTPException(500, { message: "Stripe is not configured" });
  }
  return stripe;
}
__name(requireStripe, "requireStripe");

// src/routes/checkout.ts
init_modules_watch_stub();

// src/utils/auth.ts
init_modules_watch_stub();
async function verifyAuthToken(c) {
  const token = c.req.header("authorization")?.replace("Bearer ", "") || null;
  if (!token) {
    return {
      user: null,
      error: c.json({ error: "Authentication required" }, 401)
    };
  }
  const adminDb = getAdminDb(c.env);
  const user = await adminDb.auth.verifyToken(token);
  if (!user) {
    return {
      user: null,
      error: c.json({ error: "Invalid or expired token" }, 401)
    };
  }
  return { user, error: null };
}
__name(verifyAuthToken, "verifyAuthToken");

// src/routes/checkout.ts
async function handleCheckout(c) {
  const authResult = await verifyAuthToken(c);
  if (authResult.error) {
    return authResult.error;
  }
  const adminDb = getAdminDb(c.env);
  const { licenses } = await adminDb.query({
    licenses: { $: { where: { userId: authResult.user.id } } }
  });
  if (licenses.length > 0) {
    return c.json({ error: "Already purchased" }, 400);
  }
  const stripe = requireStripe(c);
  const priceId = c.env.STRIPE_PRICE_ID;
  const host = c.env.HOST;
  if (!priceId) {
    return c.json({ error: "Price ID not configured" }, 500);
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: host ? `${host}/dashboard` : void 0,
      cancel_url: host ? `${host}/dashboard` : void 0,
      metadata: {
        app_user_id: authResult.user.id
      },
      payment_intent_data: {
        metadata: {
          app_user_id: authResult.user.id
        }
      }
    });
    if (!session.url) {
      return c.json({ error: "Failed to create checkout session" }, 500);
    }
    return c.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return c.json(
      {
        error: "Failed to create checkout",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
}
__name(handleCheckout, "handleCheckout");

// src/routes/stripe-webhook.ts
init_modules_watch_stub();

// src/utils/license.ts
init_modules_watch_stub();
var CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function base32Encode(data) {
  let bits = 0;
  let value = 0;
  let result = "";
  for (const byte of data) {
    value = value << 8 | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += CROCKFORD[value >> bits & 31];
    }
  }
  if (bits > 0) {
    result += CROCKFORD[value << 5 - bits & 31];
  }
  return result;
}
__name(base32Encode, "base32Encode");
function formatLicenseKey(base32) {
  const groups = [];
  for (let i2 = 0; i2 < base32.length; i2 += 5) {
    groups.push(base32.slice(i2, i2 + 5));
  }
  return groups.join("-");
}
__name(formatLicenseKey, "formatLicenseKey");
var SERIAL_SIZE = 2;
async function importPrivateKey(pem) {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\\n/g, "").replace(/\s/g, "");
  const binaryString = atob(b64);
  const der = new Uint8Array(binaryString.length);
  for (let i2 = 0; i2 < binaryString.length; i2++) {
    der[i2] = binaryString.charCodeAt(i2);
  }
  return crypto.subtle.importKey("pkcs8", der, { name: "Ed25519" }, false, [
    "sign"
  ]);
}
__name(importPrivateKey, "importPrivateKey");
async function generateLicenseKey(serial, privateKeyPem) {
  const payload = new Uint8Array(SERIAL_SIZE);
  new DataView(payload.buffer).setUint16(0, serial & 65535, false);
  const privateKey = await importPrivateKey(privateKeyPem);
  const sigBuffer = await crypto.subtle.sign("Ed25519", privateKey, payload);
  const sig = new Uint8Array(sigBuffer);
  const combined = new Uint8Array(SERIAL_SIZE + sig.length);
  combined.set(payload, 0);
  combined.set(sig, SERIAL_SIZE);
  return formatLicenseKey(base32Encode(combined));
}
__name(generateLicenseKey, "generateLicenseKey");

// src/routes/stripe-webhook.ts
async function handleStripeWebhook(c) {
  const stripeWebhookSecret = c.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeWebhookSecret) {
    return c.json({ error: "Stripe webhook secret not configured" }, 500);
  }
  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ error: "Missing signature" }, 401);
  }
  const body = await c.req.text();
  const stripe = requireStripe(c);
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      stripeWebhookSecret
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return c.json({ error: "Invalid signature" }, 401);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const appUserId = session.metadata?.app_user_id;
    if (!appUserId) {
      console.error("No app_user_id in session metadata");
      return c.json({ error: "Missing app_user_id" }, 400);
    }
    const adminDb = getAdminDb(c.env);
    const { licenses } = await adminDb.query({
      licenses: { $: { where: { userId: appUserId } } }
    });
    if (licenses.length > 0) {
      return c.json({ received: true });
    }
    const serial = Math.floor(Math.random() * 65535) + 1;
    const privateKeyPem = c.env.LICENSE_PRIVATE_KEY_PEM;
    const licenseKey = await generateLicenseKey(serial, privateKeyPem);
    const licenseId = id_default();
    await adminDb.transact([
      adminDb.tx.licenses[licenseId].update({
        userId: appUserId,
        licenseKey,
        serial,
        createdAt: Date.now()
      }),
      adminDb.tx.licenses[licenseId].link({ user: appUserId })
    ]);
  }
  return c.json({ received: true });
}
__name(handleStripeWebhook, "handleStripeWebhook");

// src/index.ts
var app = new Hono2();
app.use("*", requestContextMiddleware);
app.get("/api/checkout", handleCheckout);
app.post("/api/webhooks/stripe", handleStripeWebhook);
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});
var src_default = { fetch: app.fetch };

// ../../node_modules/.bun/wrangler@4.77.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.bun/wrangler@4.77.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-t8piKW/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/.bun/wrangler@4.77.0/node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-t8piKW/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
