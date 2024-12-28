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
import { JSDOM } from "jsdom";
import { nextTick } from "vue";
import country from "../public/data/TaiwanSelection/topoJson/towns-mercator.json"

describe("TaiwanSelection.vue", () => {
  let wrapper;
  beforeAll(() => {
    // Mock initMap 方法，避免執行真實邏輯
    // TaiwanSelection.methods.initMap = vi.fn();
    // TaiwanSelection.methods.initD3js = vi.fn();

    TaiwanSelection.mounted = vi.fn();
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

  // 初始化地圖
  it("initMap", async () => {
    const { initMap } = wrapper.vm;
    await initMap(true);
    const { d3Svg, mapGroup, countrySvg, townSvg, villageSvg } = wrapper.vm;

    expect(d3Svg.node().tagName).toBe("svg");
    expect(mapGroup.attr("class")).toBe("map-group");
    expect(countrySvg.attr("class")).toBe("selected-county-country");
    expect(townSvg.attr("class")).toBe("selected-county-towns");
    expect(villageSvg.attr("class")).toBe("selected-county-villages");
  });

  // 刪除地圖
  it("removeChild", async ()=>{
    const { removeChild, getDomFromDeep, initMap, appendMap } = wrapper.vm;
    await initMap(true);
    // appendMap(0);
    console.log('country',country);
    
    const dom = getDomFromDeep(0);

    // setTimeout(()=>{
    //   console.log('dom=>',dom.selectAll("path").empty());
    // },1000)

    
  })
});
