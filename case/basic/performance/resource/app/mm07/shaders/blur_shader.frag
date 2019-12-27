uniform sampler2D fm_texture0;
uniform mediump vec4 fm_filter_kernel_size;

varying mediump vec2 v_texcoord;

void main()
{
    mediump vec2 offset = fm_filter_kernel_size.xx;

    gl_FragColor = 0.2 * texture2D(fm_texture0, v_texcoord);
    gl_FragColor += 0.2 * texture2D(fm_texture0, v_texcoord + vec2(-1.0, -1.0) * offset);
    gl_FragColor += 0.2 * texture2D(fm_texture0, v_texcoord + vec2( 1.0, -1.0) * offset);
    gl_FragColor += 0.2 * texture2D(fm_texture0, v_texcoord + vec2(-1.0,  1.0) * offset);
    gl_FragColor += 0.2 * texture2D(fm_texture0, v_texcoord + vec2( 1.0,  1.0) * offset);
}
 