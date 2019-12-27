uniform sampler2D fm_diffuse_reflectance_texture;

varying mediump vec2 v_texcoord;
varying mediump float v_intensity;

void main(void)
{
    gl_FragColor = texture2D(fm_diffuse_reflectance_texture,  v_texcoord) * v_intensity;
    gl_FragColor.a  = 1.0;
}
 