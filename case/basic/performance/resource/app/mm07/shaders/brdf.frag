uniform mediump vec4 fm_light_diffuse_color;

uniform mediump vec4 fm_delta_diffuse_color;
uniform mediump vec4 fm_delta_specular_color;
uniform mediump vec4 fm_delta_specular_exponent;

uniform mediump vec4 fm_shadow_bias;

uniform mediump vec4 fm_vn_color;
uniform mediump vec4 fm_vn_scale;
uniform mediump vec4 fm_vn_exponent;

uniform sampler2D fm_diffuse_reflectance_texture;

varying mediump vec4 v_color;
varying mediump vec3 v_normal;
varying mediump vec3 v_view_direction;
varying mediump vec3 v_light_direction;
varying mediump vec2 v_texcoord;


void main(void)
{
    mediump vec3 N  = normalize(v_normal);

    mediump vec3 V  = normalize(v_view_direction);
    mediump vec3 L  =  normalize(v_light_direction.xyz);
    mediump vec3 H = normalize(L + V);

    mediump float ln   = dot(L, N);
    mediump float vn  = dot(V, N);
    mediump float hn = dot(H, N);
    mediump float vn_clamped = max(0.0, vn);
    mediump float ln_clamped  = max(0.0, ln);
    
    // Diffuse
    mediump vec3 delta_diffuse = ln_clamped * fm_delta_diffuse_color.rgb; 

    // Fresnel
    mediump vec3 fresnel =  pow(1.0 - vn_clamped, fm_vn_exponent.x) * fm_vn_scale.x * fm_vn_color.rgb * ln_clamped;

    // Shadow
   mediump vec3 shadow = clamp(fm_shadow_bias.xxx + v_color.rgb, 0.0, 1.0);

    // Specular
    mediump vec3 delta_specular = vec3(0.0);
    if(ln > 0.0)
    {
        delta_specular = pow(max(hn, 0.0), fm_delta_specular_exponent.x) * fm_delta_specular_color.rgb;
    }

    mediump vec4 tex = texture2D(fm_diffuse_reflectance_texture, v_texcoord);
    mediump vec3 ambient = tex.rgb * fm_light_diffuse_color.rgb;

    gl_FragColor.rgb  = shadow * tex.rgb * (delta_diffuse + fresnel + tex.a * delta_specular) + ambient;
    gl_FragColor.a  = 1.0;
}
 