<template>
  <div style="padding: 50px; padding-top: 8%">
    <v-col cols="6" md="6">
      <v-select
        :items="departements"
        item-text="name"
        item-value="id"
        v-model="departementId"
        label="Departements"
        @change="changeDepartment"
      ></v-select>
    </v-col>
    <v-data-table
      :headers="headers"
      :items="profilegroupsBydepartements"
      :search="search"
      :loading="loading"
      sort-by="item.id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.NonFunctionalEquipement="{ item }">
      <p>
        {{  item.equipmentsCount - item.functionalEquipmnet }}
      </p>
    </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          color="teal"
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
</template>
<script>
import CustomizedAxios from "../../plugins/axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    loading: false,
    search: "",
    confirmAddSave: false,
    headers: [
      { text: "Name", value: "name", sortable: true },
      { text: "Total equipment", value: "equipmentsCount", sortable: true },
      {
        text: "Functional Equipement",
        value: "functionalEquipmnet",
        sortable: true,
      },
      {
        text: "Non Functional Equipement",
        value: "NonFunctionalEquipement",
        sortable: true,
      },
      { text: "Total damage", value: "damagedCount", sortable: true },
      { text: "Resolved", value: "confirmedCount", sortable: true },
      { text: "Closed", value: "closedCount", sortable: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
    profilegroups: [],
    profilegroupsBydepartements: [],
    departements: [],
    test: [],
    merge: [],
    departementId: "",
    editedIndex: -1,
    ProfileGroupsByCounters: {
      id: null,
      equipmentsCount: null,
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
    },
    editedItem: {
      id: "",
      name: "",
      departement: "",
      domain: {
        id: "",
      },
    },
    defaultItem: {
      id: "",
      name: "",
      departement: "",
      domain: {
        id: "",
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
    ...mapGetters(["getProfileGroupsByCounters", "getdepartements"]),
  },
  watch: {
    dialog(val) {
      if (this.editedIndex == -1) {
        this.editedIndex = -1;
        this.editedItem = {
          id: "",
          name: "",
          departement: "",
          domain: {
            id: "",
          },
        };
      }

      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {},
  methods: {
    initialize() {
      this.profilegroupsBydepartements = [];
      this.getProfileGroupsByCountersAction().then(() => {
        this.profilegroupsBydepartements = [...this.getProfileGroupsByCounters];
      });
      this.setDepartementsAction().then(() => {
        this.departements = [...this.getdepartements];
      });
    },
    pageView(item) {
      this.$router.push({
        name: "techniqueView",
        params: { name: item.name },
      });
      localStorage.removeItem("idDomainGroupesid");

      localStorage.setItem("idDomainGroupesid", item.id);
    },
    ...mapActions([
      "getProfileGroupsByCountersAction",
      "setDepartementsAction",
    ]),
    changeDepartment() {
      this.profilegroupsBydepartements = [];
      this.profilegroups = [];
      this.getProfileGroupsByCountersAction().then(() => {
        //this.profilegroupsBydepartements = [...this.getProfileGroupsByCounters];
        this.getProfileGroupsByCounters.map((item) => {
          if (item.department_id == this.departementId) {
            this.profilegroupsBydepartements.push(item);
          }
        });
      });
      console.log("this.profilegroupsBydepartements", this.profilegroupsBydepartements);
    },
  },
};
</script>
