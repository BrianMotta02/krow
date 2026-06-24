import { Image, type ImageStyle, type StyleProp } from 'react-native';

const LOGO_SOURCE = require('../assets/images/logo.png');

// Proporção real do arquivo logo.png (750 x 332).
const LOGO_ASPECT_RATIO = 750 / 332;

export type LogoProps = {
  /** Altura da logo em pixels. A largura é calculada pela proporção da imagem. */
  height?: number;
  style?: StyleProp<ImageStyle>;
};

/**
 * Logo da marca KROW (ícone + texto) a partir de assets/images/logo.png.
 * Use este componente em qualquer lugar que precise exibir a logo.
 */
export function Logo({ height = 40, style }: LogoProps) {
  return (
    <Image
      source={LOGO_SOURCE}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="KROW"
      style={[{ height, width: height * LOGO_ASPECT_RATIO }, style]}
    />
  );
}
