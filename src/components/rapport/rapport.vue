<template>
  <div style="padding: 0px; padding-top: 2%">
    <v-container class="">
      <h4>Rapport by :</h4>
      <v-row>
        <v-col cols="12" sm="4" md="4">
          <v-select
            :items="profile_groupe"
            item-text="name"
            item-value="id"
            v-model="profile_groupe_id"
            label="Equipment groupe :"
            :disabled="disabled"
            @change="changeProfile_groupeSELECT"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-select
            :items="equipmentsFiltre"
            item-text="name"
            item-value="id"
            v-model="equipments_id"
            label="Equipment :"
            @change="changeEquipmentsFiltreSELECT"
            :disabled="disabledEquipmentsFiltre"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-select
            :items="equipmentsFiltre"
            item-text="name"
            item-value="id"
            v-model="equipments_id"
            label="Equipment :"
            @change="changeEquipmentsFiltreSELECT"
            :disabled="disabledEquipmentsFiltre"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
    <v-container style="padding: 0px; padding-top: 2%">
      <v-row>
    <div style="margin: 0 auto; width: 100%">
          <v-data-table
            :headers="headers"
            :items="desserts"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
        </div>
      </v-row>
    </v-container>
    <v-container  style="padding: 0px; padding-top: 4%">
        <v-row class="d-flex justify-center">
            <v-btn
                color="primary"
              >
                Generate Rapport
              </v-btn>
              
        </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      drawer: false,
      headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
        ],
         desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
    };
  },
  mounted() {
    document.title = "Rapport";
  },
  computed: {
    ...mapGetters(["", ""]),
  },
  watch: {},
  methods: {
    initialize() {},
    ...mapActions([""]),
  },
};
</script>

<style></style>
