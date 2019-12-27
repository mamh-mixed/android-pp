uniform sampler2D fm_diffuse_reflectance_texture;

uniform mediump vec4 fm_color0;
uniform mediump vec4 fm_color1;

varying mediump vec2 v_texcoord;
varying mediump vec4 v_brighness;
varying mediump float v_depth;

void main(void)
{
   // compute water color
   mediump vec4 water_color_surface = vec4(fm_color0.rgb, 0.2);
   mediump vec4 water_color_bottom = vec4(fm_color1.rgb, 1.0);
   mediump float water_depth = clamp(pow(v_depth, 0.15), 0.0, 1.0);
   mediump vec4 water_color = mix(water_color_surface, water_color_bottom, water_depth);

   mediump vec4 texcolor = texture2D(fm_diffuse_reflectance_texture, v_texcoord);
   mediump vec4 material_color = texcolor * v_brighness;

   gl_FragColor = mix(material_color, material_color * water_color, water_color.a);
   gl_FragColor.a = texcolor.a;
}

 