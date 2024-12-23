import { fn } from "@storybook/test";

import TaiwanSelection from "./Taiwan.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "TaiwanSelection/Taiwan",
  component: TaiwanSelection,
  tags: ["autodocs"],
  argTypes: {
    deepVal: { control: "number", min: 0, max: 3 }, // 動態修改 deepVal
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    deepVal: 0,
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  render: (args) => ({
    components: { TaiwanSelection },
    setup() {
      const updateDeep = (newDeep) => {
        args.deepVal = newDeep; // 更新 deepVal
      };
      return { args, updateDeep };
    },
    template: `<TaiwanSelection :deepVal="args.deepVal" @updateDeep='updateDeep'/>`,
  }),
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Country = {
  args: {
    deepVal: 0,
  },
};
