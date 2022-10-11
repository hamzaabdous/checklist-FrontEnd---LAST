<template>
  <div style="padding: 50px; padding-top: 2%">
    <v-row style="text-align: center">
      <v-col cols="12" md="12">
        <h3>
          Equipement :
          <span class="red--text">
            {{ this.EquipmentsByCounter.nameEquipment }}</span
          >
        </h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" md="4">
        <template>
          <v-card class="mx-auto" max-width="200" outlined>
            <v-list-item three-line class="d-flex">
              <v-list-item-content>
                <div class="text-overline mb-4 red--text">
                  Pending Defects Tickets
                </div>
                <v-list-item-title class="text-h5 mb-1 red--text">
                  {{ this.EquipmentsByCounter.damagedCount }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="60" color="white">
                <v-icon color="red" large>
                  mdi-alarm-light
                </v-icon></v-list-item-avatar
              >
            </v-list-item>
          </v-card>
        </template>
      </v-col>
      <v-col cols="4" md="4">
        <template>
          <v-card class="mx-auto" max-width="200" outlined>
            <v-list-item three-line class="d-flex">
              <v-list-item-content>
                <div class="text-overline mb-4 deep-orange--text">
                  RESOLVED Defects TICKETS
                </div>
                <v-list-item-title class="text-h5 mb-1 deep-orange--text">
                  {{ this.EquipmentsByCounter.confirmedCount }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="60" color="white">
                <v-icon color="deep-orange" large>
                  mdi-bell-check
                </v-icon></v-list-item-avatar
              >
            </v-list-item>
          </v-card>
        </template>
      </v-col>
      <v-col cols="4" md="4">
        <template>
          <v-card class="mx-auto" v-if="isHistorique" max-width="200" outlined>
            <v-list-item three-line class="d-flex">
              <v-list-item-content>
                <div class="text-overline mb-4 blue--text">
                  Closed Defect Tickets
                </div>
                <v-list-item-title class="text-h5 mb-1 blue--text">
                  {{ this.EquipmentsByCounter.closedCount }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar tile size="60" color="white">
                <v-icon color="blue" large>
                  mdi-lock-open
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
        :items="damageByEquipments"
        :search="search"
        :loading="loading"
        sort-by="item.id"
        class="elevation-1"
      >
        <template v-slot:item="{ item }">
          <tr @click="pageView(item)">
            <td class="">{{ item.damage_type.name }}</td>

            <td>
              <v-chip class="white--text" :color="getColor(item.status)">
                {{ item.status }}
              </v-chip>
            </td>
            <td class="">{{ item.declared_by.username }}</td>
            <td class="">{{ item.created_at }}</td>
            <td class="">{{ item.confirmedAt }}</td>
            <td>
              <v-btn
                v-if="item.status != 'closed'"
                color="primary"
                class="mr-2 btn white--text"
                @click.stop="clickImage(item)"
              >
                <v-icon medium class="mr-2"> mdi-camera </v-icon>
                /
                <v-icon medium class="mr-2"> mdi-comment </v-icon>
              </v-btn>
              <v-btn
                v-if="
                  item.status != 'resolved' &&
                  item.status != 'closed' &&
                  fonction != 'FOREMAN' &&
                  fonction != 'ADMIN'
                "
                class="mr-2 btn white--text"
                color="#FF8F56"
                @click.stop="opendialogresolve(item)"
              >
                Resolved
              </v-btn>
              <v-btn
                v-if="
                  item.status != 'on progress' &&
                  item.status != 'closed' &&
                  fonction != 'SUPERVISOR' &&
                  fonction != 'ADMIN'
                "
                class="mr-2 btn white--text"
                color="#f54"
                @click.stop="opendialogrejected(item)"
              >
                Rejected
              </v-btn>
              <v-btn
                v-if="
                  item.status != 'closed' &&
                  fonction != 'TECHNICIEN' &&
                  fonction != 'SUPERVISOR' &&
                  fonction != 'ADMIN'
                "
                class="mr-2 btn white--text"
                color="#76ba99"
                @click.stop="opendialogclosed(item)"
              >
                Close
              </v-btn>

              <v-btn
                v-if="fonction == 'ADMIN'"
                color="red"
                class="mr-2 btn white--text"
                @click.stop="opendialogDelete(item)"
              >
                <v-icon medium class="mr-2"> mdi-delete </v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template v-slot:top>
          <template>
            <v-btn
              :color="iscolor"
              @click="isHistorique == false ? showHistorique() : initialize()"
              class="white--text"
            >
              Historique Defecte
            </v-btn>
          </template>
          <v-dialog v-model="dialogimage" max-width="700px">
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialogimage = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items> </v-toolbar-items>
              </v-toolbar>

              <v-card-title class="text-h5"> Description : </v-card-title>
              <v-col cols="12" md="12">
                <v-textarea
                  solo
                  name="input-7-4"
                  label="Description"
                  v-model="photo.description"
                ></v-textarea>
              </v-col>
              <v-card-title class="text-h5"> Add picture : </v-card-title>
              <v-col cols="12" md="12">
                <v-file-input
                  label="Pictures"
                  v-model="photo.photos"
                  filled
                  multiple
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="" @click="dialogimage = false">
                  Close
                </v-btn>
                <v-btn depressed color="primary" @click="sendImage()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogresolve" max-width="700px">
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialogresolve = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items> </v-toolbar-items>
              </v-toolbar>

              <v-card-title class="text-h5"> Description : </v-card-title>
              <v-col cols="12" md="12">
                <v-textarea
                  solo
                  name="input-7-4"
                  label="Description"
                  v-model="confirmDamage.resolveDescription"
                ></v-textarea>
              </v-col>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="" @click="dialogresolve = false">
                  Close
                </v-btn>
                <v-btn depressed color="primary" @click="confirmed()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogrejected" max-width="700px">
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialogrejected = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items> </v-toolbar-items>
              </v-toolbar>

              <v-card-title class="text-h5"> Description : </v-card-title>
              <v-col cols="12" md="12">
                <v-textarea
                  solo
                  name="input-7-4"
                  label="Description"
                  v-model="revertDamage.rejectedDescription"
                ></v-textarea>
              </v-col>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="" @click="dialogrejected = false">
                  Close
                </v-btn>
                <v-btn depressed color="primary" @click="revert()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogclose" max-width="700px">
            <v-card>
              <v-toolbar dark color="error">
                <v-toolbar-title>Warning !</v-toolbar-title>
              </v-toolbar>
              <v-card-title class="text-h5"
                >Are you sure you want to close this Defecte ?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="" @click="dialogclose = false">Cancel</v-btn>
                <v-btn color="primary" @click="closed">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-toolbar dark color="error">
                <v-toolbar-title>Warning !</v-toolbar-title>
              </v-toolbar>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this Defecte ?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="" @click="dialogDelete = false"
                  >Cancel</v-btn
                >
                <v-btn depressed color="error" @click="deleteDamage()"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog" fullscreen hide-overlay>
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="closedtailedialoge">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-title class="text-h5 blue--text text--darken-3">
                Defect Details:
              </v-card-title>
              <v-container>
                <v-row>
                  <v-col>
                    <table class="DamageDetails">
                      <tbody>
                        <tr>
                          <td><h3>Defect</h3></td>
                          <td class="valueColumn">
                            <h4>{{ damageSelect.damage_type.name }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Description</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.description == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.description }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Status</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.status == null">Empty</h5>

                            <h4 v-else>{{ damageSelect.status }}</h4>
                          </td>
                        </tr>

                        <tr>
                          <td><h3>Profile Group</h3></td>
                          <td class="valueColumn">
                            <h5
                              v-if="
                                damageSelect.equipment.profile_group.name ==
                                null
                              "
                            >
                              Empty
                            </h5>

                            <h4 v-else>
                              {{ damageSelect.equipment.profile_group.name }}
                            </h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Equipment</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.equipment.name == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.equipment.name }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Declared At</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.declaredAt == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.declaredAt }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Declared By</h3></td>
                          <td class="valueColumn">
                            <h5
                              v-if="damageSelect.declared_by.username == null"
                            >
                              Empty
                            </h5>

                            <h4 v-else>
                              {{ damageSelect.declared_by.username }}
                            </h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Resolved At</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.confirmedAt == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.confirmedAt }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Resolve Description</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.resolveDescription == null">
                              Empty
                            </h5>

                            <h4 v-else>
                              {{ damageSelect.resolveDescription }}
                            </h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Resolved By</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.confirmed_by == null">
                              Empty
                            </h5>

                            <h4 v-else>
                              {{ damageSelect.confirmed_by.username }}
                            </h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Closed At</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.closedAt == null">Empty</h5>

                            <h4 v-else>{{ damageSelect.closedAt }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Rejected By</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.rejected_by == null">
                              Empty
                            </h5>

                            <h4 v-else>
                              {{ damageSelect.rejected_by.username }}
                            </h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Rejected At</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.rejectedAt == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.rejectedAt }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Rejected Times</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.rejectedTimes == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.rejectedTimes }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Rejected Description</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.rejectedDescription == null">
                              Empty
                            </h5>

                            <h4 v-else>
                              {{ damageSelect.rejectedDescription }}
                            </h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Updated at</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.updated_at == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.updated_at }}</h4>
                          </td>
                        </tr>

                        <tr>
                          <td><h3>Created at</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.created_at == null">
                              Empty
                            </h5>

                            <h4 v-else>{{ damageSelect.created_at }}</h4>
                          </td>
                        </tr>
                        <tr>
                          <td><h3>Last driver</h3></td>
                          <td class="valueColumn">
                            <h5 v-if="damageSelect.driverOut == null">Empty</h5>

                            <h4 v-else>
                              {{ damageSelect.driver_out.username }}
                            </h4>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>
              </v-container>
              <v-card-title class="text-h5 blue--text text--darken-3">
                Photos :
              </v-card-title>
              <v-container class="DamageDetails">
                <v-row class="photos">
                  <template>
                    <v-row v-if="damageSelect.photos.length == 0">
                      <v-col cols="4">
                        <h5>Empty</h5>
                      </v-col>
                    </v-row>
                    <v-row v-else>
                      <v-col
                        v-for="item in damageSelect.photos"
                        :key="item.id"
                        class="d-flex child-flex"
                        cols="4"
                      >
                        <v-img
                          max-height="150"
                          max-width="200"
                          :src="`http://localhost:8000/storage/cdn/damagePhotos/${item.filename}`"
                          aspect-ratio="1"
                          class="grey lighten-2 imageRadius"
                          @click="showImage(item)"
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-col>
                    </v-row>
                  </template>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogimageShow"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialogimageShow = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Picture</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn class="mr-2 white--text" color="red">
                <v-icon medium class="mr-2">mdi-folder-image</v-icon>
                <a
                  class="downloadpicture"
                  :href="`http://localhost:8000/storage/cdn/damagePhotos/${PhotoShow.filename}`"
                  download
                  target="_blank"
                >
                  download picture</a
                >
              </v-btn>
            </v-toolbar>
            <v-card>
              <div class="p-100">
                <v-img
                  :lazy-src="`http://localhost:8000/storage/cdn/damagePhotos/${PhotoShow.filename}`"
                  max-height="90%"
                  max-width="100%"
                  :src="`http://localhost:8000/storage/cdn/damagePhotos/${PhotoShow.filename}`"
                ></v-img>
              </div>
            </v-card>
          </v-dialog>
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
            color="teal"
            class="mr-2 btn white--text"
            @click.stop="clickImage(item)"
          >
            <v-icon medium class="mr-2"> mdi-camera </v-icon>
            /
            <v-icon medium class="mr-2"> mdi-comment </v-icon>
          </v-btn>
          <v-btn
            class="mr-2 btn"
            color="primary"
            @click.stop="opendialogresolve(item)"
          >
            Resolved
          </v-btn>
          <v-btn
            class="mr-2 btn"
            color="error"
            @click.stop="opendialogrejected(item)"
          >
            Rejected
          </v-btn>
          <v-btn
            class="mr-2 btn"
            color="primary"
            @click.stop="dialogclose = true"
          >
            Close
          </v-btn>

          <v-btn
            v-if="userDepartment == 'IT'"
            color="red"
            class="mr-2 btn white--text"
            @click.stop="opendialogDelete(item)"
          >
            <v-icon medium class="mr-2"> mdi-delete </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize()"> Reset </v-btn>
        </template>
      </v-data-table>
    </div>
    <LoadingPage v-if="LoadingPage == true" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import LoadingPage from "../LoadingPage.vue";

export default {
  components: {
    LoadingPage,
  },
  data: () => ({
    isHistorique: false,
    LoadingPage: false,
    dialog: false,
    dialogDelete: false,
    loading: false,
    dialogimage: false,
    dialogresolve: false,
    dialogclose: false,
    dialogrejected: false,
    dialogDelete: false,
    dialogimageShow: false,
    search: "",
    fonction: "",
    userDepartment: "",
    headers: [
      { text: "Name", value: "damage_type.name", sortable: true },
      { text: "Status", value: "status", sortable: true },
      { text: "Created By", value: "declared_by.username", sortable: true },
      { text: "Created At", value: "created_at", sortable: true },
      { text: "Resolved At", value: "confirmedAt", sortable: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
    damageByEquipments: [],
    equipmentsFiltreByid: [],
    showdetails: false,
    PhotoShow: {
      id: null,
      description: null,
      filename: "",
      damage_id: null,
      created_at: "",
      updated_at: "",
    },
    photo: {
      id: "",
      description: "",
      foreman_id: "",
      photos: [],
    },
    ImagesPath: "http://localhost:8000/storage/cdn/damagePhotos/",
    damageSelect: {
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
      driver_out: {
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
    equipment: null,
    idEquipment: null,
    iscolor: "black",
    EquipmentsByCounter: {
      id: null,
      nameEquipment: "",
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
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
    Damagedelete: {
      id: null,
    },
    editedIndex: -1,
    editedItem: {
      id: null,
      name: "",
      description: "",
    },
    defaultItem: {
      id: null,
      name: "",
      description: "",
    },
    EmailModel: {
      payload: {
        Equipment: "",
        department: "",
        Defect: "",
        Status: "on progress",
        DriverOut: "",
        DeclaredBy: "",
        DeclaredAt: "",
      },
      status: "",
      email: "",
      department: "IT",
    },
    damageByEquipmentsClose: [],
    damageByEquipmentsWithOutClose: [],
    departmentIT: {
      id: null,
      name: "",
      email:"",
      created_at: "",
      updated_at: "",
    },
    departmentTEC: {
      id: null,
      name: "",
      email:"",
      created_at: "",
      updated_at: "",
    },
    departmentOP: {
      id: null,
      name: "",
      email:"",
      created_at: "",
      updated_at: "",
    },
  }),
  mounted() {
    document.title = "Checklist";
    this.loading = true;
    this.fonction = this.getUserActive.fonction.name;
    this.userDepartment = this.getUserActive.fonction.department.name;
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
      "getDamageTypeByEquipmentID",
      "getEquipmentsByCounter",
      "sendDamagePhotosStoragePath",
      "getUserActive",
      "getdepartements"
    ]),
  },
  watch: {
    dialog(val) {},
  },
  created() {
    // this.initialize();
  },
  methods: {
    getColor(status) {
      var color = "";
      if (status == "on progress") color = "#f54 ";
      else if (status == "closed") color = "#76ba99";
      else if (status == "resolved") color = "#FF8F56";

      return color;
    },
    initialize() {
      this.setDepartementsAction().then(() => {
        this.department = [...this.getdepartements];
        this.department.map((item) => {
          if (item.name.toLowerCase() == "technique") {
            this.departmentTEC = item;
          }
          if (item.name.toLowerCase() == "it") {
            this.departmentIT = item;
          }
          if (item.name.toLowerCase() == "operations") {
            this.departmentOP = item;
          }
        });
        console.log("set Departements", this.department);
      });
      this.damageByEquipments = [];
      this.equipmentsFiltreByid = [];
      this.idEquipment = localStorage.getItem("idEquipment");
      console.log("this.idEquipment", this.idEquipment);
      console.log(
        "department_id: " + this.getUserActive.fonction.department_id
      );

      if (this.getUserActive.fonction.department_id == 1) {
        this.FindDamageTypeByEquipmentID_ITAction(this.idEquipment).then(
          (resolve) => {
            this.damageByEquipments = [...this.getDamageTypeByEquipmentID];
            this.damageByEquipments.map((item) => {
              if (item.equipment_id == this.idEquipment) {
                this.equipmentsFiltreByid.push(item);
              }
            });
            this.damageByEquipments = this.equipmentsFiltreByid.filter(
              (c) => c.status != "closed"
            );
            this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
              (c) => c.status == "closed"
            );
            this.EquipmentsByCounter.nameEquipment = resolve.nameEquipment;
            this.EquipmentsByCounter.damagedCount = resolve.damagedCount;
            this.EquipmentsByCounter.confirmedCount = resolve.confirmedCount;
            this.EquipmentsByCounter.closedCount = 0;
            console.log("resolve", resolve);
          }
        );
      } else if (this.getUserActive.fonction.department_id == 2) {
        this.FindDamageTypeByEquipmentID_TECAction(this.idEquipment).then(
          (resolve) => {
            this.damageByEquipments = [...this.getDamageTypeByEquipmentID];
            this.damageByEquipments.map((item) => {
              if (item.equipment_id == this.idEquipment) {
                this.equipmentsFiltreByid.push(item);
              }
            });
            this.damageByEquipments = this.equipmentsFiltreByid.filter(
              (c) => c.status != "closed"
            );
            this.EquipmentsByCounter.nameEquipment = resolve.nameEquipment;
            this.EquipmentsByCounter.damagedCount = resolve.damagedCount;
            this.EquipmentsByCounter.confirmedCount = resolve.confirmedCount;
            this.EquipmentsByCounter.closedCount = 0;
          }
        );
      } else {
        console.log("ccccccc filtre");
        this.FindDamageTypeByEquipmentIDAction(this.idEquipment).then(
          (resolve) => {
            this.damageByEquipments = [...this.getDamageTypeByEquipmentID];
            this.damageByEquipments.map((item) => {
              if (item.equipment_id == this.idEquipment) {
                this.equipmentsFiltreByid.push(item);
              }
            });
            this.damageByEquipments = this.equipmentsFiltreByid.filter(
              (c) => c.status != "closed"
            );

            this.getEquipmentsByCounterAction(this.idEquipment).then(() => {
              this.EquipmentsByCounter.id = this.getEquipmentsByCounter.id;
              this.EquipmentsByCounter.nameEquipment =
                this.getEquipmentsByCounter.nameEquipment;
              this.EquipmentsByCounter.damagedCount =
                this.getEquipmentsByCounter.damagedCount;
              this.EquipmentsByCounter.confirmedCount =
                this.getEquipmentsByCounter.confirmedCount;
              this.EquipmentsByCounter.closedCount = 0;
            });
          }
        );
      }
      this.iscolor = "black";
      this.isHistorique = false;
      console.log("EquipmentsByCounter", this.EquipmentsByCounter);
    },
    ...mapActions([
      "FindDamageTypeByEquipmentIDAction",
      "getEquipmentsByCounterAction",
      "getEquipmentsByCounterITAction",
      "getEquipmentsByCounterTECAction",
      "confirmDamageAction",
      "closeDamageAction",
      "revertDamageAction",
      "sendDamagePhotosStoragePathAction",
      "deleteDAMAGEAction",
      "FindDamageTypeByEquipmentID_ITAction",
      "FindDamageTypeByEquipmentID_TECAction",
      "SendEmailAction",
      "setDepartementsAction"
    ]),
    pageView(item, row) {
      this.damageSelect = item;
      this.photo.id = item.id;

      console.log("this.damageSelect", this.damageSelect);
      this.dialog = true;
      this.showdetails = true;
    },
    showHistorique() {
      this.damageByEquipments = [];
      this.equipmentsFiltreByid = [];
      this.loading = true;
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      if (this.getUserActive.fonction.department_id == 1) {
        this.FindDamageTypeByEquipmentID_ITAction(this.idEquipment).then(
          (resolve) => {
            this.damageByEquipments = [...this.getDamageTypeByEquipmentID];
            this.damageByEquipments.map((item) => {
              if (item.equipment_id == this.idEquipment) {
                this.equipmentsFiltreByid.push(item);
              }
            });
            this.damageByEquipmentsWithOutClose =
              this.equipmentsFiltreByid.filter((c) => c.status != "closed");
            this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
              (c) => c.status == "closed"
            );
            this.damageByEquipments = [];
            this.damageByEquipments = [...this.damageByEquipmentsClose];
            this.damageByEquipmentsWithOutClose.map((item) => {
              this.damageByEquipments.push(item);
            });

            this.EquipmentsByCounter.nameEquipment = resolve.nameEquipment;
            this.EquipmentsByCounter.damagedCount = resolve.damagedCount;
            this.EquipmentsByCounter.confirmedCount = resolve.confirmedCount;
            this.EquipmentsByCounter.closedCount = resolve.closedCount;
            console.log("resolve", resolve);
            this.loading = false;
          }
        );
      } else if (this.getUserActive.fonction.department_id == 2) {
        this.FindDamageTypeByEquipmentID_TECAction(this.idEquipment).then(
          (resolve) => {
            this.damageByEquipments = [...this.getDamageTypeByEquipmentID];
            this.damageByEquipments.map((item) => {
              if (item.equipment_id == this.idEquipment) {
                this.equipmentsFiltreByid.push(item);
              }
            });
            this.damageByEquipmentsWithOutClose =
              this.equipmentsFiltreByid.filter((c) => c.status != "closed");
            this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
              (c) => c.status == "closed"
            );
            this.damageByEquipments = [];
            this.damageByEquipments = [...this.damageByEquipmentsClose];
            this.damageByEquipmentsWithOutClose.map((item) => {
              this.damageByEquipments.push(item);
            });

            this.EquipmentsByCounter.nameEquipment = resolve.nameEquipment;
            this.EquipmentsByCounter.damagedCount = resolve.damagedCount;
            this.EquipmentsByCounter.confirmedCount = resolve.confirmedCount;
            this.EquipmentsByCounter.closedCount = resolve.closedCount;
          }
        );
        this.loading = false;
      } else {
        console.log("ccccccc filtre");
        this.FindDamageTypeByEquipmentIDAction(this.idEquipment).then(
          (resolve) => {
            this.damageByEquipments = [...this.getDamageTypeByEquipmentID];
            this.damageByEquipments.map((item) => {
              if (item.equipment_id == this.idEquipment) {
                this.equipmentsFiltreByid.push(item);
              }
            });
            this.damageByEquipmentsWithOutClose =
              this.equipmentsFiltreByid.filter((c) => c.status != "closed");
            this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
              (c) => c.status == "closed"
            );
            this.damageByEquipments = [];
            this.damageByEquipments = [...this.damageByEquipmentsClose];
            this.damageByEquipmentsWithOutClose.map((item) => {
              this.damageByEquipments.push(item);
            });
            this.getEquipmentsByCounterAction(this.idEquipment).then(() => {
              this.EquipmentsByCounter.id = this.getEquipmentsByCounter.id;
              this.EquipmentsByCounter.nameEquipment =
                this.getEquipmentsByCounter.nameEquipment;
              this.EquipmentsByCounter.damagedCount =
                this.getEquipmentsByCounter.damagedCount;
              this.EquipmentsByCounter.confirmedCount =
                this.getEquipmentsByCounter.confirmedCount;
              this.EquipmentsByCounter.closedCount =
                this.getEquipmentsByCounter.closedCount;
            });
          }
        );
        this.loading = false;
      }
      this.iscolor = "teal";
      this.isHistorique = true;
    },
    clickImage(item) {
      this.damageSelect = item;
      this.photo.id = item.id;

      this.dialogimage = true;
    },
    closedtailedialoge() {
      this.showdetails = false;
      this.dialog = false;
    },
    opendialogclosed(item) {
      this.damageSelect = item;

      this.dialogclose = true;
    },
    opendialogresolve(item) {
      this.damageSelect = item;

      this.dialogresolve = true;
    },
    opendialogrejected(item) {
      this.damageSelect = item;

      this.dialogrejected = true;
    },
    opendialogDelete(item) {
      this.dialogDelete = true;
      this.Damagedelete.id = item.id;
    },
    confirmed() {
      this.confirmDamage.id = this.damageSelect.id;
      this.confirmDamage.confirmedBy_id = this.getUserActive.id;

      this.confirmDamageAction(this.confirmDamage).then((resolve) => {
        this.damageByEquipments = this.damageByEquipments.map((item) => {
          if (item.id == resolve.id) {
            // resolve.confirmed_by=resolve.confirmedBy;
            return resolve;
          }
          return item;
        });
        console.log("resolve", resolve);
        this.damageSelect.resolveDescription =
          this.confirmDamage.resolveDescription;
        this.damageSelect.status = resolve.status;
        this.confirmDamage.id = null;

        this.confirmDamage.confirmedBy_id = null;
        this.confirmDamage.resolveDescription = "";
        this.EmailModel.payload.Equipment =
          this.EquipmentsByCounter.nameEquipment;
        this.EmailModel.payload.department =
          resolve.damage_type.department.name;
        this.EmailModel.payload.Defect = resolve.damage_type.name;
        this.EmailModel.status = "Resolved ";
        this.EmailModel.payload.Status = "resolved";
        this.EmailModel.email = this.departmentOP.email.toString()+resolve.department.email.toString();

        this.EmailModel.payload.confirmed_by = this.getUserActive.username;
        this.EmailModel.payload.confirmedAt = resolve.declaredAt;
        if (resolve.driver_out != null) {
          this.damageSelect.driver_out = resolve.driver_out.username;
          this.EmailModel.payload.DriverOut = resolve.driver_out.username;
        } else {
          console.error("test DriverOut");
        }
        this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
        this.EmailModel.payload.DeclaredAt = resolve.declaredAt;

        this.SendEmailAction(this.EmailModel).then(() => {
          console.log("DONE");
        });
      });
      setTimeout(() => {
        this.counters();
      }, 1000);
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      this.showdetails = false;
      this.dialogresolve = false;
    },
    closed() {
      this.closeDamage.id = this.damageSelect.id;
      this.closeDamage.closedBy_id = this.getUserActive.id;
      this.damageSelect.status = this.closeDamage.status;
      this.closeDamageAction(this.closeDamage).then((resolve) => {
        this.damageByEquipments = this.damageByEquipments.map((item) => {
          if (item.id == resolve.id) {
            // resolve.confirmed_by=resolve.confirmedBy;
            return resolve;
          }
          return item;
        });

        this.damageSelect.status = resolve.status;
        this.EmailModel.payload.Equipment =
          this.EquipmentsByCounter.nameEquipment;
        this.EmailModel.payload.department =
          resolve.damage_type.department.name;
        this.EmailModel.payload.Defect = resolve.damage_type.name;
        this.EmailModel.status = "Closed ";
        this.EmailModel.payload.Status = "closed";
        this.EmailModel.email = this.departmentOP.email.toString()+resolve.department.email.toString();
        this.EmailModel.payload.ClosedBy = this.getUserActive.username;
        this.EmailModel.payload.ClosedAt = resolve.declaredAt;
        if (resolve.driver_out != null) {
          this.damageSelect.driver_out = resolve.driver_out.username;
          this.EmailModel.payload.DriverOut = resolve.driver_out.username;
        } else {
          console.error("test DriverOut");
        }
        this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
        this.EmailModel.payload.DeclaredAt = resolve.declaredAt;

        this.SendEmailAction(this.EmailModel).then(() => {
          console.log("DONE");
        });
        this.closeDamage.id = null;
        this.closeDamage.closedBy_id = null;
      });
      setTimeout(() => {
        this.counters();
      }, 1000);
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      this.dialogclose = false;
      this.showdetails = false;
    },
    revert() {
      this.revertDamage.id = this.damageSelect.id;
      this.revertDamage.rejectedBy_id = this.getUserActive.id;
      this.damageSelect.status = this.revertDamage.status;

      this.revertDamageAction(this.revertDamage).then((resolve) => {
        this.damageByEquipments = this.damageByEquipments.map((item) => {
          if (item.id == resolve.id) {
            // resolve.confirmed_by=resolve.confirmedBy;
            return resolve;
          }
          return item;
        });
        this.damageSelect.status = resolve.status;
        this.damageSelect.rejectedTimes = resolve.rejectedTimes;
        this.damageSelect.rejectedDescription =
          this.revertDamage.rejectedDescription;
        this.revertDamage.id = null;
        this.revertDamage.rejectedBy_id = null;
        this.revertDamage.rejectedDescription = "";

        this.EmailModel.payload.Equipment =
          this.EquipmentsByCounter.nameEquipment;
        this.EmailModel.payload.department =
          resolve.damage_type.department.name;
        this.EmailModel.payload.Defect = resolve.damage_type.name;
        this.EmailModel.status = "Rejcted ";
        this.EmailModel.payload.Status = "on progress";
        this.EmailModel.email = this.departmentOP.email.toString()+resolve.department.email.toString();
        this.EmailModel.payload.rejected_by = this.getUserActive.username;
        this.EmailModel.payload.rejectedAt = resolve.declaredAt;
        if (resolve.driver_out != null) {
          this.damageSelect.driver_out = resolve.driver_out.username;

          this.EmailModel.payload.DriverOut = resolve.driver_out.username;
        } else {
          console.error("test DriverOut");
        }
        this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
        this.EmailModel.payload.DeclaredAt = resolve.declaredAt;

        this.SendEmailAction(this.EmailModel).then(() => {
          console.log("DONE");
        });
      });
      setTimeout(() => {
        this.counters();
      }, 1000);
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      this.showdetails = false;
      this.dialogrejected = false;
    },
    deleteDamage() {
      this.deleteDAMAGEAction(this.Damagedelete).then(() => {
        this.damageByEquipments = this.damageByEquipments.filter((e) => {
          return e.id != this.Damagedelete.id;
        });
      });
      setTimeout(() => {
        this.counters();
      }, 2000);
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      this.dialogDelete = false;
    },
    showImage(item) {
      console.log("image click", item);
      this.PhotoShow = item;
      this.dialogimageShow = true;
    },
    counters() {
      if (this.getUserActive.fonction.department_id == 1) {
        this.getEquipmentsByCounterITAction(this.idEquipment).then(() => {
          this.EquipmentsByCounter.id = this.getEquipmentsByCounter.id;
          this.EquipmentsByCounter.nameEquipment =
            this.getEquipmentsByCounter.nameEquipment;

          this.EquipmentsByCounter.damagedCount =
            this.getEquipmentsByCounter.damagedCount;
          this.EquipmentsByCounter.confirmedCount =
            this.getEquipmentsByCounter.confirmedCount;
          this.EquipmentsByCounter.closedCount =
            this.getEquipmentsByCounter.closedCount;
        });
      } else if (this.getUserActive.fonction.department_id == 2) {
        this.getEquipmentsByCounterTECAction(this.idEquipment).then(() => {
          this.EquipmentsByCounter.id = this.getEquipmentsByCounter.id;
          this.EquipmentsByCounter.nameEquipment =
            this.getEquipmentsByCounter.nameEquipment;

          this.EquipmentsByCounter.damagedCount =
            this.getEquipmentsByCounter.damagedCount;
          this.EquipmentsByCounter.confirmedCount =
            this.getEquipmentsByCounter.confirmedCount;
          this.EquipmentsByCounter.closedCount =
            this.getEquipmentsByCounter.closedCount;
        });
      } else {
        this.getEquipmentsByCounterAction(this.idEquipment).then(() => {
          this.EquipmentsByCounter.id = this.getEquipmentsByCounter.id;
          this.EquipmentsByCounter.nameEquipment =
            this.getEquipmentsByCounter.nameEquipment;

          this.EquipmentsByCounter.damagedCount =
            this.getEquipmentsByCounter.damagedCount;
          this.EquipmentsByCounter.confirmedCount =
            this.getEquipmentsByCounter.confirmedCount;
          this.EquipmentsByCounter.closedCount =
            this.getEquipmentsByCounter.closedCount;
        });
      }
    },
    sendImage() {
      this.photo.foreman_id = this.getUserActive.id;

      var formData = new FormData();
      formData.append("id", parseFloat(this.photo.id));
      formData.append("description", this.photo.description);

      this.photo.photos.map((item) => {
        formData.append("photos[]", item);
      });
      formData.append(
        "foreman_id",
        parseFloat(parseFloat(this.photo.foreman_id))
      );

      console.log("this.photo", this.photo);
      this.sendDamagePhotosStoragePathAction(formData).then((resolve) => {
        this.damageByEquipments = this.damageByEquipments.map((c) => {
          if (c.id == resolve.id) {
            this.damageSelect.photos = resolve.photos;
            this.damageSelect.description = resolve.description;
            c.photos = resolve.photos;
            c.description = resolve.description;
          }
          return c;
        });
        swal("Good job!", "Add photo and description success ", "success");

        console.log("done");
      });
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      this.dialogimage = false;
    },
  },
};
</script>
