uniform sampler2D fm_texture0;
uniform sampler2D fm_texture1;
uniform sampler2D fm_texture2;
uniform mediump vec4 fm_time;
uniform mediump vec4 fm_viewport_x_y_width_height;

varying mediump vec2 v_position;
varying mediump vec3 v_normal;
varying mediump vec3 v_tangent;
varying mediump vec3 v_binormal;
varying mediump vec3 v_view_direction;
varying mediump float v_view_distance;

mediump vec3 fmu_water_normal(mediump vec2 wave_offset, mediump vec2 noise_offset)
{
   mediump vec4 noize = texture2D(fm_texture0, wave_offset) * 2.0 - 1.0;
   mediump vec3 normal = noize.xyz;
   normal.x = mix(noize.b, noize.g, sin(noise_offset.x + noize.b) * 0.5 + 0.5);
   normal.y = 8.0;
   normal.z = mix(noize.r, noize.g, sin(noise_offset.y + noize.r) * 0.5 + 0.5);
   return normalize(normal);
}

void main()
{
   mediump float wave_speed = 0.49;
   mediump float noise_speed = 1.8;
   mediump float jitter_scale = 4.59;

   mediump vec2 wave_offset = fm_time.x * wave_speed + v_position* vec2(1.4353, 1.347);
   mediump vec2 noise_offset = vec2(fm_time.x * noise_speed) + v_position * vec2(3.4353, 13.347);
   mediump vec3 water_normal = fmu_water_normal(wave_offset, noise_offset);
   mediump vec2 jitter = vec2(v_tangent.xy * water_normal.xx + v_binormal.xy * water_normal.zz) * jitter_scale * v_view_distance;

   mediump vec2 screencoord = gl_FragCoord.xy / fm_viewport_x_y_width_height.zw;

   mediump float jitter_power = texture2D(fm_texture1, screencoord).a;
   mediump vec4 reflection_color = texture2D(fm_texture1, screencoord + jitter * jitter_power);

   jitter_power = texture2D(fm_texture2, screencoord).a;
   mediump vec4 underwater_color = texture2D(fm_texture2, screencoord - jitter * jitter_power);

   mediump float lrp = 1.0 - dot(normalize(v_view_direction), water_normal);
   mediump float mix_power = clamp(0.1 + pow(lrp, 6.008), 0.0, 1.0);

   mediump vec3 V = normalize(v_view_direction);
   mediump vec3 N = vec3(0.0, 1.0, 0.0);
   mediump float vn = dot(V, N);
   //mediump float vn = dot(V, water_normal);
   mediump float fresnel = max(0.0, pow(1.0 - vn, 4.0));

   gl_FragColor = mix(underwater_color, reflection_color, mix_power);
   gl_FragColor.rgb = fresnel * reflection_color.rgb;
   gl_FragColor.rgb += max(0.0, 1.0 - fresnel) * underwater_color.rgb;
   gl_FragColor.a = 1.0;
}

 