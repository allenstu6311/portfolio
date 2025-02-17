<template>
  <div class="bg"></div>
  <div class="custom-container" ref="container">
    <!-- loading -->
    <div class="d-flex justify-content-center custom-spinner" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <!-- 操作區域 -->
    <div class="control-box">
      <!-- 返回上一層 -->
      <div class="page-title">
        <h1 class="svelte-ypi6vb" v-if="deep === 0">
          <span class="year svelte-ypi6vb">2024</span
          ><span class="text svelte-ypi6vb" data-svelte-h="svelte-1y3jmw7"
            >總統大選</span
          >
        </h1>
        <div class="back" @click="goBack" v-else>
          <img src="/image/TaiwanSelection/arrow.svg" alt="" />
          <p>返回上一層</p>
        </div>
        <!-- 手機板查詢按鈕 -->
        <div class="">
          <button class="search-button" @click="isShow = true">搜尋縣市</button>
        </div>
      </div>

      <!-- 電腦版視窗 -->
      <div class="window-pc">
        <h2 class="title">選情分析</h2>
        <div class="search wrap">
          <input
            type="text"
            placeholder="請輸入縣市名稱"
            v-model="searchStr"
            @focus="focusing = true"
            :disabled="loading"
          />
          <ul
            class="location-options"
            :style="{ padding: filterLocationOptions.length ? '8px 16px' : '' }"
          >
            <li
              v-for="item in filterLocationOptions"
              :key="item.id"
              @click="chooseAddress(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <template v-if="currAreaName">
          <div class="introduce wrap">
            <div class="address">{{ currAreaName }}</div>
            <Selection :currAreaSelection="currAreaSelection" />
            <div class="desc">{{ locationData.textContent }}</div>
          </div>
        </template>
      </div>
    </div>
    <!-- 地圖 -->
    <div class="map">
      <Taiwan
        v-model:deep-val="deep"
        v-model:search-param="searchParam"
        v-model:loading="loading"
        @update-deep="updateDeep"
        @get-location-data="(val) => (locationData = val)"
        @update-selection-info="(val) => (selectionInfo = val)"
        :locationMap="locationMap"
      />
    </div>
    <!-- 手機版視窗 -->
    <div class="window-h5" v-if="deep > 0" ref="windowH5">
      <div class="introduce">
        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <div class="address">{{ currAreaName }}</div>
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <Selection :currAreaSelection="currAreaSelection" />
                <!-- AI分析 -->
                <div
                  class="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        AI分析
                      </button>
                    </h2>
                    <div
                      id="flush-collapseOne"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body desc">
                        {{ locationData.textContent }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 手機板查詢 -->
    <div class="search-h5" :style="{ height: isShow ? '100vh' : '0' }">
      <div class="close" v-if="isShow" @click="isShow = false">
        <img
          class="close-icon svelte-losp1r"
          src="/image/TaiwanSelection/cross.png"
          alt="close icon"
        />
      </div>

      <div class="">
        <h2 class="title">選情分析</h2>
        <div class="search wrap">
          <input
            type="text"
            placeholder="請輸入縣市名稱"
            v-model="searchStr"
            @focus="focusing = true"
            :disabled="loading"
          />
          <ul
            class="location-options"
            :style="{ padding: filterLocationOptions.length ? '8px 16px' : '' }"
          >
            <li
              v-for="item in filterLocationOptions"
              :key="item.id"
              @click="
                chooseAddress(item);
                isShow = false;
              "
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Taiwan from "@/stories/TaiwanSelection/Taiwan.vue";
import Selection from "@/stories/TaiwanSelection/Selection.vue";
import { getLocationCode } from "@/api/TaiwanSelection";

const pathname = import.meta.env.MODE === "production" ? "/portfolio" : "";

export default {
  components: {
    Taiwan,
    Selection,
  },
  data() {
    return {
      deep: 0,
      locationData: {},
      locationOptions: [],
      searchStr: "",
      searchParam: {},
      focusing: true,
      selectionInfo: {},
      selectionData: [],
      loading: true,
      isShow: false,
      bootstrapLink: "",
      locationMap: {},
    };
  },
  methods: {
    updateH5Distance() {
      if (this.deep === 0) return;
      this.$nextTick(() => {
        const { windowH5 } = this.$refs;
        const { bottom } = windowH5.getBoundingClientRect();
        const { innerHeight } = window;
        const distance = innerHeight - bottom;

        if (distance !== 0) {
          windowH5.style.transform = `translateY(${distance}px)`;
        }
      });
    },
    goBack() {
      if (this.deep > 0) {
        this.deep--;
        this.searchStr = "";
      }
    },
    chooseAddress(item) {
      this.searchStr = item.name;
      this.searchParam = item;
      this.focusing = false;
    },
    findParentId(id) {
      const countryId = id.length > 5 && id.slice(0, 5);
      const townId = id.length > 8 && id.slice(0, 8);

      return {
        countryId,
        townId,
      };
    },
    mappingName(id) {
      if (!id) return "";
      const { countryId, townId } = this.findParentId(id);

      const countryName = this.locationMap[countryId] || "";
      const townName = this.locationMap[townId] || "";
      const areaName = this.locationMap[id];

      return countryName + townName + areaName;
    },
    updateDeep(val) {
      this.deep = val;
      this.searchStr = "";
    },
    // 製作地圖名稱的雜湊表
    handleLocationMap(rows) {
      rows.forEach((items, index, array) => {
        const item = items.split(",");
        const countryId = item[0];
        const townId = item[1];
        const villageId = item[2];

        if (!this.locationMap.hasOwnProperty(countryId)) {
          this.locationMap[countryId] = item[3];
        }
        if (!this.locationMap.hasOwnProperty(townId)) {
          this.locationMap[townId] = item[4];
        }
        this.locationMap[villageId] = item[5];
      });
    },
    // 製作地圖名稱的選項
    handleLocationOption(mapperData) {
      for (const id in mapperData) {
        this.locationOptions.push({
          name: this.mappingName(id),
          id,
        });
      }
    },
    async getLocationCode() {
      const text = await getLocationCode();
      const rows = text.split("\n").slice(1);
      this.handleLocationMap(rows);
      this.handleLocationOption(this.locationMap);
    },
  },
  watch: {
    /**
     * 處理safari window-h5定位問題
     */
    deep: {
      handler(val) {
        if (val > 0) {
          this.updateH5Distance();
        }
      },
    },
  },
  computed: {
    currAreaSelection() {
      const { id } = this.locationData;
      if (!id) return {};
      return this.selectionInfo[id] || {};
    },
    currAreaName() {
      if (this.deep === 0) return "";
      const { id } = this.locationData;
      return id ? this.mappingName(id) : "尚無資料";
    },
    filterLocationOptions() {
      if (!this.searchStr || !this.focusing) return [];
      const matchOptions = this.locationOptions
        .filter((item) => item.name.includes(this.searchStr))
        .map((item) => {
          const { countryId, townId } = this.findParentId(item.id);
          const idList = [countryId, townId, item.id].filter((item) => item);
          // 包含更多輸入文字的選項要排更前面
          const matchCount =
            this.searchStr === item.name.slice(0, this.searchStr.length)
              ? this.searchStr.length
              : 0;

          return {
            name: item.name,
            id: item.id,
            idList,
            matchCount,
          };
        })
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 10);

      return matchOptions || [];
    },
  },
  async mounted() {
    await this.getLocationCode();
    /**
     * safari瀏覽器在鍵盤出現時，
     * 會將視窗往上移動避免蓋住內
     * 容，但不會自動復原，導致畫
     * 面跑掉，所以自訂義式見修復
     */
    const { container } = this.$refs;
    //键盘收起的事件处理
    document.body.addEventListener("focusout", () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        container.style.height = `100vh`;
        this.updateH5Distance();
      }, 100);
    });

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${pathname}/style/bootstrap.min.css`;
    document.head.appendChild(link);

    // 保存引用，方便在销毁组件时移除
    this.bootstrapLink = link;
  },
  beforeUnmount() {
    // 在组件卸载时移除样式
    if (this.bootstrapLink) {
      document.head.removeChild(this.bootstrapLink);
    }
  },
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  shape-rendering: crispEdges;
  list-style: none;
  box-sizing: border-box;
}

p,
ul,
h2 {
  margin: 0;
  padding: 0;
}
html {
  overflow: hidden;
  height: 100%;
}
body {
  background-color: rgb(244, 244, 244);
}
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: conic-gradient(
    from 135deg at 52.72% 30.87%,
    rgba(98, 132, 255, 0.3) 30.4565128684deg,
    rgba(163, 203, 255, 0.3) 51.4212781191deg,
    rgba(69, 234, 234, 0.3) 94.6980285645deg,
    rgba(177, 234, 224, 0.3) 169.1589081287deg
  );
  filter: blur(121.8189086914px);
}

.custom-container {
  position: relative;
  /* height: 100vh; */
  height: 100%;
}

.page-title {
  position: absolute;
  left: 10px;
  top: 10%;
  z-index: 10;
}

.page-title .year {
  color: #a4aeef;
  font-size: 56px;
  font-weight: 500;
  margin-right: 10px;
}

.page-title .text {
  color: #3b4f7d;
  font-size: 28px;
  font-weight: 500;
}

.back {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #5a6be3;
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
    1px 1px 0 #fff;
}

.control-box {
  max-width: 1440px;
  margin: auto;
  position: relative;
  z-index: 20;
  top: 100px;
}

.map {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.wrap {
  background-color: rgba(244, 244, 244, 0.9);
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 16px;
}

.custom-spinner {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  align-items: center;
  z-index: 10;
  background-color: rgba(240, 248, 255, 0.24);
}

@media screen and (max-width: 1024px) {
  .bg {
    display: none;
  }
  .control-box {
    top: 50px;
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/style/TaiwanSelection/window.css";
</style>
