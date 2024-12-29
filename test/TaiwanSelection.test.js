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
import countryData from "../public/data/TaiwanSelection/topoJson/towns-mercator.json"

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

  // 計算支持率
  it("calauteSelectionRate", () => {
    const { calauteSelectionRate } = wrapper.vm;
    const id = 68000050039;
    const data1 = [
      {
        village_id: "68000050039",
        cand_info: [
          {
            cand_no: 1,
            tks_rate: 39.96,
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
    const data2 = [
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
    const data3 = [
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
            tks_rate: 70.38,
          },
        ],
      },
    ];

    expect(calauteSelectionRate(id, data1)).toBe("#00ffff");
    expect(calauteSelectionRate(id, data2)).toBe("rgb(88, 220, 152)");
    expect(calauteSelectionRate(id, data3)).toBe("rgb(56, 112, 189)");
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

  // 生成地圖
  it('appendMap', async ()=>{
    const { initMap, appendMap, getDomFromDeep } = wrapper.vm;
    await initMap(true);
    const dom = getDomFromDeep(0);
    const mapData = topojson.feature(
      countryData,
      countryData.objects.counties
    ).features
    appendMap(dom, mapData);
    expect(dom.selectAll("path").size()).toBe(mapData.length)
  })

  //removeChild
  //moveMap
  //focusMap
  //moveMapInCenter
});
