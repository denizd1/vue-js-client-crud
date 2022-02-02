<template>
  <v-container>
    <v-row>
      <v-col cols="12" style="height: 600px; width: 100%; z-index: 99">
        <l-map
          v-if="showMap"
          ref="map"
          :zoom="zoom"
          :no-blocking-animations="true"
          :center="center"
          :options="mapOptions"
          style="height: 80%"
          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
        >
          <v-icondefault></v-icondefault>
          <l-tile-layer :url="url" :attribution="attribution" />
          <!-- <l-marker
            ref="marker"
            v-if="withTooltip != null"
            :lat-lng="withTooltip"
          /> -->
          <v-marker-cluster>
            <v-marker
              v-for="marker in markers"
              :key="marker.id"
              :lat-lng="marker.latlng"
              :icon="icon"
              :class="$style.baz"
            >
              <v-popup>
                <button @click="handlePopupClick(marker.id)">
                  {{ marker.text }}
                </button>
              </v-popup>
            </v-marker>
          </v-marker-cluster>
          <l-polyline
            v-for="(line, index) in polyline"
            :key="index"
            :lat-lngs="line.latlngs"
            :color="line.color"
          />

          <l-geo-json
            v-if="showGeojson"
            :geojson="geojson"
            :options="options"
            :options-style="styleFunction"
          />

          <l-control-scale
            position="topright"
            :imperial="false"
            :metric="true"
          ></l-control-scale>
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import TutorialDataService from "../services/TutorialDataService";
import {
  LMap,
  LGeoJson,
  LTileLayer,
  LMarker,
  LPolyline,
  LControlScale,
  LIconDefault,
  LPopup,
} from "vue2-leaflet";
import { ProfilePlotter } from "../common/ProfilePlotter.js";
import http from "../http-common";
import { Icon, icon } from "leaflet";
import { bus } from "../main";

import citiesLatLongjson from "../data/cities_of_turkey.json";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
delete Icon.Default.prototype._getIconUrl;

function onEachFeature(feature, layer) {
  var v = this;
  if (feature.properties.mytag && feature.properties.mytag == "Cities") {
    layer.on("click", function (e) {
      document.querySelectorAll(".leaflet-interactive").forEach((el) => {
        el.classList.add("pseudoClass");
      });
      document
        .querySelectorAll(".selected")
        .forEach((el) => el.classList.remove("selected"));
      e.originalEvent.target.classList.add("selected");
      e.originalEvent.target.classList.remove("pseudoClass");
      v.$emit("searchParam", this.feature.properties.name);
      v.selectedCityparam = this.feature.properties.name;
      v.dataService(this.feature.properties.name, v.selectedMethod);
    });
    layer.on("mouseover", function (e) {
      document
        .querySelectorAll(".pseudoClass")
        .forEach((el) => el.classList.remove("pseudoClass"));
      e.originalEvent.target.classList.add("pseudoClass");
    });
    layer.on("mouseout", function (e) {
      document
        .querySelectorAll(".pseudoClass")
        .forEach((el) => el.classList.remove("pseudoClass"));
      e.originalEvent.target.classList.add("pseudoClass");
    });
  }
}
export default {
  name: "TurkeyMap",
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LGeoJson,
    LControlScale,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
    "v-marker": LMarker,
    "v-icondefault": LIconDefault,
    "v-popup": LPopup,
  },
  data() {
    return {
      icon: null,
      polyline: [],
      responseData: null,
      markers: [],
      colorScale: ["e7d090", "e9ae7b", "de7062"],
      citiesLatLongjson: citiesLatLongjson,
      zoom: 6,
      loading: false,
      center: [39.750359, 37.015598],
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      currentZoom: 6,
      mapOptions: {
        zoomSnap: 0.5,
      },
      geojson: null,
      showMap: true,
      showGeojson: false,
      searchParam: null,
      options: { onEachFeature: onEachFeature.bind(this) },
      selectedMethod: null,
      selectedCityparam: null,
      selectedJsonparam: null,
    };
  },
  methods: {
    getselectedMethod(val) {
      this.selectedMethod = val;
      this.dataService(this.selectedCityparam, this.selectedMethod);
    },
    handlePopupClick(val) {
      let routeData = this.$router.resolve({
        name: "tutorial",
        params: { id: val },
      });
      window.open(routeData.href, "_blank");
    },
    dataService(city, selectedMethod) {
      let params = {};
      this.polyline = [];
      this.markers = [];
      params["il"] = city;
      params["yontem"] = selectedMethod;
      TutorialDataService.findAllgetAll(params)
        .then((response) => {
          this.responseData = response.data;

          this.citiesLatLongjson.filter((elem) => {
            if (city === elem.il) {
              for (let i = 0; i < this.responseData.length; i++) {
                //profileplotter.js ile nokta ve profilleri cizmek icin
                this.triggerExternalplot(this.responseData[i]);
              }
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    //farkli olceklerde parsel geojsonlari ve sehir geojsoni getirmek icin (checkbox change)
    changeScale(val) {
      this.selectedJsonparam = val;
      this.scaleService(val);
    },
    triggerExternalplot(currentTutorial) {
      var params = ProfilePlotter(currentTutorial);
      if (params.polyline !== null) {
        this.polyline.push(params.polyline);
      }
      if (params.markerLatlong !== null) {
        this.markers.push({
          id: params.id,
          latlng: params.markerLatlong,
          text: params.text,
        });
        if (params.yontem == "Sismik Yöntemler") {
          Icon.Default.mergeOptions({
            iconRetinaUrl: require("../assets/seismic.png"),
            iconUrl: require("../assets/seismic.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
          this.generateIcon(iconUrl, shadowUrl);
        }
        if (params.yontem == "Elektrik ve Elektromanyetik Yöntemler") {
          Icon.Default.mergeOptions({
            iconRetinaUrl: require("../assets/battery.png"),
            iconUrl: require("../assets/battery.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
          this.generateIcon(iconUrl, shadowUrl);
        }
        if (params.yontem == "Kuyu Ölçüleri") {
          Icon.Default.mergeOptions({
            iconRetinaUrl: require("../assets/drilling-rig.png"),
            iconUrl: require("../assets/drilling-rig.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
          this.generateIcon(iconUrl, shadowUrl);
        }
        if (params.altyontem == "Gravite") {
          Icon.Default.mergeOptions({
            iconRetinaUrl: require("../assets/gravity.png"),
            iconUrl: require("../assets/gravity.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
          this.generateIcon(iconUrl, shadowUrl);
        }
        if (params.altyontem == "Manyetik") {
          Icon.Default.mergeOptions({
            iconRetinaUrl: require("../assets/magnetic-field.png"),
            iconUrl: require("../assets/magnetic-field.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
          this.generateIcon(iconUrl, shadowUrl);
        }
        if (params.altyontem == "Radyometri") {
          // ../assets/radiation-detector.png
          Icon.Default.mergeOptions({
            iconRetinaUrl: require("../assets/radiation-detector.png"),
            iconUrl: require("../assets/radiation-detector.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
          this.generateIcon(iconUrl, shadowUrl);
        }
      }
    },
    generateIcon(iconUrl, shadowUrl) {
      let customicon = icon(
        Object.assign({}, Icon.Default.prototype.options, {
          iconUrl,
          shadowUrl,
        })
      );

      this.icon = customicon;
    },
    //asenkron geojson servisi. (checkbox change)
    async scaleService(val) {
      this.loading = true;
      const response = await http.get(`/getGeoJson${val}`);

      const data = await response.data;

      this.citiesGeojson = data;
      this.geojson = data;
      this.showGeojson = true;
      this.loading = false;
    },
  },
  watch: {
    geojson: function () {
      this.$refs.map.setCenter([39.750359, 37.015598]);
      this.$refs.map.setZoom(6);
    },
    deep: true,
  },
  computed: {
    styleFunction() {
      return () => {
        return {
          weight: 2,
          color: "#ECEFF1",
          opacity: 1,
          fillColor: "#95ffff",
          fillOpacity: 0.4,
        };
      };
    },
  },
  mounted() {
    bus.$on("renderMap", () => {
      setTimeout(() => {
        //mapObject is a property that is part of leaflet
        this.$refs.map.mapObject.invalidateSize();
      }, 100);
    });
    bus.$on("fireScalechange", (val) => {
      this.changeScale(val);
    });
    bus.$on("methodParam", (data) => {
      this.getselectedMethod(data);
    });
    bus.$on("hideGeojson", (data) => {
      this.showGeojson = data;
    });
  },
};
</script>
<style>
.selected {
  fill-opacity: 0;
}
/* .hoverstyle {
  fill: #ca3d3d;
} */
.pseudoClass {
  fill: #95ffff;
}
.leaflet-marker-icon {
  width: 42px !important;
  height: 42px !important;
}
.legend {
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
}
</style>
<style module>
.baz >>> .leaflet-marker-icon {
  width: 42px !important;
  height: 42px !important;
}
</style>
