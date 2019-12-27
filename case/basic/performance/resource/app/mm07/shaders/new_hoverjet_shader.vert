attribute vec3 fm_position;
attribute vec3 fm_normal;
attribute vec2 fm_texcoord0;
attribute vec4 fm_color;

uniform vec4 fm_view_position;
uniform mediump vec4 fm_light_direction;

uniform mat4 fm_local_to_clip_matrix;
uniform mat4 fm_local_to_world_matrix;

varying mediump vec3 v_normal;
varying mediump vec2 v_texcoord0;
varying mediump vec3 v_view_direction;
varying mediump vec4 v_color;
varying mediump vec3 v_half;

void main(void)
{
    precision mediump float;

    mediump vec3 position = vec3(fm_local_to_world_matrix * vec4(fm_position, 1.0));

    gl_Position = fm_local_to_clip_matrix * vec4(fm_position, 1.0);
    v_normal = vec3(fm_local_to_world_matrix* vec4(fm_normal, 0.0));
    v_texcoord0 = fm_texcoord0;
    v_view_direction  = normalize(fm_view_position.xyz - position);
    v_half = normalize(v_view_direction + fm_light_direction.xyz);
    v_color = fm_color / 255.0;
}
 