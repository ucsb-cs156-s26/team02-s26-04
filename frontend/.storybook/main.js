/** @type { import('@storybook/react-vite').StorybookConfig } */
import { mergeConfig } from "vite";

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ["../public"],

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          main: "/src/main",
        },
      },
    });
  },
};

export default config;