import { useTheme } from './ThemeContext';
import { darkColors, lightColors } from './colors';

const useColors = () => {
  const { theme } = useTheme();
  return theme === 'dark' ? darkColors : lightColors;
};

export default useColors;
