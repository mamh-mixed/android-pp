attribute mediump vec3 fm_position;
attribute mediump vec3 fm_normal;
attribute mediump vec4 fm_color;

uniform mediump vec4 fm_view_position;
uniform mediump vec4 fm_texture_scale;

uniform mediump mat4 fm_local_to_clip_matrix;
uniform mediump mat4 fm_local_to_world_matrix;

varying mediump vec3 v_position;
varying mediump vec3 v_normal;
varying mediump vec4 v_color;
varying mediump vec3 v_view_direction;

void main(void)
{
    precision mediump float;

    v_position = vec3(fm_local_to_world_matrix * vec4(fm_position, 1.0));

    gl_Position = fm_local_to_clip_matrix * vec4(fm_position, 1.0);
    v_view_direction  = fm_view_position.xyz - v_position;
    v_normal = vec3(fm_local_to_world_matrix* vec4(fm_normal, 0.0));
    v_color = fm_color / 255.0;
    v_position *= fm_texture_scale.x; 
}
 