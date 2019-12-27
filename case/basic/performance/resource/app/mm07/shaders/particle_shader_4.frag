
varying mediump float v_time; 

uniform sampler2D fm_diffuse_reflectance_texture;

uniform mediump vec4 fm_object_shadow; 
uniform mediump vec4 fm_shadow_bias;

void main(void)
{
    gl_FragColor = texture2D(fm_diffuse_reflectance_texture, gl_PointCoord); 
    gl_FragColor.a -= v_time;

    // shadow
    gl_FragColor.rgb *= clamp(fm_object_shadow.rgb + fm_shadow_bias.xxx, 0.0, 1.0);
}
 