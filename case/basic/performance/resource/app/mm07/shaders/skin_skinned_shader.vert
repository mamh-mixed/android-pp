attribute vec3 fm_position;
attribute vec3 fm_normal;
attribute vec3 fm_tangent;
attribute vec2 fm_weights;
attribute vec2 fm_matrix_indices;
attribute vec2 fm_texcoord0;

uniform vec4 fm_light_position;
uniform vec4 fm_view_position;
uniform mat4 fm_world_to_clip_matrix;
uniform vec4 fm_bones_3x4[90];

varying mediump vec2 v_texcoord;
varying mediump vec3 v_normal;
varying mediump vec3 v_tangent;
varying mediump vec3 v_binormal;
varying mediump vec3 v_view_direction;
varying mediump vec3 v_light_direction;

void main(void)
{
    precision mediump float;

    int index1 = 3 * int(fm_matrix_indices.x);
    int index2 = 3 * int(fm_matrix_indices.y);

    vec4 b1 = fm_weights.x * fm_bones_3x4[index1] + fm_weights.y * fm_bones_3x4[index2];
    vec4 b2 = fm_weights.x * fm_bones_3x4[index1 + 1] + fm_weights.y * fm_bones_3x4[index2 + 1];
    vec4 b3 = fm_weights.x * fm_bones_3x4[index1 + 2] + fm_weights.y * fm_bones_3x4[index2 + 2];

    // matrix is packed into 3 vectors
    mat4 skin_to_world_matrix;
    skin_to_world_matrix[0] = vec4(b1.xyz, 0.0);
    skin_to_world_matrix[1] = vec4(b1.w, b2.xy, 0.0);
    skin_to_world_matrix[2] = vec4(b2.zw, b3.x, 0.0);
    skin_to_world_matrix[3] = vec4(b3.yzw, 1.0); 

    vec4 vertex_position_world = skin_to_world_matrix * vec4(fm_position, 1.0);

    v_normal = vec3(skin_to_world_matrix* vec4(fm_normal, 0.0));
    v_tangent = vec3(skin_to_world_matrix * vec4(fm_tangent, 0.0));
    v_binormal = cross(v_normal, v_tangent);
    v_texcoord = fm_texcoord0;
    v_view_direction  = fm_view_position.xyz - vertex_position_world.xyz;
    v_light_direction = fm_light_position.xyz - vertex_position_world.xyz;

   gl_Position = fm_world_to_clip_matrix * vertex_position_world;
}
 