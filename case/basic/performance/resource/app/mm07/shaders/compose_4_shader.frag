uniform sampler2D fm_texture0;
uniform sampler2D fm_texture1;
uniform sampler2D fm_texture2;
uniform sampler2D fm_texture3;

varying mediump vec2 v_texcoord;

void main()
{
   mediump vec4 color0 = texture2D(fm_texture0, v_texcoord * 2.0);
   mediump vec4 color1 = texture2D(fm_texture1, (v_texcoord - vec2(0.5, 0.0)) * 2.0);
   mediump vec4 color2 = texture2D(fm_texture2, (v_texcoord - vec2(0.0, 0.5)) * 2.0);
   mediump vec4 color3 = texture2D(fm_texture3, (v_texcoord - vec2(0.5, 0.5)) * 2.0);

   if(v_texcoord. y < 0.5) {
      gl_FragColor = (v_texcoord.x < 0.5) ? color0 : color1;
   } else {
      gl_FragColor = (v_texcoord.x < 0.5) ? color2 : color3;
   }
   gl_FragColor.a = 1.0;
} 