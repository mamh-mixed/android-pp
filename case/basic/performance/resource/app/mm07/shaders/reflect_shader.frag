uniform sampler2D fm_diffuse_reflectance_texture;
uniform mediump vec4 fm_light_diffuse_color;
uniform mediump vec4 fm_delta_diffuse_color;

varying mediump vec4 v_color;
varying mediump vec2 v_texcoord;
varying mediump float v_calm_height;

void main(void)
{
    mediump vec3 tex = texture2D(fm_diffuse_reflectance_texture, v_texcoord).rgb;
    mediump vec3 ambient = tex.rgb * fm_light_diffuse_color.rgb;
    gl_FragColor.rgb = tex.rgb * fm_delta_diffuse_color.rgb * v_color.rgb + ambient. rgb;
    gl_FragColor.a = v_calm_height;
} 