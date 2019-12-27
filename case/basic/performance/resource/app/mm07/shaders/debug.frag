uniform mediump vec4 fm_light_direction;

varying mediump vec3 v_normal;

void main(void)
{
    mediump vec3 N = normalize(v_normal);
    mediump vec3 L = fm_light_direction.xyz;
    mediump float ln  = dot(L, N);
    gl_FragColor.rgb = max(0.0, dot(L, N)) * vec3(0.33, 0.33, 0.33);
    gl_FragColor.a  = 1.0;
}
 