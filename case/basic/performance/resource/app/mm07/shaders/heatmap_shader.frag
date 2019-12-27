#define PI2 (2.0 * 3.1415926535897932384626433832795)

uniform mediump vec4 fm_time;

varying mediump vec2 v_offset;

mediump vec2 compute_distort(mediump float x, mediump float y)
{
   mediump float animation_frame = 1.0 + fm_time.x * 0.0895757;
   mediump float x_noise = sin(x * PI2 * 1913.3349485 * animation_frame);
   mediump float y_noise = cos(y * PI2 * 1282.5526763 * animation_frame);
   mediump float bonus_noise = cos((y + x) * PI2 * 2000.2526763 * animation_frame);
   return vec2(x_noise, y_noise) + bonus_noise;
}

void main(void)
{
   gl_FragColor.rg = 0.5 + 0.5 * compute_distort(v_offset.x, v_offset.y);
   gl_FragColor.b = 0.0;
   gl_FragColor.a = 1.0;
} 