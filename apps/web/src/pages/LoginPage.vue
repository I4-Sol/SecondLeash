<template>
  <div class="login-page">
    <div class="login-container">
      <Card class="login-card">
        <template #header>
          <div class="login-header">
            <i class="pi pi-heart" style="font-size: 3rem; color: var(--primary-color)"></i>
            <h1>SecondLeash</h1>
            <p class="subtitle">Dog Shelter Management Platform</p>
          </div>
        </template>
        <template #content>
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-field">
              <label for="email">Email</label>
              <InputText id="email" v-model="email" type="email" placeholder="your@email.com" required />
            </div>

            <div class="form-field">
              <label for="password">Password</label>
              <Password
                id="password"
                v-model="password"
                placeholder="Enter your password"
                :feedback="false"
                toggleMask
                required
              />
            </div>

            <div v-if="authStore.error" class="error-message">
              <i class="pi pi-exclamation-circle"></i>
              {{ authStore.error }}
            </div>

            <Button type="submit" label="Login" :loading="authStore.loading" class="w-full" />

            <div class="demo-credentials">
              <p class="demo-title">Demo Credentials:</p>
              <p class="demo-item"><strong>Shelter Admin:</strong> shelter@secondleash.com / Shelter123!</p>
              <p class="demo-item"><strong>Staff:</strong> staff@secondleash.com / Staff123!</p>
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await authStore.login({ email: email.value, password: password.value });

  if (success) {
    router.push('/dashboard');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--pale-blue) 0%, var(--sky-blue) 100%);
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  padding: 2rem 1rem 1rem;
}

.login-header h1 {
  margin: 0.5rem 0 0.25rem;
  color: var(--text-color);
  font-size: 2rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.login-form {
  padding: 0 1rem 1rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-credentials {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
  font-size: 0.85rem;
}

.demo-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.demo-item {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

:deep(.p-inputtext),
:deep(.p-password input) {
  width: 100%;
}
</style>
