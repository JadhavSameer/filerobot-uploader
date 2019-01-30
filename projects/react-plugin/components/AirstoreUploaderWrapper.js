import React from 'react';
import configureStore from '../module.hot';
import AirstoreUploader from './AirstoreUploader';
import { ThemeProvider } from 'styled-components';
import { getReducers } from '../reducers';
import { I18n } from 'react-i18nify';
import * as translations from '../assets/translations';
import '../assets/fonts/scaleflex-icon-font.css';
import theme, { colorSchemes } from '../assets/styles/colorScheme';

I18n.setTranslations(translations);

export default ({ initialOptions = {}, opened = false, onClose = () => {}, initialTab = null, ...otherProps }) => {
  initialOptions.colorScheme = initialOptions.colorScheme || {};

  const colorTheme = initialOptions.colorScheme.active;
  const colors = colorTheme === 'custom' ? initialOptions.colorScheme[colorTheme] : colorSchemes[colorTheme || 'default'];
  const resultTheme = {
    ...theme,
    ...colors
  };

  return (
    <ThemeProvider theme={resultTheme}>
      <AirstoreUploader
        opened={opened}
        onClose={onClose}
        initialTab={initialTab}
        initialOptions={initialOptions}
        {...otherProps}
      />
    </ThemeProvider>
  );
}

const createAirstoreUploaderStore = () => configureStore();

export { createAirstoreUploaderStore, getReducers };