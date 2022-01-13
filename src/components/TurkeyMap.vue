<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        class="p-0"
        style="height: 600px; width: 100%; z-index: 99"
      >
        <v-row class="light--text">
          <v-col cols="12" md="6">
            <v-checkbox
              class="float-left mr-2 mt-0"
              style="z-index: 99"
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
          :zoom="zoom"
          :center="center"
          :options="mapOptions"
          style="height: 80%"
          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
        >
          <l-tile-layer :url="url" :attribution="attribution" />

          <l-geo-json
            v-if="showGeojson"
            :geojson="geojson"
            :options="options"
            :options-style="styleFunction"
          />
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import http from "../http-common";
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "turkey-map",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data() {
    return {
      colorScale: ["e7d090", "e9ae7b", "de7062"],

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
      options: {
        onEachFeature: function onEachFeature(feature, layer) {
          layer.on("click", function () {
            console.log(feature.properties.Name);
          });
        },
      },
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
    getColor: function (feature) {
      console.log(feature.properties.Name);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    changeScale(ev, checked, val) {
      if (checked === false) {
        this.showGeojson = false;
        ev.preventDefault();
      } else {
        for (let i = 0; i < this.scaleControls.length; i++) {
          if (val !== this.scaleControls[i].factor) {
            this.scaleControls[i].checked = false;
          }
        }
        this.scaleService(val);
      }
    },

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

  // async created() {
  //   this.loading = true;
  //   const response = await http.get("/getGeoJson25");

  //   const data = await response.data;
  //   this.geojson = data;
  //   this.loading = false;
  // },
};
</script>
