attribute mediump vec3 fm_position;
attribute mediump vec3 fm_normal;
attribute mediump vec2 fm_weights;
attribute mediump vec2 fm_matrix_indices;

uniform mediump vec4 fm_light_direction;
uniform mediump vec4 fm_view_position;
uniform mediump mat4 fm_world_to_clip_matrix;
uniform mediump vec4 fm_bones_3x4[90];

varying mediump vec3 v_normal;

void main(void)
{
    mediump int index1 = 3 * int(fm_matrix_indices.x);
    mediump int index2 = 3 * int(fm_matrix_indices.y);

    mediump vec4 b1 = fm_weights.x * fm_bones_3x4[index1] + fm_weights.y * fm_bones_3x4[index2];
    mediump vec4 b2 = fm_weights.x * fm_bones_3x4[index1 + 1] + fm_weights.y * fm_bones_3x4[index2 + 1];
    mediump vec4 b3 = fm_weights.x * fm_bones_3x4[index1 + 2] + fm_weights.y * fm_bones_3x4[index2 + 2];

    // matrix is packed into 3 vectors
    mediump mat4 skin_to_world_matrix;
    skin_to_world_matrix[0] = vec4(b1.xyz, 0.0);
    skin_to_world_matrix[1] = vec4(b1.w, b2.xy, 0.0);
    skin_to_world_matrix[2] = vec4(b2.zw, b3.x, 0.0);
    skin_to_world_matrix[3] = vec4(b3.yzw, 1.0); 
    mediump mat4 skin_to_clip_matrix = fm_world_to_clip_matrix * skin_to_world_matrix;

    gl_Position = skin_to_clip_matrix * vec4(fm_position, 1.0);
    v_normal = vec3(skin_to_world_matrix* vec4(fm_normal, 0.0));
}
 