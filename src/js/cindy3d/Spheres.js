/**
 * @param {Viewer} viewer
 * @constructor
 * @extends {PrimitiveRenderer}
 */
function Spheres(viewer) {
  let vs = [
    "precision mediump float;",
    c3d_resources.sphere_vert
  ].join("\n");
  let fs = [
    "precision mediump float;",
    viewer.lightingCode,
    c3d_resources.common_frag,
    c3d_resources.sphere_frag
  ].join("\n");
  if (viewer.glExtFragDepth)
    fs = "#extension GL_EXT_frag_depth : enable\n" + fs;
  this.init(viewer.gl.TRIANGLES, viewer.gl, vs, fs);
}

Spheres.prototype = new PrimitiveRenderer(
  ["aCenter", "aColor", "aRelativeRadius"], [0, 1, 2, 2, 1, 3]);

/**
 * @param {Array.<number>} pos
 * @param {number} radius
 * @param {Array.<number>} color
 */
Spheres.prototype.add = function(pos, radius, color) {
  let x = pos[0], y = pos[1], z = pos[2], w = pos[3];
  let r = color[0], g = color[1], b = color[2], a = color[3];
  if (a < 1.0)
    this.opaque = false;
  this.addPrimitive([
    x, y, z, w, r, g, b, a,  1.0,  1.0, 0.0, radius,
    x, y, z, w, r, g, b, a, -1.0,  1.0, 0.0, radius,
    x, y, z, w, r, g, b, a,  1.0, -1.0, 0.0, radius,
    x, y, z, w, r, g, b, a, -1.0, -1.0, 0.0, radius
  ]);
};

/**
 * @param {Viewer} viewer
 * @param {number} mode
 */
Spheres.prototype.render = function(viewer, mode) {
  this.renderPrimitives(viewer.gl, u => {
    viewer.setUniforms(u);
    u["sphereMode"]([mode]);
  });
};
