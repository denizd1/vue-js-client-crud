<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        class="p-0"
        style="height: 600px; width: 100%; z-index: 99"
      >
        <v-row>
          <v-col cols="12" md="6">
            <v-checkbox
              class="float-left mr-2 mt-0 shrink"
              style="z-index: 89"
              v-for="(scaleControl, index) in scaleControls"
              :key="index"
              v-model="scaleControl.checked"
              :color="scaleControl.color"
              :label="scaleControl.label"
              :input-value="scaleControl.factor"
              @click="
                changeScale($event, scaleControl.checked, scaleControl.factor)
              "
            >
            </v-checkbox>
          </v-col>
        </v-row>
        <l-map
          v-if="showMap"
          ref="lMap"
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
          <l-control style="display: none" :position="'bottomleft'">
            <div class="legend">
              <v-col cols="2">
                <v-checkbox
                  class="shrink mr-0 mt-0"
                  style="z-index: 89"
                  v-for="(geoMethods, index) in methodLegend"
                  :key="index"
                  v-model="geoMethods.checked"
                  :label="geoMethods.name"
                >
                </v-checkbox>
              </v-col>
            </div>
          </l-control>
          <l-control-scale
            position="topright"
            :imperial="false"
            :metric="true"
          ></l-control-scale>
          <!-- <l-control v-if="showButton" position="bottomleft">
            <v-btn depressed elevation="2" small @click="resetZoom"
              >Haritaya Geri Dön</v-btn
            >
          </l-control> -->
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
  LControl,
  LIconDefault,
  LPopup,
} from "vue2-leaflet";
import { ProfilePlotter } from "../common/ProfilePlotter.js";
import http from "../http-common";
import { Icon, icon } from "leaflet";

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
      v.dataService(this.feature.properties.name);
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
    LControl,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
    "v-marker": LMarker,
    "v-icondefault": LIconDefault,
    "v-popup": LPopup,
  },
  data() {
    return {
      icon: null,
      // showButton: false,
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
      methodLegend: [
        { name: "Elektrik ve Elektromanyetik Yöntemler", checked: false },
        { name: "Potansiyel Yöntemler", checked: false },
        { name: "Sismik Yöntemler", checked: false },
        { name: "Kuyu Ölçümleri", checked: false },
      ],
      //Farkli geojsonlar icin gereken parametreler
      scaleControls: [
        {
          id: 1,
          name: "yirmibesBin",
          factor: 25,
          label: "1/25.000",
          checked: false,
          color: "success",
        },

        {
          id: 2,
          name: "yuzBin",
          factor: 100,
          label: "1/100.000",
          checked: false,
          color: "success",
        },
        {
          id: 3,
          name: "besyuzBin",
          factor: 500,
          label: "1/500.000",
          checked: false,
          color: "success",
        },
        {
          id: 4,
          name: "iller",
          factor: 0,
          label: "İller",
          checked: false,
          color: "success",
        },
      ],
    };
  },
  methods: {
    handlePopupClick(val) {
      let routeData = this.$router.resolve({
        name: "tutorial",
        params: { id: val },
      });
      window.open(routeData.href, "_blank");
      // this.$router.push({ name: "tutorial", params: { id: val } });
    },
    //haritaya geri donunce zoomu resetler
    // resetZoom() {
    //   this.zoom = 6;
    //   this.center = [39.750359, 37.015598];
    // },
    //secilen ile gore projeleri getiren servisi cagirir
    dataService(val) {
      let params = {};
      this.polyline = [];
      this.markers = [];
      params["il"] = val;
      TutorialDataService.findAllgetAll(params)
        .then((response) => {
          this.responseData = response.data;

          this.citiesLatLongjson.filter((elem) => {
            if (val === elem.il) {
              // this.center = [elem.latitude, elem.longitude];
              // this.zoom = 7.8;
              for (let i = 0; i < this.responseData.length; i++) {
                //profileplotter.js ile nokta ve profilleri cizmek icin
                this.triggerExternalplot(this.responseData[i]);
              }
            }
          });

          // this.showButton = true;
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
    changeScale(ev, checked, val) {
      // this.showButton = false;

      if (checked === false) {
        this.showGeojson = false;
        // this.preventDefault();
      } else {
        for (let i = 0; i < this.scaleControls.length; i++) {
          if (val !== this.scaleControls[i].factor) {
            this.scaleControls[i].checked = false;
          }
        }
        this.scaleService(val);
      }
    },
    triggerExternalplot(currentTutorial) {
      var params = ProfilePlotter(currentTutorial);
      if (params.polyline !== null) {
        this.polyline.push(params.polyline);
      }

      // this.center = params.center;
      // this.currentCenter = params.currentCenter;
      // console.log(params.withTooltip);
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
      this.$refs.lMap.setCenter([39.750359, 37.015598]);
      this.$refs.lMap.setZoom(6);
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
  // watch: {
  //   searchParam: {
  //     handler: function (val) {
  //       console.log(val);
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  // },

  // async created() {
  //   this.loading = true;
  //   const response = await http.get("/getGeoJson25");

  //   const data = await response.data;
  //   this.geojson = data;
  //   this.loading = false;
  // },
};
</script>
<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
@import "~leaflet/dist/leaflet.css";
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
  padding: 6px 8px;
  font: 14px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  /*box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);*/
  /*border-radius: 5px;*/
  line-height: 24px;
  color: #555;
}
</style>
<style module>
.baz >>> .leaflet-marker-icon {
  width: 42px !important;
  height: 42px !important;
}
</style>
