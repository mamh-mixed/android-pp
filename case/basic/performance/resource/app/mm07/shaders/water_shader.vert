attribute mediump vec3 fm_position;
attribute mediump vec3 fm_normal;

uniform mediump vec4 fm_time;

uniform mediump vec4 fm_light_direction;
uniform mediump vec4 fm_view_position;

uniform mediump mat4 fm_local_to_world_matrix;
uniform mediump mat4 fm_world_to_clip_matrix;

varying mediump vec2 v_position;
varying mediump vec3 v_normal;
varying mediump vec3 v_tangent;
varying mediump vec3 v_binormal;
varying mediump vec3 v_view_direction;
varying mediump float v_view_distance;

void main()
{
    mediump vec4 vertex_position_world = fm_local_to_world_matrix * vec4(fm_position, 1.0);

    v_position = fm_position.xz * 0.2;
    v_normal = vec3 (0.0, 1.0, 0.0);
    v_tangent = vec3( fm_world_to_clip_matrix *  vec4 (1.0, 0.0, 0.0, 0.0));
    v_binormal = vec3( fm_world_to_clip_matrix *  vec4 (0.0, 0.0, 1.0, 0.0));

    v_view_direction  = fm_view_position.xyz - vertex_position_world.xyz;
    v_view_distance = 1.0 / length(v_view_direction);

    gl_Position = fm_world_to_clip_matrix * vertex_position_world;
} 