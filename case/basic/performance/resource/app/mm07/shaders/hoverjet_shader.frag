uniform mediump vec4 fm_light_diffuse_color;
uniform mediump vec4 fm_light_direction;
uniform mediump vec4 fm_object_shadow;

uniform mediump vec4 fm_delta_diffuse_color;
uniform mediump vec4 fm_delta_specular_color;
uniform mediump vec4 fm_delta_specular_exponent;
uniform mediump vec4 fm_color_posx;
uniform mediump vec4 fm_color_posy;
uniform mediump vec4 fm_color_negy;

uniform mediump vec4 fm_shadow_bias;

uniform mediump vec4 fm_vn_color;
uniform mediump vec4 fm_vn_scale;
uniform mediump vec4 fm_vn_exponent;

uniform sampler2D fm_texture0;

varying mediump vec3 v_normal;
varying mediump vec3 v_view_direction;
varying mediump vec2 v_texcoord0;

void main(void)
{
    mediump vec3 N  = normalize(v_normal);
    mediump vec3 V  = normalize(v_view_direction);
    mediump vec3 L  = normalize(fm_light_direction.xyz);
    mediump vec3 H = normalize(L + V);

    mediump float ln   = dot(L, N);
    //mediump float vn  = dot(V, N);
    mediump float hn = dot(H, N);
    //mediump float vn_clamped = max(0.0, vn);
    mediump float ln_clamped  = max(0.0, ln);
    
    // Diffuse
    mediump vec3 delta_diffuse = ln_clamped * fm_delta_diffuse_color.rgb; 

    // Fresnel
    //mediump vec3 fresnel =  pow(1.0 - vn_clamped, fm_vn_exponent.x) * fm_vn_scale.x * fm_vn_color.rgb * ln_clamped;

    // Shadow
    mediump vec3 shadow = clamp(fm_object_shadow.rgb + fm_shadow_bias.xxx, 0.0, 1.0);

    // Ambient diffuse
    mediump vec3 ambient_diffuse = vec3(0.0);
    ambient_diffuse += max(0.0, 1.0 - abs(N.y)) * fm_color_posx.rgb;
    ambient_diffuse += max(0.0, N.y) * fm_color_posy.rgb;
    ambient_diffuse += max(0.0, -N.y) * fm_color_negy.rgb;

    // Specular
    mediump vec3 delta_specular = vec3(0.0);
    if(ln > 0.0)
    {
        delta_specular = pow(max(hn, 0.0), fm_delta_specular_exponent.x) * fm_delta_specular_color.rgb;
    }

    mediump vec4 tex = texture2D(fm_texture0, v_texcoord0);

    gl_FragColor.rgb  = shadow * tex.rgb * (delta_diffuse + ambient_diffuse) + tex.a * delta_specular;
    gl_FragColor.a  = 1.0;
}
 