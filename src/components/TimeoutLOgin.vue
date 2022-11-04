<template>
  
        <div class="loginPage">
                <v-card class="loginForm">
                  <v-row style="margin: 0; padding: 0; background: #fff" class="login">
                    <v-col  class="form">
                      <v-row>
                        <v-col cols="2"></v-col>
                        <v-col cols="8" style="color: red" v-if="failedAuth">
                          Incorrect username or password !
                        </v-col>
                        <v-col cols="1"></v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2"></v-col>
                        <v-col cols="8">
                          <v-text-field solo v-model="username" label="username"></v-text-field
                        ></v-col>
                        <v-col cols="1"></v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2"></v-col>
                        <v-col cols="8">
                          <v-text-field
                            solo
                            v-model="password"
                            type="password"
                            label="password"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="1"></v-col>
                      </v-row>

                      <div class="btn_form">
                        <v-btn color="#A6CEE3" @click="Login" class="mb-2 btn white--text">
                          <v-icon left> mdi-login-variant </v-icon>
                          LOGIN
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
        </div>
  
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import CustomizedAxios from "../plugins/axios";
export default {
  components: {},
  props:["changeLoginValueToFalse"],
  data() {
    return {
      failedAuth: false,
      logged: false,
      username: null,
      password: null,
      userActive: {
        user: {
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
        token: "",
      },
    };
  },
  mounted() {
    document.title = "Checklist";

    this.initialize();
    this.userActive=this.getUserActive;
  },
  computed: {
    ...mapGetters(["getUsers", "getUserActive"]),
  },
  watch: {},
  methods: {
    initialize() {
      console.log("xccc");

    },
    Login() {
      console.log("username", this.username);
      console.log("password", this.password);
      var userLogin = {
        username: this.username,
        password: this.password,
      };
     // console.log("this.userActive", this.userActive);

      this.LoginAction(userLogin)
        .then((resolve) => {
          console.log("user login", resolve);
          console.log("userrerere", resolve.user.id == this.getUserActive.id);
          if (resolve.user.id == this.userActive.id) {
              console.log("here ",resolve.user.id == this.getUserActive.id)
              this.changeLoginValueToFalse();
          }else{
            if (resolve.user.fonction.department.name == "TECHNIQUE") {
            this.$router.push({
              name: "technique",
            });
            window.location.reload();
          } else if (
            resolve.user.fonction.department.name == "OPERATIONS" &&
            resolve.user.fonction.name != "DRIVER"
          ) {
            this.$router.push({
              name: "technique",
            });
            window.location.reload();
          } else if (resolve.user.fonction.name == "DRIVER") {
            this.$router.push({
              name: "Damage",
            });
            window.location.reload();
          } else {
            this.$router.push({
              name: "technique",
            });
            window.location.reload();
          }
          }
        })
        .catch(() => {
          this.failedAuth = true;
        });
    },
    ...mapActions([
      "setUsersAction",
      "editUserAction",
      "LoginAction",
      "addUserAction2",
    ]),
  },
};
</script>

<style lang="scss" scoped>
  .loginPage {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-color: #00000052;
    z-index: 10000000000000;
    text-align: center;
  }
  .loginForm {
    width: 500px;
    margin: 0 auto;
    margin-top: 160px;
    height: 320px;
    padding-top: 100px;
  }
  .login{
    width: 500px;
  }
</style>