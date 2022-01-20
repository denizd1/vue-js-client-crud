<template>
  <div style="height: 500px; width: 100%">
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

      <l-marker v-if="withTooltip" :lat-lng="withTooltip" />
      <l-polyline
        v-if="polyline"
        :lat-lngs="polyline.latlngs"
        :color="polyline.color"
      />
      <l-control-scale
        position="topright"
        :imperial="false"
        :metric="true"
      ></l-control-scale>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { latLng } from "leaflet";
import "leaflet.utm";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolyline,
  LControlScale,
} from "vue2-leaflet";
import { Icon } from "leaflet";
import * as L from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "MapView",
  props: ["currentTutorial"],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LControlScale,
  },
  data() {
    return {
      withTooltip: null,
      polyline: null,
      zoom: 11.5,
      loading: false,
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      currentZoom: 11.5,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
  },
  beforeMount() {
    if (this.currentTutorial.datum == "WGS_84") {
      if (this.currentTutorial.x && this.currentTutorial.y) {
        var pointIcon = L.utm({
          x: this.currentTutorial.x,
          y: this.currentTutorial.y,
          zone: this.currentTutorial.zone ? this.currentTutorial.zone : 0,
          southHemi: false,
        });
        (this.center = latLng(pointIcon.latLng().lat, pointIcon.latLng().lng)),
          (this.withTooltip = latLng(
            pointIcon.latLng().lat,
            pointIcon.latLng().lng
          )),
          (this.currentCenter = latLng(
            pointIcon.latLng().lat,
            pointIcon.latLng().lng
          ));

        this.withTooltip = latLng(
          pointIcon.latLng().lat,
          pointIcon.latLng().lng
        );
      }
      if (
        this.currentTutorial.profil_baslangic_x &&
        this.currentTutorial.profil_baslangic_y &&
        this.currentTutorial.profil_bitis_x &&
        this.currentTutorial.profil_bitis_y
      ) {
        var polyLineStart = L.utm({
          x: this.currentTutorial.profil_baslangic_x,
          y: this.currentTutorial.profil_baslangic_y,
          zone: this.currentTutorial.zone ? this.currentTutorial.zone : 0,
          southHemi: false,
        });
        var polyLineEnd = L.utm({
          x: this.currentTutorial.profil_bitis_x,
          y: this.currentTutorial.profil_bitis_y,
          zone: this.currentTutorial.zone ? this.currentTutorial.zone : 0,
          southHemi: false,
        });
        (this.center = latLng(
          (polyLineStart.latLng().lat + polyLineEnd.latLng().lat) / 2,
          (polyLineStart.latLng().lng + polyLineEnd.latLng().lng) / 2
        )),
          (this.polyline = {
            latlngs: [
              [polyLineStart.latLng().lat, polyLineStart.latLng().lng],
              [polyLineEnd.latLng().lat, polyLineEnd.latLng().lng],
            ],
            color: "red",
          });
      }
    }
  },
  // async created() {
  //   this.loading = true;
  //   const response = await http.get("/getGeoJson");

  //   const data = await response.data;
  //   this.geojson = data;
  //   this.loading = false;
  // },
};
</script>
