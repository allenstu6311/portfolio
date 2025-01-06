<template>
  <svg ref="svg"></svg>
</template>
<script>
import {
  assignValue,
  getInitSize,
  getPartyColorBySupport,
  getTransform,
} from "@/utils/TaiwanSelection";
import * as d3 from "d3";
import * as topojson from "topojson";
import { pathname } from "../../utils/TaiwanSelection";

const { bounds } = d3.geoPath();
const geoPath = d3.geoPath();

export default {
  props: {
    deepVal: {
      type: Number,
      default: 0,
    },
    searchParam: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    locationMap: {
      type: Object,
      default: {},
    },
  },
  emits: [
    "updateDeep",
    "getLocationData",
    "updateSelectionInfo",
    "update:loading",
  ],
  data() {
    return {
      countryInfo: {
        name: "",
        dom: "",
        id: "",
        textContent: "",
      },
      townInfo: {
        name: "",
        dom: "",
        textContent: "",
      },
      villageInfo: {
        name: "",
        dom: "",
        textContent: "",
      },
      d3Svg: "",
      countrySvg: "",
      mapGroup: "",
      townSvg: "",
      villageSvg: "",
      areaData: "",
      villageData: "",
      villageDataList: {},
      selectionData: [],
      selectionInfo: {},
      zoom: null,
      allowAutoZoom: true, //允許D3自動調整位置
      initData: {},
    };
  },
  watch: {
    deepVal: {
      handler(newVal, oldVal) {
        this.updateDeepVal(newVal, oldVal);
      },
    },
    // 父層查詢事件
    async searchParam(param) {
      const { idList, id } = param;

      this.$emit("updateDeep", 0); //reset map
      this.villageData = await this.getMapData(idList[0]);
      for (let i = 1; i <= idList.length; i++) {
        await this.updateCurrInfo(idList[i - 1], i);
        this.$emit("updateDeep", i);
        await this.$nextTick();
      }
    },
  },
  methods: {
    async initEnv(init) {
      if (init) {
        this.initMap();
        this.areaData = await this.getMapData(); //獲得第一層圖層
        const { counties } = this.areaData.objects;

        // 等待所有請求完成
        const promises = counties.geometries.map((geometry) => {
          return this.getSelectionData(geometry.id);
        });
        const results = await Promise.all(promises);
        // 批量更新數據
        this.selectionData = results.flat(); // 將所有結果展平合併

        const { dom, mapData } = this.getGenMapData(0);
        this.initData = bounds({
          type: "FeatureCollection",
          features: mapData, // 将你的数组包装成 FeatureCollection
        });
        // 產生地圖
        this.appendMap(dom, mapData);
      }
      this.moveMap(this.initData);
    },
    initMap() {
      const { svg } = this.$refs;
      this.d3Svg = d3.select(svg);
      this.mapGroup = this.d3Svg.append("g").attr("class", "map-group");

      this.countrySvg = this.mapGroup
        .append("g")
        .attr("class", "selected-county-country");
      this.townSvg = this.mapGroup
        .append("g")
        .attr("class", "selected-county-towns");
      this.villageSvg = this.mapGroup
        .append("g")
        .attr("class", "selected-county-villages");
    },
    initD3js() {
      if (!this.zoom) {
        this.zoom = d3
          .zoom()
          .scaleExtent([1, 30])
          .on("zoom", (d, data) => {
            if (this.deepVal > 0 || this.allowAutoZoom) {
              this.zoomed(d, data);
            }
          });

        // 註冊zoom事件
        this.d3Svg.call(this.zoom);
      }
    },
    zoomed(event) {
      const { transform } = event;
      const { x, y, k } = transform;

      this.mapGroup.attr("transform", `translate(${x},${y}) scale(${k})`);
      this.mapGroup.attr("stroke-width", 1 / transform.k);
    },
    // moveMapInCenter() {
    //   const dom = this.mapGroup.node();
    //   const zoomLevel = getInitSize(this.mapGroup.node());
    //   const { translateX, translateY } = getTransform(dom, zoomLevel);

    //   // 应用过渡效果
    //   this.d3Svg
    //     .transition()
    //     .duration(500)
    //     .call(
    //       this.zoom.transform,
    //       d3.zoomIdentity.translate(translateX, translateY).scale(zoomLevel)
    //     )
    //     .on("end", () => {
    //       this.allowAutoZoom = false; // 初始化不允許滑鼠移動地圖及縮放
    //       this.$emit("update:loading", false);
    //     });
    // },
    getMapData(id) {
      let url = `${pathname}/data/TaiwanSelection/topoJson/towns-mercator.json`;
      if (id) {
        if (this.villageDataList[id]) return this.villageDataList[id];
        this.$emit("update:loading", true);
        url = `${pathname}/data/TaiwanSelection/topoJson/tw-village/${id}.json`;
      }

      return fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (id) {
            this.villageDataList[id] = data;
            this.$emit("update:loading", false);
          }
          return data || {};
        });
    },
    getFeatureById(deep, id, isSingle) {
      let data;
      switch (deep) {
        case 0:
          data = topojson.feature(
            this.areaData,
            this.areaData.objects.counties
          ).features;

          break;
        case 1:
          data = topojson.feature(
            this.areaData,
            this.areaData.objects.towns
          ).features;
          break;
        default:
          data = topojson.feature(
            this.villageData,
            this.villageData.objects.village
          ).features;
          break;
      }

      if (isSingle) {
        return data.find((item) =>
          deep === 2
            ? item.properties.VILLCODE.includes(id)
            : item.id.includes(id)
        );
      }

      if (deep === 2) {
        return data.filter((item) => item.properties.TOWNCODE.includes(id));
      }

      return deep === 1
        ? data.filter((item) => item.id.slice(0, id.length).includes(id))
        : data; // deep === 0
    },
    getGenMapData(deep, id) {
      const dom = this.getDomFromDeep(deep);
      const mapData = this.getFeatureById(deep, id);
      return { dom, mapData };
    },
    appendMap(dom, mapData) {
      const currDeep = this.deepVal; //避免傳參考影響每層的deep值
      dom
        .selectAll("path")
        .data(mapData)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("stroke", "#fff")
        .attr("fill", (data) => {
          const id = data.id ? data.id : data.properties.VILLCODE;
          const selectData = this.selectionData.filter((item) =>
            item.village_id.startsWith(id)
          );
          if (!selectData.length) return "lightblue";
          return this.calauteSelectionRate(id, selectData);
        })
        .attr("stroke-width", `0.${currDeep === 0 ? 3 : 1}`)
        .attr("data-bs-placement", "top")
        .attr("data-bs-toggle", "tooltip")
        .attr("draggable", "true")
        .attr("title", (data) => {
          const id = data.id ? data.id : data.properties.VILLCODE;
          return this.locationMap[id];
        })
        .attr("class", "custom-tooltip")
        .on("click", async (e, data) => {
          //因為要設定到下一層所以+1
          this.mapOnClick(currDeep + 1, data);
        });

      if (typeof bootstrap !== "undefined") {
        this.genTips();
      }
    },
    genTips() {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );

      tooltipTriggerList.map(function (tooltipTriggerEl) {
        const tooltipInstance = new bootstrap.Tooltip(tooltipTriggerEl, {
          placement: "top",
          trigger: "hover",
        });

        // 調整位置
        tooltipTriggerEl.addEventListener("mouseenter", () => {
          tooltipInstance.update();
        });
        // 隱藏上一個tips
        tooltipTriggerEl.addEventListener("click", () => {
          tooltipInstance.hide();
        });

        return tooltipInstance;
      });
    },
    async mapOnClick(deep, data) {
      const id = data.id ? data.id : data.properties.VILLCODE;
      await this.updateCurrInfo(id, deep);

      if (deep === 1) {
        this.villageData = await this.getMapData(id); //取得村里SVG
      }

      if (deep === this.deepVal) {
        this.updateDeepVal(deep, this.deepVal);
      }
      this.$emit("updateDeep", deep);
    },
    async updateCurrInfo(id, deep) {
      const currInfo = this.getInfoFromDeep(deep);
      Object.assign(currInfo, await assignValue(id, deep));

      /**
       * deep為2時，通常對應資料1
       */
      const DATA_INDEX = 1; //資料跟地圖深度距離1
      currInfo.targetData = this.getFeatureById(deep - DATA_INDEX, id, true);
    },
    updateDeepVal(newDeep, oldDeep) {
      const delCondition =
        (newDeep > 0 || oldDeep > newDeep) && // 深度達到0以上或新目標深度大於舊目標深度
        !(newDeep === 3 && oldDeep === 3); // 最底層的切換不須刪除

      if (delCondition) {
        this.calculateNodesToDelete(newDeep, oldDeep);
      }
      const currInfo = this.getInfoFromDeep(newDeep);
      this.focusMap(newDeep, currInfo.targetData);
      this.$emit("getLocationData", currInfo);

      if (newDeep < 3) {
        const { dom, mapData } = this.getGenMapData(newDeep, currInfo.id);
        this.appendMap(dom, mapData);
      }

      if (newDeep === 0) {
        this.allowAutoZoom = true;
        this.moveMap(this.initData);
      } else {
        this.moveMap(bounds(currInfo.targetData));
      }
    },
    removeAllPath(dom) {
      dom.selectAll("path").remove();
    },
    calculateNodesToDelete(newDeep, oldDeep) {
      // 切換縣市
      if (newDeep === 1) {
        this.removeAllPath(this.townSvg);
        this.removeAllPath(this.villageSvg);
      }
      // 同層移動
      if (newDeep === oldDeep) {
        const dom = this.getDomFromDeep(newDeep);
        this.removeAllPath(dom);
      } else if (oldDeep > newDeep) {
        /**
         * 不同層移動(里=>縣 or 區=>里)
         * 子層的點擊需要全部清空，父
         * 層的點擊僅須返回一層
         */
        while (oldDeep > newDeep) {
          const dom = this.getDomFromDeep(oldDeep);
          this.removeAllPath(dom);
          oldDeep--;
        }
      }
    },
    moveMap(data) {
      const { translateX, translateY, scale } = getTransform(data);
      // 应用过渡效果
      this.d3Svg
        .transition()
        .duration(500)
        .call(
          this.zoom.transform,
          d3.zoomIdentity.translate(translateX, translateY).scale(scale)
        )
        .on("end", () => {
          this.allowAutoZoom = false; // 初始化不允許滑鼠移動地圖及縮放
          this.$emit("update:loading", false);
        });
    },
    getDomFromDeep(deep) {
      const useDeep = deep === undefined ? this.deepVal : deep;
      switch (useDeep) {
        case 0:
          return this.countrySvg;
        case 1:
          return this.townSvg;
        default:
          return this.villageSvg;
      }
    },
    getInfoFromDeep(deep) {
      const useDeep = deep === undefined ? this.deepVal : deep;
      switch (useDeep) {
        case 1:
          return this.countryInfo;
        case 2:
          return this.townInfo;
        case 3:
          return this.villageInfo;
        default:
          return {};
      }
    },
    focusMap(deep, targetData) {
      const foucsNode = this.mapGroup.select(".focus").node();
      if (foucsNode) this.mapGroup.select(".focus").remove();

      this.mapGroup
        .datum(targetData)
        .append("path")
        .attr("d", geoPath)
        .attr("stroke", "#FFFA76")
        .attr("fill", "none")
        .attr("class", "focus")
        .attr("stroke-width", `0.${4 - deep}`);
      // console.log("this.mapGroup", this.mapGroup.node());
    },
    getSelectionData(id) {
      if (!id) return;
      return fetch(
        `${pathname}/data/TaiwanSelection/topoJson/selection/${id}.json`
      ).then((res) => res.json());
    },
    calauteSelectionRate(id, data) {
      let cand_1 = 0; // 民眾黨
      let cand_2 = 0; // 民進黨
      let cand_3 = 0; // 國民黨

      data.forEach((item) => {
        const { cand_info } = item;
        cand_1 += cand_info[0].tks_rate;
        cand_2 += cand_info[1].tks_rate;
        cand_3 += cand_info[2].tks_rate;
      });

      this.selectionInfo[id] = {
        cand_1: (cand_1 / data.length).toFixed(2),
        cand_2: (cand_2 / data.length).toFixed(2),
        cand_3: (cand_3 / data.length).toFixed(2),
      };

      this.$emit("updateSelectionInfo", this.selectionInfo);
      const max = Math.max(...[cand_1, cand_2, cand_3]);

      if (max === 0) return "lightblue";
      if (max === cand_1) return "#00ffff";
      if (max === cand_2)
        return getPartyColorBySupport(2, (cand_2 / data.length).toFixed(2));
      if (max === cand_3)
        return getPartyColorBySupport(3, (cand_3 / data.length).toFixed(2));
    },
  },
  mounted() {
    window.addEventListener("resize", async () => {
      this.allowAutoZoom = true;
      this.initEnv();

      const length = this.deepVal;
      for (let i = 0; i <= length; i++) {
        this.$emit("updateDeep", i);
        await this.$nextTick();
      }
    });

    this.$nextTick(async () => {
      this.initEnv(true);
      this.initD3js();
    });
  },
};
</script>
<style lang="scss" scoped>
svg {
  width: 100%;
  height: 100vh;
}
</style>
<style>
.custom-tooltip {
  outline: none;
}
</style>
