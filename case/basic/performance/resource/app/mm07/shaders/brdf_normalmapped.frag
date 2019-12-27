uniform mediump vec4 fm_light_diffuse_color;

uniform mediump vec4 fm_delta_diffuse_color;
uniform mediump vec4 fm_delta_specular_color;
uniform mediump vec4 fm_delta_specular_exponent;

uniform mediump vec4 fm_shadow_bias;

uniform mediump vec4 fm_vn_color;
uniform mediump vec4 fm_vn_scale;
uniform mediump vec4 fm_vn_exponent;

uniform sampler2D fm_diffuse_reflectance_texture;
uniform sampler2D fm_normal_map_texture;
uniform mediump vec4 fm_normal_map_scale;

varying mediump vec3 v_normal;
varying mediump vec4 v_color;
varying mediump vec3 v_view_direction;
varying mediump vec3 v_light_direction;
varying mediump vec2 v_texcoord;
varying mediump vec3 v_tangent;
varying mediump vec3 v_binormal;

void main(void)
{
     mediump vec3  T  = normalize(v_tangent);
     mediump vec3  B  = normalize(v_binormal);

     mediump vec3  texture_normal = texture2D(fm_normal_map_texture, v_texcoord).xyz * 2.0 - 1.0;

    mediump vec3 N  = normalize(v_normal);

    N = normalize(
	fm_normal_map_scale.x * texture_normal.x * T + 
	fm_normal_map_scale.x * texture_normal.y * B + 
	texture_normal.z * N
    );

    mediump vec3 V  = normalize(v_view_direction);
    mediump vec3 L  =  normalize(v_light_direction);
    mediump vec3 H = normalize(L + V);

    mediump float ln = dot(L, N);
    mediump float vn = dot(V, N);
    mediump float hn = dot(H, N);
    mediump float vn_clamped = max(0.0, vn);
    mediump float ln_clamped  = max(0.0, ln);

    mediump vec4 tex = texture2D(fm_diffuse_reflectance_texture, v_texcoord);
    mediump vec3 ambient = tex.rgb * fm_light_diffuse_color.rgb;
    
    // Diffuse
    mediump vec3 delta_diffuse = ln_clamped * fm_delta_diffuse_color.rgb; 

    // Fresnel
    mediump vec3 fresnel =  pow(1.0 - vn_clamped, fm_vn_exponent.x) * fm_vn_scale.x * fm_vn_color.rgb;// * ln_clamped;

    // Shadow   // uncomment if per vertex shadows in use. 
   mediump vec3 shadow = ambient + v_color.rgb;

    // Specular
    mediump vec3 delta_specular = vec3(0.0);
    if(ln > 0.0)
    {
        delta_specular = pow(max(hn, 0.0), fm_delta_specular_exponent.x) * fm_delta_specular_color.rgb;
    }

    gl_FragColor.rgb  = shadow * tex.rgb * (delta_diffuse + fresnel + tex.a * delta_specular * shadow) + ambient;
    gl_FragColor.a  = 1.0;
}
 