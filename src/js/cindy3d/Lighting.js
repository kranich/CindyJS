/**
 * @constructor
 * @struct
 */
function Lighting() {
  this.ambient = [0, 0, 0];
  this.lights = [new PointLight([0, 0, 0], [1, 1, 1], [0, 0, 0])];
  this.modified = false;
}

/** @type {Array.<number>} */
Lighting.prototype.ambient;

/** @type {Array.<Light>} */
Lighting.prototype.lights;

/** @type {boolean} */
Lighting.prototype.modified;

/**
 * @return {string}
 */
Lighting.prototype.shaderCode = function() {
  let vars = "", code = "";
  for (let i = 0; i < this.lights.length; ++i) {
    if (this.lights[i]) {
      vars += this.lights[i].shaderVars(i);
      code += this.lights[i].shaderCode(i);
    }
  }
  return vars + "void lightScene() {\n" + code + "}";
};

/**
 * @param {Object} u
 */
Lighting.prototype.setUniforms = function(u) {
  u["uAmbient"](this.ambient);
  for (let i = 0; i < this.lights.length; ++i)
    if (this.lights[i])
      this.lights[i].setUniforms(u, i);
};

/**
 * @param {string} type
 * @param {Array.<string>} args
 * @constructor
 */
function Light(type, args) {
  this.type = type;
  this.args = args;
}

/** @type {string} */
Light.prototype.type;

/** @type {Array.<string>} */
Light.prototype.args;

/** @enum {string} */
Light.prototype.typeMap = {
  "uDiffuse": "vec3",
  "uSpecular": "vec3",
  "uLightPos": "vec3",
  "uLightDir": "vec3",
  "uSpotDir": "vec3",
  "uSpotCosCutoff": "float",
  "uSpotExponent": "float",
};

/**
 * @param {number} i
 * @return {string}
 */
Light.prototype.shaderCode = function(i) {
  return "  " + this.type + "(" + this.args.map(
    a => a + i).join(", ") + ");\n";
};

/**
 * @param {number} i
 * @return {string}
 */
Light.prototype.shaderVars = function(i) {
  return this.args.map(
    a => "uniform " + this.typeMap[a] + " " + a + i + ";\n").join("");
};

/**
 * @param {Object} u
 * @param {number} i
 */
Light.prototype.setUniforms = function(u, i) {
  this.args.forEach(a => u[a + i](this[a]));
};

/**
 * @constructor
 * @extends Light
 */
function PointLight(pos, diffuse, specular) {
  this["uLightPos"] = pos;
  this["uDiffuse"] = diffuse;
  this["uSpecular"] = specular;
}

PointLight.prototype = new Light(
  "pointLight", ["uLightPos", "uDiffuse", "uSpecular"]);
