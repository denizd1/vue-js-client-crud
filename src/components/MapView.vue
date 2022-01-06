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
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import "leaflet.utm";
import { LMap, LTileLayer, LMarker, LPolyline } from "vue2-leaflet";
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
  },
  data() {
    return {
      withTooltip: null,
      polyline: null,
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
    (this.zoom = 11.5),
      (this.url = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"),
      (this.attribution =
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'),
      (this.currentZoom = 11.5),
      (this.showParagraph = false),
      (this.mapOptions = {
        zoomSnap: 0.5,
      }),
      (this.showMap = true);
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
};
</script>
