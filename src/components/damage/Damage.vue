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
              label="Equipment groupe :"
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
              Are you sure you want to valide this Damages ?
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
        <v-container>
          <v-row>
            <v-col cols="5" class="ITpanell">
              <v-container>
                <v-row>
                  <v-col cols="5"></v-col>
                  <v-col cols="4">
                    <span>IT </span>
                    <span class="red--text"
                      >({{
                        this.modelDamageIT.length +
                        this.modelIT.length +
                        this.confirmedDamageIT.length
                      }})</span
                    ></v-col
                  >
                  <v-col cols="3"></v-col>
                </v-row>
              </v-container>

              <v-col cols="12" sm="12" class="scroll">
                <v-list>
                  <v-list-item-group
                    name="it"
                    v-model="modelIT"
                    multiple
                    active-class="bg-active"
                    color="#fff"
                  >
                    <div>
                      <v-list-item
                        v-for="(item, i) in modelDamageIT"
                        :key="i"
                        class="item itemDamaged"
                        :disabled="true"
                        style="
                          background-color: rgb(255, 235, 234);
                          color: #f54;
                        "
                      >
                        <v-list-item-icon>
                          <v-icon medium> mdi-progress-wrench </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            name="modelDamageIT"
                            v-text="item.name"
                          ></v-list-item-title>
                          <h4>{{ item.damage.status }}</h4>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <div>
                      <v-list-item
                        v-for="(item, i) in confirmedDamageIT"
                        :key="i"
                        class="item"
                        style="background-color: #76ba99; color: #fff"
                        :disabled="true"
                      >
                        <v-list-item-icon>
                          <v-icon medium> mdi-progress-wrench </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            name="modelDamageTEC"
                            v-text="item.name"
                          ></v-list-item-title>
                          <h4>{{ item.damage.status }}</h4>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <div>
                      <v-list-item
                        v-for="(item, i) in damageTypesIT"
                        :key="i"
                        class="item"
                        @click="dialogValideFunction(item, i)"
                      >
                        <v-list-item-icon>
                          <v-icon> mdi-cellphone-link-off</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            name="damageTypesIT"
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="5" class="TECpanell">
              <v-container>
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-col cols="6">
                    <span>Technique </span>
                    <span class="red--text">
                      ({{
                        this.modelDamageTEC.length +
                        this.modelTEC.length +
                        this.confirmedDamageTEC.length
                      }})</span
                    ></v-col
                  >
                  <v-col cols="3"></v-col>
                </v-row>
              </v-container>

              <v-col cols="12" sm="12" class="scroll">
                <v-list>
                  <v-list-item-group
                    name="TEC"
                    v-model="modelTEC"
                    multiple
                    active-class="bg-active"
                    color="#fff"
                  >
                    <div>
                      <v-list-item
                        v-for="(item, i) in modelDamageTEC"
                        :key="i"
                        class="item"
                        style="
                          background-color: rgb(255, 235, 234);
                          color: #f54;
                        "
                        :disabled="true"
                      >
                        <v-list-item-icon>
                          <v-icon medium> mdi-progress-wrench </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            name="modelDamageTEC"
                            v-text="item.name"
                          ></v-list-item-title>
                          <h4>{{ item.damage.status }}</h4>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <div>
                      <v-list-item
                        v-for="(item, i) in confirmedDamageTEC"
                        :key="i"
                        class="item"
                        style="background-color: #76ba99; color: #fff"
                        :disabled="true"
                      >
                        <v-list-item-icon>
                          <v-icon medium> mdi-progress-wrench </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            name="modelDamageTEC"
                            v-text="item.name"
                          ></v-list-item-title>
                          <h4>{{ item.damage.status }}</h4>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                    <div>
                      <v-list-item
                        v-for="(item, i) in damageTypesTEC"
                        :key="i"
                        class="item"
                        @click="dialogValideFunction(item)"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-car-wrench</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            name="damageTypesTEC"
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-list-item-group>
                </v-list>
              </v-col>
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
      revertedBy_id: null,
      revertedAt: null,
      revertedTimes: null,
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
      reverted_by: null,
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
    DamageTypeByEquipmentID: [],
    DamagesMergedWithDamageTypes: [],
    damageSelect: [],
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
    valider(item) {
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

      console.log(this.Data);

      this.dialogValide = false;
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
      this.dialogValide = true;
    },
    validerDamages() {
      console.log("this.modelTEC", this.modelTEC);
      console.log("this.modelIT", this.modelIT);
      if (this.Data.length == 0) {
        if (this.equipments_id == "") {
          swal("warning !!", "Please can you chose equipment you use it!", "warning");
          this.dialogValide = false;
          this.dialogValideDamage = false;
        } else {
          this.presenceCheck.user_id = this.getUserActive.id;
          this.presenceCheck.equipment_id = this.equipments_id;
          this.presenceChecksAction(this.presenceCheck).then((resolve) => {
            console.log("presenceCheck DONE");
                      swal("warning !!", "Please can you chose equipment you use it!", "warning");

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
