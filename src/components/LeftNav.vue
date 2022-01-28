<template>
  <v-navigation-drawer
    style="top: 76px !important; z-index: 200 !important"
    permanent
    expand-on-hover
    app
  >
    <v-card class="mx-auto" width="300">
      <v-list nav dense>
        <v-list-group :value="false" no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Ölçek</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list>
            <v-list-item
              v-for="(scaleControl, index) in scaleControls"
              :key="index"
              link
            >
              <v-list-item-title v-text="scaleControl.label">
              </v-list-item-title>
              <v-checkbox
                style="z-index: 89"
                v-model="scaleControl.checked"
                :color="scaleControl.color"
                :input-value="scaleControl.factor"
                @click="
                  triggerChange(scaleControl.checked, scaleControl.factor)
                "
              >
              </v-checkbox>
            </v-list-item>
          </v-list>
        </v-list-group>
        <v-list-group :value="false" no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Yöntem</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list>
            <v-list-item
              v-for="(geoMethods, index) in methodSelect"
              :key="index"
              link
            >
              <v-list-item-title v-text="geoMethods.name"> </v-list-item-title>

              <v-checkbox style="z-index: 89" v-model="geoMethods.checked">
              </v-checkbox>
            </v-list-item>
          </v-list>
        </v-list-group>
      </v-list>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: "LeftNav",
  data() {
    return {
      toggleGeojson: false,
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
      methodSelect: [
        { name: "Elektrik ve Elektromanyetik Yöntemler", checked: false },
        { name: "Potansiyel Yöntemler", checked: false },
        { name: "Sismik Yöntemler", checked: false },
        { name: "Kuyu Ölçümleri", checked: false },
      ],
    };
  },
  methods: {
    triggerChange(checked, val) {
      if (checked === false) {
        // this.preventDefault();
      } else {
        for (let i = 0; i < this.scaleControls.length; i++) {
          if (val !== this.scaleControls[i].factor) {
            this.scaleControls[i].checked = false;
          }
        }
      }
      console.log(val);
      this.$emit("fireScalechange", val, this.toggleGeojson);
    },
  },
};
</script>
