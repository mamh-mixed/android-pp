attribute mediump vec4 fm_color;
attribute mediump vec3 fm_position;
attribute mediump vec3 fm_normal;
attribute mediump vec3 fm_tangent;
attribute mediump vec2 fm_texcoord0;

uniform mediump mat4 fm_shadow_world_to_clip_matrix;
uniform mediump vec4 fm_shadow_bias;

uniform mediump vec4 fm_light_position;
uniform mediump vec4 fm_view_position;

uniform mediump mat4 fm_local_to_clip_matrix;
uniform mediump mat4 fm_local_to_world_matrix;

uniform mediump vec4 fm_time;

varying mediump vec3 v_normal;
varying mediump vec3 v_tangent;
varying mediump vec3 v_binormal;
varying mediump vec4 v_texcoord_and_noise_offset;
varying mediump vec3 v_view_direction;
varying mediump vec3 v_light_direction;
varying mediump vec4 v_position_in_lightspace;
varying mediump vec4 v_color;


void main(void)
{
    mediump vec3 position = vec3(fm_local_to_world_matrix * vec4(fm_position, 1.0));

    gl_Position = fm_local_to_clip_matrix * vec4(fm_position, 1.0);
    v_normal = vec3(fm_local_to_world_matrix* vec4(fm_normal, 0.0));
    v_tangent = vec3(fm_local_to_world_matrix * vec4(fm_tangent, 0.0));
    v_binormal = cross(v_normal, v_tangent);
    v_texcoord_and_noise_offset.xy = fm_texcoord0;
    v_view_direction  = fm_view_position.xyz - position;
    v_light_direction  = fm_light_position.xyz - position.xyz;

    v_position_in_lightspace = fm_shadow_world_to_clip_matrix * vec4(position, 1.0);
    v_position_in_lightspace.z = v_position_in_lightspace.z - fm_shadow_bias.x;
    v_texcoord_and_noise_offset.zw = ((gl_Position.xy / gl_Position.w) * 0.5) + 0.9 + sin(fm_time.x) * 0.1;
    v_color = fm_color / 255.0;
}
 