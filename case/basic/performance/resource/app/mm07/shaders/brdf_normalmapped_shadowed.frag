#define PI (3.1415926535897932384626433832795)
#define PI2 (2.0 * PI)

uniform sampler2D fm_light_map_texture;

uniform mediump vec4 fm_light_diffuse_color;
uniform mediump vec4 fm_light_size;

uniform mediump vec4 fm_delta_diffuse_color;
uniform mediump vec4 fm_delta_specular_color;
uniform mediump vec4 fm_delta_specular_exponent;
uniform mediump vec4 fm_shadow_bias;

uniform mediump vec4 fm_vn_color;
uniform mediump vec4 fm_vn_scale;
uniform mediump vec4 fm_vn_exponent;

uniform sampler2D fm_diffuse_reflectance_texture;
uniform sampler2D      fm_normal_map_texture;
uniform mediump vec4 fm_normal_map_scale;

varying mediump vec4 v_color;
varying mediump vec3 v_normal;
varying mediump vec3 v_view_direction;
varying mediump vec3 v_light_direction;
varying mediump vec4 v_texcoord_and_noise_offset;
varying mediump vec3 v_tangent;
varying mediump vec3 v_binormal;
varying mediump vec4 v_position_in_lightspace;

mediump float fmu_noise2d(mediump vec2 offset)
{
   return fract(pow(abs(offset.x + offset.y * 1.7735375), 5.175755757) * 1375.754877);
}

// Search for potential blockers
mediump float find_blocker(
   sampler2D shadowmap,
   mediump float center_depth,
   mediump vec3 position_in_lightspace,
   mediump vec2 search_kernel,
   mediump float search_width)
{
   mediump float result;
   mediump float blocker_sum = 0.0;
   mediump float receiver = position_in_lightspace.z;
   mediump float shadowmap_depth;
   int blocker_count = 0;

   mediump vec2 offset = vec2(search_width);//search_kernel * search_width;
   mediump vec2 offset2 = vec2(offset.y, -offset.x);

   mediump vec2 samples0 = position_in_lightspace.xy + offset;
   mediump vec2 samples1 = position_in_lightspace.xy - offset;
   mediump vec2 samples2 = position_in_lightspace.xy + offset2;
   mediump vec2 samples3 = position_in_lightspace.xy - offset2;

   if(receiver > center_depth)
   {
         blocker_sum += center_depth;
         ++blocker_count;
   }

   shadowmap_depth = texture2D(shadowmap, samples0).x;
   if(receiver > shadowmap_depth)
   {
         blocker_sum += shadowmap_depth;
         ++blocker_count;
   }

   shadowmap_depth = texture2D(shadowmap, samples1).x;
   if(receiver > shadowmap_depth)
   {
         blocker_sum += shadowmap_depth;
         ++blocker_count;
   }

   shadowmap_depth = texture2D(shadowmap, samples2).x;
   if(receiver > shadowmap_depth)
   {
         blocker_sum += shadowmap_depth;
         ++blocker_count;
   }

   shadowmap_depth = texture2D(shadowmap, samples3).x;
   if(receiver > shadowmap_depth)
   {
         blocker_sum += shadowmap_depth;
         ++blocker_count;
   }

   if(blocker_count < 1)
   {
      // set it to a unique number so we can check
      // later to see if there was no blocker
      result = 1.0;
   }
   else
   {
       // return average depth of the blockers
      result = blocker_sum / float(blocker_count);
   }

   return result;
}

// Estimate penumbra based on
// blocker estimate, receiver depth, and light size
// ------------------------------------------------
mediump float estimatePenumbra(
   mediump float light_size,
   mediump float receiver,
   mediump float blocker)
{
   mediump float penumbra;

   // estimate penumbra using parallel planes approximation
   if(blocker > 0.0) {
      penumbra = (receiver - blocker) * light_size / blocker;
   } else {
      penumbra = 1.0;
   }
   
   return penumbra;
}

// Percentage-closer filter implementation with
// variable filter width and kernel
// ----------------------------------------------------
mediump float PCF_Filter(
   sampler2D shadowmap,
   mediump float center_depth,
   mediump vec3 position_in_lightspace,
   mediump vec2 filter_kernel,
   mediump float filter_width)
{
   mediump float receiver = position_in_lightspace.z;
   mediump float shadowmap_depth;

   // sum of successful depth tests
   mediump float sum = (receiver > center_depth) ? 1.0 : 0.0;

   mediump vec2 offset = filter_kernel * filter_width;
   mediump vec2 offset2 = vec2(offset.y, -offset.x);

   shadowmap_depth = texture2D(shadowmap, position_in_lightspace.xy + offset).x;
   sum += (receiver > shadowmap_depth) ? 1.0 : 0.0;

   shadowmap_depth = texture2D(shadowmap, position_in_lightspace.xy - offset).x;
   sum += (receiver > shadowmap_depth) ? 1.0 : 0.0;

   shadowmap_depth = texture2D(shadowmap, position_in_lightspace.xy + offset2).x;
   sum += (receiver > shadowmap_depth) ? 1.0 : 0.0;

   shadowmap_depth = texture2D(shadowmap, position_in_lightspace.xy - offset2).x;
   sum += (receiver > shadowmap_depth) ? 1.0 : 0.0;

   // return average of the samples
   return (sum * 0.20);
}

mediump float computeShadow(
   sampler2D in_shadowmap,
   mediump float in_light_size,
   mediump vec3 in_position_in_lightspace,
   mediump vec2 in_noise_offset)
{
   mediump float kernel_angle = fmu_noise2d(in_noise_offset) * PI2;
   mediump vec2 kernel = vec2(cos(kernel_angle), sin(kernel_angle));

   mediump vec3 position_in_lightspace;
   position_in_lightspace.xy = in_position_in_lightspace.xy;
   position_in_lightspace.z =  min(in_position_in_lightspace.z, 1.0);

   // get center sample
   mediump float center_depth = texture2D(in_shadowmap, position_in_lightspace.xy + kernel * 0.005).x;

   // Step 1: Find blocker estimate
   mediump float blocker = find_blocker(
      in_shadowmap,
      center_depth,
      position_in_lightspace,
      kernel,
      in_light_size);// / in_position_in_lightspace.z);

   mediump float shadowed = 0.0;
   if(blocker < 1.0)
   {
      // Step 2: Estimate penumbra using parallel planes approximation
      mediump float penumbra = estimatePenumbra(
         in_light_size,
         in_position_in_lightspace.z, // use original depth
         blocker);

      // Step 3: Compute percentage-closer filter
      // based on penumbra estimate
      shadowed = PCF_Filter(
         in_shadowmap,
         center_depth,
         position_in_lightspace,
         kernel,
         penumbra);
   }

   return shadowed;
}

void main(void)
{
    mediump float shadowed = computeShadow(
      fm_light_map_texture,
      fm_light_size.x,
      v_position_in_lightspace.xyz,
      v_texcoord_and_noise_offset.zw);

    mediump vec3  T  = normalize(v_tangent);
    mediump vec3  B  = normalize(v_binormal);

    mediump vec3  texture_normal = texture2D(fm_normal_map_texture, v_texcoord_and_noise_offset.xy).xyz * 2.0 - 1.0;

    mediump vec3 N  = normalize(v_normal);

    N = normalize(
	fm_normal_map_scale.x * texture_normal.x * T + 
	fm_normal_map_scale.x * texture_normal.y * B + 
	texture_normal.z * N
    );

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
   mediump vec3 shadow = min(vec3(1.0 - shadowed), v_color.rgb);

    // Specular
    mediump vec3 delta_specular = vec3(0.0);
    if(hn > 0.0)
    {
        delta_specular = pow(max(hn, 0.0), fm_delta_specular_exponent.x) * fm_delta_specular_color.rgb;
    }

    mediump vec4 tex = texture2D(fm_diffuse_reflectance_texture, v_texcoord_and_noise_offset.xy);
    mediump vec3 ambient = tex.rgb * fm_light_diffuse_color.rgb;

    gl_FragColor.rgb  = shadow * tex.rgb * (delta_diffuse + fresnel + tex.a * delta_specular) + ambient;
    gl_FragColor.a  = 1.0;
}
 