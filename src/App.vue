// App.vue

<template>
  <v-app>
      <v-navigation-drawer
              fixed
              mini-variant
              :clipped="$vuetify.breakpoint.mdAndUp"
              app
              v-model="drawer"
      >
          <v-toolbar flat class="transparent">
              <v-list class="pa-0">
                  <v-list-tile avatar>
                      <v-list-tile-avatar>
                          <v-icon>mdi-xbox-controller</v-icon>
                          <!--<img src="https://randomuser.me/api/portraits/men/85.jpg" />-->
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                          <v-list-tile-title>Configure</v-list-tile-title>
                      </v-list-tile-content>
                  </v-list-tile>
              </v-list>
          </v-toolbar>
          <v-list class="pt-0" dense>
              <v-divider></v-divider>
              <v-list-tile>
                  <v-list-tile-action>
                      <v-icon></v-icon>
                  </v-list-tile-action>
              </v-list-tile>
          </v-list>
      </v-navigation-drawer>
    <v-toolbar color="blue darken-3"
               dark
               app
               :clipped-left="$vuetify.breakpoint.mdAndUp"
               fixed>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">PowerWeb</v-toolbar-title>
        <v-toolbar-items>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false
    }
  }
}
</script>

<style>
.anchorBL{
    display:none;
}
</style>
