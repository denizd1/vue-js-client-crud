<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Proje Ekle</p>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="tutorial.title"
          :rules="[(v) => !!v || 'Bu alan boş bırakılamaz']"
          label="Nokta Adı"
          required
        ></v-text-field>

        <v-text-field
          v-model="tutorial.description"
          :rules="[(v) => !!v || 'Bu alan boş bırakılamaz']"
          label="İl"
          required
        ></v-text-field>

        <v-text-field
          v-model="tutorial.details"
          :rules="[(v) => !!v || 'Bu alan boş bırakılamaz']"
          label="İlçe"
          required
        ></v-text-field>
      </v-form>

      <v-btn color="primary" class="mt-3" @click="saveTutorial">Kaydet</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title> Submitted successfully! </v-card-title>

        <v-card-subtitle>
          Click the button to add new Tutorial.
        </v-card-subtitle>

        <v-card-actions>
          <v-btn color="success" @click="newTutorial">Add</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  name: "add-tutorial",
  data() {
    return {
      tutorial: {
        id: null,
        title: "",
        description: "",
        details: "",
        published: false,
      },
      submitted: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (
        !vm.$store.state.auth.user ||
        !vm.$store.state.auth.user.roles.includes("ROLE_ADMIN") ||
        !vm.$store.state.auth.user.roles.includes("ROLE_MODERATOR")
      ) {
        next({ name: "home" });
      }
    });
  },
  methods: {
    saveTutorial() {
      var data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
        details: this.tutorial.details,
      };

      TutorialDataService.create(data)
        .then((response) => {
          this.tutorial.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newTutorial() {
      this.submitted = false;
      this.tutorial = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
  position: relative;
  z-index: 4;
}
</style>
