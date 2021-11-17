<template>
  <div v-if="currentTutorial" class="py-3 container">
    <div class="row">
      <div class="col-4" style="z-index: 4">
        <table class="table">
          <tr>
            <td>Title</td>
            <td>{{ currentTutorial.title }}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{{ currentTutorial.description }}</td>
          </tr>
          <tr>
            <td>Details</td>
            <td>{{ currentTutorial.details }}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{{ currentTutorial.published }}</td>
          </tr>
        </table>
      </div>
      <div class="col-8" style="z-index: 4">
        <map-view></map-view>
      </div>
    </div>
    <p class="mt-3">{{ message }}</p>
  </div>
  <!-- <div v-else>
      Yukleniyor
  </div> -->
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

import MapView from "./MapView.vue";

export default {
  name: "tutorial",
  data() {
    return {
      currentTutorial: null,
      message: "",
    };
  },
  components: {
    MapView,
  },
  methods: {
    getTutorial(id) {
      TutorialDataService.get(id)
        .then((response) => {
          this.currentTutorial = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.message = "";
    this.getTutorial(this.$route.params.id);
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
