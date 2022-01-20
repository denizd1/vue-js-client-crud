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
              class="float-left mr-2 mt-0"
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
          <l-tile-layer :url="url" :attribution="attribution" />
          <l-feature-group>
            <l-marker v-if="withTooltip != null" :lat-lng="withTooltip" />
            <l-polyline
              v-if="polyline != null"
              :lat-lngs="polyline.latlngs"
              :color="polyline.color"
            />
          </l-feature-group>

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
import "leaflet/dist/leaflet.css";
import { latLng } from "leaflet";
import "leaflet.utm";
import TutorialDataService from "../services/TutorialDataService";
import {
  LMap,
  LGeoJson,
  LTileLayer,
  LMarker,
  LPolyline,
  LControlScale,
  LFeatureGroup,
} from "vue2-leaflet";
import http from "../http-common";
import { Icon } from "leaflet";
import * as L from "leaflet";
import citiesLatLongjson from "../data/cities_of_turkey.json";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function onEachFeature(feature, layer) {
  var v = this;
  if (feature.properties.mytag && feature.properties.mytag == "Cities") {
    layer.on("click", function (e) {
      document
        .querySelectorAll(".selected")
        .forEach((el) => el.classList.remove("selected"));
      e.originalEvent.target.classList.add("selected");
      v.$emit("searchParam", this.feature.properties.name);
      v.dataService(this.feature.properties.name);
    });
    layer.on("mouseover", function (e) {
      document
        .querySelectorAll(".hoverstyle")
        .forEach((el) => el.classList.remove("hoverstyle"));
      e.originalEvent.target.classList.add("hoverstyle");
    });
    layer.on("mouseout", function (e) {
      document
        .querySelectorAll(".hoverstyle")
        .forEach((el) => el.classList.remove("hoverstyle"));
      e.originalEvent.target.classList.add("hoverstyle");
    });
  }
}
export default {
  name: "TurkeyMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LGeoJson,
    LControlScale,
    LFeatureGroup,
  },
  data() {
    return {
      withTooltip: null,
      polyline: null,
      responseData: null,
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
    dataService(val) {
      let params = {};
      params["il"] = val;
      TutorialDataService.findAllgetAll(params)
        .then((response) => {
          this.responseData = response.data;
          this.citiesLatLongjson.filter((elem) => {
            if (val === elem.il) {
              this.center = [elem.latitude, elem.longitude];
              this.zoom = 7.5;
              for (let i = 0; i < this.responseData.length; i++) {
                var datum = this.responseData[i].datum
                  ? this.responseData[i].datum
                  : null;
                var project_zone = this.responseData[i].zone
                  ? this.responseData[i].zone
                  : null;
                var project_x = this.responseData[i].x
                  ? this.responseData[i].x
                  : null;
                var project_y = this.responseData[i].y
                  ? this.responseData[i].y
                  : null;
                var profil_baslangic_x = this.responseData[i].profil_baslangic_x
                  ? this.responseData[i].profil_baslangic_x
                  : null;
                var profil_baslangic_y = this.responseData[i].profil_baslangic_y
                  ? this.responseData[i].profil_baslangic_y
                  : null;
                var profil_bitis_x = this.responseData[i].profil_bitis_x
                  ? this.responseData[i].profil_bitis_x
                  : null;
                var profil_bitis_y = this.responseData[i].profil_bitis_y
                  ? this.responseData[i].profil_bitis_y
                  : null;

                this.plotProfile(
                  datum,
                  project_zone,
                  project_x,
                  project_y,
                  profil_baslangic_x,
                  profil_baslangic_y,
                  profil_bitis_x,
                  profil_bitis_y
                );
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
    changeScale(ev, checked, val) {
      this.center = [39.750359, 37.015598];
      this.zoom = 6;
      if (checked === false) {
        this.showGeojson = false;
        this.preventDefault();
      } else {
        for (let i = 0; i < this.scaleControls.length; i++) {
          if (val !== this.scaleControls[i].factor) {
            this.scaleControls[i].checked = false;
          }
        }
        this.scaleService(val);
      }
    },
    plotProfile(
      datum,
      project_zone,
      project_x,
      project_y,
      profil_baslangic_x,
      profil_baslangic_y,
      profil_bitis_x,
      profil_bitis_y
    ) {
      console.log(
        datum,
        project_zone,
        project_x,
        project_y,
        profil_baslangic_x,
        profil_baslangic_y,
        profil_bitis_x,
        profil_bitis_y
      );
      if (datum == "WGS_84") {
        if (project_x && project_y) {
          var pointIcon = L.utm({
            x: project_x,
            y: project_y,
            zone: project_zone ? project_zone : 0,
            southHemi: false,
          });

          (this.withTooltip = latLng(
            pointIcon.latLng().lat,
            pointIcon.latLng().lng
          )),
            (this.withTooltip = latLng(
              pointIcon.latLng().lat,
              pointIcon.latLng().lng
            ));
        }
        if (
          profil_baslangic_x &&
          profil_baslangic_y &&
          profil_bitis_x &&
          profil_bitis_y
        ) {
          var polyLineStart = L.utm({
            x: profil_baslangic_x,
            y: profil_baslangic_y,
            zone: project_zone ? project_zone : 0,
            southHemi: false,
          });
          var polyLineEnd = L.utm({
            x: profil_bitis_x,
            y: profil_bitis_y,
            zone: project_zone ? project_zone : 0,
            southHemi: false,
          });
          console.log(polyLineStart, polyLineStart.latLng().lat);
          this.polyline = {
            latlngs: [
              [polyLineStart.latLng().lat, polyLineStart.latLng().lng],
              [polyLineEnd.latLng().lat, polyLineEnd.latLng().lng],
            ],
            color: "red",
          };
        }
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
.selected {
  fill: #231fd6;
}
.hoverstyle {
  fill: #ca3d3d;
}
</style>
