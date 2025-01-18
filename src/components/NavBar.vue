<template>
  <div>
    <nav>
      <div class="nav-wrapper teal darken-2">
        <a data-target="slide-out" class="sidenav-trigger" v-if="!showBackBtn">
          <i class="material-icons">menu</i>
        </a>

        <a
          data-target="slide-out"
          class="sidenav-btn"
          v-if="showBackBtn"
          @click.prevent="callBackFunction()"
        >
          <i class="material-icons">arrow_back</i>
        </a>

        <div class="brand-logo valign-wrapper">
          <img src="@/assets/logo-navbar.png" v-show="!hasTitle" />

          <span v-show="hasTitle">{{ title }}</span>
        </div>

        <ul class="right hide-on-small-only">
          <li>
            <span class="white-text">
              <span class="white-text">
                {{ getCostCenterName }}
              </span>
            </span>
          </li>
          <li class="margin-navbar-elem">
            <i class="material-icons">account_balance_wallet</i>
          </li>
        </ul>
      </div>
    </nav>

    <ul id="slide-out" class="sidenav">
      <li>
        <div class="user-view shadow-layer">
          <div class="background">
            <img src="@/assets/bg-avatar-default.png" />
          </div>
          <a><img class="circle" :src="getUserAvatarUrl" /></a>
          <span class="white-text name">{{ user_name }}</span>
          <span class="white-text email">{{ user_email }}</span>
          <span class="white-text cost-center">{{ getCostCenterName }}</span>
        </div>
      </li>
      <router-link to="/dashboard">
        <li>
          <a class="waves-effect sidenav-close"
            ><i class="material-icons">home</i>Dashboard</a
          >
        </li>
      </router-link>
      <router-link to="/cash-flow">
        <li>
          <a class="waves-effect sidenav-close"
            ><i class="material-icons">attach_money</i>Cash Flow</a
          >
        </li>
      </router-link>
      <li>
        <ul class="collapsible collapsible-accordion menu-padding">
          <li>
            <a class="collapsible-header no-padding"
              >Settings<i class="material-icons">settings</i></a
            >
            <div class="collapsible-body">
              <ul>
                <router-link to="/">
                  <li>
                    <a class="waves-effect sidenav-close">Cash Movement</a>
                  </li>
                </router-link>
                <router-link to="/settings/cost-center">
                  <li>
                    <a class="waves-effect sidenav-close">Cost Center</a>
                  </li>
                </router-link>
                <router-link to="/">
                  <li>
                    <a class="waves-effect sidenav-close">Payment</a>
                  </li>
                </router-link>
                <router-link to="/">
                  <li>
                    <a class="waves-effect sidenav-close">Payment Status</a>
                  </li>
                </router-link>
                <router-link to="/">
                  <li>
                    <a class="waves-effect sidenav-close">Group 1</a>
                  </li>
                </router-link>
                <router-link to="/">
                  <li>
                    <a class="waves-effect sidenav-close">Group 2</a>
                  </li>
                </router-link>
                <router-link to="/">
                  <li>
                    <a class="waves-effect sidenav-close">Group 3</a>
                  </li>
                </router-link>
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
  props: {
    title: {
      type: String,
      default: "Home Finance",
    },
    backFunctionName: {
      type: String,
      default: null,
    },
    showBackBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user_name: null,
      user_email: null,
      cost_center_name: null,
    };
  },
  computed: {
    getCostCenterName() {
      if (!this.cost_center_name) return;

      return this.cost_center_name.substring(0, 20).toUpperCase();
    },
    getUserAvatarUrl() {
      if (!this.user_name) return;

      const name = this.user_name.replaceAll(" ", "-");

      return `https://ui-avatars.com/api/?size=512&background=00796b&color=fff&name=${name}`;
    },
    hasTitle() {
      return this.title;
    },
  },
  methods: {
    logout() {
      const authStore = useAuthStore();

      authStore.logout();
    },
    changeCostCenter() {
      const costCenterStore = useCostCenterStore();

      costCenterStore.cleanCostCenter();
    },
    initMaterialize() {
      var elems = document.querySelectorAll(".sidenav");
      M.Sidenav.init(elems);
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
    callBackFunction() {
      this.$parent[this.backFunctionName]();
    },
  },
  created() {
    this.$nextTick(() => {
      this.initMaterialize();
    });

    this.fillUserDetails();
  },

// .sidenav {
//   @media (min-width: 992px) {
//     transform: translateX(0) !important;
//     position: fixed !important;
//     width: 250px !important;
//     left: 0;
//     top: 0;
//     height: 100%;
//   }
// }
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

.shadow-layer {
  background-color: rgb(0 0 0 / 45%);
}

.brand-logo {
  position: absolute;
  color: #fff;
  font-size: 2.1rem;
  padding: 0;
  height: inherit;
  display: flex;
}

.brand-logo img {
  max-height: 80%;
  max-width: 100%;
}
</style>
