<template>
  <div style="padding: 30px; padding-top: 2%">
    <v-row style="text-align: center">
      <v-col cols="12" md="12">
        <h3>
          Equipment group :
          <span class="red--text"> {{ this.ProfileGroupsByCounter.name }}</span>
        </h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" md="3">
        <template>
          <v-card class="mx-auto" max-width="200" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4 red--text">
                  Total defictive items
                </div>
                <v-list-item-title class="text-h5 mb-1 red--text">
                  {{ this.ProfileGroupsByCounter.damagedCount }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="35" color="white">
                <v-icon color="red" large>
                  mdi-alarm-light
                </v-icon></v-list-item-avatar
              >
            </v-list-item>
          </v-card>
        </template>
      </v-col>
      <v-col cols="3" md="3">
        <template>
          <v-card class="mx-auto" max-width="200" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4 deep-orange--text">
                  RESOLVED defictive items
                </div>
                <v-list-item-title class="text-h5 mb-1 deep-orange--text">
                  {{ this.ProfileGroupsByCounter.confirmedCount }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="35" color="white">
                <v-icon color="deep-orange" large>
                  mdi-bell-check
                </v-icon></v-list-item-avatar
              >
            </v-list-item>
          </v-card>
        </template>
      </v-col>
      <v-col cols="3" md="3">
        <template>
          <v-card class="mx-auto" max-width="200" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4 blue--text">
                  Closed defictive items
                </div>
                <v-list-item-title class="text-h5 mb-1 blue--text">
                  {{ this.ProfileGroupsByCounter.closedCount }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="35" color="white">
                <v-icon color="blue" large>
                  mdi-lock-open
                </v-icon></v-list-item-avatar
              >
            </v-list-item>
          </v-card>
        </template>
      </v-col>

      <v-col cols="3" md="3">
        <template>
          <v-card class="mx-auto" max-width="200" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4 green--text">
                  Total Functional Equipement
                </div>
                <v-list-item-title class="text-h5 mb-1 green--text">
                  {{ this.ProfileGroupsByCounter.functionalEquipmnet }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="35" color="white">
                <v-icon color="green" large>
                  mdi-check-bold
                </v-icon></v-list-item-avatar
              >
            </v-list-item>
          </v-card>
        </template>
      </v-col>
    </v-row>
    <div style="padding: 3px; padding-top: 4%">
      <v-data-table
        :headers="headers"
        :items="equipments"
        :search="search"
        :loading="loading"
        sort-by="item.id"
        class="elevation-1"
      >
        <template v-slot:item="{ item }">
          <tr :class="getColor(item.damagedCount)">
            <td class="">{{ item.nameEquipment }}</td>
            <td class="">{{ item.damagedCount }}</td>
            <td class="">{{ item.confirmedCount }}</td>
            <td class="">{{ item.closedCount }}</td>
            <td>
              <v-btn
                color="teal"
                class="mr-2 btn white--text"
                @click="pageView(item)"
              >
                <v-icon medium class="mr-2"> mdi-eye-outline </v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="primary"
            class="mr-2 btn white--text"
            @click="pageView(item)"
          >
            <v-icon medium class="mr-2"> mdi-eye-outline </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize()"> Reset </v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    loading: false,
    search: "",
    headers: [
      { text: "Name", value: "nameEquipment", sortable: true },
      { text: "Total defictive items", value: "damagedCount", sortable: true },
      { text: "Resolved", value: "confirmedCount", sortable: true },
      { text: "Closed", value: "closedCount", sortable: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
    equipments: [],
    equipmentsFiltre: [],
    idgrp: null,
    ProfileGroupsByCounter: {
      id: null,
      name: "",
      equipmentsCount: null,
      functionalEquipmnet: null,
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
    },
    EquipmentsByCounters: {
      id: null,
      nameEquipment: null,
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
    },
    editedIndex: -1,
    editedItem: {
      id: null,
      name: "",
      description: "",
      profileGroup: {
        id: null,
      },
    },
    defaultItem: {
      id: null,
      name: "",
      description: "",
      profileGroup: {
        id: null,
      },
    },
  }),
  mounted() {
    document.title = "checklist";

    this.loading = true;
    setTimeout(() => {
      this.initialize();
      this.loading = false;
    }, 2500);
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapGetters([
      "getequipments",
      "getProfileGroupsByCounter",
      "getEquipmentsByCounters",
      "getUserActive",
    ]),
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    // this.initialize();
  },
  methods: {
    getColor(damagedCount) {
      var color = "";
      if (damagedCount > 0) color = "red lighten-1 white--text";
      else if (damagedCount == 0) color = "green lighten-1 white--text";

      return color;
    },
    initialize() {
      this.idgrp = localStorage.getItem("idDomainGroupes");
      if (this.getUserActive.fonction.department_id == 1) {
        this.getEquipmentsByCountersITAction(
          localStorage.getItem("idDomainGroupesid")
        ).then((resolve) => {
          this.equipments = [...this.getEquipmentsByCounters];
          //  console.log("this.equipments",this.equipments);
        });
        this.getProfileGroupsByCounterITAction(
          localStorage.getItem("idDomainGroupesid")
        ).then(() => {
          this.ProfileGroupsByCounter.id = this.getProfileGroupsByCounter.id;
          this.ProfileGroupsByCounter.name =
            this.getProfileGroupsByCounter.name;
          this.ProfileGroupsByCounter.equipmentsCount =
            this.getProfileGroupsByCounter.equipmentsCount;
          this.ProfileGroupsByCounter.functionalEquipmnet =
            this.getProfileGroupsByCounter.functionalEquipmnet;
          this.ProfileGroupsByCounter.damagedCount =
            this.getProfileGroupsByCounter.damagedCount;
          this.ProfileGroupsByCounter.confirmedCount =
            this.getProfileGroupsByCounter.confirmedCount;
          this.ProfileGroupsByCounter.closedCount =
            this.getProfileGroupsByCounter.closedCount;
        });
      } else if (this.getUserActive.fonction.department_id == 2) {
        this.getEquipmentsByCountersTECAction(
          localStorage.getItem("idDomainGroupesid")
        ).then((resolve) => {
          this.equipments = [...this.getEquipmentsByCounters];
          console.log("this.equipments", this.equipments);
        });
        this.getProfileGroupsByCounterTECAction(
          localStorage.getItem("idDomainGroupesid")
        ).then(() => {
          this.ProfileGroupsByCounter.id = this.getProfileGroupsByCounter.id;
          this.ProfileGroupsByCounter.name =
            this.getProfileGroupsByCounter.name;
          this.ProfileGroupsByCounter.equipmentsCount =
            this.getProfileGroupsByCounter.equipmentsCount;
          this.ProfileGroupsByCounter.functionalEquipmnet =
            this.getProfileGroupsByCounter.functionalEquipmnet;
          this.ProfileGroupsByCounter.damagedCount =
            this.getProfileGroupsByCounter.damagedCount;
          this.ProfileGroupsByCounter.confirmedCount =
            this.getProfileGroupsByCounter.confirmedCount;
          this.ProfileGroupsByCounter.closedCount =
            this.getProfileGroupsByCounter.closedCount;
        });
      } else {
        this.getEquipmentsByCountersAction(
          localStorage.getItem("idDomainGroupesid")
        ).then((resolve) => {
          this.equipments = [...this.getEquipmentsByCounters];
          //  console.log("this.equipments",this.equipments);
        });
        this.getProfileGroupsByCounterITAction(
          localStorage.getItem("idDomainGroupesid")
        ).then(() => {
          this.ProfileGroupsByCounter.id = this.getProfileGroupsByCounter.id;
          this.ProfileGroupsByCounter.name =
            this.getProfileGroupsByCounter.name;
          this.ProfileGroupsByCounter.equipmentsCount =
            this.getProfileGroupsByCounter.equipmentsCount;
          this.ProfileGroupsByCounter.functionalEquipmnet =
            this.getProfileGroupsByCounter.functionalEquipmnet;
          this.ProfileGroupsByCounter.damagedCount =
            this.getProfileGroupsByCounter.damagedCount;
          this.ProfileGroupsByCounter.confirmedCount =
            this.getProfileGroupsByCounter.confirmedCount;
          this.ProfileGroupsByCounter.closedCount =
            this.getProfileGroupsByCounter.closedCount;
        });
      }

      console.log("this.ProfileGroupsByCounter", this.ProfileGroupsByCounter);
    },
    ...mapActions([
      "setequipmentsAction",
      "getProfileGroupsByCounterAction",
      "getProfileGroupsByCounterITAction",
      "getProfileGroupsByCounterTECAction",
      "getEquipmentsByCountersAction",
      "getEquipmentsByCountersITAction",
      "getEquipmentsByCountersTECAction",
    ]),
    pageView(item) {
      this.$router.push({
        name: "techniqueEquipment",
        params: { name: item.name },
      });
      console.log("item.id", item.id);
      localStorage.removeItem("idEquipment");
      localStorage.setItem("idEquipment", item.id);
    },
  },
};
</script>
