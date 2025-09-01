import { createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';
import themeConfig from '../theme.config';

const defaultState = {
    isDarkMode: false,
    isBlueMode: false,
    isPeachOrangeMode: false,
    isLightMintGreenMode: false,
    isCornflowerMode: false,
    isSalmonPinkMode: false,
    isClassicMode: false, 
    mainLayout: 'app',
    theme: 'light',
    menu: 'vertical',
    layout: 'full',
    rtlClass: 'ltr',
    animation: '',
    navbar: 'navbar-sticky',
    locale: 'en',
    sidebar: false,
    pageTitle: '',
    languageList: [
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
    ],
    semidark: false,
};

const initialState = {
    ...defaultState,
    theme: localStorage.getItem('theme') || themeConfig.theme,
    menu: localStorage.getItem('menu') || themeConfig.menu,
    layout: localStorage.getItem('layout') || themeConfig.layout,
    rtlClass: localStorage.getItem('rtlClass') || themeConfig.rtlClass,
    animation: localStorage.getItem('animation') || themeConfig.animation,
    navbar: localStorage.getItem('navbar') || themeConfig.navbar,
    locale: localStorage.getItem('i18nextLng') || themeConfig.locale,
    sidebar: localStorage.getItem('sidebar') === 'true',
    semidark: localStorage.getItem('semidark') === 'true',
    isDarkMode: false,
    isBlueMode: false,
    isPeachOrangeMode: false,
    isLightMintGreenMode: false,
    isCornflowerMode: false,
    isSalmonPinkMode: false,
    isClassicMode: false, 
    languageList: [
        ...defaultState.languageList,
        { code: 'ae', name: 'Arabic' },
    ],
};

const themeConfigSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleTheme(state, { payload }) {
            payload = payload || state.theme;
            localStorage.setItem('theme', payload);
            state.theme = payload;

            // Reset all theme flags
            state.isDarkMode = false;
            state.isBlueMode = false;
            state.isPeachOrangeMode = false;
            state.isLightMintGreenMode = false;
            state.isCornflowerMode = false;
            state.isSalmonPinkMode = false;
            state.isClassicMode = false;

            if (payload === 'dark') {
                state.isDarkMode = true;
            } else if (payload === 'blue') {
                state.isBlueMode = true;
            } else if (payload === 'peach') {
                state.isPeachOrangeMode = true;
            } else if (payload === 'lightmint') {
                state.isLightMintGreenMode = true;
            } else if (payload === 'cornflower') {
                state.isCornflowerMode = true;
            } else if (payload === 'salmonpink') {
                state.isSalmonPinkMode = true;
            } else if (payload === 'classic') {
                state.isClassicMode = true;
            } else if (payload === 'system') {
                state.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            // Remove all existing theme classes
            const body = document.querySelector('body');
            body?.classList.remove('dark', 'blue-mode', 'peach', 'lightmint', 'cornflower', 'salmonpink', 'classic');

            // Apply the selected theme class
            if (state.isDarkMode) {
                body?.classList.add('dark');
            } else if (state.isBlueMode) {
                body?.classList.add('blue-mode');
            } else if (state.isPeachOrangeMode) {
                body?.classList.add('peach');
            } else if (state.isLightMintGreenMode) {
                body?.classList.add('lightmint');
            } else if (state.isCornflowerMode) {
                body?.classList.add('cornflower');
            } else if (state.isSalmonPinkMode) {
                body?.classList.add('salmonpink');
            } else if (state.isClassicMode) {
                body?.classList.add('classic');
            }
        },
        toggleMenu(state, { payload }) {
            payload = payload || state.menu;
            state.sidebar = false;
            localStorage.setItem('menu', payload);
            state.menu = payload;
        },
        toggleLayout(state, { payload }) {
            payload = payload || state.layout;
            localStorage.setItem('layout', payload);
            state.layout = payload;
        },
        toggleRTL(state, { payload }) {
            payload = payload || state.rtlClass;
            localStorage.setItem('rtlClass', payload);
            state.rtlClass = payload;
            document.querySelector('html')?.setAttribute('dir', state.rtlClass || 'ltr');
        },
        toggleAnimation(state, { payload }) {
            payload = payload?.trim() || state.animation;
            localStorage.setItem('animation', payload);
            state.animation = payload;
        },
        toggleNavbar(state, { payload }) {
            payload = payload || state.navbar;
            localStorage.setItem('navbar', payload);
            state.navbar = payload;
        },
        toggleSemidark(state, { payload }) {
            const value = payload === true || payload === 'true';
            localStorage.setItem('semidark', value.toString());
            state.semidark = value;
        },
        toggleLocale(state, { payload }) {
            payload = payload || state.locale;
            i18next.changeLanguage(payload);
            state.locale = payload;
        },
        toggleSidebar(state) {
            state.sidebar = !state.sidebar;
        },
        setPageTitle(state, { payload }) {
            document.title = `${payload}`;
        },
    },
});

export const {
    toggleTheme,
    toggleMenu,
    toggleLayout,
    toggleRTL,
    toggleAnimation,
    toggleNavbar,
    toggleSemidark,
    toggleLocale,
    toggleSidebar,
    setPageTitle,
} = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
