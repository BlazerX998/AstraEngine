// =========================
// Fragment Shader (default.frag)
// =========================
#version 300 es
precision highp float;

in vec3 vFragPos;
in vec3 vNormal;
in vec2 vUV;

out vec4 FragColor;

// === material ===
uniform sampler2D uDiffuseMap;
uniform vec3 uViewPos;

// === light structures ===
struct DirLight {
    vec3 direction;
    vec3 color;
    float intensity;
};
uniform DirLight uDirLights[4];
uniform int uDirCount;

struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
    float constant;
    float linear;
    float quadratic;
};
uniform PointLight uPointLights[8];
uniform int uPointCount;

struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 color;
    float intensity;
    float cutOff;
    float outerCutOff;
};
uniform SpotLight uSpotLights[4];
uniform int uSpotCount;

// === lighting computation helpers ===
vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir) {
    vec3 lightDir = normalize(-light.direction);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 diffuse = diff * light.color * light.intensity;
    vec3 specular = spec * light.color * light.intensity * 0.5;
    return diffuse + specular;
}

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
    vec3 lightDir = normalize(light.position - fragPos);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

    vec3 diffuse = diff * light.color * light.intensity;
    vec3 specular = spec * light.color * light.intensity * 0.5;
    return (diffuse + specular) * attenuation;
}

vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
    vec3 lightDir = normalize(light.position - fragPos);
    float theta = dot(lightDir, normalize(-light.direction));
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);

    float diff = max(dot(normal, lightDir), 0.0);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

    vec3 diffuse = diff * light.color * light.intensity;
    vec3 specular = spec * light.color * light.intensity * 0.5;
    return (diffuse + specular) * intensity;
}

// === main ===
void main() {
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 result = vec3(0.0);

    for (int i = 0; i < uDirCount; ++i)
        result += CalcDirLight(uDirLights[i], norm, viewDir);

    for (int i = 0; i < uPointCount; ++i)
        result += CalcPointLight(uPointLights[i], norm, vFragPos, viewDir);

    for (int i = 0; i < uSpotCount; ++i)
        result += CalcSpotLight(uSpotLights[i], norm, vFragPos, viewDir);

    vec3 texColor = texture(uDiffuseMap, vUV).rgb;
    result = result * texColor;
    FragColor = vec4(result, 1.0);
}
