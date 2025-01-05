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
import countryData from "../public/data/TaiwanSelection/topoJson/towns-mercator.json";
import taoyuanVillage from "../public/data/TaiwanSelection/topoJson/tw-village/68000.json";

describe("TaiwanSelection.vue", () => {
  let mapData = [];
  let townsData = [];
  let villagesData = [];

  function genPath(dom, data) {
    const path = d3.geoPath();
    dom.selectAll("path").data(data).enter().append("path").attr("d", path);
  }

  let wrapper;
  beforeAll(() => {
    // Mock mounted 方法，避免執行真實邏輯
    TaiwanSelection.mounted = vi.fn();
  });

  beforeEach(async () => {
    wrapper = shallowMount(TaiwanSelection);
    mapData = topojson.feature(
      countryData,
      countryData.objects.counties
    ).features;

    townsData = topojson.feature(
      countryData,
      countryData.objects.towns
    ).features;

    villagesData = topojson.feature(
      taoyuanVillage,
      taoyuanVillage.objects.village
    ).features;

    const { initMap, appendMap, getDomFromDeep } = wrapper.vm;
    // 初始化d3地圖
    await initMap(true);
    const dom = getDomFromDeep(0);
    // 產生d3地圖
    appendMap(dom, mapData);
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
  it("initMap", () => {
    const { d3Svg, mapGroup, countrySvg, townSvg, villageSvg } = wrapper.vm;

    expect(d3Svg.node().tagName).toBe("svg");
    expect(mapGroup.attr("class")).toBe("map-group");
    expect(countrySvg.attr("class")).toBe("selected-county-country");
    expect(townSvg.attr("class")).toBe("selected-county-towns");
    expect(villageSvg.attr("class")).toBe("selected-county-villages");
  });

  // 生成地圖
  it("appendMap", () => {
    const { appendMap, getDomFromDeep } = wrapper.vm;
    const dom = getDomFromDeep(0);
    appendMap(dom, mapData);
    expect(dom.selectAll("path").size()).toBe(mapData.length);
  });

  // 計算刪除的節點
  it("calculateNodesToDelete", () => {
    const { calculateNodesToDelete, townSvg } = wrapper.vm;

    // 同層移動
    const townsMockData = townsData.filter((item) => item.id.includes("68000"));
    genPath(townSvg, townsMockData);
    calculateNodesToDelete(1, 1);
    expect(townSvg.selectAll("path").size()).toBe(0);

    // 往深層移動
    genPath(townSvg, townsMockData);
    calculateNodesToDelete(1, 2);
    expect(townSvg.selectAll("path").size()).toBe(0);
  });

  //刪除path節點
  it("removeAllPath", () => {
    const { removeAllPath } = wrapper.vm;
    const path = d3.geoPath();
    const svg = d3.create("svg");
    svg.selectAll("path").data(mapData).enter().append("path").attr("d", path);

    expect(svg.selectAll("path").size(), "測試範本不可沒有資料").not.toBe(0);
    removeAllPath(svg);
    expect(svg.selectAll("path").size()).toBe(0);
  });

  //地圖聚焦
  it("focusMap", () => {
    const { focusMap } = wrapper.vm;
    focusMap(1, mapData[0]);
    const { mapGroup } = wrapper.vm;
    const focusNode = mapGroup.select(".focus").node();

    expect(focusNode).not.toBe(null);
    expect(focusNode.getAttribute("d")).not.toBe(null);
    expect(focusNode.getAttribute("stroke-width")).toBe("0.3");
  });

  //moveMapInCenter
  // it.only("moveMapInCenter", () => {
  //   const { moveMapInCenter } = wrapper.vm;
  //   const { mapGroup } = wrapper.vm;
  //   const node = mapGroup.node();
  //   const transform = node.getAttribute("class");
  //   console.log("transform 1", transform);

  //   moveMapInCenter();
  //   console.log("transform 2", transform);
  // });

  //moveMap
});
