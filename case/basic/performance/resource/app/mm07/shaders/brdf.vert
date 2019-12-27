attribute vec4 fm_color;
attribute vec3 fm_position;
attribute vec3 fm_normal;
attribute vec2 fm_texcoord0;

uniform mediump vec4 fm_light_position;
uniform mediump vec4 fm_view_position;

uniform mediump mat4 fm_local_to_clip_matrix;
uniform mediump mat4 fm_local_to_world_matrix;

varying mediump vec4 v_color;
varying mediump vec2 v_texcoord;
varying mediump vec3 v_normal;
varying mediump vec3 v_view_direction;
varying mediump vec3 v_light_direction;

void main(void)
{
    mediump vec4 vertex_position_world = fm_local_to_world_matrix * vec4(fm_position, 1.0);

    gl_Position = fm_local_to_clip_matrix * vec4(fm_position, 1.0);
    v_normal = vec3(fm_local_to_world_matrix* vec4(fm_normal, 0.0));
    v_texcoord = fm_texcoord0;
    v_color = fm_color / 255.0;
    v_view_direction  = fm_view_position.xyz - vertex_position_world.xyz;
    v_light_direction  = fm_light_position.xyz - vertex_position_world.xyz;
}
 