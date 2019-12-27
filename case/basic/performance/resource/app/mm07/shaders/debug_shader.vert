attribute vec3 fm_position;
attribute vec3 fm_normal;

uniform vec4 fm_view_position;
uniform mat4 fm_local_to_clip_matrix;
uniform mat4 fm_local_to_world_matrix;

varying mediump vec3 v_normal;

void main(void)
{
    precision mediump float;

    gl_Position = fm_local_to_clip_matrix * vec4(fm_position, 1.0);
    v_normal = vec3(fm_local_to_world_matrix * vec4(fm_normal, 0.0));
}
 