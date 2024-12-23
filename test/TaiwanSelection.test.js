import { mount, shallowMount } from "@vue/test-utils";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import TaiwanSelection from "@/stories/TaiwanSelection/Taiwan.vue";

describe("TaiwanSelection.vue", () => {
  let wrapper;
  beforeAll(() => {
    // Mock initMap 方法，避免執行真實邏輯
    TaiwanSelection.methods.initMap = vi.fn();
    TaiwanSelection.methods.initD3js = vi.fn();
  });

  beforeEach(() => {
    wrapper = shallowMount(TaiwanSelection);
  });

  afterEach(() => {
    vi.restoreAllMocks(); // 清理所有 Mock
  });

  it("updateSelectionData", async () => {
    const { updateSelectionData } = wrapper.vm;
    const mockData = [{ id: 1, name: "Test County" }];

    updateSelectionData(mockData);
    var { selectionData } = wrapper.vm;
    expect(selectionData).toEqual(mockData);

    wrapper.vm.selectionData = [];

    updateSelectionData([]);
    var { selectionData } = wrapper.vm;
    expect(selectionData).toEqual([]);
  });
});
