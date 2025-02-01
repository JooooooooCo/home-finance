<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-card-text>
              <v-form @submit.prevent="login">

                <v-row class="text-center">
                  <v-col cols="12">
                    <v-img :src="logoUrl" alt="logo" class="my-4" contain height="100" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="user.email" label="Email" name="email" type="text" autocomplete="username" required></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="user.password" label="Password" name="password" type="password" autocomplete="current-password" required></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="text-center">
                    <v-btn type="submit" color="teal darken-2" class="white--text" large block>Login</v-btn>
                  </v-col>
                </v-row>
                
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth.store'
import logoUrl from '@/assets/logo.png'

const authStore = useAuthStore()

const user = ref({
  email: '',
  password: ''
})

function login() {
  authStore.login(user.value.email, user.value.password)
}
</script>