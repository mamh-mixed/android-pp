uniform sampler2D fm_diffuse_reflectance_texture;
uniform sampler2D fm_normal_map_texture;
uniform sampler2D fm_detail_map_texture;
uniform mediump vec4 fm_color0; //skin_unscattered;
uniform mediump vec4 fm_color1; //skin_melanin;
uniform mediump vec4 fm_color2; //skin_hemoglobin;
uniform mediump vec4 fm_delta_specular_color;
uniform mediump vec4 fm_delta_specular_scale;
uniform mediump vec4 fm_delta_specular_exponent;
uniform mediump vec4 fm_delta_specular_roughness;
uniform mediump vec4 fm_vn_scale;
uniform mediump vec4 fm_vn_exponent;
uniform mediump vec4 fm_translucency_exponent;
uniform mediump vec4 fm_translucency_ramp_off;
uniform mediump vec4 fm_texture_scale;

varying mediump vec2 v_texcoord;
varying mediump vec3 v_normal;
varying mediump vec3 v_tangent;
varying mediump vec3 v_binormal;
varying mediump vec3 v_view_direction;
varying mediump vec3 v_light_direction;

mediump vec4 TransPass(mediump float translucency_factor, mediump float dotln)
{
   mediump float translucence = smoothstep(-fm_translucency_ramp_off.x * translucency_factor, 1.0, dotln);
   //translucence = (dotln < 1.0) ? translucence : translucence - 1.0;
   mediump vec4 color = mix(fm_color2, mix(fm_color1 * fm_translucency_exponent.x, fm_color0, dotln), translucence);

   return color * translucence;
}

mediump float SpecularFrontOn(mediump vec3 normal, mediump vec3 view_direction, mediump vec3 light_direction, mediump float power, mediump float gloss)
{
   mediump vec3 specular_reflect = (2.0 * dot(normal, light_direction) * normal - light_direction);
   mediump float specular = pow(clamp(dot(specular_reflect, view_direction), 0.0, 1.0), gloss) * power;

   return specular;
}

void main(void)
{
   precision mediump float;

   vec3 normal = normalize(v_normal);
   vec3 tangent = normalize(v_tangent);
   vec3 binormal = normalize(v_binormal);
   vec3 view_direction = normalize(v_view_direction);
   vec3 light_direction = normalize(v_light_direction);
   
   vec4 diffuse_sample = texture2D(fm_diffuse_reflectance_texture, v_texcoord);
   vec4 normal_sample = texture2D(fm_normal_map_texture, v_texcoord);
   vec4 micro_sample = texture2D(fm_detail_map_texture, v_texcoord * fm_texture_scale.x);

   vec3 texnormal = (normal_sample.xyz * 2.0 - 1.0) + (micro_sample.xyz * 2.0 - 1.0);

   normal = (texnormal.z * normal) + (texnormal.y * binormal) + (texnormal.x * tangent);
   normal = normalize(normal);

   float dotln = dot(light_direction, normal);
   float dotvn = dot(view_direction, normal);

   // compute translucency (note: factor is stored in normal map alpha channel)
   vec4 translucency = TransPass(normal_sample.a, dotln);
   vec4 a = diffuse_sample;
   vec4 b = (translucency);
   vec4 base_color = ((1.0 - a) * (a * b) + a * (1.0 - (1.0 - a) * (1.0 - b))) * b;

   // compute fresnel
   float fresnel_mask = clamp(dotvn * fm_delta_specular_roughness.x, 0.0, 1.0);
   float fresnel_strength = clamp(1.0 - fresnel_mask, 0.0, 1.0) * fm_vn_exponent.x + 1.0;
   float fresnel_glossiness = fresnel_mask * fm_vn_scale.x + 1.0;

   // compute specular (note: factor is stored in diffuse map alpha channel)
   float specular_front_on = SpecularFrontOn(
      normal,
      view_direction,
      light_direction,
      fm_delta_specular_exponent.x * fresnel_strength,
      fm_delta_specular_scale.x * fresnel_glossiness * diffuse_sample.a);
   vec4 specular = specular_front_on * fm_delta_specular_color * translucency.x;

   gl_FragColor.rgb = base_color.rgb + specular.rgb;
   gl_FragColor.a = 1.0;
} 