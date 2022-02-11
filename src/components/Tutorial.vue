<template>
  <div v-if="currentTutorial" class="py-3">
    <div class="row">
      <div class="col-4 table-responsive" style="z-index: 4">
        <detail-table :currentTutorial="currentTutorial"></detail-table>
      </div>
      <div class="col-8" style="z-index: 4">
        <map-view :currentTutorial="currentTutorial"></map-view>
      </div>
      <!-- <v-card-actions style="z-index: 99">
        <v-btn color="success" @click="print">Yazdir</v-btn>
      </v-card-actions> -->
    </div>
  </div>
  <!-- <div v-else>
      Yukleniyor
  </div> -->
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

import MapView from "./MapView.vue";
import DetailTable from "./DetailTable.vue";

export default {
  name: "tutorial",
  data() {
    return {
      currentTutorial: null,
    };
  },
  components: {
    DetailTable,
    MapView,
  },
  methods: {
    getTutorial(id) {
      TutorialDataService.get(id)
        .then((response) => {
          this.currentTutorial = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.state.auth.user) {
        vm.getTutorial(vm.$route.params.id);
      } else {
        next({ name: "login" });
      }
    });
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
  position: relative;
  z-index: 99;
}
</style>
