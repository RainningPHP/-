<template>
  <div class="errPage-container">
    <img
      class="errPage-img"
      src="@/assets/developping_images/developping.png"
      width="50%"
      alt="正在开发中"
    />
    <span class="text-jumbo text-ginormous">正在开发中~</span>
  </div>
</template>

<script>
export default {
  name: "Developping",
  data() {
    return {};
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.errPage-container {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .errPage-img {
    max-width: 658px;
  }
  .text-jumbo {
    font-size: 40px;
    font-weight: 700;
    color: #aaa;
  }
}
</style>
