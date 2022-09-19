<template>
  <div>
    <nav>
      <div class="nav-wrapper teal darken-2">
        <a data-target="slide-out" class="sidenav-trigger">
          <i class="material-icons">menu</i>
        </a>

        <a class="brand-logo">Home Finance</a>

        <ul class="right hide-on-small-only">
          <li>
            <span class="white-text">
              <i class="material-icons">account_balance_wallet</i>
            </span>
          </li>
          <li class="margin-navbar-elem">
            <span class="white-text">
              {{ getCostCenterName }}
            </span>
          </li>
        </ul>
      </div>
    </nav>

    <ul id="slide-out" class="sidenav">
      <li>
        <div class="user-view">
          <div class="background">
            <img src="../assets/bg-avatar-default.png" />
          </div>
          <a><img class="circle" src="../assets/avatar-default.png" /></a>
          <span class="white-text name">{{ user_name }}</span>
          <span class="white-text email">{{ user_email }}</span>
          <span class="white-text cost-center">{{ getCostCenterName }}</span>
        </div>
      </li>
      <li>
        <a class="waves-effect sidenav-close"
          ><i class="material-icons">home</i>Dashboard</a
        >
      </li>
      <li>
        <ul class="collapsible collapsible-accordion menu-padding">
          <li>
            <a class="collapsible-header no-padding"
              >Settings<i class="material-icons">settings</i></a
            >
            <div class="collapsible-body">
              <ul>
                <li>
                  <a class="waves-effect sidenav-close">Cash Movement</a>
                </li>
                <li>
                  <a class="waves-effect sidenav-close">Payment</a>
                </li>
                <li>
                  <a class="waves-effect sidenav-close">Payment Status</a>
                </li>
                <li>
                  <a class="waves-effect sidenav-close">Group 1</a>
                </li>
                <li>
                  <a class="waves-effect sidenav-close">Group 2</a>
                </li>
                <li>
                  <a class="waves-effect sidenav-close">Group 3</a>
                </li>
                <li>
                  <a class="waves-effect sidenav-close">Cost Center</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </li>
      <li><div class="divider"></div></li>
      <li>
        <a
          class="waves-effect sidenav-close"
          @click.prevent="changeCostCenter()"
          ><i class="material-icons">swap_horiz</i>Change Cost Center</a
        >
      </li>
      <li>
        <a class="waves-effect sidenav-close" @click.prevent="logout()"
          ><i class="material-icons">arrow_back</i>Logout</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth.store";
import { useCostCenterStore } from "@/store/cost_center.store";
import M from "materialize-css";

export default {
  name: "NavBar",
  data() {
    return {
      user_name: null,
      user_email: null,
      cost_center_name: null,
    };
  },
  computed: {
    getCostCenterName() {
      return this.cost_center_name.substring(0, 20).toUpperCase();
    },
  },
  methods: {
    logout() {
      const authStore = useAuthStore();

      authStore.logout();
    },
    changeCostCenter() {
      const costCenterStore = useCostCenterStore();

      costCenterStore.changeCostCenter();
    },
    initSideNav() {
      var elems = document.querySelectorAll(".sidenav");
      M.Sidenav.init(elems);
      document.addEventListener("DOMContentLoaded", function () {});
      var collapsibleElem = document.querySelector(".collapsible");
      M.Collapsible.init(collapsibleElem);
    },
    fillUserDetails() {
      const authStore = useAuthStore();
      const costCenterStore = useCostCenterStore();

      this.user_name = authStore.name;
      this.user_email = authStore.email;
      this.cost_center_name = costCenterStore.name;
    },
  },
  created() {
    this.$nextTick(() => {
      this.initSideNav();
    });

    this.fillUserDetails();
  },
};
</script>

<style lang="scss" scoped>
.sidenav-trigger {
  display: block !important;
}

.brand-logo {
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.sidenav .collapsible-header {
  background-color: #ffffff;
}

.sidenav .collapsible-header:hover {
  background-color: #ffffff;
}

.collapsible {
  background-color: #ffffff;
}

.menu-padding {
  padding: 0 32px;
}

.cost-center {
  font-weight: 500;
  font-size: 14px;
  line-height: 10px !important;
  padding-bottom: 16px;
}

.email {
  padding-bottom: 0px !important;
  font-weight: 400;
}

.margin-navbar-elem {
  margin: 0 18px 0 5px;
}
</style>
