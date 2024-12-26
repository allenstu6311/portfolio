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
import * as d3 from "d3";
import * as topojson from "topojson";

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

  // 合併選舉資料
  it("updateSelectionData", () => {
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

  // 計算支持率
  it("calauteSelectionRate", () => {
    const { calauteSelectionRate } = wrapper.vm;
    const id = 68000050039;
    const data = [
      {
        village_id: "68000050039",
        cand_info: [
          {
            cand_no: 1,
            tks_rate: 31.96,
          },
          {
            cand_no: 2,
            tks_rate: 37.67,
          },
          {
            cand_no: 3,
            tks_rate: 30.38,
          },
        ],
      },
    ];

    expect(calauteSelectionRate(id, data)).toBe("rgb(88, 220, 152)");
  });
});
