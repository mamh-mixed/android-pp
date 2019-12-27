uniform sampler2D fm_texture0;
uniform mediump vec4 fm_filter_threshold;
uniform mediump vec4 fm_filter_intensity;

varying mediump vec2 v_texcoord;

mediump vec2 c_blur_center = vec2(0.5, 0.5);
mediump float c_max_distance = 0.71;
const lowp int c_sample_count = 8;

mediump vec4 radial_blur(
    sampler2D colormap,
    mediump vec2 texcoord,
    mediump vec2 blurdir,
    mediump float max_radius
)
{
   mediump vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
   mediump float scale;

   for(int i = 0; i < c_sample_count; ++i)
   {
      scale = max_radius * (float(i) / float(c_sample_count - 1));
      color += 0.125 * texture2D(fm_texture0, texcoord + blurdir * scale);
   }
   return color;
}

void main()
{
   mediump vec2 blurdir = normalize(c_blur_center - v_texcoord);

   mediump float distance_to_center = distance(v_texcoord, c_blur_center);
   mediump float blur_start = (1.0 - fm_filter_threshold.x) * c_max_distance;
   mediump float blur_range = c_max_distance - blur_start;

   mediump float power = (distance_to_center - blur_start) / blur_range;
   mediump float blur_width = power * fm_filter_intensity.x;

   if(distance_to_center < blur_start)
   {
      gl_FragColor = texture2D(fm_texture0, v_texcoord);
   }
   else
   {
      gl_FragColor = radial_blur(fm_texture0, v_texcoord, blurdir, blur_width);
   }
} 