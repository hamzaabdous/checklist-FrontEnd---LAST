<template>
  <div style="padding: 0; padding-top: 13px">
    <div style="margin: 0 auto; width: 100%">
      <v-container class="damageContainer">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select
              :items="profile_groupe"
              item-text="name"
              item-value="id"
              v-model="profile_groupe_id"
              label="Equipment groups :"
              :disabled="disabled"
              @change="changeProfile_groupeSELECT"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="6">
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
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>Warning !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              Are you sure you want to valide this defected ?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" @click="cancel"> No </v-btn>
              <v-btn color="primary" @click="dialog = false"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogValide" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>Warning !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              Are you sure you want to valide this Damages ?
            </v-card-title>
            <v-card-text class="font-weight-bold"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" @click="cancelvalide()"> No </v-btn>
              <v-btn color="primary" @click="valider()"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogValideDamage" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>Warning !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              Are you sure you want to valide this Damages ?
            </v-card-title>
            <v-card-text class="font-weight-bold"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" @click="dialogValideDamage = false">
                No
              </v-btn>
              <v-btn color="primary" @click="validerDamages()"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="resolvedDialoge" persistent max-width="490">
          <v-card>
            <v-card-title class="text-h5 red lighten-1 white--text">
              Warning !!
            </v-card-title>
            <v-spacer></v-spacer>

            <v-card-text class="pa-4 black--text">
              Warning this is a resolved item, are you sure you want to turn it
              not-defected or defected ?
            </v-card-text>
            <v-card-actions>
              <v-btn color="#fff " @click="resolvedDialoge = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mr-2" color="#76ba99" @click="closed">
                Not-Defected
              </v-btn>
              <v-btn class="mr-2" color="#f54" @click="revert">
                Defected
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="defectedDialoge" persistent max-width="490">
          <v-card>
            <v-card-title class="text-h5 red lighten-1 white--text">
              Warning !!
            </v-card-title>
            <v-spacer></v-spacer>

            <v-card-text class="pa-4 black--text">
              Warning this is a defected item, are you sure you want to turn it
              not-defected ?
            </v-card-text>
            <v-card-actions>
              <v-btn color="#fff" @click="defectedDialoge = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn class="mr-2" color="#76ba99" @click="confirmed">
                Not-Defected
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-container>
          <v-row>
            <v-col cols="4" class="ITpanell">
              <v-row>
                <v-col cols="12" class="d-flex justify-center">
                  <span>IT </span>
                  <span class="red--text"
                    >({{
                      this.modelDamageIT.length + this.confirmedDamageIT.length
                    }})</span
                  ></v-col
                >
              </v-row>

              <v-col cols="12" sm="12" class="scroll">
                <v-list flat>
                  <v-list-item-group
                    name="it"
                    v-model="modelIT"
                    multiple
                    color="#fff"
                  >
                    <div class="hamzatec d-flex flex-wrap">
                      <v-list-item
                        v-for="(item, i) in modelDamageIT"
                        :key="i"
                        class="item itemDamaged d-flex flex-wrap"
                        @click="defectedFunction(item, i)"
                        style="background-color: #f54; color: #fff"
                      >
                        <v-list-item-content class="item-content">
                          <v-list-item-title
                            name="modelDamageIT"
                            class="itemName"
                            >{{ item.name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <div class="hamzatec d-flex flex-wrap">
                      <v-list-item
                        v-for="(item, i) in confirmedDamageIT"
                        :key="i"
                        class="item"
                        style="background-color: #ff8f56; color: #fff"
                        @click="resolvedFunction(item, i)"
                      >
                        <v-list-item-content class="item-content">
                          <v-list-item-title
                            name="modelDamageTEC"
                            class="itemName"
                            >{{ item.name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <v-divider class="ma-3"></v-divider>

                    <div class="hamzatec d-flex flex-wrap">
                      <v-list-item
                        v-for="(item, i) in damageTypesIT"
                        :key="i"
                        class="item"
                        active-class="bg-active"
                        style="background-color: #76ba99; color: #fff"
                        @click="valider(item, i)"
                      >
                        <v-list-item-content class="item-content">
                          <v-list-item-title
                            name="damageTypesIT"
                            class="itemName"
                            >{{ item.name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-col>

            <v-col cols="8" class="TECpanell">
              <v-row>
                <v-col cols="12" class="d-flex justify-center">
                  <span>Technique </span>
                  <span class="red--text">
                    ({{
                      this.modelDamageTEC.length +
                      this.confirmedDamageTEC.length
                    }})</span
                  ></v-col
                >
              </v-row>

              <v-col cols="12" sm="12" class="scroll">
                <v-list flat>
                  <v-list-item-group
                    name="TEC"
                    v-model="modelTEC"
                    multiple
                    color="#fff"
                  >
                    <div class="hamzatec d-flex flex-wrap">
                      <v-list-item
                        v-for="(item, i) in modelDamageTEC"
                        :key="i"
                        class="item"
                        style="background-color: #f54; color: #fff"
                        @click="defectedFunction(item, i)"
                      >
                        <v-list-item-content class="item-content">
                          <v-list-item-title
                            name="modelDamageTEC"
                            class="itemName"
                            >{{ item.name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <div class="hamzatec d-flex flex-wrap">
                      <v-list-item
                        v-for="(item, i) in confirmedDamageTEC"
                        :key="i"
                        class="item"
                        style="background-color: #ff8f56; color: #fff"
                        @click="resolvedFunction(item, i)"
                      >
                        <v-list-item-content class="item-content">
                          <v-list-item-title
                            name="modelDamageTEC"
                            class="itemName"
                            >{{ item.name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <v-divider class="ma-3"></v-divider>

                    <div class="hamzatec d-flex flex-wrap">
                      <v-list-item
                        v-for="(item, i) in damageTypesTEC"
                        :key="i"
                        class="item"
                        active-class="bg-active"
                        style="background-color: #76ba99; color: #fff"
                        @click="valider(item, i)"
                      >
                        <v-list-item-content class="item-content">
                          <v-list-item-title
                            name="damageTypesTEC"
                            class="itemName"
                            >{{ item.name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="4">
              <v-sheet
                color="#f54"
                elevation="1"
                height="20"
                width="20"
                rounded
              ></v-sheet>
              Defected
            </v-col>
            <v-col cols="4">
              <v-sheet
                color="#FF8F56"
                elevation="1"
                height="20"
                width="20"
                rounded
              ></v-sheet>
              Resolved
            </v-col>
            <v-col cols="3">
              <v-sheet
                color="#76ba99"
                elevation="1"
                height="20"
                width="20"
                rounded
              ></v-sheet>
              Not-Defected
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col class="d-flex justify-center" cols="12">
              <v-btn
                depressed
                color="primary"
                :disabled="disabled"
                @click="dialogValideDamage = true"
              >
                Valider
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CustomizedAxios from "../../plugins/axios";
export default {
  data: () => ({
    userFiltre: [],
    disabled: false,
    resolvedDialoge: false,
    defectedDialoge: false,
    damageTypesIT: [],
    damageTypesTEC: [],
    modelDamageIT: [],
    modelDamageTEC: [],
    confirmedDamageTEC: [],
    confirmedDamageIT: [],
    equipmentsFiltre: [],
    Data: [],
    damageCourent: {
      declaredBy_id: null,
      equipment_id: null,
      damage_type_id: null,
    },
    damage_type_id: null,
    modelIT_id_Courent: null,
    modelTEC_id_Courent: null,
    profile_groupe: [],
    equipments: [],
    damagesend: [],
    modelIT: [],
    modelTEC: [],
    department: [],
    departmentIT: {
      id: null,
      name: "",
      created_at: "",
      updated_at: "",
    },
    departmentTEC: {
      id: null,
      name: "",
      created_at: "",
      updated_at: "",
    },
    DamageSelect: {
      id: null,
      status: "",
      description: "",
      declaredBy_id: null,
      declaredAt: "",
      confirmedBy_id: null,
      confirmedAt: null,
      closedBy_id: null,
      closedAt: null,
      rejectedBy_id: null,
      rejectedAt: null,
      rejectedTimes: null,
      equipment_id: null,
      damage_type_id: null,
      created_at: "",
      updated_at: "",
      declared_by: {
        id: null,
        username: "",
        lastName: "",
        firstName: "",
        email: "",
        phoneNumber: "",
        fonction_id: null,
        created_at: "",
        updated_at: "",
        fonction: {
          id: null,
          name: "",
          department_id: null,
          created_at: "",
          updated_at: "",
          department: {
            id: null,
            name: "",
            created_at: "",
            updated_at: "",
          },
        },
      },
      confirmed_by: null,
      closed_by: null,
      rejected_by: null,
      equipment: {
        id: null,
        name: "",
        profile_group_id: null,
        created_at: "",
        updated_at: "",
        profile_group: {
          id: null,
          name: "",
          department_id: null,
          created_at: "",
          updated_at: "",
          department: {
            id: null,
            name: "",
            created_at: "",
            updated_at: "",
          },
        },
      },
      damage_type: {
        id: null,
        name: "",
        profile_group_id: null,
        department_id: null,
        created_at: "",
        updated_at: "",
        profile_group: {
          id: null,
          name: "",
          department_id: null,
          created_at: "",
          updated_at: "",
          department: {
            id: null,
            name: "",
            created_at: "",
            updated_at: "",
          },
        },
        department: {
          id: null,
          name: "",
          created_at: "",
          updated_at: "",
        },
      },
      photos: [
        {
          id: null,
          description: null,
          filename: "",
          damage_id: null,
          created_at: "",
          updated_at: "",
        },
      ],
    },
    presenceCheck: {
      user_id: 0,
      equipment_id: 0,
      validation_presence_At: "",
    },
    confirmDamage: {
      id: null,
      confirmedBy_id: null,
      resolveDescription: "",
    },
    closeDamage: {
      id: null,
      closedBy_id: null,
    },
    revertDamage: {
      id: null,
      rejectedBy_id: null,
      rejectedDescription: "",
    },
    resolveditem: [],
    defecteditem: [],
    defectsChange: {
      item: [],
      damagetypeOld: [],
      statusOld: null,
      statusNew: "",
    },
    listDefectsChange: [],
    DamageTypeByEquipmentID: [],
    DamagesMergedWithDamageTypes: [],
    damageSelect: [],
    isvalide: false,
    equipments_id: "",
    dialog: false,
    dialogValide: false,
    profile_groupe_id: null,
    disabledEquipmentsFiltre: true,
    dialogValideDamage: false,
  }),
  mounted() {
    document.title = "damage";

    this.initialize();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapGetters([
      "getUsers",
      "getdamageTypes",
      "getprofilegroups",
      "getequipments",
      "getDamageTypeByEquipmentID",
      "getdamage",
      "getEquipmentDamagesMergedWithDamageTypes",
      "getdepartements",
      "getUserActive",
    ]),
  },
  watch: {
    dialog(val) {
      val || this.cancel();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    //this.initialize();
  },
  methods: {
    changeProfile_groupeSELECT() {
      this.modelDamageIT = [];
      this.modelDamageTEC = [];
      this.equipmentsFiltre = [];
      this.confirmedDamageTEC = [];
      this.confirmedDamageIT = [];
      this.damageTypesIT.length = 0;
      this.damageTypesTEC.length = 0;
      this.disabledEquipmentsFiltre = false;
      var count = 0;
      console.log("equipments", this.equipments);
      this.equipments.map((item) => {
        if (item.profile_group_id == this.profile_groupe_id) {
          this.equipmentsFiltre.push(item);
          count++;
        }
      });
      if (count == 0) {
        this.equipmentsFiltre = [];
      }
    },
    changeEquipmentsFiltreSELECT() {
      var IT = this.departmentIT.id;
      var TEC = this.departmentTEC.id;
      this.modelDamageTEC = [];
      this.modelDamageIT = [];
      this.damageTypesTEC = [];
      this.damageTypesIT = [];
      this.confirmedDamageTEC = [];
      this.confirmedDamageIT = [];
      this.FindDamageTypeByEquipmentID = [];
      this.getEquipmentDamagesMergedWithDamageTypesAction(
        this.equipments_id
      ).then(() => {
        this.DamagesMergedWithDamageTypes = [
          ...this.getEquipmentDamagesMergedWithDamageTypes,
        ];
        console.log(
          "DamagesMergedWithDamageTypes",
          this.DamagesMergedWithDamageTypes
        );
        this.DamagesMergedWithDamageTypes.map((item) => {
          //  debugger;
          if (item.department_id == TEC && item.damage != null) {
            if (item.damage.status == "closed") {
              this.damageTypesTEC.push(item);
            } else if (item.damage.status == "resolved") {
              this.confirmedDamageTEC.push(item);
            } else {
              this.modelDamageTEC.push(item);
            }
          } else if (item.department_id == TEC && item.damage == null) {
            this.damageTypesTEC.push(item);
          }

          if (item.department_id == IT && item.damage != null) {
            if (item.damage.status == "closed") {
              this.damageTypesIT.push(item);
            } else if (item.damage.status == "resolved") {
              this.confirmedDamageIT.push(item);
            } else {
              this.modelDamageIT.push(item);
            }
          } else if (item.department_id == IT && item.damage == null) {
            this.damageTypesIT.push(item);
          }
        });
      });
    },
    initialize() {
      console.log("initialize");

      this.setPROFILEDROUPSAction().then(() => {
        this.setUsersbyIDAction(this.getUserActive.id).then(() => {
          this.userFiltre = this.getUsers;
          if (this.userFiltre.profileGroups.length == 0) {
            swal("warning !!", "You don't have any group !", "warning");
            this.disabled = true;
            // this.profile_groupe = [...this.getprofilegroups];
          } else if (this.userFiltre.profileGroups.length != 0) {
            this.profile_groupe = [...this.userFiltre.profileGroups];
          }
        });
      });
      this.setequipmentsAction().then(() => {
        this.equipments = [...this.getequipments];
        console.log("set equipments", this.equipments);
      });
      this.setDepartementsAction().then(() => {
        this.department = [...this.getdepartements];
        this.department.map((item) => {
          if (item.name.toLowerCase() == "technique") {
            this.departmentTEC = item;
          }
          if (item.name.toLowerCase() == "it") {
            this.departmentIT = item;
          }
        });
        console.log("set Departements", this.department);
      });
    },
    ...mapActions([
      "setDAMAGEAction",
      "editDAMAGEAction",
      "deleteDAMAGEAction",
      "declareDamageAction",
      "confirmDamageAction",
      "closeDamageAction",
      "revertDamageAction",
      "setDAMAGETYPESAction",
      "setPROFILEDROUPSAction",
      "setequipmentsAction",
      "addDAMAGESAction",
      "FindDamageTypeByEquipmentIDAction",
      "getEquipmentDamagesMergedWithDamageTypesAction",
      "setDepartementsAction",
      "setUsersbyIDAction",
      "presenceChecksAction",
    ]),
    valider(item, i) {
      this.damageCourent.declaredBy_id = this.getUserActive.id;
      this.damageCourent.damage_type_id = item.id;
      this.damageCourent.equipment_id = this.equipments_id;
      this.damage_type_id = item.id;
      this.modelIT_id_Courent = i;

      if (this.Data.length == 0) {
        var Damage = {
          declaredBy_id: null,
          equipment_id: null,
          damage_type_id: null,
        };
        Damage.declaredBy_id = this.getUserActive.id;
        Damage.damage_type_id = this.damage_type_id;
        Damage.equipment_id = this.equipments_id;

        this.damageSelect.push(Damage);

        this.Data.push(Damage);
      } else if (this.Data.length > 0) {
        this.isvalide = false;
        this.Data.map((e) => {
          if (e.damage_type_id == this.damage_type_id) {
            this.isvalide = true;
          }
        });
        if (this.isvalide == true) {
          this.Data = this.Data.filter((c) => c.damage_type_id != item.id);
        } else {
          var Damage = {
            declaredBy_id: null,
            equipment_id: null,
            damage_type_id: null,
          };
          Damage.declaredBy_id = this.getUserActive.id;
          Damage.damage_type_id = this.damage_type_id;
          Damage.equipment_id = this.equipments_id;

          this.damageSelect.push(Damage);

          this.Data.push(Damage);
        }
      }

      console.log(this.Data);
    },
    resolvedFunction(item, i) {
      this.resolveditem = [];
      this.resolvedDialoge = true;
      this.resolveditem.push(item);
    },
    defectedFunction(item, i) {
      this.resolveditem = [];
      this.defectedDialoge = true;
      this.resolveditem.push(item);
      /*  this.defecteditem = [];
      this.defectedDialoge = true;
      this.defecteditem.push(item); */
    },
    changeDefectsFunction() {
      this.defectsChange.item = this.resolveditem[0];
      this.defectsChange.damagetypeOld = this.resolveditem[0].damage;
      this.defectsChange.statusOld = this.resolveditem[0].damage.status;
      this.defectsChange.statusNew = "closed";

      this.listDefectsChange.push(this.defectsChange);
      if (this.resolveditem[0].department.name == "IT") {
        this.damageTypesIT.push(this.resolveditem[0]);
        this.modelDamageIT = this.modelDamageIT.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      } else if (this.resolveditem[0].department.name == "TECHNIQUE") {
        this.damageTypesTEC.push(this.resolveditem[0]);
        this.modelDamageTEC = this.modelDamageTEC.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      }
      console.log("listDefectsChange", this.listDefectsChange);
      this.defectedDialoge = false;
    },
    confirmed() {
      console.log("resolveditem closed :", this.resolveditem);
      this.closeDamage.id = this.resolveditem[0].damage.id;
      this.closeDamage.closedBy_id = this.getUserActive.id;
      this.closeDamageAction(this.closeDamage).then((resolve) => {});

      if (this.resolveditem[0].department.name == "IT") {
        this.damageTypesIT.push(this.resolveditem[0]);
        this.modelDamageIT = this.modelDamageIT.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      } else if (this.resolveditem[0].department.name == "TECHNIQUE") {
        this.damageTypesTEC.push(this.resolveditem[0]);
        this.modelDamageTEC = this.modelDamageTEC.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      }

      this.defectedDialoge = false;
    },
    closed() {
      console.log("resolveditem closed :", this.resolveditem);
      this.closeDamage.id = this.resolveditem[0].damage.id;
      this.closeDamage.closedBy_id = this.getUserActive.id;
      this.closeDamageAction(this.closeDamage).then((resolve) => {});

      if (this.resolveditem[0].department.name == "IT") {
        this.damageTypesIT.push(this.resolveditem[0]);
        this.confirmedDamageIT = this.confirmedDamageIT.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      } else if (this.resolveditem[0].department.name == "TECHNIQUE") {
        this.damageTypesTEC.push(this.resolveditem[0]);
        this.confirmedDamageTEC = this.confirmedDamageTEC.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      }
      this.resolvedDialoge = false;
    },
    revert() {
      console.log("resolveditem closed :", this.resolveditem);
      this.revertDamage.id = this.resolveditem[0].damage.id;
      this.revertDamage.rejectedBy_id = this.getUserActive.id;
      this.revertDamageAction(this.revertDamage).then((resolve) => {});

      if (this.resolveditem[0].department.name == "IT") {
        this.modelDamageIT.push(this.resolveditem[0]);
        this.confirmedDamageIT = this.confirmedDamageIT.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      } else if (this.resolveditem[0].department.name == "TECHNIQUE") {
        this.modelDamageTEC.push(this.resolveditem[0]);
        this.confirmedDamageTEC = this.confirmedDamageTEC.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      }
      this.resolvedDialoge = false;
    },
    cancel() {
      this.dialog = false;
    },
    cancelvalide() {
      if (this.Data.length == 0) {
        this.dialogValide = false;
      } else {
        this.Data = this.Data.map((e) => {
          if (e.damage_type_id != this.damage_type_id) {
            return e;
          }
        });
        this.dialogValide = false;
        this.modelIT = this.modelIT.map((e) => {
          if (e != this.modelIT_id_Courent) {
            return e;
          }
        });
        this.Data = this.Data.filter(function (element) {
          return element !== undefined;
        });
      }
    },
    dialogValideFunction(item, i) {
      this.damageCourent.declaredBy_id = this.getUserActive.id;
      this.damageCourent.damage_type_id = item.id;
      this.damageCourent.equipment_id = this.equipments_id;
      this.damage_type_id = item.id;
      this.modelIT_id_Courent = i;
      //this.dialogValide = true;
    },
    validerDamages() {
      console.log("this.modelTEC", this.modelTEC);
      console.log("this.modelIT", this.modelIT);
      if (this.Data.length == 0) {
        if (this.equipments_id == "") {
          swal(
            "warning !!",
            "Please can you chose equipment you use it!",
            "warning"
          );
          this.dialogValide = false;
          this.dialogValideDamage = false;
        } else {
          this.presenceCheck.user_id = this.getUserActive.id;
          this.presenceCheck.equipment_id = this.equipments_id;
          this.presenceChecksAction(this.presenceCheck).then((resolve) => {
            console.log("presenceCheck DONE");
            swal(
              "success !!",
              "Please can you chose equipment you use it!",
              "success"
            );
          });
          this.dialogValide = false;
          this.dialogValideDamage = false;
        }
      } else if (this.Data.length > 0) {
        this.declareDamageAction(this.Data).then(() => {
          this.modelTEC = [];
          this.modelIT = [];
          console.log("validerDamages");
          var IT = this.departmentIT.id;
          var TEC = this.departmentTEC.id;

          /* this.Data.map((item) => {
          if (item.department_id == IT) {
            item.damage = this.DamageSelect;

            item.damage.status = "on progress";
            this.modelDamageIT.push(item);
            this.damageTypesIT = this.damageTypesIT.filter((e) => {
              return e.id != item.id;
            });
            this.modelIT = [];
          } else if (item.department_id == TEC) {
            item.damage = this.DamageSelect;
            item.damage.status = "on progress";
            this.modelDamageTEC.push(item);
            this.damageTypesTEC = this.damageTypesTEC.filter((e) => {
              return e.id != item.id;
            });
            this.modelTEC = [];
          }
        }); */

          this.Data = [];

          this.damageSelect = [];
          this.changeEquipmentsFiltreSELECT();
          this.dialogValide = false;
          this.dialogValideDamage = false;
        });
      }
    },
  },
};
</script>
