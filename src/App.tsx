
import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {
  toggleRTL,
  toggleTheme,
  toggleLocale,
  toggleMenu,
  toggleLayout,
  toggleAnimation,
  toggleNavbar,
  toggleSemidark,
} from './store/themeConfigSlice';
import { useSettings } from './useContext/useSettings';

interface Preferences {
  Theme?: string;
  FontFamily?: string;
  FontSize?: string;
}

const fontFamilyMap: Record<string, string> = {
  latofont: '"Lato", sans-serif',
  sans: 'ui-sans-serif, system-ui',
  serif: 'ui-serif, Georgia',
  mono: 'ui-monospace, SFMono-Regular',
  arial: 'Arial, sans-serif',
  cursive: '"Comic Sans MS", cursive',
  opendyslexic: '"OpenDyslexic", sans-serif',
};

const themeMap: Record<string, string> = {
  'Light': 'light',
  'Dark': 'dark',
  'System': 'system',
  'Pale Sky Blue': 'blue',
  'Peach Orange': 'peach',
  'SoftAzure': 'softAzure',
  'Light Mint Green': 'light-mint-green',
  'Cornflower Blue': 'cornflower-blue',
  'Salmon Pink': 'salmon-pink',
};

function App({ children }: PropsWithChildren) {
  const themeConfig = useSelector((state: RootState) => state.themeConfig);
  const dispatch = useDispatch();
  const { preferences } = useSettings();

  const fontFamily = preferences?.FontFamily || 'latoLight';
  const fontSize = preferences?.FontSize || '14px';

  

  const getEffectiveTheme = (): string => {
    const rawTheme = preferences?.Theme || '';
    const resolved = themeMap[rawTheme] || rawTheme.toLowerCase().replace(/\s+/g, '-');

    if (resolved === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return resolved;
  };

  const currentTheme = getEffectiveTheme();

  useEffect(() => {
    // Update body class
    const themeClasses = Object.values(themeMap).filter((val) => val !== 'system');
    document.body.classList.remove(...themeClasses);
    if (currentTheme) document.body.classList.add(currentTheme);

    // Initialize Redux theme settings
    dispatch(toggleTheme(localStorage.getItem('theme') || currentTheme));
    dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
    dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
    dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
    dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
    dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
    dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
    dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));

    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (preferences?.Theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        dispatch(toggleTheme(newTheme));
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [dispatch, preferences?.Theme]);

  return (
    <div
      style={{
        fontFamily: fontFamilyMap[fontFamily.toLowerCase()] || fontFamily,
        fontSize,
      }}
      className={`
        main-section antialiased relative text-sm font-normal
        ${themeConfig.sidebar ? 'toggle-sidebar' : ''}
        ${themeConfig.menu}
        ${themeConfig.layout}
        ${themeConfig.rtlClass}
        ${currentTheme}
      `}
    >
      {children}
    </div>
  );
}

export default App;
