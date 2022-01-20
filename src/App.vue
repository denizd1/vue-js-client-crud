<template>
  <v-app>
    <header style="padding-bottom: 100px">
      <nav
        class="navbar navbar-expand-lg navbar-light fixed-top bg-light"
        style="z-index: 99"
      >
        <div class="container-fluid">
          <a href class="navbar-brand" @click.prevent>
            <v-img
              class="mta-logo mx-auto"
              src="../src/assets/logo.png"
              alt="MTA logo"
            ></v-img
          ></a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- <div class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">
              <font-awesome-icon icon="home" />Home
            </router-link>
          </li>
          <li v-if="showAdminBoard" class="nav-item">
            <router-link to="/admin" class="nav-link">Admin Board</router-link>
          </li>
          <li v-if="showModeratorBoard" class="nav-item">
            <router-link to="/mod" class="nav-link"
              >Moderator Board</router-link
            >
          </li>
          <li class="nav-item">
            <router-link v-if="currentUser" to="/user" class="nav-link"
              >User</router-link
            >
          </li>
        </div> -->

          <div
            class="collapse navbar-collapse ms-auto"
            id="navbarSupportedContent"
          >
            <ul v-if="!currentUser" class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link to="/register" class="nav-link">
                  <font-awesome-icon icon="user-plus" /> Kaydol
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/login" class="nav-link">
                  <font-awesome-icon icon="sign-in-alt" /> Giriş Yap
                </router-link>
              </li>
            </ul>
            <ul v-if="currentUser" class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link to="/profile" class="nav-link">
                  <font-awesome-icon icon="user" />
                  {{ currentUser.username }}
                </router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link" href @click.prevent="logOut">
                  <font-awesome-icon icon="sign-out-alt" /> Çıkış
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <v-main>
      <router-view />

      <!-- <v-app-bar app dark fixed>
      <div class="d-flex align-center mr-2">
        <v-img
          class="mta-logo mx-auto"
          src="../src/assets/logo.png"
          alt="MTA logo"
        ></v-img>
      </div>

      <v-btn to="/tutorials" text> Tutorials </v-btn>

      <v-btn to="/add" text> Add </v-btn>
    </v-app-bar> -->
      <vue-particles
        class="particle-bg"
        color="#dedede"
        :particleOpacity="0.7"
        :particlesNumber="300"
        shapeType="circle"
        :particleSize="4"
        linesColor="#dedede"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="false"
        :clickEffect="false"
      >
      </vue-particles>
    </v-main>
    <v-footer padless>
      <v-row>
        <v-col class="py-4 text-center" cols="12">
          Her Hakkı Saklıdır © MTA {{ new Date().getFullYear() }}
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import EventBus from "./common/EventBus";
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE_ADMIN");
      }
      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE_MODERATOR");
      }
      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
  mounted() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  },
  beforeDestroy() {
    EventBus.remove("logout");
  },
};
</script>
<style>
.particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.mta-logo {
  width: 50px;
}
/* .particle-wrap:before {
  content: " ";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  background-image: url("https://logowik.com/content/uploads/images/742_mta.jpg");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 40%;
} */
</style>
